import type {
  InterfaceLanguage,
  LessonTopic,
  QuizQuestion,
  SavedWord,
  TargetLanguage,
  VocabularyItem,
} from "./types";
import { generateQuizFromVocabulary } from "./quiz-engine";
import { resolveGlossLanguage } from "./vocabulary-engine";

const STORAGE_KEY = "lume-saved-words";

// Spaced-repetition intervals in days, indexed by `strength` (0 = new word).
const INTERVAL_DAYS = [1, 2, 4, 7, 14, 30, 60];

function readAll(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedWord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(words: SavedWord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
    // storage full/disabled — saved words just won't persist this session
  }
}

function nextReviewDate(strength: number): string {
  const days = INTERVAL_DAYS[Math.min(strength, INTERVAL_DAYS.length - 1)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getSavedWords(): SavedWord[] {
  return readAll();
}

export function saveWord(item: VocabularyItem): SavedWord {
  const words = readAll();
  const id = item.id;
  const existing = words.find((w) => w.id === id);
  if (existing) return existing;

  const saved: SavedWord = {
    id,
    term: item.term,
    translation: item.translation,
    targetLanguage: item.targetLanguage,
    topic: item.topic,
    strength: 0,
    nextReviewAt: nextReviewDate(0),
    mistakes: 0,
    correctAnswers: 0,
  };
  writeAll([...words, saved]);
  return saved;
}

export function isWordSaved(wordId: string): boolean {
  return readAll().some((w) => w.id === wordId);
}

export function markWordCorrect(wordId: string): void {
  const words = readAll();
  const updated = words.map((w) =>
    w.id === wordId
      ? {
          ...w,
          strength: w.strength + 1,
          correctAnswers: w.correctAnswers + 1,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: nextReviewDate(w.strength + 1),
        }
      : w,
  );
  writeAll(updated);
}

export function markWordWrong(wordId: string): void {
  const words = readAll();
  const updated = words.map((w) =>
    w.id === wordId
      ? {
          ...w,
          strength: Math.max(0, w.strength - 1),
          mistakes: w.mistakes + 1,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: nextReviewDate(Math.max(0, w.strength - 1)),
        }
      : w,
  );
  writeAll(updated);
}

export function getWordsDueForReview(targetLanguage?: TargetLanguage): SavedWord[] {
  const now = Date.now();
  return readAll().filter(
    (w) =>
      (!targetLanguage || w.targetLanguage === targetLanguage) &&
      new Date(w.nextReviewAt).getTime() <= now,
  );
}

/** Builds a quiz from the user's own saved/due words for spaced-repetition review. */
export function generateReviewQuiz(
  targetLanguage: TargetLanguage,
  topic: LessonTopic = "daily",
  interfaceLanguage: InterfaceLanguage = "pt",
): QuizQuestion[] {
  const due = getWordsDueForReview(targetLanguage);
  if (due.length < 2) return [];

  const vocabulary: VocabularyItem[] = due.map((w) => ({
    id: w.id,
    term: w.term,
    translation: w.translation,
    example: w.term, // reviews reuse the saved term; no fresh example stored
    difficulty: "beginner",
    topic: w.topic ?? topic,
    targetLanguage: w.targetLanguage,
    source: "manual",
  }));

  return generateQuizFromVocabulary(vocabulary, targetLanguage, {
    seed: "review",
    interfaceLanguage: resolveGlossLanguage(targetLanguage, interfaceLanguage),
  });
}
