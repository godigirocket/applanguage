import { CAKTO_OFFERS, CAKTO_PRODUCT_ID, LEGACY_CAKTO_OFFERS } from "./cakto-catalog.ts";

export function normalizeCaktoEvents(body: any, now = new Date()) {
  if (!body || typeof body !== "object") throw new Error("invalid_payload");
  const eventType = String(body.event || body.event_type || body.type || "").toLowerCase();
  const orders = Array.isArray(body.data) ? body.data : [body.data || body];
  if (!orders.length || orders.length > 50) throw new Error("invalid_orders");
  return orders.map((order: any) => {
    const status = String(order.status || body.status || "unknown").toLowerCase();
    const rawId = body.event_id || order.id || order.refId || body.order_id;
    const email = String(order.customer?.email || body.customer_email || "")
      .trim()
      .toLowerCase();
    const offerId = String(order.offer?.id || order.offer_id || "");
    const productId = String(order.product?.id || order.product_id || "");
    if (!rawId || !email.includes("@")) throw new Error("missing_event_identity");
    const canonical = Object.entries(CAKTO_OFFERS).find(([, offer]) => offer.id === offerId);
    const legacy = LEGACY_CAKTO_OFFERS.find((o) => o.id === offerId && o.productId === productId);
    if ((!canonical || productId !== CAKTO_PRODUCT_ID) && !legacy)
      throw new Error("unknown_product_or_offer");
    const revoke =
      ["refund", "chargeback", "payment_refunded"].includes(eventType) ||
      ["refunded", "chargedback"].includes(status);
    const cancel = [
      "subscription_canceled",
      "subscription_cancelled",
      "subscription_renewal_refused",
    ].includes(eventType);
    const approve =
      ["purchase_approved", "payment_approved", "subscription_renewed"].includes(eventType) &&
      ["paid", "approved", "active", "completed"].includes(status);
    const action = revoke ? "revoke" : cancel ? "cancel" : approve ? "approve" : "ignore";
    const price = legacy?.price ?? canonical?.[1].price;
    const amount = Number(order.amount ?? order.offer?.price ?? body.amount);
    const currency = String(order.currency || body.currency || "BRL").toUpperCase();
    if (action === "approve" && (!Number.isFinite(amount) || amount < price! || currency !== "BRL"))
      throw new Error("payment_amount_or_currency_mismatch");
    const timestamp =
      action === "revoke"
        ? order.refundedAt || order.chargedbackAt || body.created_at
        : action === "cancel"
          ? order.canceledAt || body.created_at
          : order.paid_at || order.paidAt || body.created_at || order.created_at || order.createdAt;
    const occurred = timestamp ? new Date(timestamp) : now;
    if (!Number.isFinite(occurred.getTime())) throw new Error("invalid_event_timestamp");
    const periodEnd = order.current_period_end || order.subscription?.current_period_end || null;
    if (periodEnd && !Number.isFinite(new Date(periodEnd).getTime()))
      throw new Error("invalid_period_end");
    // Include event type: approval and refund often share an order identifier.
    return {
      event_id:
        action === "approve"
          ? `payment:${order.id || order.refId || body.order_id || rawId}`
          : `${eventType}:${rawId}:${status}`,
      event_type: eventType,
      action,
      order_id: String(order.refId || order.id || body.order_id),
      subscription_id:
        typeof order.subscription === "string"
          ? order.subscription
          : order.subscription?.id || body.subscription_id || null,
      email,
      offer_id: offerId,
      product_id: productId,
      amount: Number.isFinite(amount) ? amount : null,
      currency,
      status,
      occurred_at: occurred.toISOString(),
      period_end: periodEnd,
    };
  });
}
