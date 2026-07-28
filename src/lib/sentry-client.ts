// Browser-side error monitoring. No-op until VITE_SENTRY_DSN is configured —
// same "optional service, graceful no-op" pattern as the TTS/translation
// integrations elsewhere in this app, so the app works identically whether
// or not a Sentry project has been set up.
import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

// __root.tsx (which imports this as a side effect) renders during SSR too —
// @sentry/react's init is browser-only, so skip it entirely on the server.
if (dsn && typeof window !== "undefined") {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
  });
}

export { Sentry };
