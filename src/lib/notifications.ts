/**
 * PUSH NOTIFICATIONS - Daily Streak Reminders
 * 
 * Uses the Notification API (no external push service needed for basic reminders).
 * For server-sent push, you'd need a VAPID key + push service — this is the
 * lightweight client-only version that works via the service worker.
 */

const PERMISSION_KEY = "lume_notification_permission";
const REMINDER_KEY = "lume_last_reminder";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  localStorage.setItem(PERMISSION_KEY, result);
  return result === "granted";
}

export function scheduleStreakReminder(): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  // Don't remind more than once per 20 hours
  const lastReminder = localStorage.getItem(REMINDER_KEY);
  if (lastReminder) {
    const elapsed = Date.now() - parseInt(lastReminder, 10);
    if (elapsed < 20 * 60 * 60 * 1000) return;
  }

  // Schedule a reminder for 8 hours from now (if user hasn't returned)
  const delay = 8 * 60 * 60 * 1000; // 8 hours
  
  setTimeout(() => {
    // Check if user has been active (localStorage timestamp)
    const lastActivity = localStorage.getItem("lume_last_activity");
    if (lastActivity) {
      const inactiveFor = Date.now() - parseInt(lastActivity, 10);
      if (inactiveFor < 6 * 60 * 60 * 1000) return; // Active within 6h, skip
    }

    showLocalNotification(
      "Mantenha sua ofensiva! 🔥",
      "Faz tempo que você não pratica. Uma lição rápida de 5 min mantém o ritmo."
    );
    localStorage.setItem(REMINDER_KEY, Date.now().toString());
  }, delay);
}

export function showLocalNotification(title: string, body: string): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: "/logo.png",
        badge: "/favicon.svg",
        tag: "lume-reminder",
        data: { url: "/home" },
      });
    });
  } else {
    new Notification(title, { body, icon: "/logo.png" });
  }
}

export function trackActivity(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("lume_last_activity", Date.now().toString());
  }
}
