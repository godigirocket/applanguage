/**
 * Free Dictionary API wrapper (https://dictionaryapi.dev) — English only.
 * Definitions/phonetics/audio for English words, cached with a graceful
 * fallback to `null` on any failure (missing word, network error, timeout).
 */
import { TTL, withCacheAndFallback } from "@/lib/language-content/cache";

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
}

interface RawDictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Array<{ text?: string; audio?: string }>;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string; example?: string }>;
  }>;
}

export async function fetchDictionaryEntry(word: string): Promise<DictionaryResult | null> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return null;

  return withCacheAndFallback<DictionaryResult | null>({
    cacheKey: `dictionaryapi:en:${normalized}`,
    ttlMs: TTL.DICTIONARY_MS,
    source: "dictionaryapi",
    fallback: null,
    fetcher: async () => {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`,
      );
      if (!res.ok) return null;
      const data = (await res.json()) as RawDictionaryEntry[];
      const entry = data[0];
      if (!entry) return null;

      const audio = entry.phonetics?.find((p) => p.audio)?.audio;
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0];

      return {
        word: entry.word,
        phonetic: entry.phonetic ?? entry.phonetics?.[0]?.text,
        audioUrl: audio,
        partOfSpeech: meaning?.partOfSpeech,
        definition: definition?.definition,
        example: definition?.example,
      };
    },
  });
}
