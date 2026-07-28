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
 *     (~215KB instead of ~2MB), used for lists and id/order lookups. Each
 *     entry also carries a `chunkIndex` pointing at the detail chunk that
 *     has its full `steps`.
 *   - src/data/lessons/detail/<lang>/chunk-<n>.json — lessons grouped into
 *     chunks of CHUNK_SIZE (full `steps` included), so opening one lesson
 *     only loads its ~60KB chunk instead of the full 2MB file.
 *
 * An earlier version of this script wrote one file per lesson (2130 files
 * total), which pushed the project over Vercel's 15000-file upload limit
 * on `vercel --prod` — chunking keeps the same lazy-loading win with a
 * couple hundred files instead of thousands.
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
const CHUNK_SIZE = 25;

const LANGS = ["en", "es", "pt"];

for (const lang of LANGS) {
  const lessons = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, `masterContent.${lang}.json`), "utf8"),
  );

  const detailDir = path.join(OUT_DIR, "detail", lang);
  fs.rmSync(detailDir, { recursive: true, force: true });
  fs.mkdirSync(detailDir, { recursive: true });

  const index = [];
  const chunks = [];
  for (let i = 0; i < lessons.length; i += CHUNK_SIZE) {
    chunks.push(lessons.slice(i, i + CHUNK_SIZE));
  }

  chunks.forEach((chunk, chunkIndex) => {
    fs.writeFileSync(
      path.join(detailDir, `chunk-${chunkIndex}.json`),
      JSON.stringify(chunk) + "\n",
      "utf8",
    );
    for (const lesson of chunk) {
      const { steps, ...meta } = lesson;
      index.push({ ...meta, chunkIndex });
    }
  });

  fs.writeFileSync(path.join(OUT_DIR, `index.${lang}.json`), JSON.stringify(index, null, 2) + "\n", "utf8");

  const indexBytes = fs.statSync(path.join(OUT_DIR, `index.${lang}.json`)).size;
  console.log(
    `[${lang}] ${lessons.length} lessons -> index.${lang}.json (${(indexBytes / 1024).toFixed(0)} KB) + ${chunks.length} chunk files (~${CHUNK_SIZE} lessons each)`,
  );
}
