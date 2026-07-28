/**
 * masterContent.{en,es,pt}.json bundles all 710 lessons per language,
 * `steps` included, into one ~2MB file. contentEngine.ts was dynamically
 * importing that whole file just to render the /home and /lessons card
 * lists (which only need title/level/category/xp/duration, not the full
 * vocab/quiz/listening step content) and even just to open ONE lesson by
 * id — the single biggest source of load-time lag in the app.
 *
 * This splits each language file into:
 *   - src/data/lessons/index.<lang>.json   — lightweight metadata only
 *     (~210KB instead of ~2MB), used for lists and id/order lookups.
 *   - src/data/lessons/detail/<lang>/<id>.json — one ~3KB file per lesson,
 *     containing the full `steps` array, loaded only when that specific
 *     lesson is opened.
 *
 * Run with: node scripts/split-master-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const OUT_DIR = path.join(DATA_DIR, "lessons");

const LANGS = ["en", "es", "pt"];

for (const lang of LANGS) {
  const lessons = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, `masterContent.${lang}.json`), "utf8"),
  );

  const detailDir = path.join(OUT_DIR, "detail", lang);
  fs.rmSync(detailDir, { recursive: true, force: true });
  fs.mkdirSync(detailDir, { recursive: true });

  const index = [];
  for (const lesson of lessons) {
    const { steps, ...meta } = lesson;
    index.push(meta);
    fs.writeFileSync(path.join(detailDir, `${lesson.id}.json`), JSON.stringify(lesson) + "\n", "utf8");
  }

  fs.writeFileSync(path.join(OUT_DIR, `index.${lang}.json`), JSON.stringify(index) + "\n", "utf8");

  const indexBytes = fs.statSync(path.join(OUT_DIR, `index.${lang}.json`)).size;
  console.log(
    `[${lang}] ${lessons.length} lessons -> index.${lang}.json (${(indexBytes / 1024).toFixed(0)} KB) + ${lessons.length} detail files`,
  );
}
