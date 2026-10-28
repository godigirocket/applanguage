// Published UI audit with real QA authentication. No purchases or public posts.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.E2E_BASE_URL||'https://langlume.vercel.app';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const out='scratchpad/mobile-audit';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();const results=[];
async function check(name,fn,page){try{await fn();results.push({name,ok:true});console.log('PASS',name);}catch(error){results.push({name,ok:false,error:error.message});console.error('FAIL',name,error.message);await page.screenshot({path:`${out}/failure-${results.length}.png`,fullPage:true}).catch(()=>{});}}
async function overflow(page){
  const bad=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{
    const r=el.getBoundingClientRect(),style=getComputedStyle(el);
    if(!r.width||style.visibility==='hidden'||['absolute','fixed'].includes(style.position))return false;
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement) if(['auto','scroll'].includes(getComputedStyle(p).overflowX)&&p.scrollWidth>p.clientWidth)return false;
    return r.right>innerWidth+2||r.left< -2;
  }).slice(0,5).map(el=>({tag:el.tagName,text:el.textContent?.slice(0,65),className:String(el.className)})));
  assert.deepEqual(bad,[],'Horizontal overflow '+JSON.stringify(bad));
}
try{
  const viewports=process.env.E2E_VIEWPORTS ? JSON.parse(process.env.E2E_VIEWPORTS) : [[320,740],[390,844],[844,390],[1440,900]];
  for(const [width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000,reducedMotion:'reduce'});
    const page=await context.newPage();const runtime=[],api=[];
    page.on('pageerror',e=>runtime.push({url:page.url(),message:e.message}));
    page.on('response',r=>{if(r.status()>=400&&r.url().includes('.supabase.co/'))api.push({path:new URL(r.url()).pathname,status:r.status()});});
    await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').click();await page.waitForURL(/\/home/);
    const routes=new Set(['/home','/lessons','/games','/quiz-hub','/profile','/progress','/dictionary','/community','/culture','/skills','/vocabulary-lists','/shop','/settings','/guide','/checkout?plan=premium_annual','/memory','/hangman','/quiz/quick','/quiz/race','/quiz/daily','/quiz/survival','/quiz/listening','/quiz/flashcards','/quiz/pronunciation','/quiz/lumematch','/quiz/speedtranslator','/quiz/culturaltrivia']);
    // Discover the quiz types linked by the actual hub instead of inventing URLs.
    await page.goto(base+'/quiz-hub');await page.getByRole('link').first().waitFor();await page.waitForTimeout(400);
    for(const href of await page.locator('a[href^="/quiz-play/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href'))))routes.add(href);
    for(const route of routes)await check(`${width}x${height} ${route}`,async()=>{
      const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
      await page.locator('h1,h2,button').first().waitFor();await page.waitForTimeout(650);
      assert.ok(!page.url().includes('/login'),'Unexpected login redirect');
      const text=await page.locator('body').innerText();assert.ok(text.trim().length>25,'Empty screen');assert.ok(!text.includes("This page didn't load"));
      await overflow(page);
      if(width===390&&['/memory','/hangman','/quiz/lumematch','/quiz/speedtranslator','/quiz/pronunciation'].includes(route))await page.screenshot({path:`${out}/${route.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});
    },page);
    if(width===390)await check('mobile settings target language persists and restores',async()=>{
      await page.goto(base+'/settings');
      const changed=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().includes('/rest/v1/profiles'));
      await page.getByRole('button',{name:'Español',exact:true}).click();assert.equal((await changed).status(),204);
      await page.reload();await page.getByRole('button',{name:'English',exact:true}).waitFor();
      const target=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('lume-storage:')&&!k.endsWith(':guest')).map(k=>JSON.parse(localStorage.getItem(k)).state.targetLanguage));assert.ok(target.includes('es'));
      const restored=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().includes('/rest/v1/profiles'));
      await page.getByRole('button',{name:'English',exact:true}).click();assert.equal((await restored).status(),204);
    },page);
    await check(`${width}px logout protects lessons`,async()=>{
      await page.goto(base+'/settings');await page.getByRole('button',{name:/Sair da conta|Sign out|Cerrar sesión/}).click();await page.waitForURL(/\/login/);
      await page.goto(base+'/lessons');await page.waitForURL(/\/login/);assert.equal(new URL(page.url()).searchParams.get('redirect'),'/lessons');
    },page);
    results.push({name:`${width}px runtime and database`,ok:runtime.length===0&&api.length===0,runtime,api});
    await context.close();
  }
}finally{await browser.close();fs.writeFileSync(`${out}/results.json`,JSON.stringify({base,results},null,2));}
assert.ok(results.every(r=>r.ok),'Mobile audit has failures');
