import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCaktoEvents } from "../src/lib/cakto-events.ts";
import { caktoCheckoutUrl } from "../src/lib/cakto-catalog.ts";
import { hasPremiumEntitlement } from "../src/lib/entitlements.ts";
const product = "d796ae06-6ae5-4efc-8e84-b087aee194d7";
const order = { id: "order-1", refId: "ref-1", status: "paid", customer: { email: "QA@example.com" }, product: { id: product }, offer: { id: "t3z3hhs", price: 9.9 }, amount: 9.9 };
test("Cakto plans point to distinct verified offers", () => {
  const urls = ["premium_monthly","premium_quarterly","premium_annual","premium_lifetime"].map(caktoCheckoutUrl);
  assert.equal(new Set(urls).size, 4);
  assert.ok(urls.every(u => u.startsWith("https://pay.cakto.com.br/")));
});
test("refund beats paid status and has an independent event identity", () => {
  const approved = normalizeCaktoEvents({ secret: "do-not-persist", event: "purchase_approved", data: order })[0];
  const refunded = normalizeCaktoEvents({ event: "refund", data: order })[0];
  assert.equal(approved.action,"approve"); assert.equal(refunded.action,"revoke");
  assert.notEqual(approved.event_id,refunded.event_id);
  assert.equal(approved.event_id,normalizeCaktoEvents({event:"subscription_renewed",data:order})[0].event_id,"two approval event types for the same invoice must not extend access twice");
  assert.ok(!JSON.stringify(approved).includes("do-not-persist"));
  assert.equal(normalizeCaktoEvents({event:"refund",data:{...order,paidAt:"2026-10-01T12:00:00Z",refundedAt:"2026-10-10T12:00:00Z"}})[0].occurred_at,"2026-10-10T12:00:00.000Z");
});
test("events process every order, enforce product, amount and currency", () => {
  assert.equal(normalizeCaktoEvents({ event:"purchase_approved",data:[order,{...order,id:"order-2"}] }).length,2);
  for (const changes of [{ product:{id:"different-product"}}, {amount:0}, {currency:"USD"}, {offer:{id:"unknown"}}]) assert.throws(() => normalizeCaktoEvents({event:"purchase_approved",data:{...order,...changes}}));
  assert.equal(normalizeCaktoEvents({event:"subscription_created",data:order})[0].action,"ignore");
  assert.equal(normalizeCaktoEvents({event:"subscription_canceled",data:order})[0].action,"cancel");
});
test("premium depends on canonical profile and real expiry", () => {
  const now=Date.now();
  assert.equal(hasPremiumEntitlement({plan:"premium",premium_until:null},now),true);
  assert.equal(hasPremiumEntitlement({plan:"free",premium_until:null},now),false);
  assert.equal(hasPremiumEntitlement({plan:"premium",premium_until:new Date(now-1).toISOString()},now),false);
  assert.equal(hasPremiumEntitlement({plan:"premium",premium_until:"invalid"},now),false);
});
