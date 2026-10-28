import { chromium } from "playwright";
import fs from "node:fs";

const base = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
const stage = process.env.PERF_STAGE || "before";
const browser = await chromium.launch();
const results = [];
try {
  for (const route of ["/", "/login", "/lesson/lesson-en-1"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 80, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__perf = { lcp: 0, cls: 0, longTasks: 0, blockingMs: 0 };
      new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => { for (const e of list.getEntries()) { window.__perf.longTasks++; window.__perf.blockingMs += Math.max(0, e.duration - 50); } }).observe({ type: "longtask", buffered: true });
    });
    await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(4000);
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      return { ...window.__perf, ttfb: nav.responseStart, domReady: nav.domContentLoadedEventEnd, bytes: nav.transferSize + resources.reduce((sum, r) => sum + r.transferSize, 0), jsBytes: resources.filter(r => new URL(r.name).pathname.endsWith(".js")).reduce((sum, r) => sum + r.transferSize, 0), requests: resources.length + 1, largest: resources.filter(r => r.transferSize > 30000).map(r => ({ path: new URL(r.name).pathname, bytes: r.transferSize })).sort((a,b) => b.bytes - a.bytes).slice(0, 8) };
    });
    results.push({ route, ...metrics });
    console.log(JSON.stringify(results.at(-1)));
    await context.close();
  }
  fs.mkdirSync("scratchpad/performance", { recursive: true });
  fs.writeFileSync(`scratchpad/performance/${stage}.json`, JSON.stringify({ base, network: "1.6 Mbps / 80 ms latency / CPU 4x / cold browser cache / SW blocked", results }, null, 2));
} finally { await browser.close(); }
