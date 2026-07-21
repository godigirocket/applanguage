/**
 * One-off migration: masterContent.json's 630 lessons are 5 title templates x
 * 3 languages x 42 "volumes" each. Every volume of a given title used the
 * *exact same* 3 vocab words, and those words had nothing to do with the
 * lesson's actual title (e.g. "At the Airport" taught "Resilient, Commute,
 * Briefcase" - generic office vocabulary, not airport vocabulary).
 *
 * This script replaces each lesson's `vocab`, `quiz` (the vocab-translation
 * one right after it) and `listening` steps with real, topic-matched words
 * drawn from src/lib/language-content, varied per volume via a seeded shuffle
 * so repeats of the same title show different words instead of identical
 * content every time.
 *
 * Run with: npx tsx scripts/regenerate-mastercontent-vocab.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getVocabularyForTopic } from "../src/lib/language-content/vocabulary-engine";
import type { LessonTopic, TargetLanguage } from "../src/lib/language-content/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "..", "src", "data", "masterContent.json");

const TOPIC_MAP: Record<string, LessonTopic> = {
  "en|At the Airport": "travel",
  "en|Ordering Coffee": "food",
  "en|Job Interview Prep": "business",
  "en|Digital Communication": "technology",
  "en|Feelings & Health": "health",
  "es|En el Aeropuerto": "travel",
  "es|Pidiendo un Café": "food",
  "es|Entrevista de Trabajo": "business",
  "es|Vida Digital": "technology",
  "es|Salud y Sentimientos": "health",
  "pt|No Aeroporto": "travel",
  "pt|Pedindo um Café": "food",
  "pt|Entrevista de Emprego": "business",
  "pt|Comunicação Digital": "technology",
  "pt|Saúde e Sentimentos": "health",
};

const TRANSLATION_QUIZ_PROMPT: Record<TargetLanguage, (term: string) => string> = {
  en: (term) => `What is the correct translation for "${term}"?`,
  es: (term) => `¿Cuál es la traducción correcta para "${term}"?`,
  pt: (term) => `Qual é a tradução correta para "${term}"?`,
};

const LEVEL_TO_DIFFICULTY: Record<string, "beginner" | "intermediate" | "advanced"> = {
  A1: "beginner",
  A2: "beginner",
  B1: "intermediate",
  B2: "intermediate",
  C1: "advanced",
  C2: "advanced",
};

interface RawStep {
  type: string;
  [key: string]: unknown;
}

interface RawLesson {
  id: string;
  title: string;
  language: TargetLanguage;
  level: string;
  category: string;
  steps: RawStep[];
}

function baseTitle(title: string): string {
  return title.replace(/\s*-\s*Volume(n)?\s*\d+$/i, "").trim();
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
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

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

const raw = fs.readFileSync(FILE_PATH, "utf8");
const lessons: RawLesson[] = JSON.parse(raw);

let regenerated = 0;
let skipped = 0;

for (const lesson of lessons) {
  const key = `${lesson.language}|${baseTitle(lesson.title)}`;
  const topic = TOPIC_MAP[key];
  if (!topic) {
    skipped++;
    continue;
  }

  const difficulty = LEVEL_TO_DIFFICULTY[lesson.level] ?? "beginner";
  // The original data always glossed a word's meaning in "the other" language:
  // English gloss for Portuguese-target lessons, Portuguese gloss otherwise
  // (this app's userbase is overwhelmingly PT<->EN/ES). Keep that convention
  // instead of showing a Portuguese word's "meaning" in Portuguese again.
  const glossLanguage: TargetLanguage = lesson.language === "pt" ? "en" : "pt";

  const vocabItems = getVocabularyForTopic(topic, lesson.language, {
    difficulty,
    interfaceLanguage: glossLanguage,
    count: 3,
    seed: lesson.id,
  });
  if (vocabItems.length < 3) {
    skipped++;
    continue;
  }

  // Replace the vocab step.
  const vocabStep = lesson.steps.find((s) => s.type === "vocab");
  if (vocabStep) {
    vocabStep.words = vocabItems.map((v) => ({
      word: v.term,
      meaning: v.translation,
      example: v.example,
    }));
  }

  // Replace the first quiz step (the vocab-translation one) — identified as
  // the quiz step immediately following the vocab step, not any later
  // grammar/idiom quiz elsewhere in the lesson.
  const vocabIdx = lesson.steps.findIndex((s) => s.type === "vocab");
  const quizStep =
    vocabIdx >= 0 ? lesson.steps.slice(vocabIdx + 1).find((s) => s.type === "quiz") : undefined;
  if (quizStep) {
    const target = vocabItems[0];
    const distractors = vocabItems.slice(1).map((v) => v.translation);
    // Pull one more distractor from a neighboring seed so we have 4 options total.
    const extra = getVocabularyForTopic(topic, lesson.language, {
      difficulty,
      interfaceLanguage: glossLanguage,
      count: 4,
      seed: `${lesson.id}-quiz`,
    }).find((v) => v.term !== target.term && !distractors.includes(v.translation));
    const options = shuffleWithSeed(
      [target.translation, ...distractors, extra?.translation]
        .filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i)
        .slice(0, 4),
      hashString(lesson.id),
    );
    quizStep.question = TRANSLATION_QUIZ_PROMPT[glossLanguage](target.term);
    quizStep.options = options;
    quizStep.correct = options.indexOf(target.translation);
  }

  // Fix the drag-and-drop step: it used a fixed generic filler pool
  // ("apple"/"house"/"libro") for distractor tokens regardless of the
  // sentence's actual language, so every single lesson showed literal
  // English/Spanish words mixed into e.g. a Portuguese sentence-ordering
  // exercise. Replace distractors with real single-word terms in the
  // correct language, drawn from this lesson's topic.
  const dragdropStep = lesson.steps.find((s) => s.type === "dragdrop") as
    | { tokens?: string[]; answerTokens?: string[] }
    | undefined;
  if (dragdropStep?.answerTokens && dragdropStep.tokens) {
    const answerSet = new Set(dragdropStep.answerTokens.map((w) => w.toLowerCase()));
    const distractorPool = getVocabularyForTopic(topic, lesson.language, {
      difficulty,
      count: 10,
      seed: `${lesson.id}-dragdrop`,
    })
      .flatMap((v) => v.term.split(/\s+/))
      .filter((w) => !answerSet.has(w.toLowerCase()));
    const neededDistractors = dragdropStep.tokens.length - dragdropStep.answerTokens.length;
    const realDistractors = shuffleWithSeed(
      [...new Set(distractorPool)],
      hashString(lesson.id + "-dd"),
    ).slice(0, Math.max(0, neededDistractors));
    dragdropStep.tokens = shuffleWithSeed(
      [...dragdropStep.answerTokens, ...realDistractors],
      hashString(lesson.id + "-dd-shuffle"),
    );
  }

  // Replace the listening step, reusing the second vocab word so audioText
  // matches an example the learner already saw in this same lesson.
  const listeningStep = lesson.steps.find((s) => s.type === "listening");
  if (listeningStep && vocabItems[1]) {
    const target = vocabItems[1];
    const distractorWords = [vocabItems[0].term, vocabItems[2]?.term].filter(Boolean) as string[];
    const extra = getVocabularyForTopic(topic, lesson.language, {
      difficulty,
      interfaceLanguage: glossLanguage,
      count: 4,
      seed: `${lesson.id}-listening`,
    }).find((v) => v.term !== target.term && !distractorWords.includes(v.term));
    const options = shuffleWithSeed(
      [target.term, ...distractorWords, extra?.term]
        .filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i)
        .slice(0, 4),
      hashString(lesson.id + "-listen"),
    );
    listeningStep.audioText = target.example;
    listeningStep.options = options;
    listeningStep.correct = options.indexOf(target.term);
  }

  regenerated++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(lessons, null, 2) + "\n", "utf8");
console.log(`Regenerated ${regenerated} lessons, skipped ${skipped} (no topic mapping).`);
