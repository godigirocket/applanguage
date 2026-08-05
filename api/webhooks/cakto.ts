/**
 * CAKTO WEBHOOK ENDPOINT (Vercel Serverless Function)
 * Receives payment events from Cakto and auto-upgrades users to Premium
 * 
 * Security: NEVER trust the frontend. Only this backend endpoint can upgrade users.
 * Idempotency: Duplicate events are ignored using event_id unique constraint.
 * 
 * URL: /api/webhooks/cakto
 * Method: POST
 */

import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: Record<string, unknown>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
};

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// In-memory rate limiter for webhook endpoint (per-IP, per serverless instance)
const webhookRateLimits = new Map<string, { count: number; resetAt: number }>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Rate limiting: max 30 webhook calls per minute per IP
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 30;
  const key = `webhook:${clientIp}`;
  
  if (!webhookRateLimits.has(key) || now > webhookRateLimits.get(key)!.resetAt) {
    webhookRateLimits.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    const entry = webhookRateLimits.get(key)!;
    entry.count++;
    if (entry.count > maxRequests) {
      console.warn(`[Cakto Webhook] Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({ error: "Too many requests" });
    }
  }
  // Evict old entries to prevent memory leak
  if (webhookRateLimits.size > 1000) {
    for (const [k, v] of webhookRateLimits) {
      if (now > v.resetAt) webhookRateLimits.delete(k);
    }
  }

  try {
    const body = req.body ?? {};
    
    // 1. Validate webhook secret (Cakto sends it in the body as "secret")
    // Fail closed: an unconfigured secret must reject every request, not skip validation.
    const webhookSecret = process.env.CAKTO_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Cakto Webhook] CAKTO_WEBHOOK_SECRET is not configured; rejecting request");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const receivedSecret = typeof body.secret === "string" ? body.secret : "";

    if (!safeCompare(receivedSecret, webhookSecret)) {
      console.error("[Cakto Webhook] Invalid secret");
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // 2. Extract event data
    const eventData = normalizeEventData(body);
    
    if (!eventData.customerEmail) {
      console.error("[Cakto Webhook] Missing customer email", body);
      return res.status(400).json({ error: "Missing customer email" });
    }
    
    console.log("[Cakto Webhook] Received:", {
      type: String(eventData.eventType).slice(0, 50),
      email: eventData.customerEmail ? eventData.customerEmail.slice(0, 100) : "",
      status: String(eventData.status).slice(0, 30),
    });
    
    // 3. Save event to payment_events (idempotency check)
    const { data: savedEvent, error: saveError } = await supabaseAdmin
      .from("payment_events")
      .insert({
        provider: "cakto",
        event_id: eventData.eventId,
        event_type: eventData.eventType,
        order_id: eventData.orderId,
        subscription_id: eventData.subscriptionId,
        customer_email: eventData.customerEmail.toLowerCase().trim(),
        customer_name: eventData.customerName,
        product_id: eventData.productId,
        product_name: eventData.productName,
        amount: eventData.amount,
        currency: eventData.currency || "BRL",
        status: eventData.status,
        raw_payload: body,
        processed: false,
      })
      .select()
      .single();
    
    // If duplicate event_id, return success (idempotency)
    if (saveError?.code === "23505") {
      console.log("[Cakto Webhook] Duplicate event ignored:", eventData.eventId);
      return res.status(200).json({ message: "Event already processed" });
    }
    
    if (saveError) {
      console.error("[Cakto Webhook] Save error:", saveError);
      return res.status(500).json({ error: "Failed to save event" });
    }
    
    // 4. Process event based on type
    const shouldUpgrade = shouldUpgradeUser(eventData);
    const shouldDowngrade = shouldDowngradeUser(eventData);
    
    if (shouldUpgrade) {
      await upgradeUserToPremium(eventData, savedEvent.id);
    } else if (shouldDowngrade) {
      await downgradeUserToFree(eventData, savedEvent.id);
    } else {
      console.log("[Cakto Webhook] No action needed for event type:", eventData.eventType);
    }
    
    return res.status(200).json({ message: "Webhook processed successfully" });
    
  } catch (error) {
    console.error("[Cakto Webhook] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

interface NormalizedEvent {
  eventId: string | null;
  eventType: string;
  orderId: string | null;
  subscriptionId: string | null;
  customerEmail: string;
  customerName: string | null;
  productId: string | null;
  productName: string | null;
  amount: number | null;
  currency: string | null;
  status: string;
}

function normalizeEventData(body: any): NormalizedEvent {
  // Cakto sends: { secret, event, data: [...orders] }
  // Each order has: customer.email, product.name, status, amount, offer.price, etc.
  const firstOrder = Array.isArray(body.data) ? body.data[0] : body.data || body;
  const customer = firstOrder?.customer || {};
  const product = firstOrder?.product || {};
  const offer = firstOrder?.offer || {};

  return {
    eventId: firstOrder?.id || firstOrder?.refId || body.event_id || null,
    eventType: body.event || body.event_type || body.type || "unknown",
    orderId: firstOrder?.refId || firstOrder?.id || body.order_id || null,
    subscriptionId: firstOrder?.subscription || body.subscription_id || null,
    customerEmail: customer.email || body.customer_email || body.email || "",
    customerName: customer.name || body.customer_name || null,
    productId: product.id || product.short_id || body.product_id || null,
    productName: product.name || offer.name || body.product_name || null,
    amount: firstOrder?.amount || offer.price || body.amount || null,
    currency: body.currency || "BRL",
    status: firstOrder?.status || body.status || "unknown",
  };
}

function shouldUpgradeUser(event: NormalizedEvent): boolean {
  const upgradeEvents = [
    "purchase_approved",
    "payment_approved",
    "subscription_created",
    "subscription_renewed",
    "subscription_activated",
  ];
  
  const upgradeStatuses = ["paid", "approved", "active", "completed"];
  
  return (
    upgradeEvents.includes(event.eventType.toLowerCase()) ||
    upgradeStatuses.includes(event.status.toLowerCase())
  );
}

function shouldDowngradeUser(event: NormalizedEvent): boolean {
  const downgradeEvents = [
    "refund",
    "chargeback",
    "subscription_canceled",
    "subscription_cancelled",
    "subscription_renewal_refused",
    "payment_refunded",
  ];
  
  const downgradeStatuses = ["refunded", "chargedback", "canceled", "cancelled", "refused"];
  
  return (
    downgradeEvents.includes(event.eventType.toLowerCase()) ||
    downgradeStatuses.includes(event.status.toLowerCase())
  );
}

async function upgradeUserToPremium(event: NormalizedEvent, paymentEventId: string) {
  const email = event.customerEmail.toLowerCase().trim();
  
  console.log("[Cakto Webhook] Upgrading user to Premium:", email);
  
  const { data: profile, error: findError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, plan")
    .eq("email", email)
    .maybeSingle();
  
  if (findError) {
    console.error("[Cakto Webhook] Error finding user:", findError);
    return;
  }
  
  if (!profile) {
    console.warn("[Cakto Webhook] User not found - event saved for signup claim");
    return;
  }
  
  if (profile.plan === "premium") {
    console.log("[Cakto Webhook] User already premium:", email);
    await markEventProcessed(paymentEventId, profile.id);
    return;
  }

  // Determine premium_until based on product
  let premiumUntil: string | null = null;
  const productName = (event.productName || "").toLowerCase();
  
  if (productName.includes("vitalício") || productName.includes("lifetime")) {
    // Lifetime = no expiration
    premiumUntil = null;
  } else if (productName.includes("anual") || productName.includes("annual")) {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    premiumUntil = oneYear.toISOString();
  } else {
    // Monthly default
    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() + 1);
    premiumUntil = oneMonth.toISOString();
  }
  
  const { error: upgradeError } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "premium",
      upgraded_at: new Date().toISOString(),
      cakto_customer_email: email,
      cakto_order_id: event.orderId,
      cakto_subscription_id: event.subscriptionId,
      last_payment_status: event.eventType,
      premium_until: premiumUntil,
    })
    .eq("id", profile.id);
  
  if (upgradeError) {
    console.error("[Cakto Webhook] Upgrade error:", upgradeError);
    await markEventError(paymentEventId, upgradeError.message);
    return;
  }
  
  await markEventProcessed(paymentEventId, profile.id);
  console.log("[Cakto Webhook] ✅ User upgraded to Premium:", email, "| Until:", premiumUntil || "LIFETIME");
}

async function downgradeUserToFree(event: NormalizedEvent, paymentEventId: string) {
  const email = event.customerEmail.toLowerCase().trim();
  
  console.log("[Cakto Webhook] Downgrading user to Free:", email);
  
  let { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, email, plan")
    .eq("email", email)
    .maybeSingle();

  if (!profile && event.orderId) {
    const byOrder = await supabaseAdmin
      .from("profiles")
      .select("id, email, plan")
      .eq("cakto_order_id", event.orderId)
      .maybeSingle();
    profile = byOrder.data;
  }

  if (!profile) {
    console.warn("[Cakto Webhook] User not found for downgrade:", email);
    await markEventProcessed(paymentEventId, null);
    return;
  }
  
  const { error: downgradeError } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "free",
      last_payment_status: event.eventType,
      premium_until: null,
    })
    .eq("id", profile.id);
  
  if (downgradeError) {
    console.error("[Cakto Webhook] Downgrade error:", downgradeError);
    await markEventError(paymentEventId, downgradeError.message);
    return;
  }
  
  await markEventProcessed(paymentEventId, profile.id);
  console.log("[Cakto Webhook] ✅ User downgraded to Free:", email);
}

async function markEventProcessed(eventId: string, userId: string | null) {
  await supabaseAdmin
    .from("payment_events")
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
      user_id_matched: userId,
    })
    .eq("id", eventId);
}

async function markEventError(eventId: string, error: string) {
  await supabaseAdmin
    .from("payment_events")
    .update({
      processing_error: error,
    })
    .eq("id", eventId);
}
