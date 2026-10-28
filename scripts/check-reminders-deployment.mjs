import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
const deployment = process.env.REMINDER_DEPLOYMENT;
assert.match(deployment || '', /^https:\/\/[a-z0-9-]+\.vercel\.app$/);
process.loadEnvFile('.env');
const dir = 'scratchpad/completion-27';
const qa = JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json'));
const credentials = JSON.parse(fs.readFileSync(`${dir}/push-credentials.private.json`));
const login = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: 'POST', headers: { apikey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(qa),
});
assert.ok(login.ok, 'QA authentication');
const session = await login.json();
fs.writeFileSync(`${dir}/qa-reminder.private.headers`, `Authorization: Bearer ${session.access_token}\nContent-Type: application/json\n`);
fs.writeFileSync(`${dir}/cron.private.headers`, `Authorization: Bearer ${credentials.CRON_SECRET}\n`);
function request(name, route, { body, header } = {}) {
  const output = `${dir}/${name}.json`;
  let args = '';
  if (header) args += ` --header @${dir}/${header}.private.headers`;
  if (body) {
    const file = `${dir}/${name}.private.body.json`;
    fs.writeFileSync(file, JSON.stringify(body));
    args += ` --request POST --header Content-Type:application/json --data-binary @${file}`;
  }
  const command = `npx --yes vercel@65.0.0 curl ${route} --deployment ${deployment} --scope digirocket -- --silent --output ${output} --dump-header ${output}.headers${args}`;
  fs.rmSync(`${output}.headers`, { force: true });
  const result = spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', command], { encoding: 'utf8', timeout: 90000 });
  assert.equal(result.status, 0, `${name}: CLI request`);
  const statuses = [...fs.readFileSync(`${output}.headers`, 'utf8').matchAll(/^HTTP\/\S+\s+(\d+)/gm)];
  const status = Number(statuses.at(-1)?.[1]);
  const data = JSON.parse(fs.readFileSync(output, 'utf8'));
  return { status, data };
}
const config = request('reminders-config', '/api/reminders');
assert.equal(config.status, 200); assert.equal(config.data.configured, true);
assert.equal(Buffer.from(config.data.publicKey, 'base64url').length, 65);
console.log('PASS deployed reminders: configured public key');
const subscription = { endpoint: `https://fcm.googleapis.com/fcm/send/qa-no-delivery-${randomUUID()}`, keys: { p256dh: Buffer.alloc(65, 1).toString('base64url'), auth: Buffer.alloc(16, 1).toString('base64url') } };
assert.equal(request('reminders-no-auth', '/api/reminders', { body: { action: 'subscribe', subscription } }).status, 401);
const call = action => request(`reminders-${action}`, '/api/reminders', { header: 'qa-reminder', body: { action, subscription, language: 'pt' } });
try {
  const enabled = call('subscribe'); assert.equal(enabled.status, 200); assert.equal(enabled.data.enabled, true);
  assert.equal(call('status').data.enabled, true);
  assert.equal(call('activity').data.recorded, true);
} finally {
  const disabled = call('unsubscribe'); assert.equal(disabled.status, 200); assert.equal(disabled.data.enabled, false);
}
assert.equal(call('status').data.enabled, false);
console.log('PASS deployed reminders: authentication, opt-in, status, activity and opt-out with real database');
assert.equal(request('cron-no-auth', '/api/cron/reminders').status, 401);
const cron = request('cron-empty', '/api/cron/reminders', { header: 'cron' });
assert.equal(cron.status, 200); assert.deepEqual(cron.data, { claimed: 0, sent: 0, expired: 0, failed: 0 });
console.log('PASS deployed cron: authenticated empty queue, zero notifications sent');
