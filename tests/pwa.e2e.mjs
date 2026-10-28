import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const scripts = new Set();
  page.on("request", (r) => { if (new URL(r.url()).pathname.endsWith(".js")) scripts.add(new URL(r.url()).pathname); });
  await page.goto(base);
  const worker = await page.evaluate(async () => {
    const registration = await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error("Worker not ready")), 20000))]);
    return { active: registration.active?.scriptURL, caches: await caches.keys() };
  });
  assert.equal(new URL(worker.active).pathname, "/sw.js");
  const manifestResponse = await page.request.get(`${base}/manifest.webmanifest`);
  assert.equal(manifestResponse.status(), 200);
  const manifest = await manifestResponse.json();
  for (const icon of manifest.icons) assert.equal((await page.request.get(new URL(icon.src, base).href)).status(), 200, icon.src);
  const cached = await page.evaluate(async () => {
    const entries = [];
    for (const name of await caches.keys()) for (const request of await (await caches.open(name)).keys()) entries.push(new URL(request.url).pathname);
    return entries;
  });
  assert.ok(!cached.some((p) => p.startsWith("/_serverFn/") || ["/", "/home", "/login"].includes(p)), "Do not cache session HTML or server function responses");
  assert.ok(scripts.size < 20, `Unexpected bulk downloading: ${scripts.size} JS files`);
  const result = { base, worker, iconCount: manifest.icons.length, javascriptRequests: scripts.size, cachedPaths: cached };
  fs.writeFileSync("scratchpad/production-audit/performance-pwa.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
