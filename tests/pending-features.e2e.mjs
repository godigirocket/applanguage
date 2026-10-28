import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  let available=false, calls=0;
  await page.route("**/rest/v1/rpc/complete_lesson_atomic", route => {
    calls++;
    return route.fulfill({ status:available ? 200 : 503,contentType:"application/json",body:JSON.stringify(available ? {success:true,alreadyCompleted:false,xpEarned:41,totalXP:41} : {message:"QA offline"}) });
  });
  await page.goto("http://127.0.0.1:5173/lesson/lesson-en-1");
  await page.getByRole("button",{name:"Vamos começar"}).waitFor();
  const failed=await page.evaluate(async () => {
    const {supabase}=await import("/src/integrations/supabase/client.ts");
    supabase.auth.getSession=async()=>({data:{session:{user:{id:"00000000-0000-0000-0000-000000000001"},access_token:"qa-token-only"}},error:null});
    const {completeLesson}=await import("/src/lib/lesson-progress.ts");
    return completeLesson("00000000-0000-0000-0000-000000000001","lesson-en-1",41,60);
  });
  assert.equal(failed.pending,true);
  assert.equal(failed.success,false);
  await page.reload();
  await page.getByRole("button",{name:/Vamos começar|Revisar lição/}).waitFor();
  assert.ok(await page.evaluate(()=>localStorage.getItem("lume-completion-outbox:00000000-0000-0000-0000-000000000001:lesson-en-1")));
  await page.evaluate(async()=>{ const {supabase}=await import("/src/integrations/supabase/client.ts"); supabase.auth.getSession=async()=>({data:{session:{user:{id:"00000000-0000-0000-0000-000000000002"},access_token:"qa-account-b"}},error:null}); const {flushPendingCompletions}=await import("/src/lib/lesson-progress.ts"); await flushPendingCompletions("00000000-0000-0000-0000-000000000001"); });
  assert.equal(calls,1,"account B must not submit account A's completion");
  available=true;
  await page.evaluate(async () => { const {supabase}=await import("/src/integrations/supabase/client.ts"); supabase.auth.getSession=async()=>({data:{session:{user:{id:"00000000-0000-0000-0000-000000000001"},access_token:"qa-token-only"}},error:null}); const {flushPendingCompletions}=await import("/src/lib/lesson-progress.ts"); await flushPendingCompletions("00000000-0000-0000-0000-000000000001"); });
  assert.equal(await page.evaluate(()=>localStorage.getItem("lume-completion-outbox:00000000-0000-0000-0000-000000000001:lesson-en-1")),null);
  assert.equal(calls,2);
  console.log("PASS failed completion survives reload, does not cross accounts and retries even with a local completed flag");
} finally {await browser.close();}
