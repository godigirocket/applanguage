/**
 * Datamuse API wrapper (https://api.datamuse.com) — English word relations.
 * Used only as supporting enrichment (related words/synonyms); never
 * required for the app to function. Cached, capped, fails to [].
 */
import { TTL, withCacheAndFallback } from "@/lib/language-content/cache";

export interface RelatedWord {
  word: string;
  score: number;
}

const MAX_RESULTS = 8;

async function datamuseQuery(param: string, value: string): Promise<RelatedWord[]> {
  const cacheKey = `datamuse:${param}:${value.toLowerCase()}`;
  return withCacheAndFallback<RelatedWord[]>({
    cacheKey,
    ttlMs: TTL.RELATED_WORDS_MS,
    source: "datamuse",
    fallback: [],
    fetcher: async () => {
      const res = await fetch(
        `https://api.datamuse.com/words?${param}=${encodeURIComponent(value)}&max=${MAX_RESULTS}`,
      );
      if (!res.ok) return [];
      const data = (await res.json()) as Array<{ word: string; score?: number }>;
      return data
        .filter((d) => /^[a-zA-Z\s-]+$/.test(d.word)) // filter out odd/noisy entries
        .slice(0, MAX_RESULTS)
        .map((d) => ({ word: d.word, score: d.score ?? 0 }));
    },
  });
}

export const getSynonyms = (word: string) => datamuseQuery("rel_syn", word);
export const getAntonyms = (word: string) => datamuseQuery("rel_ant", word);
export const getMeansLike = (word: string) => datamuseQuery("ml", word);
export const getWordsForTopic = (topic: string) => datamuseQuery("topics", topic);
