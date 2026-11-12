import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = new URL(process.env.E2E_BASE_URL || "http://127.0.0.1:5173");
assert.equal(origin.hostname, "127.0.0.1", "This test is fixture-only");
const browser = await chromium.launch();
const fixtureHost = "https://qa-example.supabase.co";
try {
  for (const confirmEmail of [false, true]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const account = {
      id: "11111111-1111-4111-8111-111111111111", aud: "authenticated", role: "authenticated",
      email: "test@example.invalid", app_metadata: {}, user_metadata: {},
      identities: [{ id: "fixture-identity" }], created_at: new Date().toISOString(),
    };
    const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString("base64url");
    const token = header + "." + Buffer.from(JSON.stringify({
      sub: account.id, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600,
    })).toString("base64url") + ".fixture";
    const session = { access_token: token, refresh_token: "fixture", expires_in: 3600, token_type: "bearer", user: account };
    let profile = { id: account.id, language: "pt", target_language: "en", plan: "free", xp: 0, streak: 0 };
    let signedUp = false;
    await context.route("**/*supabase.co/**", async route => {
      const request = route.request();
      const url = new URL(request.url());
      assert.equal(url.origin, fixtureHost, "Never send test auth data to a live Supabase project");
      if (url.pathname === "/auth/v1/signup") {
        assert.equal(request.postDataJSON().data?.requested_course, "es");
        account.user_metadata.requested_course = "es";
        signedUp = true;
        return route.fulfill({ json: confirmEmail ? { ...account } : session });
      }
      if (url.pathname === "/auth/v1/token") return route.fulfill({ json: session });
      if (url.pathname === "/auth/v1/user") return route.fulfill({ json: account });
      if (url.pathname.endsWith("/rpc/sync_learning_state")) return route.fulfill({ json: request.postDataJSON().p_state });
      if (url.pathname.includes("/rpc/")) return route.fulfill({ json: 0 });
      const single = request.headers().accept?.includes("vnd.pgrst.object");
      if (url.pathname.endsWith("/profiles")) {
        if (request.method() === "PATCH") {
          profile = { ...profile, ...request.postDataJSON() };
          return route.fulfill({ status: 204 });
        }
        return route.fulfill({ json: single ? profile : [profile] });
      }
      return route.fulfill({ json: single ? null : [] });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin.href);
    const demo = page.locator(".lp-demo");
    await demo.getByRole("button", { name: "Español", exact: true }).click();
    await demo.getByRole("button", { name: "Reserva", exact: true }).click();
    await demo.getByRole("button", { name: "Verificar", exact: true }).click();
    await demo.getByRole("link", { name: "Quero continuar", exact: true }).click();
    await page.waitForURL(url => url.pathname === "/signup" && url.searchParams.get("course") === "es");
    await page.locator("input[type=email]").fill(account.email);
    for (const field of await page.locator("input[type=password]").all()) await field.fill("test-password-only");
    await page.locator("button[type=submit]").click();
    if (confirmEmail) {
      await page.waitForURL(url => url.pathname === "/login" && url.searchParams.get("redirect") === "/onboarding?course=es");
      // The provider's email callback opens /onboarding. A fresh browser reads
      // the requested course from authenticated account metadata, not storage.
      const callback = new URL("/onboarding", origin);
      callback.hash = new URLSearchParams({
        access_token: session.access_token, refresh_token: session.refresh_token,
        expires_in: "3600", token_type: "bearer", type: "signup",
      }).toString();
      await page.goto(callback.href);
    }
    await page.getByRole("button", { name: /Español.*Sua escolha inicial/ }).click();
    await page.getByRole("button", { name: "Iniciante", exact: true }).click();
    await page.getByRole("button", { name: "Para mim", exact: true }).click();
    await page.waitForURL("**/lesson/lesson-es-1");
    await page.getByRole("heading", { name: "En el Aeropuerto - Volume 1", exact: true }).waitFor();
    assert.equal(signedUp, true);
    assert.equal(profile.target_language, "es");
    assert.equal(profile.onboarding_done, true);
    assert.deepEqual(errors, []);
    console.log("PASS demo to first Spanish lesson", confirmEmail ? "email confirmation" : "immediate session");
    await context.close();
  }
} finally {
  await browser.close();
}
