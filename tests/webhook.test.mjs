import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/webhooks/cakto.ts";
test("webhook authenticates, ignores non-billing events, sends sanitized transactions and asks for retries", async () => {
  const originalFetch=globalThis.fetch;
  const keys=["CAKTO_WEBHOOK_SECRET","SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY"];
  const original=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
  process.env.CAKTO_WEBHOOK_SECRET="qa-only-webhook-secret";
  process.env.SUPABASE_URL="https://qa-database.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY="qa-only-admin-key";
  const invoke=async(method,body)=>{
    let status,payload;
    await handler({method,headers:{},body},{status(code){status=code;return this;},json(data){payload=data;return this;}});
    return {status,payload};
  };
  try {
    assert.equal((await invoke("GET",{})).status,405);
    assert.equal((await invoke("POST",{secret:"wrong"})).status,401);
    const secret=process.env.CAKTO_WEBHOOK_SECRET;
    assert.equal((await invoke("POST",{secret,event:"checkout_abandonment",data:{}})).payload.ignored,true);
    const order={id:"order-qa",status:"paid",customer:{email:"qa@example.com"},product:{id:"d796ae06-6ae5-4efc-8e84-b087aee194d7"},offer:{id:"t3z3hhs"},amount:9.9};
    const calls=[];
    globalThis.fetch=async(url,options)=>{assert.equal(new URL(url).hostname,"qa-database.invalid");calls.push(JSON.parse(options.body));return new Response(JSON.stringify({processed:true}),{status:200,headers:{"Content-Type":"application/json"}});};
    assert.equal((await invoke("POST",{secret,event:"purchase_approved",data:[order,{...order,id:"order-qa-2"}]})).status,200);
    assert.equal(calls.length,2);
    assert.ok(calls.every(c=>!JSON.stringify(c).includes(secret)));
    globalThis.fetch=async()=>new Response(JSON.stringify({code:"QA_FAILURE",message:"retry"}),{status:500,headers:{"Content-Type":"application/json"}});
    assert.equal((await invoke("POST",{secret,event:"purchase_approved",data:order})).status,503);
  } finally {globalThis.fetch=originalFetch;for(const key of keys) original[key]===undefined ? delete process.env[key] : process.env[key]=original[key];}
});
