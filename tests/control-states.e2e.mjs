import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inspectControlGeometry } from './control-geometry.mjs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:320,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();let signedIn=false;
try{
  await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').click();await page.waitForURL(/\/home/);await page.locator('.home-resume-action').waitFor();signedIn=true;
  for(const code of ['EN','ES','PT']){
    await page.goto(base+'/settings');await page.getByRole('button',{name:code,exact:true}).waitFor();
    const changed=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().includes('/rest/v1/profiles'));
    await page.getByRole('button',{name:code,exact:true}).tap();assert.equal((await changed).status(),204);
    for(const route of ['/profile','/settings','/games','/quiz/flashcards','/quiz/pronunciation','/lesson/lesson-en-1']){
      await page.goto(base+route);await page.locator('h1,h2,button').first().waitFor();await page.waitForTimeout(600);
      assert.deepEqual(await inspectControlGeometry(page),[],code+' '+route+' text fits');console.log('PASS',code,route,'control text');
    }
  }
  for(const route of ['/memory','/quiz/speedtranslator']){
    await page.goto(base+route);await page.waitForLoadState('networkidle');await page.locator('body > .lume-app-header').waitFor();await page.locator('main header button').first().tap();await page.getByRole('button',{name:'OK',exact:true}).waitFor();
    assert.deepEqual(await inspectControlGeometry(page),[],'Help dialog buttons');await page.getByRole('button',{name:'OK',exact:true}).tap();console.log('PASS',route,'help dialog');
  }
}finally{
  if(signedIn){
    await page.goto(base+'/settings');await page.getByRole('button',{name:'PT',exact:true}).waitFor();
    const restored=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().includes('/rest/v1/profiles'));await page.getByRole('button',{name:'PT',exact:true}).click();await restored;
  }
  await browser.close();
}
