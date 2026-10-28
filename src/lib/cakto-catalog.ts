// Read from the owner's Cakto catalog on 2026-10-21. Public offer identifiers.
// Product salesPage matches https://langlume.vercel.app.
export const CAKTO_PRODUCT_ID = "d796ae06-6ae5-4efc-8e84-b087aee194d7";
export const CAKTO_OFFERS = {
  premium_monthly: { id: "t3z3hhs", price: 9.9, days: 30 },
  premium_quarterly: { id: "g3hm6pm", price: 25.9, days: 90 },
  premium_annual: { id: "wf6iugo", price: 65.9, days: 365 },
  premium_lifetime: { id: "33vgk53", price: 110, days: null },
} as const;
export type PaidPlan = keyof typeof CAKTO_OFFERS;
export const LEGACY_CAKTO_OFFERS = [
  {
    id: "y7y2kbh",
    productId: "a29c1259-f930-44e6-b5a3-b2603501d8d7",
    plan: "premium_monthly",
    price: 9.9,
  },
  {
    id: "323bbhy",
    productId: "40362e5c-d96b-46d2-bc80-0297866c9609",
    plan: "premium_monthly",
    price: 9.9,
  },
  {
    id: "36ifrqs",
    productId: "a29c1259-f930-44e6-b5a3-b2603501d8d7",
    plan: "premium_lifetime",
    price: 119,
  },
  {
    id: "odipwwf",
    productId: "a29c1259-f930-44e6-b5a3-b2603501d8d7",
    plan: "premium_annual",
    price: 63.9,
  },
] as const;
export function resolveCaktoOffer(id: string, productId?: string | null) {
  if (productId && productId !== CAKTO_PRODUCT_ID) return null;
  return (
    (Object.entries(CAKTO_OFFERS).find(([, offer]) => offer.id === id)?.[0] as
      PaidPlan | undefined) || null
  );
}
export function caktoCheckoutUrl(plan: string) {
  const offer = CAKTO_OFFERS[plan as PaidPlan];
  return offer ? `https://pay.cakto.com.br/${offer.id}` : undefined;
}
