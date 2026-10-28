import test from "node:test";
import assert from "node:assert/strict";
import { selectVoice } from "../src/lib/language-apis/voice-selection.ts";
const voice = (name, lang, localService = true, isDefault = false) => ({
  name,
  lang,
  localService,
  default: isDefault,
});
test("natural voices take precedence over robotic local defaults", () => {
  const basic = voice("Microsoft David Desktop", "en-US", true, true);
  const natural = voice("Microsoft Jenny Online (Natural)", "en-US", false);
  assert.equal(selectVoice([basic, natural], "en-US"), natural);
});
test("exact locale wins between equally capable voices", () => {
  const brazil = voice("Luciana Enhanced", "pt-BR");
  assert.equal(selectVoice([voice("Joana Enhanced", "pt-PT"), brazil], "pt-BR"), brazil);
});
test("voices never cross the requested language, including when not installed", () => {
  assert.equal(selectVoice([voice("Jenny Natural", "en-US")], "es-ES"), null);
  assert.equal(selectVoice([], "pt-BR"), null);
  const spanish = voice("Monica", "es_MX");
  assert.equal(selectVoice([spanish], "es-ES"), spanish);
});
