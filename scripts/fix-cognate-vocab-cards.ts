/**
 * The vocab flashcard step (shown before the quiz in every lesson) displays
 * `word` and `meaning` side by side. For genuine loanwords/cognates spelled
 * identically in the target and gloss language (e.g. "feedback" in English
 * lessons, "reserva"/"cliente"/"turno" in Spanish lessons — Portuguese and
 * Spanish share huge amounts of vocabulary), `meaning` ends up identical to
 * `word`, which reads as a broken/missing translation rather than the
 * accurate fact that it is one. This appends a short clarifying note so it
 * reads as a deliberate teaching moment instead.
 *
 * Run with: npx tsx scripts/fix-cognate-vocab-cards.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "..", "src", "data", "masterContent.json");

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}
interface RawStep {
  type: string;
  words?: VocabWord[];
  [key: string]: unknown;
}
interface RawLesson {
  id: string;
  language: "en" | "es" | "pt";
  steps: RawStep[];
}

const NOTE = " (mesma palavra em português)";

const raw = fs.readFileSync(FILE_PATH, "utf8");
const lessons: RawLesson[] = JSON.parse(raw);

let fixed = 0;
for (const lesson of lessons) {
  const vocabStep = lesson.steps.find((s) => s.type === "vocab");
  if (!vocabStep?.words) continue;
  for (const w of vocabStep.words) {
    if (
      w.word.trim().toLowerCase() === w.meaning.trim().toLowerCase() &&
      !w.meaning.endsWith(NOTE)
    ) {
      w.meaning = `${w.meaning}${NOTE}`;
      fixed++;
    }
  }
}

fs.writeFileSync(FILE_PATH, JSON.stringify(lessons, null, 2) + "\n", "utf8");

const LANGS = ["en", "es", "pt"] as const;
for (const lang of LANGS) {
  const perLang = lessons.filter((l) => l.language === lang);
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "data", `masterContent.${lang}.json`),
    JSON.stringify(perLang, null, 2) + "\n",
    "utf8",
  );
}

console.log(`Fixed: ${fixed} vocab cards`);
