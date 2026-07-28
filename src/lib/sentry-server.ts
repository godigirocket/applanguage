// Server-side (SSR / Vercel serverless) error monitoring. No-op until
// SENTRY_DSN is configured — same graceful-degradation pattern as
// sentry-client.ts.
import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.2,
  });
}

export { Sentry };
