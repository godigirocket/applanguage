import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import webpush from "web-push";
import { PGlite } from "@electric-sql/pglite";
import handler from "../api/reminders.ts";
import cron from "../api/cron/reminders.ts";
import { validPushSubscription } from "../src/lib/push-validation.ts";
const subscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/qa-only-test",
  keys: {
    p256dh: Buffer.alloc(65, 1).toString("base64url"),
    auth: Buffer.alloc(16, 1).toString("base64url"),
  },
};
test("push endpoints require trusted HTTPS delivery hosts and valid keys", () => {
  assert.ok(validPushSubscription(subscription));
  for (const endpoint of [
    "http://fcm.googleapis.com/test",
    "https://127.0.0.1/test",
    "https://fcm.googleapis.com.evil.example/test",
    "https://user:password@fcm.googleapis.com/test",
    "https://fcm.googleapis.com:8443/test",
  ])
    assert.equal(validPushSubscription({ ...subscription, endpoint }), false);
});
test("reminder API authenticates subscriptions; cron sends only claimed opt-ins", async () => {
  const savedFetch = globalThis.fetch,
    savedSend = webpush.sendNotification;
  const env = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "VAPID_PUBLIC_KEY",
    "VAPID_PRIVATE_KEY",
    "CRON_SECRET",
  ];
  const before = Object.fromEntries(env.map((k) => [k, process.env[k]]));
  const keys = webpush.generateVAPIDKeys();
  Object.assign(process.env, {
    SUPABASE_URL: "https://qa-reminders.invalid",
    SUPABASE_SERVICE_ROLE_KEY: "qa-test-key",
    VAPID_PUBLIC_KEY: keys.publicKey,
    VAPID_PRIVATE_KEY: keys.privateKey,
    CRON_SECRET: "qa-cron-only-012345678901234567890",
  });
  const writes = [],
    deliveries = [];
  let claimed = [{ ...subscription, subscription, language: "es" }],
    expire = false;
  const invoke = async (fn, method, body, authorization) => {
    let status, payload;
    await fn(
      { method, body, headers: { authorization } },
      {
        setHeader() {},
        status(c) {
          status = c;
          return this;
        },
        json(v) {
          payload = v;
          return this;
        },
      },
    );
    return { status, payload };
  };
  try {
    globalThis.fetch = async (url, options) => {
      const u = new URL(url);
      assert.equal(u.hostname, "qa-reminders.invalid");
      if (u.pathname === "/auth/v1/user")
        return new Response(
          JSON.stringify({ id: "00000000-0000-0000-0000-000000000001", aud: "authenticated" }),
          { headers: { "Content-Type": "application/json" } },
        );
      if (u.pathname.includes("claim_due_reminders"))
        return new Response(JSON.stringify(claimed), {
          headers: { "Content-Type": "application/json" },
        });
      if (options.body) writes.push({ url: String(url), body: JSON.parse(options.body) });
      return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
    };
    webpush.sendNotification = async (s, payload) => {
      deliveries.push({ s, payload: JSON.parse(payload) });
      if (expire) throw { statusCode: 410 };
      return {};
    };
    assert.equal(
      (await invoke(handler, "POST", { action: "subscribe", subscription })).status,
      401,
    );
    assert.equal(
      (
        await invoke(
          handler,
          "POST",
          {
            action: "subscribe",
            subscription: { ...subscription, endpoint: "https://127.0.0.1/private" },
          },
          "Bearer qa-token",
        )
      ).status,
      422,
    );
    assert.equal(
      (
        await invoke(
          handler,
          "POST",
          { action: "subscribe", subscription, user_id: "forged-user", language: "es" },
          "Bearer qa-token",
        )
      ).status,
      200,
    );
    assert.equal(writes[0].body.user_id, "00000000-0000-0000-0000-000000000001");
    assert.equal((await invoke(cron, "GET", null, "Bearer wrong")).status, 401);
    assert.equal(deliveries.length, 0);
    const result = await invoke(cron, "GET", null, "Bearer " + process.env.CRON_SECRET);
    assert.equal(result.payload.sent, 1);
    assert.equal(deliveries[0].payload.title, "Un pequeño paso hoy");
    assert.equal(deliveries[0].payload.url, "/home");
    expire = true;
    assert.equal(
      (await invoke(cron, "GET", null, "Bearer " + process.env.CRON_SECRET)).payload.expired,
      1,
    );
    assert.ok(writes.some((w) => w.body.enabled === false));
    claimed = [];
    assert.equal(
      (await invoke(cron, "GET", null, "Bearer " + process.env.CRON_SECRET)).payload.sent,
      0,
    );
  } finally {
    globalThis.fetch = savedFetch;
    webpush.sendNotification = savedSend;
    for (const k of env)
      before[k] === undefined ? delete process.env[k] : (process.env[k] = before[k]);
  }
});
test("daily reminders claim once, skip recent activity and exclude opted-out accounts", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('00000000-0000-0000-0000-000000000001');`,
    );
    await db.exec(fs.readFileSync("supabase/migrations/20261027020000_push_reminders.sql", "utf8"));
    await db.exec(
      `insert into push_subscriptions(endpoint,user_id,subscription,last_activity_at,enabled) values('due','00000000-0000-0000-0000-000000000001','{}',now()-interval '2 days',true),('active','00000000-0000-0000-0000-000000000001','{}',now(),true),('off','00000000-0000-0000-0000-000000000001','{}',now()-interval '2 days',false);`,
    );
    assert.equal((await db.query("select * from claim_due_reminders(100)")).rows.length, 1);
    assert.equal((await db.query("select * from claim_due_reminders(100)")).rows.length, 0);
    await db.exec("set role authenticated");
    await assert.rejects(db.query("select * from claim_due_reminders(100)"));
    await assert.rejects(db.query("select * from push_subscriptions"));
  } finally {
    await db.close();
  }
});
test("closed-page worker displays reminders and opens only the app", async () => {
  const handlers = {},
    shown = [],
    opened = [];
  const self = {
    location: { origin: "https://langlume.vercel.app" },
    addEventListener(n, fn) {
      handlers[n] = fn;
    },
    registration: {
      async showNotification(title, options) {
        shown.push({ title, options });
      },
    },
    clients: {
      async matchAll() {
        return [];
      },
      async openWindow(url) {
        opened.push(url);
      },
    },
  };
  vm.runInNewContext(fs.readFileSync("public/push-worker.js", "utf8"), { self, URL });
  let task;
  handlers.push({
    data: { json: () => ({ title: "Practice", body: "One lesson", url: "https://evil.example" }) },
    waitUntil(p) {
      task = p;
    },
  });
  await task;
  assert.equal(shown.length, 1);
  assert.equal(shown[0].options.tag, "lume-daily-practice");
  handlers.notificationclick({
    notification: { close() {} },
    waitUntil(p) {
      task = p;
    },
  });
  await task;
  assert.deepEqual(opened, ["/home"]);
});
