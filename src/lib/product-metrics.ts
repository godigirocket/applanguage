import { track } from "@vercel/analytics";

type Events = {
  landing_signup: { placement: "hero" | "demo" | "offer" };
  landing_pricing: { placement: "offer" };
  landing_demo_answer: { course: "en" | "es" | "pt"; result: "correct" | "retry" };
  signup_accepted: { course: "en" | "es" | "pt" | "none" };
  onboarding_completed: { course: "en" | "es" | "pt"; source: "demo" | "direct" };
  lesson_start: { device: "mobile" | "desktop" };
  lesson_complete: { device: "mobile" | "desktop" };
  content_paint: { screen: "landing" | "lesson"; device: "mobile" | "desktop"; ms: number };
};

export function deviceClass() {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

export function productEvent<K extends keyof Events>(name: K, values: Events[K]) {
  try {
    track(name, values);
  } catch {
    // Analytics is optional and must not interrupt practice or sign-up.
  }
}

/** Observe direct navigations only. Client route changes are not LCP measurements. */
export function observeContentPaint() {
  const path = window.location.pathname;
  const screen = path === "/" ? "landing" : path.startsWith("/lesson/") ? "lesson" : null;
  if (
    !screen ||
    !window.PerformanceObserver?.supportedEntryTypes?.includes("largest-contentful-paint")
  )
    return;
  let latest = 0;
  let reported = false;
  const observer = new PerformanceObserver((entries) => {
    latest = entries.getEntries().at(-1)?.startTime ?? latest;
  });
  observer.observe({ type: "largest-contentful-paint", buffered: true });
  const report = () => {
    latest = observer.takeRecords().at(-1)?.startTime ?? latest;
    if (!reported && latest > 0 && latest <= 60000) {
      reported = true;
      productEvent("content_paint", { screen, device: deviceClass(), ms: Math.round(latest) });
    }
    observer.disconnect();
  };
  const onVisibility = () => {
    if (document.visibilityState === "hidden") report();
  };
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", report);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", report);
  };
}
