import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { timingSafeEqual } from "node:crypto";
import { validPushSubscription, reminderText } from "../../src/lib/push-validation.ts";
type Request = { method?: string; headers: Record<string, string | string[] | undefined> };
type Response = { status(code: number): Response; json(body: unknown): Response };
export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const cron = process.env.CRON_SECRET,
    authorization = req.headers.authorization;
  if (!cron || typeof authorization !== "string")
    return res.status(401).json({ error: "Unauthorized" });
  const a = Buffer.from(authorization),
    b = Buffer.from(`Bearer ${cron}`);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return res.status(401).json({ error: "Unauthorized" });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY)
    return res.status(503).json({ error: "Reminders not configured" });
  webpush.setVapidDetails(
    "https://langlume.vercel.app/support",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.rpc("claim_due_reminders", { p_limit: 100 });
  if (error) return res.status(503).json({ error: "Reminder queue unavailable" });
  let sent = 0,
    expired = 0,
    failed = 0;
  for (let i = 0; i < (data || []).length; i += 20)
    await Promise.all(
      data.slice(i, i + 20).map(async (item: any) => {
        if (!validPushSubscription(item.subscription)) {
          failed++;
          return;
        }
        try {
          await webpush.sendNotification(
            item.subscription,
            JSON.stringify({ ...reminderText(item.language), url: "/home" }),
            { TTL: 7200, timeout: 8000 },
          );
          sent++;
          await admin
            .from("push_subscriptions")
            .update({ last_sent_at: new Date().toISOString() })
            .eq("endpoint", item.endpoint);
        } catch (e: any) {
          if (e.statusCode === 404 || e.statusCode === 410) {
            expired++;
            await admin
              .from("push_subscriptions")
              .update({ enabled: false })
              .eq("endpoint", item.endpoint);
          } else failed++;
        }
      }),
    );
  return res.status(200).json({ claimed: data?.length || 0, sent, expired, failed });
}
