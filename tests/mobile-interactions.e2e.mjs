import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const out=process.env.MOBILE_STAGE?`scratchpad/mobile-interactions-${process.env.MOBILE_STAGE}`:'scratchpad/mobile-interactions';fs.mkdirSync(out,{recursive:true});
const browser=await (process.env.E2E_BROWSER==='webkit'?webkit:chromium).launch();const results=[],navigationCancellations=[];
try{
  for(const [width,height] of [[320,740],[390,844],[844,390]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[],cancelled=[];page.on('pageerror',e=>errors.push({url:page.url(),message:e.message,time:Date.now()}));
    page.on('requestfailed',r=>{if(/cancel|abort/i.test(r.failure()?.errorText||''))cancelled.push({path:new URL(r.url()).pathname,time:Date.now()});});
    if(process.env.DEBUG_WEBKIT==='1'){
      page.on('requestfailed',r=>{if(r.url().includes('get_leaderboard'))console.log('LEADERBOARD FAILED',r.failure()?.errorText,new URL(page.url()).pathname);});
      page.on('response',r=>{if(r.url().includes('get_leaderboard'))console.log('LEADERBOARD RESPONSE',r.status(),r.headers()['access-control-allow-origin'],new URL(page.url()).pathname);});
    }
    await page.goto(base);await page.locator('.lume-landing-hero h1').waitFor();await page.waitForLoadState('networkidle');await page.waitForTimeout(500);
    const animations=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations===Infinity).length);
    assert.equal(animations,0,'Landing should not keep decorative animations running');
    // Chrome stays fixed during both directions, including small deltas.
    await page.evaluate(async()=>{window.scrollTo({top:350,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r));for(let i=0;i<12;i++){window.scrollBy({top:4,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r));}});
    await page.waitForTimeout(350);assert.ok(await page.locator('.lume-app-header').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<1),'Header stays fixed during downward scroll');
    await page.evaluate(async()=>{for(let i=0;i<12;i++){window.scrollBy({top:-4,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r));}});
    await page.waitForTimeout(350);assert.ok(await page.locator('.lume-app-header').evaluate(el=>el.getBoundingClientRect().top>=-1),'Header returns during slow upward scroll');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`${out}/landing-${width}.png`,fullPage:true});
    await page.locator('.lume-landing-actions a[href="/login"]').tap();await page.waitForURL(/\/login/);
    await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').tap();await page.waitForURL(/\/home/);
    await page.locator('.home-resume-action').waitFor();await page.waitForLoadState('networkidle');
    for(const route of ['/home','/lessons','/games','/profile','/settings','/dictionary']){
      if(new URL(page.url()).pathname!==route)await page.goto(base+route);
      await page.locator('h1').first().waitFor();await page.waitForLoadState('networkidle');await page.waitForTimeout(300);
      await page.screenshot({path:`${out}/${route.slice(1)}-${width}.png`,fullPage:true});
      await page.screenshot({path:`${out}/${route.slice(1)}-${width}-viewport.png`});
      if(route==='/home'&&width<768){
        assert.ok(await page.locator('.home-resume-action').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight-60),'Continue learning is reachable on the first phone screen');
        if(width===390){
          await page.locator('.home-resume-action').tap();await page.waitForURL(/\/lesson\//);
          await page.getByRole('button',{name:/Vamos começar|Continuar de onde parei|Revisar lição/}).waitFor();
          await page.waitForLoadState('networkidle');
          await page.goBack();await page.waitForURL(/\/home/);await page.locator('.home-resume-action').waitFor();await page.waitForLoadState('networkidle');console.log('PASS phone primary action opens a real pending lesson and back navigation works');
        }
      }
      const clipped=await page.locator('h1,h2,h3,p').evaluateAll(els=>els.filter(el=>{
        const s=getComputedStyle(el);return s.textOverflow!=='ellipsis'&&s.display!=='none'&&el.clientWidth>0&&el.scrollWidth>el.clientWidth+3&&s.overflowX==='hidden';
      }).map(el=>el.textContent?.slice(0,60)));
      assert.deepEqual(clipped,[],'Visible text should not be cut off');
      await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(100);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight||scrollY>0),'Page can scroll to its content');
      if(width===390&&route==='/lessons'){
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        const search=page.locator('input').first();await search.fill('xyz-no-lesson');await page.waitForTimeout(200);await search.fill('');
      }
      results.push(`${width}px ${route} scroll and content`);console.log('PASS',results.at(-1));
    }
    if(width<768){
      const tabs=page.locator('.lume-mobile-tabs');await tabs.locator('a[href="/games"]').tap();await page.waitForURL(/\/games/);
      assert.ok(await page.locator('.lume-app-header').evaluate(el=>el.getBoundingClientRect().top>=-1),'Header resets after navigation');
      await tabs.locator('a[href="/lessons"]').tap();await page.waitForURL(/\/lessons/);console.log('PASS',width,'bottom navigation touch');
    }
    // WebKit reports an access-control pageerror when a navigation cancels an
    // in-flight fetch. Only classify it as a cancellation when requestfailed
    // independently confirms that exact path was cancelled at the same time.
    // Actual CORS/network failures and all other JS exceptions still fail.
    const unexpected=errors.filter(e=>{
      const abort=process.env.E2E_BROWSER==='webkit'&&e.message.endsWith('due to access control checks.')&&cancelled.some(c=>e.message.includes(c.path)&&Math.abs(e.time-c.time)<2000);
      if(abort)navigationCancellations.push({width,path:cancelled.find(c=>e.message.includes(c.path)).path});
      return !abort;
    });
    assert.deepEqual(unexpected,[]);await context.close();
  }
}finally{await browser.close();fs.writeFileSync(`${out}/results.json`,JSON.stringify({base,results,navigationCancellations},null,2));}
