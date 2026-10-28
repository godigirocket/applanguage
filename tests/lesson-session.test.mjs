import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  buildActivities,
  freshSession,
  advanceSession,
  restoreSession,
  sessionAccuracy,
  normalizeAnswer,
} from "../src/lib/lesson-session.ts";

test("each of the 2,130 lessons terminates and has solvable word banks", () => {
  let count = 0;
  for (const lang of ["en", "es", "pt"]) {
    const base = new URL(`../src/data/lessons/detail/${lang}/`, import.meta.url);
    const ids = new Set();
    for (const file of fs.readdirSync(base))
      for (const lesson of JSON.parse(fs.readFileSync(new URL(file, base)))) {
        count++;
        assert.ok(!ids.has(lesson.id), `Duplicate ID: ${lesson.id}`);
        ids.add(lesson.id);
        const activities = buildActivities(lesson.steps);
        assert.ok(activities.length > 0, lesson.id);
        let session = freshSession();
        for (const activity of activities) {
          if (activity.type === "dragdrop") {
            const bank = [...activity.tokens];
            for (const word of activity.answerTokens) {
              const index = bank.indexOf(word);
              assert.ok(index >= 0, `${lesson.id}: missing token ${word}`);
              bank.splice(index, 1);
            }
          }
          session = advanceSession(session, activities.length, true);
          assert.deepEqual(
            restoreSession(JSON.parse(JSON.stringify(session)), activities.length),
            session,
          );
        }
        assert.equal(session.cursor, activities.length);
        assert.equal(
          advanceSession(session, activities.length, false),
          session,
          "Completed sessions cannot loop",
        );
      }
  }
  assert.equal(count, 2130);
});

test("resume rejects invalid and stale checkpoints", () => {
  for (const bad of [
    null,
    {},
    { version: 1, cursor: -1, results: [] },
    { version: 1, cursor: 11, results: [] },
    { version: 1, cursor: 1.5, results: [] },
    { version: 1, cursor: 2, results: [true] },
    { version: 1, cursor: 1, results: ["true"] },
  ])
    assert.equal(restoreSession(bad, 10), null);
});

test("optional activities do not inflate accuracy", () => {
  let session = freshSession();
  for (const answer of [null, true, false, null, true])
    session = advanceSession(session, 5, answer);
  assert.equal(sessionAccuracy(session), 67);
  assert.equal(sessionAccuracy(freshSession()), 0);
});

test("translations tolerate punctuation, spacing and case while retaining accents", () => {
  assert.equal(
    normalizeAnswer("  Onde FICA o controle de passaportes? "),
    normalizeAnswer("Onde fica o controle de passaportes."),
  );
  assert.notEqual(normalizeAnswer("avó"), normalizeAnswer("avô"));
});

test("malformed or unsupported steps never create blank screens", () => {
  assert.deepEqual(
    buildActivities([
      { type: "intro" },
      { type: "quiz", options: ["one"], correct: 5 },
      { type: "speaking" },
      { type: "translation" },
      { type: "practice" },
    ]),
    [],
  );
});
