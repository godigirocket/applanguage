import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium, webkit } from "playwright";
import { buildActivities, resolveLessonText } from "../src/lib/lesson-session.ts";
import { inspectControlGeometry } from "./control-geometry.mjs";

const base = process.env.PRODUCTION_BASE_URL || "http://127.0.0.1:5174";
const browser = await (process.env.E2E_BROWSER === "webkit" ? webkit : chromium).launch();
try {
  for (const [language, width, height] of [
    ["en", 320, 740],
    ["es", 390, 844],
    ["pt", 844, 390],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const lessons = JSON.parse(
      fs.readFileSync(
        new URL(`../src/data/lessons/detail/${language}/chunk-0.json`, import.meta.url),
      ),
    );
    const lesson = lessons.find((entry) => entry.id === `lesson-${language}-1`);
    const activities = buildActivities(lesson.steps);
    await page.goto(`${base}/lesson/${lesson.id}`);
    await page.getByRole("button", { name: "Vamos começar", exact: true }).click();
    for (const [i, activity] of activities.entries()) {
      await page
        .getByText(`Prática · ${String(i + 1).padStart(2, "0")}`, { exact: true })
        .waitFor();
      if (activity.type === "quiz" || activity.type === "listening") {
        const choice = language === "en" && i === 8 ? 0 : activity.correct;
        await page.locator(".lesson-option").nth(choice).click();
      } else if (activity.type === "translation") {
        await page
          .getByLabel("Sua tradução", { exact: true })
          .fill(activity.acceptedTranslations[0]);
      } else if (activity.type === "dragdrop") {
        for (const word of activity.answerTokens) {
          await page
            .locator(".lesson-token-bank")
            .getByRole("button", { name: word, exact: true })
            .and(page.locator("button:not([disabled])"))
            .first()
            .click();
        }
      }
      if (activity.explanation) {
        await page.getByRole("button", { name: "Verificar", exact: true }).click();
        const footer = page.locator(".lesson-feedback");
        await footer
          .getByText(resolveLessonText(activity.explanation, "pt"), { exact: true })
          .waitFor();
        if (language === "en" && i === 8) {
          await footer.getByText("Resposta: a / an", { exact: true }).waitFor();
        } else {
          await footer.getByText("Muito bem!", { exact: true }).waitFor();
        }
      }
      const action = page.locator(".lesson-footer").getByRole("button", {
        name: activity.type === "speaking" ? "Pular por enquanto" : "Continuar",
        exact: true,
      });
      assert.ok(
        await action.evaluate((el) => {
          const box = el.getBoundingClientRect();
          return box.top >= 0 && box.bottom <= innerHeight + 1;
        }),
        `${language}: activity ${i + 1} action clipped`,
      );
      assert.deepEqual(await inspectControlGeometry(page), []);
      await action.click();
    }
    await page.getByRole("heading", { name: "Lição concluída", exact: true }).waitFor();
    assert.match(
      await page.locator(".lesson-result-grid").innerText(),
      language === "en" ? /80%/ : /100%/,
    );
    await page.getByRole("button", { name: "Próxima lição", exact: true }).click();
    await page.waitForURL(`**/lesson/lesson-${language}-2`);
    assert.deepEqual(errors, []);
    console.log(
      `PASS airport ${language} ${width}x${height}: feedback, translations, visible controls and next lesson`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
