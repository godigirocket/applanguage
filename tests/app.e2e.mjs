// Local browser regression suite. Auth/database are intercepted fixtures;
// this never creates users or writes to a production service.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { buildActivities } from "../src/lib/lesson-session.ts";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const out = new URL("../scratchpad/langlume-regression/", import.meta.url);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const failures = [];
const results = [];
const only = process.env.E2E_FILTER;
async function check(name, task) {
  if (only && !name.includes(only)) return;
  try {
    await task();
    results.push({ name, ok: true });
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}
async function stable(page) {
  await page.waitForTimeout(300);
}
async function noOverflow(page) {
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const css = getComputedStyle(el);
        // Content inside an intentional swipe carousel may extend past the
        // viewport. Its container is still checked for actual layout overflow.
        for (
          let parent = el.parentElement;
          parent && parent !== document.body;
          parent = parent.parentElement
        ) {
          if (
            ["auto", "scroll"].includes(getComputedStyle(parent).overflowX) &&
            parent.scrollWidth > parent.clientWidth
          )
            return false;
        }
        return (
          rect.width > 0 &&
          css.position !== "absolute" &&
          css.position !== "fixed" &&
          css.visibility !== "hidden" &&
          (rect.right > innerWidth + 2 || rect.left < -2)
        );
      })
      .slice(0, 8)
      .map((el) => ({ tag: el.tagName, class: el.className, text: el.textContent?.slice(0, 50) })),
  );
  assert.deepEqual(overflow, [], `Overflow: ${JSON.stringify(overflow)}`);
}
async function runLesson(page, language, replay = false) {
  const lesson = JSON.parse(
    fs.readFileSync(
      new URL(`../src/data/lessons/detail/${language}/chunk-0.json`, import.meta.url),
    ),
  )[0];
  await page.goto(`${base}/lesson/${lesson.id}`);
  await page
    .getByRole("button", {
      name: replay ? "Revisar lição" : /Vamos começar|Continuar de onde parei/,
    })
    .waitFor();
  await page
    .getByRole("button", {
      name: replay ? "Revisar lição" : /Vamos começar|Continuar de onde parei/,
    })
    .click();
  const activities = buildActivities(lesson.steps);
  for (let i = 0; i < activities.length; i++) {
    const a = activities[i];
    await page.getByText(`Prática · ${String(i + 1).padStart(2, "0")}`, { exact: true }).waitFor();
    await stable(page);
    await noOverflow(page);
    if (a.type === "quiz" || a.type === "listening") {
      await page.locator(".lesson-option").nth(a.correct).click();
      await page.getByRole("button", { name: "Verificar", exact: true }).click();
    } else if (a.type === "translation") {
      await page.getByLabel("Sua tradução", { exact: true }).fill(a.correctTranslation);
      await page.getByRole("button", { name: "Verificar", exact: true }).click();
    } else if (a.type === "dragdrop") {
      for (const word of a.answerTokens)
        await page
          .locator(".lesson-token-bank")
          .getByRole("button", { name: word, exact: true })
          .filter({ hasNot: page.locator("[disabled]") })
          .first()
          .click();
      await page.getByRole("button", { name: "Verificar", exact: true }).click();
    }
    if (i === 3 && !replay)
      await page.screenshot({
        path: fileURLToPath(new URL(`lesson-${language}-${page.viewportSize().width}.png`, out)),
      });
    await page
      .locator(".lesson-footer")
      .getByRole("button", {
        name: a.type === "speaking" ? "Pular por enquanto" : "Continuar",
        exact: true,
      })
      .click();
  }
  await page.getByRole("heading", { name: "Lição concluída", exact: true }).waitFor();
  assert.ok((await page.locator(".lesson-result-grid").innerText()).includes("100%"));
  await stable(page);
  await noOverflow(page);
  const state = await page.evaluate(async () =>
    (await import("/src/hooks/useStore.ts")).useStore.getState(),
  );
  assert.ok(state.completedLessons.includes(lesson.id));
  return state.xp;
}

try {
  await check("wallet, quests, curriculum and persistence", async () => {
    const page = await browser.newPage();
    await page.goto(`${base}/lesson/lesson-en-1`);
    await page.getByRole("button", { name: "Vamos começar" }).waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (button) => button.textContent.includes("Vamos começar") && !button.disabled,
      ),
    );
    const result = await page.evaluate(async () => {
      const { useStore } = await import("/src/hooks/useStore.ts");
      const { generateLessons } = await import("/src/data/contentEngine.ts");
      useStore.setState({
        lumes: 500,
        xp: 0,
        inventory: [],
        doubleXpUntil: 0,
        completedLessons: [],
        questProgress: {},
        claimedQuests: [],
        streak: 0,
        lastStudyDate: "",
      });
      const s = useStore.getState;
      const first = s().buyItem("bonus-xp");
      const duplicate = s().buyItem("bonus-xp");
      s().addXP(30);
      const doubledXP = s().xp;
      s().completeLesson("test-1");
      s().completeLesson("test-1");
      s().completeLesson("test-2");
      const firstClaim = s().claimQuest("dq-1");
      const duplicateClaim = s().claimQuest("dq-1");
      s().recordStudy();
      s().recordStudy();
      const advanced = await generateLessons("en", Infinity, [], {
        progressiveLock: true,
        startLevel: "C1",
      });
      const start = advanced.findIndex((l) => l.level === "C1");
      const kids = await generateLessons("en", 8, [], { progressiveLock: true, kidMode: true });
      const nextKids = await generateLessons("en", 8, [kids[0].id], {
        progressiveLock: true,
        kidMode: true,
      });
      return {
        first,
        duplicate,
        doubledXP,
        firstClaim,
        duplicateClaim,
        lumes: s().lumes,
        streak: s().streak,
        completed: s().completedLessons,
        advancedUnlocked: !advanced[start].locked && advanced[start + 1].locked,
        kidsUnlocked: !nextKids[1].locked,
      };
    });
    assert.equal(result.first, true);
    assert.equal(result.duplicate, false);
    assert.equal(result.doubledXP, 60);
    assert.equal(result.firstClaim, true);
    assert.equal(result.duplicateClaim, false);
    assert.equal(result.lumes, 360);
    assert.equal(result.streak, 1);
    assert.equal(result.advancedUnlocked, true);
    assert.equal(result.kidsUnlocked, true);
    await page.reload();
    await page.getByRole("button", { name: "Vamos começar" }).waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (button) => button.textContent.includes("Vamos começar") && !button.disabled,
      ),
    );
    const restored = await page.evaluate(async () => {
      const { useStore } = await import("/src/hooks/useStore.ts");
      return { xp: useStore.getState().xp, completed: useStore.getState().completedLessons };
    });
    assert.equal(restored.xp, 110);
    assert.deepEqual(restored.completed, ["test-1", "test-2"]);
    await page.close();
  });
  for (const width of [360, 390, 768, 1440])
    await check(`lesson complete ${width}px`, async () => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const xp = await runLesson(page, "en");
      if (width === 390) {
        const replayXp = await runLesson(page, "en", true);
        assert.equal(replayXp, xp, "Practice must not award duplicate XP");
        await runLesson(page, "es");
        await runLesson(page, "pt");
      }
      assert.deepEqual(errors, []);
      await context.close();
    });

  await check("resume, wrong answer, next lesson, invalid link", async () => {
    const page = await browser.newPage({
      viewport: { width: 320, height: 740 },
      reducedMotion: "reduce",
    });
    await page.goto(`${base}/lesson/lesson-en-1`);
    await page.getByRole("button", { name: "Vamos começar" }).click();
    await page
      .locator(".lesson-footer")
      .getByRole("button", { name: "Continuar", exact: true })
      .click();
    await page.getByText("Prática · 02", { exact: true }).waitFor();
    await page.reload();
    await page.getByRole("button", { name: "Continuar de onde parei" }).click();
    await page.getByText("Prática · 02", { exact: true }).waitFor();
    await stable(page);
    await noOverflow(page);
    await page.getByRole("button", { name: "Sair da lição", exact: true }).click();
    await page.getByRole("alertdialog").waitFor();
    await page.getByRole("button", { name: "Ficar na lição" }).click();
    for (let i = 0; i < 2; i++) {
      await page
        .locator(".lesson-footer")
        .getByRole("button", { name: "Continuar", exact: true })
        .click();
      await stable(page);
    }
    await page.locator(".lesson-option").first().click();
    await page.getByRole("button", { name: "Verificar", exact: true }).click();
    await page
      .locator(".lesson-footer")
      .getByRole("button", { name: "Continuar", exact: true })
      .click();
    await page.getByText("Prática · 05", { exact: true }).waitFor();
    await page.goto(`${base}/lesson/not-a-real-lesson`);
    await page.getByRole("heading", { name: "Não foi possível abrir esta lição" }).waitFor();
    await page.close();
  });

  // Fixture account scoped to this browser only.
  const env = [".env.local", ".env"]
    .filter(fs.existsSync)
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");
  const url = process.env.VITE_SUPABASE_URL || env.match(/VITE_SUPABASE_URL\s*=\s*["']?(https:\/\/[^\s"']+)/)?.[1];
  assert.ok(url, "Supabase URL is needed for isolated auth fixture");
  const account = {
    id: "11111111-1111-4111-8111-111111111111",
    aud: "authenticated",
    role: "authenticated",
    email: "local-qa@example.invalid",
    app_metadata: {},
    user_metadata: { full_name: "QA Local" },
    created_at: new Date().toISOString(),
  };
  const token = [
    "eyJhbGciOiJIUzI1NiJ9",
    Buffer.from(
      JSON.stringify({
        sub: account.id,
        exp: Math.floor(Date.now() / 1000) + 3600,
        role: "authenticated",
      }),
    ).toString("base64url"),
    "fixture",
  ].join(".");
  for (const width of [320, 390, 768, 1440])
    await check(`app routes ${width}px`, async () => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        ({ account, token, key }) => {
          localStorage.setItem(
            key,
            JSON.stringify({
              access_token: token,
              refresh_token: "fixture",
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              expires_in: 3600,
              token_type: "bearer",
              user: account,
            }),
          );
          localStorage.setItem("tutorial_shown", "true");
          localStorage.setItem(
            "lume-user-settings",
            JSON.stringify({ state: { userLevel: "A1" }, version: 0 }),
          );
          localStorage.setItem(
            "lume-storage",
            JSON.stringify({
              state: {
                learningLevel: "A1",
                interfaceLanguage: "pt",
                targetLanguage: "en",
                completedLessons: [],
                xp: 0,
              },
              version: 0,
            }),
          );
        },
        { account, token, key: `sb-${new URL(url).hostname.split(".")[0]}-auth-token` },
      );
      await context.route(`${url}/**`, async (route) => {
        const path = new URL(route.request().url()).pathname;
        const isSingle = route.request().headers().accept?.includes("vnd.pgrst.object");
        const profile = {
          id: account.id,
          full_name: "QA Local",
          level: "A1",
          plan: "free",
          xp: 0,
          streak: 0,
          target_language: "en",
          language: "pt",
        };
        const data = path.includes("/auth/")
          ? account
          : path.endsWith("/rpc/sync_learning_state")
            ? route.request().postDataJSON().p_state
          : path.includes("/rpc/")
            ? 0
            : path.includes("/profiles")
              ? isSingle
                ? profile
                : [profile]
              : isSingle
                ? null
                : [];
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const path of [
        "/home",
        "/lessons",
        "/games",
        "/progress",
        "/profile",
        "/settings",
        "/dictionary",
        "/shop",
        "/culture",
        "/community",
        "/quiz-hub",
        "/skills",
        "/vocabulary-lists",
      ]) {
        await page.goto(`${base}${path}`);
        await page
          .locator('header[aria-label="Site header"] a[href="/profile"]')
          .first()
          .waitFor({ state: "attached", timeout: 15000 });
        await page.waitForTimeout(900);
        assert.ok(!page.url().includes("/login"), `${path} auth did not load`);
        await noOverflow(page);
        await page.screenshot({
          path: fileURLToPath(new URL(`${path.slice(1)}-${width}.png`, out)),
          fullPage: true,
        });
      }
      assert.deepEqual(errors, []);
      await context.close();
    });
} finally {
  await browser.close();
  fs.writeFileSync(new URL("results.json", out), JSON.stringify(results, null, 2));
}
assert.deepEqual(failures, [], "Browser regressions failed");
