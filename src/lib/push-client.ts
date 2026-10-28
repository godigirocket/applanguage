import { supabase } from "@/integrations/supabase/client";
import { accountKey, accountOwner } from "./account-storage";
export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "PushManager" in window &&
    "serviceWorker" in navigator
  );
}
async function request(action: string, subscription: PushSubscription, language?: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session || session.user.id !== accountOwner()) throw new Error("Sign in required");
  const result = await fetch("/api/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action, subscription: subscription.toJSON(), language }),
    signal: AbortSignal.timeout(10000),
  });
  if (!result.ok) throw new Error("Reminder service unavailable");
  return result.json();
}
export async function getReminderState() {
  if (!pushSupported()) return { supported: false, enabled: false, configured: false };
  const config = await (
    await fetch("/api/reminders", { signal: AbortSignal.timeout(8000) })
  ).json();
  if (!config.configured) return { supported: true, enabled: false, configured: false };
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  const state = subscription ? await request("status", subscription) : { enabled: false };
  try {
    localStorage.setItem(accountKey("lume_push_enabled"), String(Boolean(state.enabled)));
  } catch {
    /* Private storage. */
  }
  return { supported: true, configured: true, enabled: Boolean(state.enabled) };
}
export async function enableReminders(language: string) {
  if (!pushSupported()) throw new Error("unsupported");
  const permission =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") throw new Error("permission");
  const response = await fetch("/api/reminders", { signal: AbortSignal.timeout(8000) });
  const config = await response.json();
  if (!config.configured || !config.publicKey) throw new Error("unavailable");
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) throw new Error("worker");
  const existing = await registration.pushManager.getSubscription();
  const raw = atob(config.publicKey.replace(/-/g, "+").replace(/_/g, "/"));
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: Uint8Array.from(raw, (c) => c.charCodeAt(0)),
    }));
  try {
    await request("subscribe", subscription, language);
  } catch (e) {
    if (!existing) await subscription.unsubscribe();
    throw e;
  }
  try {
    localStorage.setItem(accountKey("lume_push_enabled"), "true");
  } catch {
    /* Private storage. */
  }
}
export async function disableReminders() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await request("unsubscribe", subscription);
    await subscription.unsubscribe();
  }
  try {
    localStorage.setItem(accountKey("lume_push_enabled"), "false");
  } catch {
    /* Private storage. */
  }
}
export async function recordPushActivity() {
  const key = accountKey("lume_push_activity");
  try {
    if (
      localStorage.getItem(accountKey("lume_push_enabled")) !== "true" ||
      Date.now() - Number(localStorage.getItem(key)) < 3600000
    )
      return;
  } catch {
    return;
  }
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await request("activity", subscription);
    localStorage.setItem(key, String(Date.now()));
  }
}
