import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { buildActivities } from "../src/lib/lesson-session.ts";
const base = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const out = path.resolve("scratchpad/production-audit/auth-browser");
fs.mkdirSync(out, { recursive: true });
const results = [];
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const page = await context.newPage();
const runtimeErrors = [];
const apiFailures = [];
page.on("pageerror", (e) => runtimeErrors.push(e.message));
page.on("response", async (response) => {
  if (response.status() >= 400 && response.url().includes(".supabase.co/")) {
    const url = new URL(response.url());
    apiFailures.push({ path: url.pathname, status: response.status() });
  }
});
try {
  await page.goto(`${base}/login`);
  await page.locator('input[type="email"]').fill(qa.email);
  await page.locator('input[type="password"]').fill(qa.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/(home|onboarding)/, { timeout: 30000 });
  results.push({ name: "real-browser-signin", ok: true });
  if (page.url().includes("/onboarding")) {
    for (const choice of ["English", "Iniciante", "Para mim"]) await page.getByRole("button", { name: choice, exact: true }).click();
    await page.waitForURL(/\/home/, { timeout: 20000 });
    results.push({ name: "real-onboarding", ok: true });
  }
  // Silence only the tutorial in this QA browser; auth and data stay real.
  await page.evaluate(() => localStorage.setItem("tutorial_shown", "true"));
  if (process.env.LIVE_LESSON === "1") {
    const lesson = JSON.parse(fs.readFileSync(new URL("../src/data/lessons/detail/en/chunk-0.json", import.meta.url)))[0];
    await page.goto(`${base}/lesson/lesson-en-1`);
    await page.getByRole("button", { name: /Vamos começar|Continuar de onde parei|Revisar lição/ }).waitFor();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: /Vamos começar|Continuar de onde parei|Revisar lição/ }).click();
    const activities = buildActivities(lesson.steps);
    for (let safety = 0; safety < activities.length; safety++) {
      if (await page.getByRole("heading", { name: "Lição concluída", exact: true }).isVisible()) break;
      await page.locator(".lesson-question-area").waitFor();
      const index = Number((await page.locator(".lesson-counter").innerText()).split("/")[0]);
      const a = activities[index];
      assert.ok(a, `Invalid activity ${index}`);
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
      await page.waitForTimeout(300);
    }
    await page.getByRole("heading", { name: "Lição concluída", exact: true }).waitFor();
    await page.getByText("Progresso salvo", { exact: true }).waitFor({ timeout: 45000 });
    await page.screenshot({ path: path.join(out, "authenticated-completion.png") });
    results.push({ name: "authenticated-lesson-complete-and-save", ok: true });
    await page.getByRole("button", { name: "Próxima lição", exact: true }).click();
    // The persistent QA account may already have finished lesson 2. Advancing
    // must select another lesson instead of looping back to the current one.
    await page.waitForURL((url) =>
      /^\/lesson\/lesson-en-/.test(url.pathname) && url.pathname !== "/lesson/lesson-en-1",
    );
    await page.getByRole("button", { name: /Vamos começar|Continuar de onde parei/ }).waitFor();
    results.push({ name: "authenticated-next-lesson", ok: true });
    await page.goto(`${base}/home`);
  }
  await page.reload();
  for (const route of ["/home", "/lessons", "/games", "/profile", "/progress", "/dictionary", "/community", "/culture", "/skills", "/vocabulary-lists", "/shop", "/settings", "/checkout?plan=premium_annual"]) {
    await page.goto(`${base}${route}`);
    await page.locator('header[aria-label="Site header"] a[href="/profile"]').first().waitFor({ state: "attached", timeout: 15000 });
    await page.waitForTimeout(1000);
    assert.ok(!page.url().includes("/login"), `Lost session at ${route}`);
    const body = await page.locator("body").innerText();
    assert.ok(!body.includes("This page didn't load"), route);
    await page.screenshot({ path: path.join(out, `${route.split("?")[0].slice(1)}.png`), fullPage: true });
    results.push({ name: `real-account${route}`, ok: true });
  }
  await page.reload();
  await page.locator('header[aria-label="Site header"] a[href="/profile"]').first().waitFor({ state: "attached" });
  results.push({ name: "session-after-reload", ok: true });
} catch (error) {
  results.push({ name: "browser-flow", ok: false, error: error.message });
  await page.screenshot({ path: path.join(out, "failure.png"), fullPage: true });
} finally {
  await browser.close();
  fs.writeFileSync(path.join(out, "results.json"), JSON.stringify({ base, results, runtimeErrors, apiFailures }, null, 2));
}
for (const result of results) console.log(result.ok ? "PASS" : "FAIL", result.name, result.error || "");
console.log("Runtime errors", runtimeErrors.length, "API failures", JSON.stringify(apiFailures));
assert.ok(results.every((r) => r.ok) && runtimeErrors.length === 0, "Authenticated live browser checks failed");
