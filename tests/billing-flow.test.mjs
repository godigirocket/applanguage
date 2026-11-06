import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import webhook from "../api/webhooks/cakto.ts";
import { CAKTO_OFFERS, CAKTO_PRODUCT_ID } from "../src/lib/cakto-catalog.ts";
import { hasPremiumEntitlement } from "../src/lib/entitlements.ts";

test("Cakto approval unlocks only the buyer and refund removes the entitlement end to end", async () => {
  const db = new PGlite();
  const previousFetch = globalThis.fetch;
  const env = {
    CAKTO_WEBHOOK_SECRET: "fixture-webhook-secret",
    SUPABASE_URL: "https://billing-db.invalid",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-role",
  };
  const previousEnv = Object.fromEntries(Object.keys(env).map(key => [key, process.env[key]]));
  Object.assign(process.env, env);
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
        SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, email_confirmed_at timestamptz);
      CREATE TABLE profiles(id uuid PRIMARY KEY REFERENCES auth.users, plan text DEFAULT 'free',
        premium_until timestamptz, upgraded_at timestamptz, cakto_customer_email text,
        cakto_order_id text, cakto_subscription_id text, last_payment_status text);
      CREATE TABLE payment_events(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text,
        event_id text, event_type text, order_id text, subscription_id text, customer_email text,
        product_id text, amount numeric, currency text, status text, raw_payload jsonb,
        processed boolean DEFAULT false, processed_at timestamptz, user_id_matched uuid,
        processing_error text, created_at timestamptz DEFAULT now(), UNIQUE(event_id, provider));
      INSERT INTO auth.users VALUES
        ('00000000-0000-0000-0000-000000000001','buyer@example.invalid',now()),
        ('00000000-0000-0000-0000-000000000002','other@example.invalid',now());
      INSERT INTO profiles(id) SELECT id FROM auth.users;
    `);
    for (const file of ["20261021020000_cakto_entitlements.sql", "20261024010000_protect_billing_identifiers.sql"]) {
      await db.exec(fs.readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8"));
    }
    globalThis.fetch = async (url, options) => {
      assert.equal(String(url), env.SUPABASE_URL + "/rest/v1/rpc/process_cakto_event");
      const { p_event } = JSON.parse(options.body);
      assert.ok(!Object.hasOwn(p_event, "secret"));
      await db.exec("SET ROLE service_role");
      try {
        const { rows } = await db.query("SELECT process_cakto_event($1::jsonb) AS result", [JSON.stringify(p_event)]);
        return Response.json(rows[0].result);
      } finally {
        await db.exec("RESET ROLE");
      }
    };
    const now = Date.now();
    const order = {
      id: "fixture-invoice", refId: "fixture-order",
      status: "paid", customer: { email: "BUYER@example.invalid" },
      product: { id: CAKTO_PRODUCT_ID }, offer: { id: CAKTO_OFFERS.premium_monthly.id },
      amount: CAKTO_OFFERS.premium_monthly.price, currency: "BRL",
      paidAt: new Date(now).toISOString(),
    };
    async function deliver(event, data, secret = env.CAKTO_WEBHOOK_SECRET) {
      let status, payload;
      await webhook({ method: "POST", headers: {}, body: { secret, event, data } }, {
        status(code) { status = code; return this; },
        json(body) { payload = body; return this; },
      });
      return { status, payload };
    }
    async function profiles() {
      return (await db.query("SELECT plan,premium_until::text FROM profiles ORDER BY id")).rows;
    }
    assert.equal((await deliver("purchase_approved", order, "wrong")).status, 401);
    assert.equal((await deliver("purchase_approved", { ...order, amount: 0 })).status, 422);
    assert.ok((await profiles()).every(profile => !hasPremiumEntitlement(profile, now)));
    assert.equal((await deliver("purchase_approved", order)).status, 200);
    const [buyer, other] = await profiles();
    assert.ok(hasPremiumEntitlement(buyer, now));
    assert.equal(hasPremiumEntitlement(other, now), false);
    assert.ok(buyer.premium_until, "Monthly approval must not grant lifetime access");
    assert.equal((await deliver("payment_approved", order)).payload.results[0].duplicate, true);
    assert.deepEqual(await profiles(), [buyer, other]);
    assert.equal((await deliver("payment_refunded", {
      ...order, status: "refunded", refundedAt: new Date(now + 1000).toISOString(),
    })).status, 200);
    assert.ok((await profiles()).every(profile => !hasPremiumEntitlement(profile, now + 1000)));
    assert.equal((await deliver("purchase_approved", order)).payload.results[0].duplicate, true);
    assert.ok((await profiles()).every(profile => profile.plan === "free"));
  } finally {
    globalThis.fetch = previousFetch;
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await db.close();
  }
});
