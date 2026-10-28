import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";

test("database completion is idempotent, transactional, scoped and quotas are durable", async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      CREATE TABLE auth.users(id uuid primary key);
      CREATE TABLE profiles(id uuid primary key references auth.users, xp integer default 0, streak integer default 0, plan text default 'free', premium_until timestamptz, updated_at timestamptz);
      CREATE TABLE lesson_progress(user_id uuid references auth.users,lesson_id text,status text,progress integer,xp_earned integer,completed_at timestamptz,updated_at timestamptz, unique(user_id,lesson_id));
      INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
      INSERT INTO profiles(id) SELECT id FROM auth.users;`);
    await db.exec(fs.readFileSync("supabase/migrations/20261021010000_atomic_learning.sql", "utf8"));
    await db.exec(`select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false)`);
    const run = async id => (await db.query("select complete_lesson_atomic($1) as result", [id])).rows[0].result;
    const results = await Promise.all(Array.from({ length: 8 }, () => run("lesson-en-1")));
    assert.equal(results.filter(r => !r.alreadyCompleted).length, 1);
    assert.equal((await db.query("select xp from profiles where id=auth.uid()")).rows[0].xp, 41);
    await db.exec(`CREATE FUNCTION fail_xp() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test rollback'; END $$;
      CREATE TRIGGER fail_xp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION fail_xp();`);
    await assert.rejects(run("lesson-en-2"));
    assert.equal((await db.query("select count(*)::int as n from lesson_progress where lesson_id='lesson-en-2'")).rows[0].n, 0, "failure must roll back progress too");
    await db.exec("DROP TRIGGER fail_xp ON profiles");
    assert.equal((await run("lesson-en-2")).success, true);
    const quotas = await Promise.all(Array.from({ length: 21 }, () => db.query("select consume_ai_quota('chat') as allowed")));
    assert.equal(quotas.filter(q => q.rows[0].allowed).length, 20);
    await db.exec(`select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false)`);
    assert.equal((await run("lesson-en-1")).xpEarned, 41);
    assert.equal((await db.query("select consume_ai_quota('chat') as allowed")).rows[0].allowed, true);
    await db.exec(`select set_config('request.jwt.claim.sub','',false)`);
    await assert.rejects(run("lesson-en-1"), /not_authenticated/);
    await assert.rejects(db.query("select consume_ai_quota('chat')"), /not_authenticated/);
  } finally { await db.close(); }
});

test("payment ledger handles renewals, refunds, duplicate deliveries, cancellation and pending signup", async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      CREATE TABLE auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      CREATE TABLE profiles(id uuid primary key references auth.users,plan text default 'free',premium_until timestamptz,upgraded_at timestamptz,cakto_customer_email text,cakto_order_id text,cakto_subscription_id text,last_payment_status text);
      CREATE TABLE payment_events(id uuid primary key default gen_random_uuid(),provider text,event_id text,event_type text,order_id text,subscription_id text,customer_email text,product_id text,amount numeric,currency text,status text,raw_payload jsonb,processed boolean default false,processed_at timestamptz,user_id_matched uuid,processing_error text,created_at timestamptz default now(),unique(event_id,provider));
      INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000001','qa@example.com',now());
      INSERT INTO profiles(id) SELECT id FROM auth.users;`);
    await db.exec(fs.readFileSync("supabase/migrations/20261021020000_cakto_entitlements.sql","utf8"));
    await db.exec(fs.readFileSync("supabase/migrations/20261024010000_protect_billing_identifiers.sql","utf8"));
    const base={event_id:"approved:1",event_type:"purchase_approved",action:"approve",order_id:"order-1",subscription_id:"sub-1",email:"qa@example.com",offer_id:"t3z3hhs",product_id:"d796ae06-6ae5-4efc-8e84-b087aee194d7",amount:9.9,currency:"BRL",status:"paid",occurred_at:"2026-10-21T12:00:00Z",period_end:null};
    const process=async event => (await db.query("select process_cakto_event($1::jsonb) as result",[JSON.stringify(event)])).rows[0].result;
    const profile=async ()=>(await db.query("select * from profiles")).rows[0];
    assert.equal((await process(base)).processed,true);
    const expires=(await profile()).premium_until;
    assert.equal((await process(base)).duplicate,true);
    assert.equal(new Date((await profile()).premium_until).getTime(),new Date(expires).getTime());
    await process({...base,event_id:"renewed:2",event_type:"subscription_renewed",order_id:"order-2",occurred_at:"2026-11-20T12:00:00Z"});
    assert.ok(new Date((await profile()).premium_until)>new Date(expires));
    await process({...base,event_id:"cancel:sub1",action:"cancel",event_type:"subscription_canceled",occurred_at:"2026-11-21T12:00:00Z"});
    assert.equal((await profile()).plan,"premium"); assert.equal((await profile()).cancel_at_period_end,true);
    await process({...base,event_id:"refund:old",action:"revoke",event_type:"refund",occurred_at:"2026-11-22T12:00:00Z"});
    assert.equal((await profile()).plan,"premium","old order refund must not revoke newer renewal");
    await process({...base,event_id:"refund:new",action:"revoke",event_type:"refund",order_id:"order-2",occurred_at:"2026-11-23T12:00:00Z"});
    assert.equal((await profile()).plan,"free");
    await process({...base,event_id:"late-approved:3",occurred_at:"2026-10-22T12:00:00Z"});
    assert.equal((await profile()).plan,"free","late older approval must not undo refund");
    assert.equal((await process({...base,event_id:"pending:1",email:"future@example.com"})).pendingSignup,true);
    await db.exec(`INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000002','future@example.com',now());
      INSERT INTO profiles(id) VALUES('00000000-0000-0000-0000-000000000002');
      select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);`);
    await assert.rejects(db.query("select claim_pending_payments('qa@example.com','00000000-0000-0000-0000-000000000002')"),/email_mismatch/);
    await assert.rejects(db.query("select claim_pending_payments('qa@example.com','00000000-0000-0000-0000-000000000001')"),/not_authorized/);
    assert.equal((await db.query("select claim_pending_payments('future@example.com','00000000-0000-0000-0000-000000000002') as n")).rows[0].n,1);
    assert.ok((await db.query("select premium_until from profiles where id=auth.uid()")).rows[0].premium_until,"monthly pending signup cannot become lifetime");
    await assert.rejects(process({...base,event_id:"fake:1",amount:0}),/payment_amount/);
    await db.exec("INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000003','new@example.com',now()); GRANT SELECT,INSERT,UPDATE ON profiles TO authenticated; SET ROLE authenticated");
    await assert.rejects(db.query("update profiles set plan='premium'"),/billing_fields_are_server_only/);
    await assert.rejects(db.query("update profiles set cakto_order_id='spoofed-order'"),/billing_fields_are_server_only/);
    await assert.rejects(db.query("update profiles set cakto_subscription_id='spoofed-subscription'"),/billing_fields_are_server_only/);
    await assert.rejects(db.query("insert into profiles(id,cakto_order_id) values('00000000-0000-0000-0000-000000000003','spoofed-order')"),/billing_fields_are_server_only/);
    await assert.rejects(db.query("select process_cakto_event('{}'::jsonb)"),/permission denied/);
    await db.exec("RESET ROLE");
  } finally { await db.close(); }
});
