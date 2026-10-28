import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.PRODUCTION_BASE_URL || "http://127.0.0.1:5173";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const browser = await chromium.launch();
const results = [];
async function signIn(page) {
  await page.locator('input[type="email"]').fill(qa.email);
  await page.locator('input[type="password"]').fill(qa.password);
  await page.locator('button[type="submit"]').click();
}
try {
  for (const [destination, expected] of [["/lessons", "/lessons"], ["/checkout?plan=premium_annual", "/checkout?plan=premium_annual"], ["/login?redirect=https://evil.example", "/home"]]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${base}${destination}`);
    await page.waitForURL(/\/login/);
    if (!destination.startsWith("/login")) assert.equal(new URL(page.url()).searchParams.get("redirect"), expected);
    await signIn(page);
    await page.waitForURL((url) => url.pathname === expected.split("?")[0], { timeout: 20000 });
    if (expected.includes("?")) assert.equal(new URL(page.url()).searchParams.get("plan"), "premium_annual");
    results.push({ name: `login returns to ${expected}`, ok: true });
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  let profileRequests = 0;
  await page.route("**/rest/v1/profiles?*", async (route) => {
    if (route.request().method() !== "GET") return route.continue();
    profileRequests++;
    await new Promise(resolve => setTimeout(resolve, 10000));
    await route.fulfill({ status: 503, contentType: "application/json", body: '{"message":"QA delayed profile"}' }).catch(() => {});
  });
  const firstProfileRequest = page.waitForRequest(
    (request) => request.method() === "GET" && request.url().includes("/rest/v1/profiles?"),
    { timeout: 15000 },
  );
  await page.goto(`${base}/login`);
  await signIn(page);
  await page.waitForURL(/\/home/);
  await page.getByText(/Continue Aprendendo|Continue Learning/, { exact: true }).waitFor({ timeout: 4000 });
  await firstProfileRequest;
  assert.equal(profileRequests, 1, "shell, header and home should share one profile request");
  results.push({ name: "home usable while profile is delayed; one shared request", ok: true });
  await context.close();
  const chatContext = await browser.newContext();
  const chatPage = await chatContext.newPage();
  await chatPage.goto(`${base}/login`);
  await signIn(chatPage);
  await chatPage.waitForURL(/\/home/);
  let chatRequests = 0;
  chatPage.on("request", r => { if (r.method() === "POST" && r.url().includes("/_serverFn/") && r.postData()?.includes("messages")) chatRequests++; });
  await chatPage.goto(`${base}/conversation/travel`);
  await chatPage.locator('input[placeholder="Or type here..."]').waitFor({ state: "attached" });
  await chatPage.getByTestId("practice-reply").waitFor();
  assert.equal(chatRequests, 0, "guided conversation must not call a model endpoint");
  const text = await chatPage.locator("body").innerText();
  assert.ok(!text.includes("wonderful to practice with you today"), "must not pretend canned fallback is AI");
  assert.ok(await chatPage.getByRole("alert").count() || text.includes("Save"), "conversation should show a response or recoverable error");
  results.push({ name: "guided conversation initializes locally without model requests", ok: true });
  await chatContext.close();
  console.log(JSON.stringify(results, null, 2));
  fs.mkdirSync("scratchpad/performance", { recursive: true });
  fs.writeFileSync("scratchpad/performance/navigation.json", JSON.stringify({ base, results }, null, 2));
} finally { await browser.close(); }
