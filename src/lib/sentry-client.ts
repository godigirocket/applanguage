// Keep monitoring off the initial rendering path. Errors wait for SDK
// initialization; rendering and navigation do not.
const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
let monitoring: Promise<typeof import("@sentry/react")> | undefined;
function loadMonitoring() {
  if (!dsn || typeof window === "undefined") return;
  monitoring ??= import("@sentry/react").then((sdk) => {
    sdk.init({ dsn, environment: import.meta.env.MODE, tracesSampleRate: 0.2 });
    return sdk;
  });
  return monitoring;
}
export function initializeMonitoring() {
  void loadMonitoring()?.catch(() => {});
}
export function captureClientException(error: Error) {
  void loadMonitoring()
    ?.then((sdk) => sdk.captureException(error))
    .catch(() => {});
}
