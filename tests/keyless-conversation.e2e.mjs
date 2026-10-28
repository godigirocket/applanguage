import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const qa = JSON.parse(
  fs.readFileSync("scratchpad/production-audit/qa-account.private.json", "utf8"),
);
fs.mkdirSync("scratchpad/keyless", { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(() => {
      window.__spoken = [];
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
        }
      };
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          cancel() {},
          getVoices() {
            return [{ name: "Local test voice", lang: "en-US", localService: true }];
          },
          speak(utterance) {
            window.__spoken.push({
              text: utterance.text,
              lang: utterance.lang,
              local: utterance.voice?.localService,
            });
          },
        },
      });
      Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: undefined });
      Object.defineProperty(window, "webkitSpeechRecognition", {
        configurable: true,
        value: undefined,
      });
    });
    const page = await context.newPage();
    const errors = [],
      modelRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (
        /generativelanguage|texttospeech\.googleapis/.test(request.url()) ||
        (request.url().includes("/_serverFn/") && request.postData()?.includes("messages"))
      )
        modelRequests.push(request.url());
    });
    await page.goto(`${base}/login`);
    await page.locator("input[type=email]").fill(qa.email);
    await page.locator("input[type=password]").fill(qa.password);
    await page.locator("button[type=submit]").click();
    await page.waitForURL(/\/home/);
    await page.goto(`${base}/conversation/travel`);
    await page.getByTestId("practice-reply").waitFor();
    assert.equal(await page.getByTestId("practice-reply").count(), 1);
    assert.ok(
      (await page.getByTestId("practice-reply").innerText()).includes(
        "Where would you like to travel?",
      ),
    );
    await context.setOffline(true);
    await page.getByRole("textbox", { name: "Sua resposta" }).fill("I want go to Lisbon");
    await page.getByRole("textbox", { name: "Sua resposta" }).press("Enter");
    await page
      .getByTestId("practice-reply")
      .filter({ hasText: "I want to go to Lisbon" })
      .waitFor();
    await page.getByRole("button", { name: "Help", exact: true }).click();
    await page.getByTestId("practice-reply").filter({ hasText: "Use this model" }).waitFor();
    await page
      .getByRole("button", { name: "I'd like a room for two nights, please.", exact: true })
      .click();
    await page
      .getByTestId("practice-reply")
      .filter({ hasText: "Ask how to get to the station." })
      .waitFor();
    if (width === 390) {
      for (let step = 0; step < 4; step++) {
        for (let hint = 0; hint < 3; hint++) {
          await page.getByRole("button", { name: "Help", exact: true }).click();
        }
        await page.getByLabel("Sugestões de resposta").getByRole("button").first().click();
      }
      await page.getByTestId("practice-reply").filter({ hasText: "You completed this scenario" }).waitFor();
      await page.getByRole("button", { name: "Start again", exact: true }).click();
      await page.getByTestId("practice-reply").last().filter({ hasText: "Where would you like to travel?" }).waitFor();
      console.log("PASS long guided session with repeated help terminates and restarts without losing progress");
    }
    await page.getByRole("button", { name: "Falar resposta", exact: true }).click();
    await page
      .locator("p")
      .filter({ hasText: /Reconhecimento de voz (?:não disponível|indisponível|nao disponivel)/ })
      .waitFor();
    await page
      .getByTestId("practice-reply")
      .last()
      .getByRole("button", { name: "Áudio", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken);
    assert.ok(spoken.some((s) => s.local && s.lang === "en-US"));
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2),
      false,
    );
    assert.deepEqual(modelRequests, []);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `scratchpad/keyless/conversation-${width}.png`, fullPage: true });
    console.log(
      `PASS ${width}px: local greeting, offline replies/correction/help, suggestions, native audio, unsupported mic, zero model requests`,
    );
    await context.setOffline(false);
    if (width === 390) {
      await page.route("https://api.dictionaryapi.dev/api/v2/entries/en/serendipity", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              word: "serendipity",
              meanings: [{ definitions: [{ definition: "A fortunate discovery." }] }],
            },
          ]),
        }),
      );
      await page.goto(`${base}/dictionary`);
      await page.getByPlaceholder(/Buscar palavra ou tradução/).fill("serendipity");
      await page
        .getByRole("button", { name: "Consultar definição em inglês", exact: true })
        .click();
      await page.getByText("A fortunate discovery.", { exact: true }).waitFor();
      await page.getByPlaceholder(/Buscar palavra ou tradução/).fill("unavailableword");
      await context.setOffline(true);
      await page
        .getByRole("button", { name: "Consultar definição em inglês", exact: true })
        .click();
      await page.getByText(/A definição online não está disponível/).waitFor();
      console.log("PASS optional dictionary lookup with fixture and recoverable offline failure");
    }
    await context.close();
  }
} finally {
  await browser.close();
}
