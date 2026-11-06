import { chromium } from "playwright";
import assert from "node:assert/strict";
const base=process.env.PRODUCTION_BASE_URL||"http://127.0.0.1:5174";
const browser=await chromium.launch();
try {
  const htmlOnly = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const intro = await htmlOnly.newPage();
  await intro.goto(`${base}/lesson/lesson-en-1`);
  await intro.getByRole("heading",{name:"At the Airport - Volume 1",exact:true}).waitFor();
  assert.ok(await intro.getByRole("button",{name:"Vamos começar"}).isDisabled(),"Preview the lesson before JS; only enable practice after account initialization");
  await htmlOnly.close();
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(`${base}/lesson/lesson-en-1`);
  await page.getByRole("button",{name:"Vamos começar"}).waitFor();
  await page.evaluate(()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error("Worker not ready")),20000))]));
  await page.reload();
  await page.getByRole("button",{name:"Vamos começar"}).waitFor();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("heading",{name:"At the Airport - Volume 1",exact:true}).waitFor();
  await page.getByRole("button",{name:"Vamos começar"}).click();
  await page.getByText("Prática · 01",{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log("PASS previously visited public lesson reloads and starts offline using built PWA and SSR");
} finally {await browser.close();}
