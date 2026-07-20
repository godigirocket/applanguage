/**
 * Tatoeba API wrapper (https://api.tatoeba.org) — real, native-written example
 * sentences per language. Optional enrichment on top of the app's own curated
 * examples; never blocks lesson content if it fails or the shape changes.
 */
import type { TargetLanguage } from "@/lib/language-content/types";
import { TTL, withCacheAndFallback } from "@/lib/language-content/cache";

export interface TatoebaSentence {
  text: string;
  translation?: string;
}

// Tatoeba uses ISO 639-3 language codes.
const LANG_CODE: Record<TargetLanguage, string> = { en: "eng", es: "spa", pt: "por" };

const MAX_LEN = 90;
const MAX_RESULTS = 5;

function isReasonableSentence(text: string): boolean {
  return typeof text === "string" && text.length > 0 && text.length <= MAX_LEN;
}

export async function fetchTatoebaSentences(
  term: string,
  targetLanguage: TargetLanguage,
): Promise<TatoebaSentence[]> {
  const normalized = term.trim();
  if (!normalized) return [];

  const cacheKey = `tatoeba:${targetLanguage}:${normalized.toLowerCase()}`;
  return withCacheAndFallback<TatoebaSentence[]>({
    cacheKey,
    ttlMs: TTL.TATOEBA_MS,
    source: "tatoeba",
    fallback: [],
    fetcher: async () => {
      const lang = LANG_CODE[targetLanguage];
      const res = await fetch(
        `https://api.tatoeba.org/unstable/sentences?lang=${lang}&q=${encodeURIComponent(normalized)}&limit=${MAX_RESULTS}`,
      );
      if (!res.ok) return [];
      const data = (await res.json()) as { data?: Array<{ text?: string; translations?: unknown[][] }> };
      const items = data.data ?? [];

      const results: TatoebaSentence[] = [];
      for (const item of items) {
        if (!item.text || !isReasonableSentence(item.text)) continue;
        const translationGroup = Array.isArray(item.translations) ? item.translations.flat() : [];
        const firstTranslation = (translationGroup[0] as { text?: string } | undefined)?.text;
        results.push({ text: item.text, translation: firstTranslation });
        if (results.length >= MAX_RESULTS) break;
      }
      return results;
    },
  });
}
