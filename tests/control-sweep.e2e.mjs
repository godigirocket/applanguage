import { chromium, webkit } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { inspectControlGeometry } from './control-geometry.mjs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const out=process.env.SWEEP_STAGE?`scratchpad/control-sweep-${process.env.SWEEP_STAGE}`:'scratchpad/control-sweep';fs.mkdirSync(out,{recursive:true});
const browser=await(process.env.E2E_BROWSER==='webkit'?webkit:chromium).launch();const results=[],runtime=[],apiFailures=[];
if(process.env.E2E_RESUME==='1'&&fs.existsSync(`${out}/results.json`)){
  const previous=JSON.parse(fs.readFileSync(`${out}/results.json`,'utf8'));assert.equal(previous.base,base);assert.deepEqual(previous.runtime,[]);assert.deepEqual(previous.apiFailures,[]);
  results.push(...previous.results.filter(r=>r.issues.length===0));
}
const mainRoutes=['/home','/lessons','/games','/quiz-hub','/profile','/progress','/dictionary','/community','/culture','/skills','/vocabulary-lists','/shop','/settings','/guide','/checkout?plan=premium_annual','/memory','/hangman','/quiz/quick','/quiz/race','/quiz/daily','/quiz/survival','/quiz/listening','/quiz/flashcards','/quiz/pronunciation','/quiz/lumematch','/quiz/speedtranslator','/quiz/culturaltrivia','/quiz-play/vocab','/quiz-play/grammar','/quiz-play/listening','/quiz-play/pronunciation','/quiz-play/review','/quiz-play/travel','/quiz-play/business','/quiz-play/mixed'];
const extraRoutes=['/','/login','/signup','/forgot-password','/reset-password','/pricing','/success','/cancel','/onboarding','/setup','/terms','/refund','/support','/lesson/lesson-en-1',...['daily-life','art-culture','professional','free-talk','speaking-confidence','music-expression','travel','relationships'].map(t=>'/conversation/'+t),...['london','new-york','sydney','toronto','dublin','madrid','barcelona','mexico-city'].map(c=>'/culture/'+c)];
const routes=process.env.E2E_EXTRA_ONLY==='1'?extraRoutes:[...mainRoutes,...extraRoutes];
try{
  for(const width of JSON.parse(process.env.E2E_WIDTHS||'[320,390]')){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();
    page.on('pageerror',e=>runtime.push({width,url:page.url(),message:e.message}));
    page.on('response',r=>{if(r.status()>=400&&r.url().includes('.supabase.co/'))apiFailures.push({width,path:new URL(r.url()).pathname,status:r.status()});});
    await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').click();await page.waitForURL(/\/home/);await page.locator('.home-resume-action').waitFor();
    for(const route of routes){
      if(results.some(r=>r.width===width&&r.route===route))continue;
      await page.goto(base+route);await page.locator('h1:visible,h2:visible,button:visible').first().waitFor();await page.waitForTimeout(850);
      const issues=await inspectControlGeometry(page);results.push({width,route,issues});console.log(issues.length?'FAIL':'PASS',width,route,JSON.stringify(issues));
      for(const fraction of [.5,1,0]){
        await page.evaluate(f=>window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),fraction);await page.waitForTimeout(60);
        for(const selector of ['.lume-app-header','.lume-mobile-tabs']){
          const nav=page.locator(selector);if(!await nav.count()||!await nav.isVisible())continue;
          const pinned=await nav.evaluate(el=>{const probe=document.createElement('div');probe.style.cssText='position:fixed;inset:0;visibility:hidden;pointer-events:none';document.body.append(probe);const expected=probe.getBoundingClientRect(),r=el.getBoundingClientRect();const correct=el.parentElement===document.body&&Math.abs(r.left-expected.left)<2&&Math.abs(r.right-expected.right)<2&&(el.classList.contains('lume-app-header')?Math.abs(r.top-expected.top)<2:Math.abs(r.bottom-expected.bottom)<2);probe.remove();return correct;});
          assert.ok(pinned,`${width}px ${route} ${selector} moved during scroll`);
        }
      }
      if(issues.length)await page.screenshot({path:`${out}/${width}-${route.split('?')[0].replaceAll('/','-')}.png`,fullPage:true});
    }
    await context.close();
  }
}finally{await browser.close();fs.writeFileSync(`${out}/results.json`,JSON.stringify({base,results,runtime,apiFailures},null,2));}
assert.ok(results.every(r=>r.issues.length===0),'Some controls have text outside their bounds');
assert.deepEqual(runtime,[],'Unexpected browser exceptions');assert.deepEqual(apiFailures,[],'Failed database requests');
