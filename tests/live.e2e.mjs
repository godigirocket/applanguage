import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { buildActivities } from "../src/lib/lesson-session.ts";

const base = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
const stage = process.env.LIVE_STAGE || "production";
const out = path.resolve("scratchpad/production-audit", stage);
fs.mkdirSync(out, { recursive: true });
const results = [];
const browser = await chromium.launch();
async function check(name, run) {
  try { await run(); results.push({ name, ok: true }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, ok: false, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}
async function noOverflow(page) {
  const issues = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || getComputedStyle(el).visibility === "hidden") return false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (["auto", "scroll"].includes(getComputedStyle(p).overflowX) && p.scrollWidth > p.clientWidth) return false;
    }
    return getComputedStyle(el).position !== "absolute" && getComputedStyle(el).position !== "fixed" && (r.right > innerWidth + 2 || r.left < -2);
  }).slice(0, 5).map((el) => ({ tag: el.tagName, className: String(el.className), text: el.textContent?.slice(0, 50) })));
  assert.deepEqual(issues, [], `Horizontal overflow: ${JSON.stringify(issues)}`);
}
try {
  for (const width of [390, 1440]) await check(`public pages ${width}px`, async () => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/pricing", "/terms", "/support", "/refund"]) {
      const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      assert.equal(response.status(), 200, route);
      await page.locator("h1,h2,input,button").first().waitFor({ state: "visible", timeout: 20000 });
      if (["/login", "/signup", "/forgot-password"].includes(route)) await page.locator('input[type="email"]').waitFor({ timeout: 15000 });
      await page.waitForTimeout(700);
      await noOverflow(page);
      assert.ok(!(await page.locator("body").innerText()).includes("This page didn't load"));
      await page.screenshot({ path: path.join(out, `${route.slice(1) || "landing"}-${width}.png`), fullPage: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
  });
  if (stage !== "baseline") await check("published lesson: complete, replay, resume, next", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const lesson = JSON.parse(fs.readFileSync(new URL("../src/data/lessons/detail/en/chunk-0.json", import.meta.url)))[0];
    await page.goto(`${base}/lesson/${lesson.id}`);
    await page.getByRole("button", { name: "Vamos começar" }).click();
    await page.locator(".lesson-footer").getByRole("button", { name: "Continuar", exact: true }).click();
    await page.getByText("Prática · 02", { exact: true }).waitFor();
    await page.reload();
    await page.getByRole("button", { name: "Continuar de onde parei" }).click();
    const activities = buildActivities(lesson.steps);
    for (let i = 1; i < activities.length; i++) {
      const a = activities[i];
      await page.getByText(`Prática · ${String(i + 1).padStart(2, "0")}`, { exact: true }).waitFor();
      if (["quiz", "listening"].includes(a.type)) {
        await page.locator(".lesson-option").nth(a.correct).click();
        await page.getByRole("button", { name: "Verificar", exact: true }).click();
      } else if (a.type === "translation") {
        await page.getByLabel("Sua tradução", { exact: true }).fill(a.correctTranslation);
        await page.getByRole("button", { name: "Verificar", exact: true }).click();
      } else if (a.type === "dragdrop") {
        for (const word of a.answerTokens) await page.locator(".lesson-token-bank").getByRole("button", { name: word, exact: true }).first().click();
        await page.getByRole("button", { name: "Verificar", exact: true }).click();
      }
      await page.locator(".lesson-footer").getByRole("button", { name: a.type === "speaking" ? "Pular por enquanto" : "Continuar", exact: true }).click();
    }
    await page.getByRole("heading", { name: "Lição concluída", exact: true }).waitFor();
    assert.match(await page.locator(".lesson-result-grid").innerText(), /100%/);
    await page.screenshot({ path: path.join(out, "published-completion.png") });
    await page.getByRole("button", { name: "Próxima lição", exact: true }).click();
    await page.waitForURL(/lesson-en-2/);
    await page.goto(`${base}/lesson/lesson-en-1`);
    await page.getByRole("button", { name: "Revisar lição", exact: true }).waitFor();
    await page.close();
  });
} finally {
  await browser.close();
  fs.writeFileSync(path.join(out, "results.json"), JSON.stringify({ base, results }, null, 2));
}
assert.ok(results.every((r) => r.ok), "Live browser checks failed");
