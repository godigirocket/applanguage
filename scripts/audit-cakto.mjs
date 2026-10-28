// Read-only catalog probe; never print or persist access tokens or secrets.
import fs from "node:fs";
const env = { ...process.env };
for (const file of [".env", ".env.local"]) if (fs.existsSync(file)) for (const line of fs.readFileSync(file,"utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z_0-9]+)=(.*)$/); if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
}
const auth = await fetch("https://api.cakto.com.br/public_api/token/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env.CAKTO_CLIENT_ID || "", client_secret: env.CAKTO_CLIENT_SECRET || "" }), signal: AbortSignal.timeout(15000) });
console.log("Cakto authentication status",auth.status);
if (!auth.ok) process.exit(1);
const token = (await auth.json()).access_token;
async function list(path) {
  const rows = []; let next = `https://api.cakto.com.br/public_api/${path}/`;
  for (let n = 0; next && n < 30; n++) {
    const u = new URL(next);
    if (u.hostname !== "api.cakto.com.br" || !["https:", "http:"].includes(u.protocol) || !u.pathname.startsWith("/public_api/")) throw new Error("Unexpected catalog pagination origin");
    u.protocol = "https:";
    const response = await fetch(u, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Catalog ${path} status ${response.status}`);
    const payload = await response.json();
    rows.push(...(payload.results || payload.data || payload)); next = payload.next;
  }
  return rows;
}
const offers = await list("offers");
const products = await list("products");
try {
  const webhooks = await list("webhooks");
  const relevantWebhooks = webhooks.filter(w => /langlume/i.test(String(w.url || w.webhook_url || w.name || "")));
  console.log("Langlume webhook audit",relevantWebhooks.map(w => ({ id:w.id, url:w.url || w.webhook_url, events:w.events, status:w.status, secretMatchesLocal:w.secret === env.CAKTO_WEBHOOK_SECRET })));
} catch { console.log("Webhook catalog read unavailable"); }
const langProducts = products.filter(p => /langlume|lumelearn|lume app/i.test(p.name));
const productIds = new Set(langProducts.map(p => p.id));
const relevant = offers.filter(o => productIds.has(o.product) || /langlume|lumelearn/i.test(o.name));
fs.writeFileSync("scratchpad/production-audit/cakto-offers.private.json", JSON.stringify({ products: langProducts, offers: relevant }, null, 2));
console.log("Catalog read", { products: products.length, offers: offers.length, langlumeProducts: langProducts.length, langlumeOffers: relevant.length });
for (const offer of relevant) console.log(JSON.stringify({ id: offer.id, productId: offer.product, name: offer.name, price: offer.price, periodDays: offer.recurrence_period, type: offer.type, status: offer.status }));
