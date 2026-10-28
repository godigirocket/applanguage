import test from "node:test";
import assert from "node:assert/strict";
import { guidedTurn, SCENARIOS } from "../src/lib/guided-conversation.ts";

test("all eight scenarios work in three languages without fetching or repeating stages", () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw Error("Conversation must not use network");
  };
  try {
    assert.equal(Object.keys(SCENARIOS).length, 8);
    for (const topic of Object.keys(SCENARIOS))
      for (const language of ["en", "pt", "es"]) {
        const messages = [];
        let result = guidedTurn({ topic, language, messages });
        assert.ok(result.reply.includes(SCENARIOS[topic][language][0].question));
        const seen = new Set([result.reply]);
        for (let i = 0; i < 6; i++) {
          messages.push(
            { role: "assistant", content: result.reply },
            { role: "user", content: result.suggestions[0] },
          );
          result = guidedTurn({ topic, language, messages });
          assert.ok(result.reply.length > 20);
          assert.ok(!seen.has(result.reply), `${topic}/${language} repeated a stage`);
          seen.add(result.reply);
        }
        assert.equal(result.complete, true, `${topic}/${language} did not terminate`);
        messages.push({ role: "user", content: result.suggestions[0] });
        const restarted = guidedTurn({ topic, language, messages });
        assert.equal(restarted.complete, false);
        assert.ok(restarted.reply.includes(SCENARIOS[topic][language][0].question));
      }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("help preserves the scenario, short replies earn no XP and known corrections are specific", () => {
  const input = { topic: "travel", language: "en", messages: [{ role: "user", content: "Help" }] };
  const help = guidedTurn(input);
  assert.equal(help.earnsXP, false);
  assert.ok(help.reply.includes("Lisbon"));
  const short = guidedTurn({ ...input, messages: [{ role: "user", content: "yes" }] });
  assert.equal(short.earnsXP, false);
  const corrected = guidedTurn({
    ...input,
    messages: [{ role: "user", content: "I want go to Lisbon" }],
  });
  assert.ok(corrected.reply.includes("I want to go to Lisbon"));
  const confident = guidedTurn({
    ...input,
    mood: "confidence",
    messages: [{ role: "user", content: "I want go to Lisbon" }],
  });
  assert.ok(!confident.reply.includes("One useful adjustment"));
  assert.equal(
    guidedTurn({ ...input, messages: [{ role: "user", content: "Goodbye" }] }).complete,
    true,
  );
});
