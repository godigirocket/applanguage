import fs from "node:fs";
import { pathToFileURL } from "node:url";

const directory = new URL("../src/data/lessons/", import.meta.url);
const curatedSteps = JSON.parse(fs.readFileSync(new URL("airport-a1.json", directory), "utf8"));

export function applyCuratedLesson(lesson) {
  return Object.hasOwn(curatedSteps, lesson.id)
    ? { ...lesson, steps: curatedSteps[lesson.id] }
    : lesson;
}

// Refresh only the published chunks touched by authored content. The same
// override is applied by split-master-content when rebuilding the catalog.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const paths = new Set();
  for (const id of Object.keys(curatedSteps)) {
    const language = id.match(/^lesson-(en|es|pt)-/)?.[1];
    if (!language) throw new Error(`Unrecognized curated lesson ID: ${id}`);
    const index = JSON.parse(fs.readFileSync(new URL(`index.${language}.json`, directory), "utf8"));
    const chunk = index.find((lesson) => lesson.id === id)?.chunkIndex;
    if (!Number.isInteger(chunk)) throw new Error(`Missing published lesson: ${id}`);
    paths.add(`detail/${language}/chunk-${chunk}.json`);
  }
  for (const path of paths) {
    const file = new URL(path, directory);
    const lessons = JSON.parse(fs.readFileSync(file, "utf8"));
    fs.writeFileSync(file, JSON.stringify(lessons.map(applyCuratedLesson)) + "\n");
  }
}
