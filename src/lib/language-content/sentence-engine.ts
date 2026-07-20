import type { LessonSentence, LessonTopic, TargetLanguage, VocabularyItem } from "./types";
import { fetchTatoebaSentences } from "@/lib/language-apis/tatoebaApi";

/**
 * Returns example sentences for a lesson. Always includes the vocabulary's
 * own hand-written examples (guaranteed topic-correct); optionally enriches
 * with real Tatoeba sentences containing the term, when available.
 */
export async function getExampleSentences(
  term: string,
  targetLanguage: TargetLanguage,
  topic: LessonTopic,
): Promise<LessonSentence[]> {
  const extra = await fetchTatoebaSentences(term, targetLanguage);
  return extra.map((s, i) => ({
    id: `sentence-${topic}-${targetLanguage}-${term}-${i}`,
    text: s.text,
    translation: s.translation,
    targetLanguage,
    topic,
    source: "tatoeba" as const,
  }));
}

/** Sentences straight from the lesson's own curated vocabulary (no network call, always available). */
export function getVocabularySentences(vocabulary: VocabularyItem[]): LessonSentence[] {
  return vocabulary.map((v, i) => ({
    id: `sentence-${v.id}-${i}`,
    text: v.example,
    translation: v.exampleTranslation,
    targetLanguage: v.targetLanguage,
    topic: v.topic,
    source: "manual" as const,
  }));
}
