import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";
import { normalizeCaktoEvents } from "../../src/lib/cakto-events.ts";

type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type Response = { status(code: number): Response; json(body: unknown): Response };
export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: "Webhook not configured" });
  const body = req.body as Record<string, unknown> | undefined;
  const received = typeof body?.secret === "string" ? body.secret : "";
  const a = Buffer.from(secret),
    b = Buffer.from(received);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return res.status(401).json({ error: "Unauthorized" });
  const type = String(body?.event || body?.event_type || body?.type || "").toLowerCase();
  if (
    ![
      "purchase_approved",
      "payment_approved",
      "subscription_renewed",
      "refund",
      "chargeback",
      "payment_refunded",
      "subscription_canceled",
      "subscription_cancelled",
      "subscription_renewal_refused",
    ].includes(type)
  )
    return res.status(200).json({ received: true, ignored: true });
  let events;
  try {
    events = normalizeCaktoEvents(body);
  } catch (error) {
    return res
      .status(422)
      .json({ error: error instanceof Error ? error.message : "Invalid event" });
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Database not configured" });
  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  try {
    const results = [];
    for (const event of events) {
      const { data, error } = await admin.rpc("process_cakto_event", { p_event: event });
      if (error) throw new Error(error.code || "Payment transaction failed");
      results.push(data);
    }
    return res.status(200).json({ received: true, results });
  } catch (error) {
    // Return a failure so the provider retries. Never persist the webhook secret.
    console.error(
      "[Cakto] Transaction failed:",
      error instanceof Error ? error.message : "Unknown",
    );
    return res.status(503).json({ error: "Payment synchronization unavailable; retry required" });
  }
}
