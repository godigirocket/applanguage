import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.E2E_BASE_URL||'https://langlume.vercel.app';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const browser=await chromium.launch();
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();
  const cdp=await context.newCDPSession(page);
  const swipe=async(from,to)=>{
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:from}]});
    for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:from+(to-from)*i/12}]});await new Promise(r=>setTimeout(r,20));}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);
  };
  await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').tap();await page.waitForURL(/\/home/);await page.locator('.home-resume-action').waitFor();
  await page.locator('body > .lume-mobile-tabs').waitFor();
  await page.waitForTimeout(350);
  if(await page.locator('[data-sonner-toast]').first().isVisible()){
    assert.ok(await page.evaluate(()=>document.querySelector('[data-sonner-toast]').getBoundingClientRect().bottom<=document.querySelector('.lume-mobile-tabs').getBoundingClientRect().top-4),'Welcome notice must not cover bottom menu');console.log('PASS welcome notice stays above bottom navigation');
  }
  await page.screenshot({path:'scratchpad/keyless/menus-touch-final.png'});
  for(const route of ['/home','/lessons','/games']){
    if(new URL(page.url()).pathname!==route)await page.goto(base+route);await page.waitForLoadState('networkidle');await page.locator('body > .lume-app-header').waitFor();
    await swipe(600,200);
    assert.ok(await page.evaluate(()=>scrollY>80),'Native touch gesture scrolls content');
    for(const selector of ['.lume-app-header','.lume-mobile-tabs'])assert.ok(await page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return el.classList.contains('lume-app-header')?Math.abs(r.top)<2:Math.abs(r.bottom-innerHeight)<2;}),'Menu stays pinned during native touch scroll');
    await swipe(220,620);
    assert.ok(await page.locator('.lume-app-header').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<2));
    console.log('PASS',route,'native touch scroll in both directions and pinned menus');
  }
}finally{await browser.close();}
