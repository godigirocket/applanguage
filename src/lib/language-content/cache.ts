/**
 * Generic TTL cache for language-content/language-apis lookups.
 * localStorage-backed with an in-memory fallback (SSR / storage-full safe).
 */

interface ApiCacheEntry<T> {
  key: string;
  data: T;
  source: string;
  createdAt: number;
  expiresAt: number;
}

const STORAGE_PREFIX = "lume-api-cache:";
const memoryFallback = new Map<string, ApiCacheEntry<unknown>>();

function readEntry<T>(key: string): ApiCacheEntry<T> | null {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw) return JSON.parse(raw) as ApiCacheEntry<T>;
    } catch {
      // fall through to memory
    }
  }
  return (memoryFallback.get(key) as ApiCacheEntry<T> | undefined) ?? null;
}

function writeEntry<T>(key: string, entry: ApiCacheEntry<T>) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
      return;
    } catch {
      // storage full / disabled -> fall through to memory
    }
  }
  memoryFallback.set(key, entry);
}

export function getCached<T>(key: string): T | null {
  const entry = readEntry<T>(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) return null;
  return entry.data;
}

export function setCached<T>(key: string, data: T, source: string, ttlMs: number): void {
  const now = Date.now();
  writeEntry(key, { key, data, source, createdAt: now, expiresAt: now + ttlMs });
}

export const TTL = {
  DICTIONARY_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
  TATOEBA_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  TRANSLATION_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
  GRAMMAR_CHECK_MS: 24 * 60 * 60 * 1000, // 1 day
  RELATED_WORDS_MS: 15 * 24 * 60 * 60 * 1000, // 15 days
};

/**
 * Wraps an async lookup with cache-first, timeout, and fallback behavior.
 * Never throws: on timeout/error it resolves with `fallback`.
 */
export async function withCacheAndFallback<T>(opts: {
  cacheKey: string;
  ttlMs: number;
  source: string;
  timeoutMs?: number;
  fallback: T;
  fetcher: () => Promise<T>;
}): Promise<T> {
  const { cacheKey, ttlMs, source, timeoutMs = 4000, fallback, fetcher } = opts;

  const cached = getCached<T>(cacheKey);
  if (cached !== null) return cached;

  try {
    const result = await Promise.race([
      fetcher(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeoutMs),
      ),
    ]);
    setCached(cacheKey, result, source, ttlMs);
    return result;
  } catch {
    return fallback;
  }
}
