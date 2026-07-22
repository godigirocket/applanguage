/**
 * One-off patch: some vocabulary is a cognate/loanword — identical spelling
 * in the target and gloss language (e.g. "backup", "cliente", "reserva").
 * The masterContent generator's translation-quiz step asks `Qual é a
 * tradução correta para "X"?` and lists X itself as the (only sensible)
 * correct option, which reads as the question giving away its own answer.
 * This patch finds those lessons and, where the lesson's own 3-word vocab
 * list has a non-cognate alternative, rebuilds that quiz step (and the
 * listening step, same issue) around the alternative word instead.
 *
 * Run with: npx tsx scripts/fix-cognate-quiz-answers.ts
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

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
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

let quizFixed = 0;
let listeningFixed = 0;
let skippedNoAlternative = 0;

for (const lesson of lessons) {
  if (!lesson.topic) continue;
  const vocabStep = lesson.steps.find((s) => s.type === "vocab") as
    | { words?: VocabWord[] }
    | undefined;
  const words = vocabStep?.words;
  if (!words || words.length < 2) continue;

  const glossLanguage: TargetLanguage = lesson.language === "pt" ? "en" : "pt";
  const difficulty = LEVEL_TO_DIFFICULTY[lesson.level] ?? "beginner";

  // --- Translation quiz step (first "quiz" step) ---
  const quizStep = lesson.steps.find((s) => s.type === "quiz") as
    | { question?: string; options?: string[]; correct?: number }
    | undefined;
  if (quizStep?.options?.length && typeof quizStep.correct === "number") {
    const correctAnswer = quizStep.options[quizStep.correct];
    const usedTerm = quizStep.question?.match(/"([^"]+)"/)?.[1];
    const usedWord = words.find((w) => w.word === usedTerm);
    if (usedWord && isCognate(usedWord.word, correctAnswer)) {
      const alternative = words.find((w) => w !== usedWord && !isCognate(w.word, w.meaning));
      if (alternative) {
        const extra = getVocabularyForTopic(lesson.topic, lesson.language, {
          difficulty,
          interfaceLanguage: glossLanguage,
          count: 6,
          seed: `${lesson.id}-cognatefix`,
        });
        const distractors = extra
          .filter((v) => v.term.toLowerCase() !== alternative.word.toLowerCase())
          .map((v) => v.translation)
          .filter(
            (t, i, arr) =>
              t.toLowerCase() !== alternative.meaning.toLowerCase() && arr.indexOf(t) === i,
          )
          .slice(0, 3);
        const options = shuffleWithSeed(
          [alternative.meaning, ...distractors],
          hashString(lesson.id + "-cognatefix-opts"),
        );
        quizStep.question = TRANSLATION_QUIZ_PROMPT[glossLanguage](alternative.word);
        quizStep.options = options;
        quizStep.correct = options.indexOf(alternative.meaning);
        quizFixed++;
      } else {
        skippedNoAlternative++;
      }
    }
  }

  // --- Listening step ---
  const listeningStep = lesson.steps.find((s) => s.type === "listening") as
    | { audioText?: string; options?: string[]; correct?: number }
    | undefined;
  if (listeningStep?.options?.length && typeof listeningStep.correct === "number") {
    const correctTerm = listeningStep.options[listeningStep.correct];
    const usedWord = words.find((w) => w.word === correctTerm);
    if (usedWord && isCognate(usedWord.word, usedWord.meaning)) {
      const alternative = words.find((w) => w !== usedWord && !isCognate(w.word, w.meaning));
      if (alternative) {
        const distractorWords = words.filter((w) => w !== alternative).map((w) => w.word);
        const extra = getVocabularyForTopic(lesson.topic, lesson.language, {
          difficulty,
          count: 6,
          seed: `${lesson.id}-cognatefix-listen`,
        }).find((v) => v.term !== alternative.word && !distractorWords.includes(v.term));
        const options = shuffleWithSeed(
          [alternative.word, ...distractorWords, extra?.term]
            .filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i)
            .slice(0, 4),
          hashString(lesson.id + "-cognatefix-listen-opts"),
        );
        listeningStep.audioText = alternative.example;
        listeningStep.options = options;
        listeningStep.correct = options.indexOf(alternative.word);
        listeningFixed++;
      }
    }
  }
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

console.log(`Quiz steps fixed: ${quizFixed}`);
console.log(`Listening steps fixed: ${listeningFixed}`);
console.log(`Skipped (all 3 vocab words were cognates, no alternative): ${skippedNoAlternative}`);
