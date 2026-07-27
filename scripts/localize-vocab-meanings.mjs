/**
 * Every lesson's vocab step has a `meaning` field, but it was authored as a
 * single hardcoded gloss (Portuguese for en/es-target lessons, English for
 * pt-target lessons) with no awareness of the learner's actual
 * interfaceLanguage — so e.g. a Spanish-target lesson always showed a
 * Portuguese gloss even for English-interface users. All 795 unique vocab
 * words in masterContent.json turn out to originate 1:1 from the
 * CONCEPTS_BY_TOPIC dictionary (src/lib/language-content/data/*.ts), which
 * already has proper en/es/pt terms per concept — so instead of calling an
 * external translation API (none is configured in this project), we cross-
 * reference that dictionary to fill in the missing gloss language and
 * rewrite `meaning` from a string into a `{ en?, es?, pt? }` map.
 *
 * Run with: node scripts/localize-vocab-meanings.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MASTER_PATH = path.join(ROOT, "src", "data", "masterContent.json");
const DATA_DIR = path.join(ROOT, "src", "lib", "language-content", "data");

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
const COGNATE_NOTE = " (mesma palavra em português)";
const stripNote = (s) => (s.endsWith(COGNATE_NOTE) ? s.slice(0, -COGNATE_NOTE.length) : s);

// --- 1. Parse the concept dictionary (en/es/pt term triples) ---
const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".ts") && f !== "types.ts");
const concepts = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(DATA_DIR, f), "utf8");
  const blocks = content.split(/\},\s*\{/);
  for (const block of blocks) {
    const enM = block.match(/en:\s*\{\s*term:\s*"([^"]*)"/);
    const esM = block.match(/es:\s*\{\s*term:\s*"([^"]*)"/);
    const ptM = block.match(/pt:\s*\{\s*term:\s*"([^"]*)"/);
    if (enM && esM && ptM) concepts.push({ en: enM[1], es: esM[1], pt: ptM[1] });
  }
}
console.log(`Parsed ${concepts.length} concepts from CONCEPTS_BY_TOPIC data files.`);

const idxByLang = { en: new Map(), es: new Map(), pt: new Map() };
for (const c of concepts) {
  idxByLang.en.set(norm(c.en), c);
  idxByLang.es.set(norm(c.es), c);
  idxByLang.pt.set(norm(c.pt), c);
}

// --- 2. Rewrite every lesson's vocab meaning into a per-language map ---
const lessons = JSON.parse(fs.readFileSync(MASTER_PATH, "utf8"));

let converted = 0;
let missing = 0;
const missingWords = [];

for (const lesson of lessons) {
  const targetLang = lesson.language; // en | es | pt
  const vocabStep = lesson.steps.find((s) => s.type === "vocab");
  if (!vocabStep?.words) continue;

  for (const w of vocabStep.words) {
    if (typeof w.meaning !== "string") continue; // already converted

    const existingClean = stripNote(w.meaning);
    const concept = idxByLang[targetLang].get(norm(w.word));

    const meaning = {};
    if (targetLang === "en") {
      meaning.pt = existingClean;
      meaning.es = concept ? concept.es : null;
    } else if (targetLang === "es") {
      meaning.pt = existingClean;
      meaning.en = concept ? concept.en : null;
    } else {
      // pt target: existing gloss was authored in English
      meaning.en = existingClean;
      meaning.es = concept ? concept.es : null;
    }

    if (!concept) {
      missing++;
      missingWords.push(`${targetLang}:${w.word}`);
      // fall back to duplicating the one gloss we do have so nothing renders blank
      const fallback = meaning.pt || meaning.en;
      if (!meaning.es) meaning.es = fallback;
      if (!meaning.en && targetLang !== "en") meaning.en = fallback;
      if (!meaning.pt && targetLang !== "pt") meaning.pt = fallback;
    }

    w.meaning = meaning;
    converted++;
  }
}

console.log(`Converted ${converted} vocab meaning fields.`);
console.log(`Missing concept-dictionary match (used fallback): ${missing}`);
if (missingWords.length) console.log(missingWords.slice(0, 30).join(", "));

fs.writeFileSync(MASTER_PATH, JSON.stringify(lessons, null, 2) + "\n", "utf8");

const LANGS = ["en", "es", "pt"];
for (const lang of LANGS) {
  const perLang = lessons.filter((l) => l.language === lang);
  fs.writeFileSync(
    path.join(ROOT, "src", "data", `masterContent.${lang}.json`),
    JSON.stringify(perLang, null, 2) + "\n",
    "utf8",
  );
}
console.log("Done. Regenerated per-language split files.");
