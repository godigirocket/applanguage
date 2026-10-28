import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5174";
const qa = JSON.parse(fs.readFileSync("scratchpad/production-audit/qa-account.private.json"));
const b = await chromium.launch();
try {
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  await c.addInitScript(() => {
    let loaded = false;
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    const synth = new EventTarget();
    const basic = {
      name: "Microsoft David Desktop",
      voiceURI: "basic-en",
      lang: "en-US",
      localService: true,
      default: true,
    };
    const natural = {
      name: "Jenny Online Natural",
      voiceURI: "natural-en",
      lang: "en-US",
      localService: false,
      default: false,
    };
    Object.assign(synth, {
      cancel() {},
      getVoices() {
        return loaded
          ? [
              basic,
              natural,
              { name: "Luciana Enhanced", voiceURI: "pt", lang: "pt-BR", localService: true },
            ]
          : [];
      },
      speak(u) {
        window.__spoken.push({
          text: u.text,
          voice: u.voice?.voiceURI,
          rate: u.rate,
          lang: u.lang,
        });
      },
    });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: synth });
    window.__loadVoices = () => {
      loaded = true;
      synth.dispatchEvent(new Event("voiceschanged"));
    };
  });
  const p = await c.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/login");
  await p.locator("input[type=email]").fill(qa.email);
  await p.locator("input[type=password]").fill(qa.password);
  await p.locator("button[type=submit]").click();
  await p.waitForURL(/home/);
  await p.locator(".home-resume-action").waitFor();
  await p.waitForLoadState("networkidle");
  await p.goto(base + "/settings");
  await p.locator("#lume-voice").waitFor();
  await p.waitForLoadState("networkidle");
  assert.equal(await p.locator("#lume-voice option").count(), 1);
  await p.evaluate(() => window.__loadVoices());
  await p.waitForFunction(() => document.querySelectorAll("#lume-voice option").length === 3);
  await p.locator(".lume-voice-settings .voice-preview").click();
  assert.equal((await p.evaluate(() => window.__spoken)).at(-1).voice, "natural-en");
  assert.equal((await p.evaluate(() => window.__spoken)).at(-1).rate, 1);
  await p.locator("#lume-voice").selectOption("basic-en");
  await p.locator(".lume-voice-settings .voice-preview").click();
  assert.equal((await p.evaluate(() => window.__spoken)).at(-1).voice, "basic-en");
  await p.reload();
  await p.waitForLoadState("networkidle");
  await p.evaluate(() => window.__loadVoices());
  await p.waitForFunction(() => document.querySelector("#lume-voice").value === "basic-en");
  await p.locator(".lume-voice-settings .voice-preview").click();
  assert.equal((await p.evaluate(() => window.__spoken)).at(-1).voice, "basic-en");
  await p.locator("#lume-voice").selectOption("");
  await p.locator(".lume-voice-settings .voice-preview").click();
  assert.equal((await p.evaluate(() => window.__spoken)).at(-1).voice, "natural-en");
  assert.deepEqual(errors, []);
  console.log(
    "PASS voice settings: lazy voices, language filtering, natural ranking, normal cadence, preview, manual choice, reload persistence, automatic reset",
  );
} finally {
  await b.close();
}
