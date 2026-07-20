/**
 * LanguageTool wrapper (https://api.languagetool.org/v2/check) — grammar/
 * writing correction. Routed through a server function so debounce/rate
 * limiting is consistent and the public endpoint isn't hit straight from
 * every keystroke. Never blocks the lesson: on failure it returns
 * `available: false` and the UI shows "correção indisponível agora".
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { TTL, getCached, setCached } from "@/lib/language-content/cache";
import { checkRateLimit } from "@/lib/rate-limit";

const CheckInput = z.object({
  text: z.string().min(1).max(1000),
  language: z.enum(["en-US", "es", "pt-BR"]),
});

export interface GrammarSuggestion {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: string[];
}

const RATE_LIMIT = { limit: 15, windowMs: 60 * 1000 }; // 15 checks / min per IP

export const checkGrammar = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CheckInput.parse(data))
  .handler(async ({ data }): Promise<{ available: boolean; suggestions: GrammarSuggestion[] }> => {
    const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
    const { allowed } = checkRateLimit(`languagetool:${ip}`, RATE_LIMIT);
    if (!allowed) return { available: false, suggestions: [] };

    const cacheKey = `languagetool:${data.language}:${data.text}`;
    const cached = getCached<GrammarSuggestion[]>(cacheKey);
    if (cached !== null) return { available: true, suggestions: cached };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: controller.signal,
        body: new URLSearchParams({ text: data.text, language: data.language }),
      });
      clearTimeout(timeout);

      if (!res.ok) return { available: false, suggestions: [] };

      const json = (await res.json()) as {
        matches?: Array<{
          message?: string;
          shortMessage?: string;
          offset?: number;
          length?: number;
          replacements?: Array<{ value?: string }>;
        }>;
      };

      const suggestions: GrammarSuggestion[] = (json.matches ?? []).map((m) => ({
        message: m.message ?? "",
        shortMessage: m.shortMessage,
        offset: m.offset ?? 0,
        length: m.length ?? 0,
        replacements: (m.replacements ?? []).map((r) => r.value ?? "").filter(Boolean),
      }));

      setCached(cacheKey, suggestions, "languagetool", TTL.GRAMMAR_CHECK_MS);
      return { available: true, suggestions };
    } catch {
      return { available: false, suggestions: [] };
    }
  });
