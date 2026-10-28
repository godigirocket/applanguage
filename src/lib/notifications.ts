import { accountKey } from "./account-storage";
/** Activity only. Permission and subscriptions are controlled in Settings. */
export function trackActivity() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(accountKey("lume_last_activity"), String(Date.now()));
    if (localStorage.getItem(accountKey("lume_push_enabled")) === "true" && navigator.onLine)
      void import("./push-client").then((module) => module.recordPushActivity()).catch(() => {});
  } catch {
    /* Browser storage may be blocked. */
  }
}
