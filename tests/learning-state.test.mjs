import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { emptyLearningState, mergeLearningState, quizStreaks } from "../src/lib/learning-state.ts";
const first = { id: "attempt-a", date: "2026-10-27T12:00:00.000Z", score: 8, total: 10 };
const second = { id: "attempt-b", date: "2026-10-27T13:00:00.000Z", score: 2, total: 10 };
test("two-device learning merge deduplicates attempts and retains newer reviews", () => {
  const a = {
    ...emptyLearningState(),
    attempts: [first],
    reviews: { water: { wordId: "water", lastReview: 100, interval: 4, correctStreak: 0 } },
    words: { water: { term: "water", updatedAt: "2026-10-27T12:00:00.000Z", strength: 0 } },
  };
  const b = {
    ...emptyLearningState(),
    attempts: [first, second],
    reviews: { water: { wordId: "water", lastReview: 200, interval: 12, correctStreak: 1 } },
    words: { water: { term: "water", updatedAt: "2026-10-27T13:00:00.000Z", strength: 1 } },
  };
  const merged = mergeLearningState(a, b);
  assert.equal(merged.attempts.length, 2);
  assert.equal(merged.reviews.water.interval, 12);
  assert.equal(merged.words.water.strength, 1);
  assert.deepEqual(mergeLearningState(merged, a), merged);
  assert.deepEqual(quizStreaks(merged.attempts), { currentStreak: 0, bestStreak: 1 });
});
test("cloud learning RPC merges atomically, isolates accounts and restricts direct writes", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;insert into auth.users values('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
    );
    await db.exec(fs.readFileSync("supabase/migrations/20261027010000_learning_state.sql", "utf8"));
    const run = async (state) =>
      (await db.query("select sync_learning_state($1::jsonb) as result", [JSON.stringify(state)]))
        .rows[0].result;
    await assert.rejects(run(emptyLearningState()));
    await db.exec(
      `select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);set role authenticated;`,
    );
    assert.equal((await run({ ...emptyLearningState(), attempts: [first] })).attempts.length, 1);
    assert.equal(
      (await run({ ...emptyLearningState(), attempts: [first, second] })).attempts.length,
      2,
    );
    assert.equal((await run({ ...emptyLearningState(), attempts: [first] })).attempts.length, 2);
    await assert.rejects(
      db.query("update learning_state set state=$1", [JSON.stringify(emptyLearningState())]),
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);`,
    );
    assert.equal((await db.query("select * from learning_state")).rows.length, 0);
    assert.equal((await run(emptyLearningState())).attempts.length, 0);
    await assert.rejects(run({ attempts: "invalid" }));
  } finally {
    await db.close();
  }
});

test("opening a new card never resets a completed review", () => {
  const learned = {
    ...emptyLearningState(),
    words: {
      a: {
        id: "a",
        term: "water",
        correctAnswers: 1,
        lastReviewedAt: "2026-10-27T12:00:00Z",
        updatedAt: "2026-10-27T12:00:00Z",
        strength: 1,
      },
    },
  };
  const fresh = {
    ...emptyLearningState(),
    words: {
      a: {
        id: "a",
        term: "water",
        correctAnswers: 0,
        updatedAt: "2026-10-27T14:00:00Z",
        strength: 0,
      },
    },
  };
  assert.equal(mergeLearningState(learned, fresh).words.a.strength, 1);
  assert.equal(mergeLearningState(fresh, learned).words.a.strength, 1);
});
