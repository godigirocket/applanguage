import { generateVocabQuiz, generateGrammarQuiz, generateMixedQuiz } from "@/data/quizEngine";
import { getVocabularyForTopic } from "./vocabulary-engine";
import {
  generateQuizFromVocabulary,
  dedupeQuestions,
  avoidRecentlySeenContent,
} from "./quiz-engine";
import { generateReviewQuiz } from "./saved-words";
import { ALL_TOPICS } from "./topics";
import type { LessonTopic } from "./types";

// Shared real-content question builder used by every quiz surface in the app
// (quiz-play/$type, quiz/$mode game modes). Centralizing this means every
// game mode gets genuine, language-correct, non-repeating content from the
// same engine instead of each screen inventing its own (previously: a static
// English/Portuguese-only question bank with no Spanish support at all).

export type UnifiedQuestion =
  | {
      id: string;
      kind: "choice";
      prompt: string;
      options: string[];
      correctAnswer: string;
      explanation?: string;
    }
  | {
      id: string;
      kind: "truefalse";
      prompt: string;
      options: string[];
      correctAnswer: string;
      explanation?: string;
    }
  | { id: string; kind: "listening"; audioText: string; options: string[]; correctAnswer: string }
  | { id: string; kind: "pronunciation"; targetPhrase: string };

export const ROTATION_TOPICS: LessonTopic[] = [
  "daily",
  "travel",
  "food",
  "business",
  "sports",
  "fitness",
  "health",
  "technology",
  "family",
  "work",
  "shopping",
  "culture",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

// Deterministic per day+type so the topic mix feels fresh across days without
// being jarring/random within a single play-through.
export function pickRotatingTopic(seedKey: string): LessonTopic {
  const day = new Date().toISOString().slice(0, 10);
  const idx = Math.abs(hashString(day + seedKey)) % ROTATION_TOPICS.length;
  return ROTATION_TOPICS[idx];
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  let a = seed;
  const rand = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildListeningQuestions(
  topic: LessonTopic,
  targetLanguage: "en" | "es" | "pt",
  count: number,
): UnifiedQuestion[] {
  const items = getVocabularyForTopic(topic, targetLanguage, {
    count: count * 2,
    seed: `listening-${topic}`,
  });
  return items.slice(0, count).map((item, i) => {
    const distractors = items
      .filter((v) => v.id !== item.id)
      .slice(0, 3)
      .map((v) => v.term);
    const options = seededShuffle([item.term, ...distractors], hashString(item.id) + i);
    return {
      id: `listening-${item.id}`,
      kind: "listening" as const,
      audioText: item.term,
      options,
      correctAnswer: item.term,
    };
  });
}

export function buildPronunciationQuestions(
  topic: LessonTopic,
  targetLanguage: "en" | "es" | "pt",
  count: number,
): UnifiedQuestion[] {
  const items = getVocabularyForTopic(topic, targetLanguage, {
    count,
    seed: `pronunciation-${topic}`,
  });
  return items.map((item) => ({
    id: `pronunciation-${item.id}`,
    kind: "pronunciation" as const,
    targetPhrase: item.example,
  }));
}

export function buildEngineChoiceQuestions(
  topic: LessonTopic,
  targetLanguage: "en" | "es" | "pt",
  count: number,
  seed: string,
): UnifiedQuestion[] {
  const vocabulary = getVocabularyForTopic(topic, targetLanguage, { count, seed });
  const questions = dedupeQuestions(
    generateQuizFromVocabulary(vocabulary, targetLanguage, { seed }),
  );
  return questions.map((q) => ({
    id: q.id,
    kind: "choice" as const,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
}

export function buildQuestionsForType(
  type: string,
  targetLanguage: "en" | "es" | "pt",
  recentlySeenIds: Set<string>,
  questionCount = 6,
): UnifiedQuestion[] {
  const QUESTION_COUNT = questionCount;

  if ((ALL_TOPICS as string[]).includes(type)) {
    const topic = type as LessonTopic;
    const fresh = avoidRecentlySeenContent(
      buildEngineChoiceQuestions(topic, targetLanguage, QUESTION_COUNT * 2, topic),
      recentlySeenIds,
    );
    return fresh.slice(0, QUESTION_COUNT);
  }

  if (type === "listening") {
    const topic = pickRotatingTopic("listening");
    return buildListeningQuestions(topic, targetLanguage, QUESTION_COUNT);
  }

  if (type === "pronunciation") {
    const topic = pickRotatingTopic("pronunciation");
    return buildPronunciationQuestions(topic, targetLanguage, 5);
  }

  if (type === "review") {
    const reviewQuestions = generateReviewQuiz(targetLanguage);
    return reviewQuestions.map((q) => ({
      id: q.id,
      kind: "choice" as const,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  }

  // "errors" (spot the mistake) reuses the same true/false grammar-rule
  // format as "grammar" — both are grammar-correctness checks at heart.
  if (type === "grammar" || type === "errors") {
    return generateGrammarQuiz(targetLanguage, "all", QUESTION_COUNT).map((q) => ({
      id: q.id,
      kind: "truefalse" as const,
      prompt: q.prompt,
      options: q.options ?? [],
      correctAnswer: q.correctAnswer as string,
      explanation: q.explanation,
    }));
  }

  if (type === "mixed") {
    return generateMixedQuiz(targetLanguage, "all", QUESTION_COUNT).map((q) =>
      q.type === "true_false"
        ? {
            id: q.id,
            kind: "truefalse" as const,
            prompt: q.prompt,
            options: q.options ?? [],
            correctAnswer: q.correctAnswer as string,
            explanation: q.explanation,
          }
        : {
            id: q.id,
            kind: "choice" as const,
            prompt: q.prompt,
            options: q.options ?? [],
            correctAnswer: q.correctAnswer as string,
            explanation: q.explanation,
          },
    );
  }

  // Everything else (quick/race/daily/survival/verbs/slang/prepositions/
  // synonyms/dialogue/words/idioms/vocab/translation/unrecognized) rotates
  // across real topics instead of a fixed small pool.
  const topic = pickRotatingTopic(type);
  const fresh = avoidRecentlySeenContent(
    buildEngineChoiceQuestions(topic, targetLanguage, QUESTION_COUNT * 2, `${type}-${topic}`),
    recentlySeenIds,
  );
  if (fresh.length > 0) return fresh.slice(0, QUESTION_COUNT);

  // Last-resort fallback: the legacy vocabularyExpanded-based generator, in
  // case a target language somehow has no engine content at all.
  return generateVocabQuiz(targetLanguage, "all", QUESTION_COUNT).map((q) => ({
    id: q.id,
    kind: "choice" as const,
    prompt: q.prompt,
    options: q.options ?? [],
    correctAnswer: q.correctAnswer as string,
    explanation: q.explanation,
  }));
}
