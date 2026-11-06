import assert from "node:assert/strict";
import { chromium } from "playwright";

// Inject a push event through Chromium, without registering a real subscription
// or contacting a push provider. Exercise the installed production worker.
const origin = new URL(process.env.PRODUCTION_BASE_URL || "http://127.0.0.1:5174").origin;
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ permissions: ["notifications"] });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  let registrationId;
  cdp.on("ServiceWorker.workerRegistrationUpdated", ({ registrations }) => {
    const registration = registrations.find(({ scopeURL, isDeleted }) => scopeURL === `${origin}/` && !isDeleted);
    if (registration) registrationId = registration.registrationId;
  });
  await cdp.send("ServiceWorker.enable");
  await page.goto(origin);
  await page.evaluate(async () => {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Worker not ready")), 20000)),
    ]);
  });
  assert.ok(registrationId, "The browser registered the production service worker");
  await page.goto("about:blank");
  await cdp.send("ServiceWorker.deliverPushMessage", {
    origin,
    registrationId,
    data: JSON.stringify({ title: "Langlume QA", body: "Teste local do lembrete" }),
  });
  await page.goto(origin);
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const notifications = await registration?.getNotifications({ tag: "lume-daily-practice" });
    return notifications?.some((notification) => notification.title === "Langlume QA" && notification.data.url === "/home");
  });
  console.log("PASS installed Chromium worker displays an injected reminder without an app page open");
} finally {
  await browser.close();
}
