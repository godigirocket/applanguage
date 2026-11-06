import test from "node:test";
import assert from "node:assert/strict";
import { matchTranscript, matchTranscriptDetailed } from "../src/lib/speech-match.ts";
test("transcript matching preserves order, duplicates and extra words", () => {
  assert.equal(matchTranscript("Hello, world!", "hello world"), 100);
  assert.equal(matchTranscript("no no no", "no"), 33);
  assert.equal(matchTranscript("I would like coffee", "coffee like would I"), 0);
  assert.equal(matchTranscript("good morning", "good morning extra extra"), 0);
  assert.equal(matchTranscript("", ""), 0);
  assert.equal(matchTranscript("¿Dónde está el café?", "Dónde está el café"), 100);
  assert.equal(matchTranscript("Olá, você!", "olá você"), 100);
});
test("word feedback distinguishes substitutions from omissions and agrees with the phrase score", () => {
  const result = matchTranscriptDetailed("I love hot coffee", "I like hot coffee");
  assert.equal(result.score, matchTranscript("I love hot coffee", "I like hot coffee"));
  assert.deepEqual(result.wordResults.map(({status}) => status), ["correct", "incorrect", "correct", "correct"]);
  assert.equal(matchTranscriptDetailed("I love hot coffee", "I love coffee").wordResults[2].status, "missing");
});
