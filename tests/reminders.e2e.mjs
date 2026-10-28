import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:5174';
const qa = JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    window.__push = { requests: 0, subscriptions: 0, unsubscribes: 0, deny: false };
    const notification = { permission: 'default', async requestPermission() {
      window.__push.requests++;
      return notification.permission = window.__push.deny ? 'denied' : 'granted';
    } };
    Object.defineProperty(window, 'Notification', { configurable: true, value: notification });
    Object.defineProperty(window, 'PushManager', { configurable: true, value: class {} });
    let subscribed = false;
    const subscription = {
      toJSON() { return { endpoint: 'https://fcm.googleapis.com/fcm/send/mock-ui-only', keys: { p256dh: 'mock', auth: 'mock' } }; },
      async unsubscribe() { subscribed = false; window.__push.unsubscribes++; return true; }
    };
    const registration = { pushManager: {
      async getSubscription() { return subscribed ? subscription : null; },
      async subscribe(options) {
        if (!options.userVisibleOnly || options.applicationServerKey.length !== 65) throw new Error('Invalid push options');
        subscribed = true; window.__push.subscriptions++; return subscription;
      }
    } };
    navigator.serviceWorker.getRegistration = async () => registration;
  });
  const calls = [], errors = [];
  let enabled = false, fail = false;
  await context.route('**/api/reminders', async route => {
    const request = route.request();
    if (request.method() === 'GET') return route.fulfill({ json: { configured: true, publicKey: Buffer.alloc(65, 1).toString('base64url') } });
    const body = request.postDataJSON();
    assert.match(request.headers().authorization, /^Bearer /);
    calls.push(body.action);
    if (fail && body.action === 'subscribe') return route.fulfill({ status: 503, json: { error: 'test unavailable' } });
    if (body.action === 'subscribe') enabled = true;
    if (body.action === 'unsubscribe') enabled = false;
    return route.fulfill({ json: { enabled } });
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/login');
  await page.locator('input[type=email]').fill(qa.email);
  await page.locator('input[type=password]').fill(qa.password);
  await page.locator('button[type=submit]').click();
  await page.waitForURL(/home/);
  await page.locator('.home-resume-action').waitFor();
  await page.goto(base + '/settings');
  const enable = page.getByRole('button', { name: 'Ativar lembrete', exact: true });
  await enable.waitFor();
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(b => b.textContent === 'Ativar lembrete')?.disabled);
  assert.equal(await page.evaluate(() => window.__push.requests), 0, 'Never ask on page load');
  await enable.click();
  await page.getByRole('button', { name: 'Desativar lembrete', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__push.requests), 1);
  assert.ok(enabled);
  await page.getByRole('button', { name: 'Desativar lembrete', exact: true }).click();
  await enable.waitFor();
  assert.equal(enabled, false);
  assert.equal(await page.evaluate(() => window.__push.unsubscribes), 1);
  fail = true;
  await enable.click();
  await page.getByRole('alert').filter({ hasText: 'Não foi possível alterar o lembrete' }).waitFor();
  assert.equal(await page.evaluate(() => window.__push.unsubscribes), 2, 'Roll back failed subscription');
  fail = false;
  await page.evaluate(() => { window.__push.deny = true; Notification.permission = 'default'; });
  await enable.click();
  await page.getByRole('alert').filter({ hasText: 'As notificações estão bloqueadas' }).waitFor();
  assert.deepEqual(errors, []);
  assert.ok(calls.includes('subscribe') && calls.includes('unsubscribe'));
  console.log('PASS reminders UI: explicit opt-in, opt-out, registration rollback and denied permission');
} finally { await browser.close(); }
