import type {
  Difficulty,
  InterfaceLanguage,
  LessonTopic,
  TargetLanguage,
  VocabularyItem,
} from "./types";
import { CONCEPTS_BY_TOPIC } from "./fallback-content";

// Deterministic PRNG (mulberry32) so the same seed always produces the same
// selection/order — no Math.random() drift between server and client render.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Returns real, topic-matched vocabulary for a target language.
 *
 * `seed` (e.g. a lesson id or volume number) selects and orders a subset of
 * the topic's full concept bank deterministically, so repeated lessons on
 * the same topic show *different* words instead of the exact same 3 every
 * time — while staying stable across server/client renders for the same seed.
 */
export function getVocabularyForTopic(
  topic: LessonTopic,
  targetLanguage: TargetLanguage,
  opts: {
    difficulty?: Difficulty;
    interfaceLanguage?: InterfaceLanguage;
    count?: number;
    seed?: number | string;
  } = {},
): VocabularyItem[] {
  const {
    difficulty,
    interfaceLanguage: requestedInterfaceLanguage = "pt",
    count = 5,
    seed = topic,
  } = opts;

  // Learning a language whose gloss is shown in that *same* language makes
  // every question and its own answer identical text (e.g. "What does X
  // mean?" with X itself listed as the correct option) — this happens
  // whenever the user's interface language and target language coincide
  // (a valid combination the UI doesn't block). Fall back to a different
  // gloss language rather than ever rendering a degenerate quiz like that.
  const interfaceLanguage: InterfaceLanguage =
    requestedInterfaceLanguage === targetLanguage
      ? targetLanguage === "pt"
        ? "en"
        : "pt"
      : requestedInterfaceLanguage;

  const concepts = CONCEPTS_BY_TOPIC[topic] ?? [];
  if (concepts.length === 0) return [];

  const seedNum = typeof seed === "number" ? seed : hashString(String(seed));

  // Prefer words at the requested difficulty, but top up from the rest of the
  // topic's bank when there aren't enough of them — some topics only have a
  // couple of "advanced" entries, and returning fewer than `count` words just
  // because the exact difficulty is thin is worse than mixing in nearby ones.
  // Matching-difficulty entries are always placed ahead of the padding ones —
  // this order must survive to the final slice below, so nothing here
  // re-shuffles the combined pool afterwards.
  let pool: typeof concepts;
  if (difficulty) {
    const matching = seededShuffle(
      concepts.filter((c) => c.difficulty === difficulty),
      seedNum,
    );
    if (matching.length >= count) {
      pool = matching;
    } else {
      const rest = seededShuffle(
        concepts.filter((c) => c.difficulty !== difficulty),
        seedNum + 1,
      );
      pool = [...matching, ...rest];
    }
  } else {
    pool = seededShuffle(concepts, seedNum);
  }

  const selected = pool.slice(0, Math.min(count, pool.length));

  return selected.map((entry) => {
    const targetForm = entry[targetLanguage];
    const interfaceForm = entry[interfaceLanguage];
    const item: VocabularyItem = {
      id: `vocab-${topic}-${targetLanguage}-${entry.concept}`,
      term: targetForm.term,
      translation: interfaceForm.term,
      definition: undefined,
      example: targetForm.example,
      exampleTranslation: interfaceForm.example,
      partOfSpeech: targetForm.partOfSpeech,
      difficulty: entry.difficulty,
      topic,
      targetLanguage,
      source: "manual",
    };
    return item;
  });
}

export function getAllConceptsForTopic(topic: LessonTopic) {
  return CONCEPTS_BY_TOPIC[topic] ?? [];
}
