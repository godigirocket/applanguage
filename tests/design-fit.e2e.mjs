import { chromium } from "playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
import { inspectControlGeometry } from "./control-geometry.mjs";
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5174";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const b = await chromium.launch();
const results = [],
  errors = [];
fs.mkdirSync("scratchpad/design-27", { recursive: true });
try {
  for (const [width, height] of [
    [320, 740],
    [360, 800],
    [390, 844],
    [430, 932],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [844, 390],
  ]) {
    const c = await b.newContext({
      viewport: { width, height },
      isMobile: width < 1000,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const p = await c.newPage();
    p.on("pageerror", (e) => errors.push({ width, url: p.url(), error: e.message }));
    await p.goto(base);
    await p.waitForLoadState("networkidle");
    await p.screenshot({ path: `scratchpad/design-27/landing-${width}.png` });
    assert.deepEqual(await inspectControlGeometry(p), []);
    for (const d of await p.locator(".landing-faq summary").all()) {
      await d.click();
      await p.waitForTimeout(50);
    }
    assert.equal(await p.locator(".landing-faq details[open]").count(), 3);
    await p.goto(base + "/login");
    await p.locator("input[type=email]").fill(qa.email);
    await p.locator("input[type=password]").fill(qa.password);
    await p.locator("button[type=submit]").click();
    await p.waitForURL(/home/);
    await p.locator(".home-resume-action").waitFor();
    await p.waitForLoadState("networkidle");
    for (const route of [
      "home",
      "lessons",
      "games",
      "profile",
      "settings",
      "conversation/travel",
      "lesson/lesson-en-1",
    ]) {
      if (new URL(p.url()).pathname !== "/" + route) await p.goto(base + "/" + route);
      await p.waitForLoadState("networkidle");
      assert.equal(new URL(p.url()).pathname, "/" + route);
      await p.waitForTimeout(300);
      assert.deepEqual(await inspectControlGeometry(p), [], `${width} ${route}`);
      assert.ok(
        await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        "Page overflow",
      );
      if (route === "games") {
        await p.getByRole("link", { name: "Gramática", exact: true }).click();
        await p.waitForURL(/quiz-play\/grammar/);
        await p.goto(base + "/games");
        await p.waitForLoadState("networkidle");
      }
      if (route === "conversation/travel") {
        const input = p.getByRole("textbox", {name: "Sua resposta", exact: true});
        await input.focus();
        assert.equal(await input.evaluate(e => getComputedStyle(e).fontSize), "16px");
        assert.equal(await p.evaluate(() => visualViewport.scale), 1);
        assert.ok(await p.locator(".lume-conversation-page").evaluate(e => Math.abs(e.getBoundingClientRect().height-innerHeight)<2), "Conversation fills the viewport");
        await p.setViewportSize({width,height:Math.max(320,height-280)});
        await p.waitForTimeout(150);
        assert.ok(await input.evaluate(e => {const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1;}), "Reply input stays visible with shorter viewport");
        await p.setViewportSize({width,height});
        await input.blur();
      }
      if (route.startsWith("lesson/")) {
        await p.locator(".lesson-welcome > .lesson-primary").click();
        await p.locator(".lesson-footer").waitFor();
        await p.waitForTimeout(1400);
        const geometry = await p.locator(".lesson-footer .lesson-primary").evaluate((e) => {
          const r = e.getBoundingClientRect();
          return {
            top: r.top,
            bottom: r.bottom,
            height: innerHeight,
            scale: visualViewport.scale,
            doc: document.documentElement.scrollHeight,
          };
        });
        assert.ok(geometry.top >= 0 && geometry.bottom <= height + 1, JSON.stringify(geometry));
        assert.equal(geometry.scale, 1);
        await p.screenshot({ path: `scratchpad/design-27/exercise-${width}.png` });
        await p.setViewportSize({ width, height: Math.max(320, height - 200) });
        await p.waitForTimeout(100);
        assert.ok(
          await p
            .locator(".lesson-footer .lesson-primary")
            .evaluate((e) => e.getBoundingClientRect().bottom <= innerHeight + 1),
          "Action fits after viewport resize",
        );
        await p.setViewportSize({ width, height });
      }
      if ([390, 1440].includes(width)) {
        await p.screenshot({
          path: `scratchpad/design-27/${route.replaceAll("/", "-")}-${width}.png`,
        });
        if (!route.startsWith("lesson/")) {
          await p.evaluate(() => (document.documentElement.dataset.theme = "dark"));
          await p.screenshot({
            path: `scratchpad/design-27/dark-${route.replaceAll("/", "-")}-${width}.png`,
          });
          await p.evaluate(() => (document.documentElement.dataset.theme = "light"));
        }
      }
      results.push({ width, height, route, ok: true });
      console.log("PASS design", width, height, route);
    }
    await c.close();
  }
} finally {
  await b.close();
  fs.writeFileSync(
    "scratchpad/design-27/results.json",
    JSON.stringify({ base, results, errors }, null, 2),
  );
}
assert.deepEqual(errors, []);
