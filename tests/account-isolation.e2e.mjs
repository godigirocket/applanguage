import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/lesson/lesson-en-1");
  await page.getByRole("button",{name:"Vamos começar"}).waitFor();
  const result = await page.evaluate(async () => {
    const { switchAccount } = await import("/src/lib/account-session.ts");
    const { useStore,flushStoreWrites } = await import("/src/hooks/useStore.ts");
    const { useUserStore } = await import("/src/store/userStore.ts");
    const { accountKey } = await import("/src/lib/account-storage.ts");
    const a="00000000-0000-0000-0000-000000000001",b="00000000-0000-0000-0000-000000000002";
    await switchAccount(a);
    useStore.setState({lumes:700,xp:41,inventory:["avatar-crown"],completedLessons:["lesson-en-1"]});
    useUserStore.getState().setUserLevel("C1");
    localStorage.setItem(accountKey("lume-saved-words"),JSON.stringify([{id:"private-a",term:"hello"}]));
    await flushStoreWrites();
    await switchAccount(b);
    const clean = { xp:useStore.getState().xp,lumes:useStore.getState().lumes,inventory:useStore.getState().inventory,completed:useStore.getState().completedLessons,level:useUserStore.getState().userLevel,words:localStorage.getItem(accountKey("lume-saved-words")) };
    useStore.getState().setLumes(15);
    await flushStoreWrites();
    await switchAccount(a);
    const restored={xp:useStore.getState().xp,lumes:useStore.getState().lumes,inventory:useStore.getState().inventory,completed:useStore.getState().completedLessons,level:useUserStore.getState().userLevel};
    await switchAccount(null);
    const guest={xp:useStore.getState().xp,lumes:useStore.getState().lumes};
    await switchAccount(b);
    return {clean,restored,guest,secondBalance:useStore.getState().lumes};
  });
  assert.deepEqual(result.clean,{xp:0,lumes:0,inventory:[],completed:[],level:"",words:null});
  assert.deepEqual(result.restored,{xp:41,lumes:700,inventory:["avatar-crown"],completed:["lesson-en-1"],level:"C1"});
  assert.deepEqual(result.guest,{xp:0,lumes:0});
  assert.equal(result.secondBalance,15);
  console.log("PASS account A → B → A → guest → B isolates and restores wallet, XP, inventory, lessons, level and words");
} finally { await browser.close(); }
