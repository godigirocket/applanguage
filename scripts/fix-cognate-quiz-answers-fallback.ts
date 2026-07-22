/**
 * Follow-up to fix-cognate-quiz-answers.ts: the 6 lessons where all 3 of the
 * lesson's own vocab words were cognates (no in-lesson alternative) still
 * have a translation-quiz question that repeats its own answer. Pull a
 * genuinely different, non-cognate word from the wider topic pool instead.
 *
 * Run with: npx tsx scripts/fix-cognate-quiz-answers-fallback.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getVocabularyForTopic } from "../src/lib/language-content/vocabulary-engine";
import type { LessonTopic, TargetLanguage } from "../src/lib/language-content/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "..", "src", "data", "masterContent.json");

const TRANSLATION_QUIZ_PROMPT: Record<TargetLanguage, (term: string) => string> = {
  en: (term) => `What is the correct translation for "${term}"?`,
  es: (term) => `¿Cuál es la traducción correcta para "${term}"?`,
  pt: (term) => `Qual é a tradução correta para "${term}"?`,
};

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface RawStep {
  type: string;
  [key: string]: unknown;
}
interface RawLesson {
  id: string;
  language: TargetLanguage;
  level: string;
  topic?: LessonTopic;
  steps: RawStep[];
}

const isCognate = (word: string, meaning: string) =>
  word.trim().toLowerCase() === meaning.trim().toLowerCase();
const LEVEL_TO_DIFFICULTY: Record<string, "beginner" | "intermediate" | "advanced"> = {
  A1: "beginner",
  A2: "beginner",
  B1: "intermediate",
  B2: "intermediate",
  C1: "advanced",
  C2: "advanced",
};

const raw = fs.readFileSync(FILE_PATH, "utf8");
const lessons: RawLesson[] = JSON.parse(raw);

let fixed = 0;

for (const lesson of lessons) {
  if (!lesson.topic) continue;
  const quizStep = lesson.steps.find((s) => s.type === "quiz") as
    | { question?: string; options?: string[]; correct?: number }
    | undefined;
  if (!quizStep?.options?.length || typeof quizStep.correct !== "number") continue;

  const correctAnswer = quizStep.options[quizStep.correct];
  const quotedTerm = (quizStep.question?.match(/"([^"]+)"/) || [])[1];
  if (!quotedTerm || !isCognate(quotedTerm, correctAnswer)) continue;

  const glossLanguage: TargetLanguage = lesson.language === "pt" ? "en" : "pt";
  const difficulty = LEVEL_TO_DIFFICULTY[lesson.level] ?? "beginner";

  const pool = getVocabularyForTopic(lesson.topic, lesson.language, {
    difficulty,
    interfaceLanguage: glossLanguage,
    count: 20,
    seed: `${lesson.id}-cognatefallback`,
  });
  const replacement = pool.find((v) => !isCognate(v.term, v.translation));
  if (!replacement) continue; // whole topic bank is cognates for this pair — leave as-is

  const distractors = pool
    .filter((v) => v.term !== replacement.term)
    .map((v) => v.translation)
    .filter(
      (t, i, arr) =>
        t.toLowerCase() !== replacement.translation.toLowerCase() && arr.indexOf(t) === i,
    )
    .slice(0, 3);
  const options = shuffleWithSeed(
    [replacement.translation, ...distractors],
    hashString(lesson.id + "-cognatefallback-opts"),
  );
  quizStep.question = TRANSLATION_QUIZ_PROMPT[glossLanguage](replacement.term);
  quizStep.options = options;
  quizStep.correct = options.indexOf(replacement.translation);
  fixed++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(lessons, null, 2) + "\n", "utf8");

const LANGS: TargetLanguage[] = ["en", "es", "pt"];
for (const lang of LANGS) {
  const perLang = lessons.filter((l) => l.language === lang);
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "data", `masterContent.${lang}.json`),
    JSON.stringify(perLang, null, 2) + "\n",
    "utf8",
  );
}

console.log(`Fixed: ${fixed}`);
