/**
 * In-memory sliding-window rate limiter for server functions that call paid,
 * third-party APIs (Gemini, Google Cloud TTS). Keyed by client IP.
 *
 * Limitation: this state lives in the serverless instance's memory, so it
 * resets on cold start and is not shared across concurrent instances. It
 * stops rapid abuse within a warm instance, but is not a substitute for
 * restricting the underlying API key itself (API restrictions + quota in
 * Google Cloud Console / AI Studio).
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Bound memory usage: if the map grows past this, drop the oldest entries.
const MAX_TRACKED_KEYS = 5000;

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    if (buckets.size > MAX_TRACKED_KEYS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: windowMs - (now - bucket.windowStart) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
