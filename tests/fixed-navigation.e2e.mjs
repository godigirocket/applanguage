import { chromium, webkit } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { inspectControlGeometry } from './control-geometry.mjs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const engine=process.env.E2E_BROWSER==='webkit'?'webkit':'chromium';
const out=`scratchpad/fixed-navigation-${engine}`;fs.mkdirSync(out,{recursive:true});
const browser=await(engine==='webkit'?webkit:chromium).launch();const results=[];
async function pinned(page){
  for(const selector of ['.lume-app-header','.lume-mobile-tabs']){
    const el=page.locator(selector);if(!await el.count()||!await el.isVisible())continue;
    await page.waitForFunction(s=>{const e=document.querySelector(s);return !!e&&e.parentElement===document.body&&e.getBoundingClientRect().height>0;},selector,{timeout:5000});
    assert.equal(await el.count(),1,'Only one instance of each navigation bar');
    const position=await el.evaluate(e=>{const probe=document.createElement('div');probe.style.cssText='position:fixed;inset:0;visibility:hidden;pointer-events:none';document.body.append(probe);const expected=probe.getBoundingClientRect(),r=e.getBoundingClientRect();const result={body:e.parentElement===document.body,left:r.left,right:r.right,top:r.top,bottom:r.bottom,expected:expected.toJSON()};probe.remove();return result;});
    assert.ok(position.body&&Math.abs(position.left-position.expected.left)<2&&Math.abs(position.right-position.expected.right)<2&&(selector==='.lume-app-header'?Math.abs(position.top-position.expected.top)<2:Math.abs(position.bottom-position.expected.bottom)<2),selector+' stays at viewport edge '+JSON.stringify(position));
  }
}
try{
  for(const [width,height] of [[320,740],[360,800],[390,844],[844,390]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();
    await page.goto(base);await page.waitForLoadState('networkidle');await page.locator('body > .lume-app-header').waitFor();
    for(const language of ['EN','ES','PT']){
      await page.getByRole('button',{name:'Language settings',exact:true}).tap();await page.locator('.lume-language-panel').getByRole('button',{name:language,exact:true}).tap();
      await page.waitForTimeout(150);assert.deepEqual(await inspectControlGeometry(page),[],`${width}px anonymous ${language} controls`);
      const header=page.locator('.lume-app-header');assert.ok(await header.evaluate(e=>[...e.querySelectorAll('a,button')].every(x=>{const r=x.getBoundingClientRect();return !r.width||r.left>=0&&r.right<=innerWidth+1;})),'Header controls stay on screen');
    }
    await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').tap();await page.waitForURL(/\/home/);await page.locator('.home-resume-action').waitFor();await page.waitForLoadState('networkidle');
    for(const route of ['/home','/lessons','/games','/community','/profile','/settings','/dictionary']){
      if(new URL(page.url()).pathname!==route)await page.goto(base+route);await page.locator('h1').first().waitFor();await page.waitForLoadState('networkidle');await pinned(page);
      for(const part of [.5,1,0]){await page.evaluate(f=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),part);await page.waitForTimeout(80);await pinned(page);}
      // A page entrance transform must never become the chrome's containing block.
      await page.locator('#main-content').evaluate(e=>e.style.transform='translateY(40px)');await pinned(page);await page.locator('#main-content').evaluate(e=>e.style.transform='');
      await page.getByRole('button',{name:'Language settings',exact:true}).tap();
      const panel=page.locator('.lume-language-panel');await panel.waitFor();assert.ok(await panel.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;}),'Language menu fits viewport');
      assert.deepEqual(await inspectControlGeometry(page),[],`${width}px ${route} open menu text`);await page.getByRole('button',{name:'Language settings',exact:true}).tap();
      if(route==='/profile'){
        await page.getByRole('button',{name:'Conquistas',exact:true}).tap();await page.waitForTimeout(250);assert.deepEqual(await inspectControlGeometry(page),[],'Achievements tab controls');
      }
      results.push({width,height,route,ok:true});console.log('PASS',width,height,route,'pinned bars, transition, menu and text');
    }
    await page.setViewportSize({width,height:Math.max(320,height-140)});await pinned(page);await page.setViewportSize({width,height});await pinned(page);
    await page.screenshot({path:`${out}/settings-${width}.png`});
    await context.close();
  }
}finally{await browser.close();fs.writeFileSync(`${out}/results.json`,JSON.stringify({base,results},null,2));}
