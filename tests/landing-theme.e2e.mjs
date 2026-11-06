import { chromium, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import { inspectControlGeometry } from "./control-geometry.mjs";
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5174";
const output = "scratchpad/landing-release";
const engine = process.env.E2E_BROWSER === "webkit" ? webkit : chromium;
fs.mkdirSync(output, { recursive: true });
const browser = await engine.launch();
const luminance = (css) =>
  css
    .match(/\d+/g)
    .slice(0, 3)
    .map((x) => Number(x) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    .reduce((sum, x, i) => sum + x * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
try {
  for (const width of [320, 390, 768, 1440])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 768 ? 540 : 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript((theme) => {
        if (!localStorage.getItem("lume_theme")) localStorage.setItem("lume_theme", theme);
      }, theme);
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.waitForLoadState("networkidle");
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.theme || "light"),
        theme,
      );
      const colors = await page.locator(".lp").evaluate((root) => ({
        bg: getComputedStyle(root).backgroundColor,
        h1: getComputedStyle(root.querySelector("h1")).color,
        accent: getComputedStyle(root.querySelector("h1 em")).color,
        body: getComputedStyle(root.querySelector(".lp-copy p")).color,
      }));
      for (const color of [colors.h1, colors.accent, colors.body])
        assert.ok(contrast(color, colors.bg) >= 4.5, JSON.stringify(colors));
      assert.deepEqual(await inspectControlGeometry(page), []);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({
        path: `${output}/${engine.name()}-${width}-${theme}.png`,
        fullPage: true,
      });
      const demo = page.locator(".lp-demo");
      const verify = demo.getByRole("button", { name: "Verificar", exact: true });
      assert.ok(await verify.isDisabled());
      await demo.getByRole("button", { name: "Café", exact: true }).click();
      await verify.click();
      await demo
        .getByRole("status")
        .getByText(/Quase!/)
        .waitFor();
      await demo.getByRole("button", { name: "Água", exact: true }).click();
      await verify.click();
      await demo
        .getByRole("status")
        .getByText(/Acertou!/)
        .waitFor();
      assert.equal(
        await demo.getByRole("link", { name: "Quero continuar" }).getAttribute("href"),
        "/signup?course=en",
      );
      await demo.getByRole("button", { name: "Español", exact: true }).click();
      assert.ok(await verify.isDisabled());
      await demo.getByRole("button", { name: "Reserva", exact: true }).click();
      await verify.click();
      await demo.getByRole("link", { name: "Quero continuar" }).waitFor();
      for (const summary of await page.locator(".landing-faq summary").all()) await summary.click();
      assert.equal(await page.locator(".landing-faq details[open]").count(), 3);
      if (width === 390 && theme === "light") {
        await page.getByTitle(/Alternar tema|Toggle light/).click();
        await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
        await page.reload();
        assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
        await page.getByRole("button", { name: "Language settings", exact: true }).click();
        await page
          .locator(".lume-language-panel")
          .getByRole("button", { name: "ES", exact: true })
          .click();
        await page.getByRole("heading", { name: /Pocos minutos/ }).waitFor();
        assert.deepEqual(await inspectControlGeometry(page), []);
        await page.getByRole("link", { name: "Ver planes Premium", exact: true }).click();
        await page.waitForURL(/\/pricing$/);
        await page.goBack();
        await page.getByRole("link", { name: "Empieza gratis", exact: true }).click();
        await page.waitForURL(/\/signup$/);
      }
      assert.deepEqual(errors, []);
      console.log("PASS", engine.name(), width, theme, "contrast, fit, demo feedback and FAQ");
      await context.close();
    }
} finally {
  await browser.close();
}
