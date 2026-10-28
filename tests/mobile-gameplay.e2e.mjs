import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:5173';
const qa=JSON.parse(fs.readFileSync('scratchpad/production-audit/qa-account.private.json','utf8'));
const words=JSON.parse(fs.readFileSync('src/data/vocabulary.json','utf8')).en.slice(0,6);
const browser=await chromium.launch();
try {
  const context=await browser.newContext({viewport:{width:Number(process.env.E2E_GAME_WIDTH||390),height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
  await page.goto(base+'/login');await page.locator('input[type=email]').fill(qa.email);await page.locator('input[type=password]').fill(qa.password);await page.locator('button[type=submit]').click();await page.waitForURL(/\/home/);
  await page.goto(base+'/memory');await page.getByText(words[0].word,{exact:true}).waitFor({state:'attached'});await page.waitForTimeout(1200);
  for(const word of words){
    // The hidden face holds the word; its card parent is the actual touch target.
    for(const text of [word.word,word.translation])await page.getByText(text,{exact:true}).locator('..').locator('..').tap();
    await page.waitForTimeout(650);
  }
  await page.getByText('Memória Impecável!',{exact:true}).waitFor();
  const clippedCards=await page.locator('.lume-memory-card').evaluateAll(cards=>cards.filter(card=>{
    const r=card.getBoundingClientRect(),p=card.querySelector('p')?.getBoundingClientRect();return p&&(p.left<r.left-2||p.right>r.right+2||p.top<r.top-2||p.bottom>r.bottom+2);
  }).length);
  assert.equal(clippedCards,0,'Matched card translations fit inside each card');
  console.log('PASS mobile memory: all six pairs and completion');
  await page.goto(base+'/quiz/flashcards');await page.locator('h3').first().waitFor();await page.waitForTimeout(1000);
  const first=await page.locator('h3').first().innerText();await page.locator('h3').first().tap();await page.getByRole('button',{name:/Fácil/}).tap();await page.waitForTimeout(900);
  assert.notEqual(await page.locator('h3').first().innerText(),first);
  console.log('PASS mobile flashcards: flip, difficulty and next card');
  await page.goto(base+'/quiz-play/vocab');
  for(let i=0;i<6;i++){
    const question=page.locator('h3').first();await question.waitFor();const text=await question.innerText();
    await question.locator('..').getByRole('button').first().tap();
    await page.waitForFunction(previous=>document.querySelector('h3')?.textContent!==previous,text,{timeout:10000});
  }
  await page.getByText(/Quiz concluído|Quiz Completed/i).waitFor();
  console.log('PASS mobile vocabulary quiz: six answers, feedback and results');
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
