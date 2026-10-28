import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const out='scratchpad/theme-audit';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const rgb=hex=>hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255);
const lum=values=>values.map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(rgb(a)),lum(rgb(b)))+0.05)/(Math.min(lum(rgb(a)),lum(rgb(b)))+0.05);
try{
  for(const width of [320,390,1440])for(const theme of ['light','dark']){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',colorScheme:theme});
    await context.addInitScript(value=>{if(!localStorage.getItem('lume_theme'))localStorage.setItem('lume_theme',value);},theme);
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base);await page.locator('.lume-landing-hero h1').waitFor();await page.waitForTimeout(3000);
    const styles=await page.locator('.lume-landing-hero').evaluate(el=>{
      const layer=getComputedStyle(el,'::after'),h=getComputedStyle(el.querySelector('h1')),p=getComputedStyle(el.querySelector('p'));
      return{isolation:getComputedStyle(el).isolation,layer:Number(layer.zIndex),layerBackground:layer.backgroundImage,heading:h.backgroundImage,text:p.color,theme:document.documentElement.dataset.theme||'light',bg:getComputedStyle(el).getPropertyValue('--bg-primary').trim()};
    });
    assert.equal(styles.theme,theme);assert.equal(styles.isolation,'isolate');assert.ok(styles.layer<0,'Decoration must paint behind copy, never over text/buttons');
    const headingColors=[...styles.heading.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].map(m=>m.slice(1).map(Number).map(n=>n.toString(16).padStart(2,'0')).join(''));
    assert.equal(headingColors.length,3);for(const color of headingColors)assert.ok(contrast(color,theme==='light'?'f7f9ff':'08111f')>=4.5,'Heading gradient must preserve text contrast');
    const text=styles.text.match(/\d+/g).slice(0,3).map(Number).map(n=>n.toString(16).padStart(2,'0')).join('');
    assert.ok(contrast(text,theme==='light'?'f7f9ff':'08111f')>=4.5,'Body copy contrast');
    for(const color of ['16763b','0f6179','1a5c4a'])assert.ok(contrast(color,'ffffff')>=4.5,'Preview bubbles must retain white text contrast');
    await page.screenshot({path:`${out}/${theme}-${width}.png`});assert.deepEqual(errors,[]);
    console.log(`PASS ${width}px ${theme}: decoration behind copy, heading/body contrast >=4.5, no JS errors`);
    if(width===390){
      // Test the product control and saved preference, not just a CSS class.
      await page.getByTitle(/Alternar tema|Toggle light/).click();await page.waitForTimeout(250);
      const next=theme==='light'?'dark':'light';assert.equal(await page.evaluate(()=>localStorage.getItem('lume_theme')),next);
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme||'light'),next);
      await page.reload();await page.waitForTimeout(1000);
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme||'light'),next);
      console.log(`PASS ${width}px theme toggle updates DOM and persists after reload`);
    }
    await context.close();
  }
}finally{await browser.close();}
