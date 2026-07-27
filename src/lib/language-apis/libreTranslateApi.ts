/**
 * LibreTranslate wrapper. Always runs server-side (TanStack Start server
 * function) regardless of whether an API key is configured, so a key never
 * reaches the client bundle. If VITE_LIBRETRANSLATE_URL isn't configured,
 * translation is simply unavailable and callers get the original text back —
 * the app must never depend on this to function.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { TTL, getCached, setCached } from "@/lib/language-content/cache";
import { checkRateLimit } from "@/lib/rate-limit";

const TranslateInput = z.object({
  text: z.string().min(1).max(500),
  source: z.enum(["en", "es", "pt"]),
  target: z.enum(["en", "es", "pt"]),
});

const RATE_LIMIT = { limit: 30, windowMs: 60 * 1000 }; // 30 translations / min per IP

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TranslateInput.parse(data))
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
    const { allowed } = checkRateLimit(`libretranslate:${ip}`, RATE_LIMIT);
    if (!allowed) return { translated: data.text, available: false };

    const baseUrl = process.env.VITE_LIBRETRANSLATE_URL;
    if (!baseUrl) {
      return { translated: data.text, available: false };
    }

    const cacheKey = `libretranslate:${data.source}:${data.target}:${data.text}`;
    const cached = getCached<string>(cacheKey);
    if (cached !== null) return { translated: cached, available: true };

    try {
      const apiKey = process.env.LIBRETRANSLATE_API_KEY;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          q: data.text,
          source: data.source,
          target: data.target,
          format: "text",
          ...(apiKey ? { api_key: apiKey } : {}),
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) return { translated: data.text, available: false };
      const json = (await res.json()) as { translatedText?: string };
      if (!json.translatedText) return { translated: data.text, available: false };

      setCached(cacheKey, json.translatedText, "libretranslate", TTL.TRANSLATION_MS);
      return { translated: json.translatedText, available: true };
    } catch {
      return { translated: data.text, available: false };
    }
  });
