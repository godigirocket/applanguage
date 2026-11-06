import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";
import { inspectControlGeometry } from "./control-geometry.mjs";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5174";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 320, height: 844 }, reducedMotion: "reduce" });
  await page.goto(`${base}/login`);
  await page.locator("input[type=email]").fill(qa.email);
  await page.locator("input[type=password]").fill(qa.password);
  await page.locator("button[type=submit]").click();
  await page.waitForURL(/\/home/);
  await page.locator(".home-resume-action").waitFor();
  await page.getByRole("button", { name: "Mostrar próxima dica" }).focus();
  await page.keyboard.press("Enter");
  await page.getByText("Ouça uma frase e repita em voz alta no seu ritmo.").waitFor();
  await page.goto(`${base}/skills`);
  await page.getByRole("heading", { name: /Árvore de Habilidades/i }).waitFor();
  const search = page.getByPlaceholder("Buscar tema…");
  await search.fill("sem-correspondencia-qa");
  await page.getByRole("heading", { name: "Nenhum tema encontrado" }).waitFor();
  await page.getByRole("button", { name: /Limpar filtros/i }).click();
  assert.equal(await search.inputValue(), "");
  const lesson = page.locator('a[href^="/lesson/"]').first();
  await lesson.waitFor();
  for (const width of [320, 390, 768, 1100, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    assert.deepEqual(await inspectControlGeometry(page), [], `Skills at ${width}px`);
    assert.ok(await page.evaluate(() => [...document.querySelectorAll('.lume-app-header a,.lume-app-header button')].every((el) => {
      const r = el.getBoundingClientRect();
      return !r.width || (r.left >= 0 && r.right <= innerWidth + 1);
    })), `Header controls fit at ${width}px`);
  }
  await lesson.click();
  await page.waitForURL(/\/lesson\//);
  await page.locator(".lesson-welcome > .lesson-primary").waitFor();
  console.log("PASS keyboard mascot tips, skill search/reset, responsive header and lesson destination");
} finally {
  await browser.close();
}
