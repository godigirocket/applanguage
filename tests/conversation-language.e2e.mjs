import { chromium } from "playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const requests = [];
  page.on("request", (r) => {
    if (r.url().includes("/_serverFn/") && r.postData()?.includes("messages"))
      requests.push(r.url());
  });
  await page.goto("http://127.0.0.1:5173/login");
  await page.locator("input[type=email]").fill(qa.email);
  await page.locator("input[type=password]").fill(qa.password);
  await page.locator("button[type=submit]").click();
  await page.waitForURL(/\/home/);
  for (const [language, question] of [
    ["en", "Where would you like to travel?"],
    ["es", "¿Adónde te gustaría viajar?"],
    ["pt", "Para onde você gostaria de viajar?"],
  ]) {
    await page.evaluate(async (language) => {
      const { useStore } = await import("/src/hooks/useStore.ts");
      useStore.getState().setTargetLanguage(language);
      useStore.getState().setInterfaceLanguage(language === "pt" ? "en" : "pt");
    }, language);
    await page.goto("http://127.0.0.1:5173/conversation/travel");
    await page.getByTestId("practice-reply").filter({ hasText: question }).waitFor();
    assert.equal(await page.getByTestId("practice-reply").count(), 1);
    console.log(
      "PASS local guided conversation in",
      language,
      "with a different interface language",
    );
  }
  assert.deepEqual(requests, []);
} finally {
  await browser.close();
}
