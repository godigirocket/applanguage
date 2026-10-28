// Dedicated QA account only. Credentials stay in ignored scratchpad files.
import fs from "node:fs";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const env = { ...process.env };
for (const file of [".env", ".env.local"]) if (fs.existsSync(file)) for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const dir = "scratchpad/production-audit";
fs.mkdirSync(dir, { recursive: true });
const credentialsPath = `${dir}/qa-account.private.json`;
const existing = fs.existsSync(credentialsPath);
const qa = existing ? JSON.parse(fs.readFileSync(credentialsPath)) : { email: `langlume-qa-${Date.now()}@example.com`, password: `${crypto.randomBytes(24).toString("base64url")}aA1!` };
if (!existing) fs.writeFileSync(credentialsPath, JSON.stringify(qa));
const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const result = existing ? await client.auth.signInWithPassword(qa) : await client.auth.signUp({ ...qa, options: { data: { full_name: "Test QA E2E", is_test_account: true } } });
if (result.error || !result.data.session) throw new Error(result.error?.message || "Email confirmation required");
const userId = result.data.user.id;
if (process.env.LIVE_VERIFY_ONLY === "1") {
  const lesson = await client.from("lesson_progress").select("lesson_id,status,progress,xp_earned,current_step,total_steps").eq("user_id", userId).eq("lesson_id", "lesson-en-1").single();
  const profile = await client.from("profiles").select("xp").eq("id", userId).single();
  if (lesson.error || profile.error) throw new Error(lesson.error?.message || profile.error?.message);
  const verified = { progress: lesson.data, profileXP: profile.data.xp };
  fs.writeFileSync(`${dir}/published-progress.json`, JSON.stringify(verified, null, 2));
  console.log(JSON.stringify(verified, null, 2));
  await client.auth.signOut({ scope: "local" });
  process.exit(0);
}
const checks = [{ name: existing ? "signin-real" : "signup-real", ok: true }];
const { error: profileError } = await client.from("profiles").update({ full_name: "Test QA E2E" }).eq("id", userId);
checks.push({ name: "profile-write-own-account", ok: !profileError, error: profileError?.message });
for (const table of ["profiles", "lesson_progress", "subscriptions", "saved_expressions", "conversations"]) {
  const result = await client.from(table).select("*").limit(1);
  checks.push({ name: `table-${table}`, ok: !result.error, error: result.error?.message, code: result.error?.code });
}
for (const name of ["get_leaderboard", "get_community_stats"]) {
  const result = await client.rpc(name, name === "get_leaderboard" ? { limit_count: 1 } : {});
  checks.push({ name: `rpc-${name}`, ok: !result.error, error: result.error?.message, code: result.error?.code });
}
// Persist a zero-XP checkpoint for this QA user's real first lesson, then
// read it back. No completion/reward is fabricated.
const previous = await client.from("lesson_progress").select("status").eq("user_id", userId).eq("lesson_id", "lesson-en-1").maybeSingle();
if (previous.data?.status === "completed") {
  checks.push({ name: "preserve-completed-lesson", ok: true });
} else {
  const checkpoint = await client.from("lesson_progress").upsert({ user_id: userId, lesson_id: "lesson-en-1", status: "in_progress", progress: 10, current_step: 1, total_steps: 10, xp_earned: 0, updated_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" }).select("lesson_id,status,current_step").single();
  checks.push({ name: "checkpoint-round-trip", ok: !checkpoint.error && checkpoint.data?.current_step === 1, error: checkpoint.error?.message });
}
await client.auth.signOut({ scope: "local" });
fs.writeFileSync(`${dir}/auth-results.json`, JSON.stringify({ checks }, null, 2));
for (const check of checks) console.log(check.ok ? "PASS" : "FAIL", check.name, check.error || "");
