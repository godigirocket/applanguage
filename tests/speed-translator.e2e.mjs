import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SENTENCE_BANK } from '../src/data/massiveContent.ts';

const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:5173';
const qa = JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json', 'utf8'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + '/login');
  await page.locator('input[type=email]').fill(qa.email);
  await page.locator('input[type=password]').fill(qa.password);
  await page.locator('button[type=submit]').click();
  await page.waitForURL(/\/home/);
  await page.goto(base + '/quiz/speedtranslator');
  await page.getByTestId('translator-source').waitFor();
  await page.waitForFunction(() => Object.keys(localStorage).some(k => k.startsWith('lume-storage:') && !k.endsWith(':guest')));
  await page.waitForTimeout(1000);
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.getByRole('button', { name: 'Jogar Novamente', exact: true }).click();
  const balance = () => page.evaluate(() => Object.keys(localStorage)
    .filter(k => k.startsWith('lume-storage:') && !k.endsWith(':guest'))
    .map(k => JSON.parse(localStorage.getItem(k)).state)
    .map(s => ({ xp: s.xp, lumes: s.lumes }))[0]);
  const before = await balance();
  const phrase = await page.getByTestId('translator-source').innerText();
  const sentence = Object.values(SENTENCE_BANK).flat().find(s => s.pt === phrase);
  assert.ok(sentence, 'Real sentence displayed in interface language');
  for (const word of sentence.en.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '').split(/\s+/).filter(Boolean)) {
    await page.getByTestId('translator-pool').getByRole('button', { name: word, exact: true }).first().click({ force: true });
    await page.clock.runFor(50);
  }
  await page.getByRole('button', { name: 'Verificar', exact: true }).click({ force: true });
  await page.clock.runFor(100);
  assert.equal(await page.getByTestId('translator-score').innerText(), '1');
  await page.getByRole('button', { name: 'Como Jogar', exact: true }).click({ force: true });
  const pausedTime = await page.getByRole('timer').innerText();
  await page.clock.runFor(5000);
  assert.equal(await page.getByRole('timer').innerText(), pausedTime, 'Help pauses countdown');
  await page.getByRole('button', { name: 'OK', exact: true }).click({ force: true });
  for (let second = 0; second < 31; second++) await page.clock.runFor(1000);
  await page.getByText('Fim de Jogo!', { exact: true }).waitFor();
  const after = await balance();
  assert.equal(after.xp - before.xp, 15, 'Timer expiry awards latest score XP');
  assert.equal(after.lumes - before.lumes, 2, 'Timer expiry awards earned currency');
  await page.clock.runFor(5000);
  assert.deepEqual(await balance(), after, 'Reward is applied only once');
  await page.getByRole('button', { name: 'Jogar Novamente', exact: true }).last().click({ force: true });
  await page.clock.runFor(100);
  assert.equal(await page.getByTestId('translator-score').innerText(), '0');
  assert.equal(await page.getByRole('timer').innerText(), '20s');
  assert.deepEqual(errors, []);
  console.log('PASS 320px touch: correct translation, paused help, timer expiry, actual XP/currency, exactly-once reward and restart');
} finally { await browser.close(); }
