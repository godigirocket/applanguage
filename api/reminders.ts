import { createClient } from "@supabase/supabase-js";
import { validPushSubscription } from "../src/lib/push-validation.ts";
type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
};
type Response = {
  status(code: number): Response;
  json(body: unknown): Response;
  setHeader?(key: string, value: string): void;
};
export default async function handler(req: Request, res: Response) {
  res.setHeader?.("Cache-Control", "no-store");
  const key = process.env.VAPID_PUBLIC_KEY,
    secret = process.env.VAPID_PRIVATE_KEY;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const configured = Boolean(key && secret && url && adminKey);
  if (req.method === "GET")
    return res.status(200).json({ configured, publicKey: configured ? key : null });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!configured) return res.status(503).json({ error: "Reminders unavailable" });
  const authorization = req.headers.authorization;
  if (typeof authorization !== "string" || !authorization.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  const admin = createClient(url!, adminKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(authorization.slice(7));
  if (authError || !user) return res.status(401).json({ error: "Unauthorized" });
  const body = req.body;
  if (!body || JSON.stringify(body).length > 12000 || !validPushSubscription(body.subscription))
    return res.status(422).json({ error: "Invalid subscription" });
  const { subscription } = body;
  try {
    if (body.action === "status") {
      const { data, error } = await admin
        .from("push_subscriptions")
        .select("enabled")
        .eq("user_id", user.id)
        .eq("endpoint", subscription.endpoint)
        .maybeSingle();
      if (error) throw error;
      return res.status(200).json({ enabled: Boolean(data?.enabled) });
    }
    if (body.action === "unsubscribe") {
      const { error } = await admin
        .from("push_subscriptions")
        .update({ enabled: false })
        .eq("user_id", user.id)
        .eq("endpoint", subscription.endpoint);
      if (error) throw error;
      return res.status(200).json({ enabled: false });
    }
    if (body.action === "activity") {
      const { error } = await admin
        .from("push_subscriptions")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("endpoint", subscription.endpoint)
        .eq("enabled", true);
      if (error) throw error;
      return res.status(200).json({ recorded: true });
    }
    if (body.action !== "subscribe") return res.status(422).json({ error: "Invalid action" });
    const { error } = await admin.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        subscription,
        language: ["pt", "en", "es"].includes(body.language) ? body.language : "pt",
        enabled: true,
        last_activity_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );
    if (error) throw error;
    return res.status(200).json({ enabled: true });
  } catch {
    return res.status(503).json({ error: "Reminders unavailable; try again" });
  }
}
