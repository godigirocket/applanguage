import fs from "node:fs";
const env = { ...process.env };
for (const file of [".env", ".env.local", process.env.AUDIT_ENV_FILE].filter(Boolean)) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_0-9]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}
const base = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
const results = [];
async function check(name, run) {
  try { const result = await run(); results.push({ name, ...result }); console.log(name, JSON.stringify(result)); }
  catch (error) { results.push({ name, error: error.message }); console.log(name, error.message); }
}
const headers = { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY };
await check("auth-settings", async () => {
  const r = await fetch(`${env.VITE_SUPABASE_URL}/auth/v1/settings`, { headers, signal: AbortSignal.timeout(15000) });
  const data = await r.json();
  return { status: r.status, signupDisabled: data.disable_signup, emailEnabled: data.external?.email, emailAutoConfirm: data.mailer_autoconfirm };
});
await check("webhook-rejects-unauthorized", async () => {
  const r = await fetch(`${base}/api/webhooks/cakto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: "invalid-qa-secret", event: "qa.invalid" }), signal: AbortSignal.timeout(15000) });
  return { status: r.status, ok: r.status === 401 };
});
await check("gemini-model-availability", async () => {
  if (!env.GEMINI_API_KEY) return { configured: false };
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models", { headers: { "x-goog-api-key": env.GEMINI_API_KEY }, signal: AbortSignal.timeout(15000) });
  const data = await r.json();
  return { status: r.status, legacyModelAvailable: data.models?.some((m) => m.name === "models/gemini-1.5-flash"), availableFlashModels: data.models?.filter((m) => /flash/.test(m.name)).map((m) => m.name).slice(0, 8), errorCode: data.error?.status };
});
await check("google-tts", async () => {
  if (!env.GOOGLE_CLOUD_API_KEY) return { configured: false };
  const r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GOOGLE_CLOUD_API_KEY },
    body: JSON.stringify({ input: { text: "Hello, welcome to Langlume." }, voice: { languageCode: "en-US", name: "en-US-Wavenet-F" }, audioConfig: { audioEncoding: "MP3" } }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await r.json();
  return { status: r.status, hasAudio: !!data.audioContent, errorCode: data.error?.status };
});
fs.mkdirSync("scratchpad/production-audit", { recursive: true });
fs.writeFileSync("scratchpad/production-audit/services.json", JSON.stringify(results, null, 2));
