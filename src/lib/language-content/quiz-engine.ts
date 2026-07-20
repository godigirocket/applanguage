import type {
  Difficulty,
  InterfaceLanguage,
  LessonTopic,
  QuizQuestion,
  QuizQuestionType,
  TargetLanguage,
  VocabularyItem,
} from "./types";

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
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

const PROMPTS: Record<
  QuizQuestionType,
  { en: string; es: string; pt: string }
> = {
  translation: {
    en: 'What is the translation of "{term}"?',
    es: '¿Cuál es la traducción de "{term}"?',
    pt: 'Qual é a tradução de "{term}"?',
  },
  meaning: {
    en: 'What does "{term}" mean?',
    es: '¿Qué significa "{term}"?',
    pt: 'O que significa "{term}"?',
  },
  "word-to-translation": {
    en: 'Choose the correct translation for "{term}":',
    es: 'Elige la traducción correcta para "{term}":',
    pt: 'Escolha a tradução correta para "{term}":',
  },
  "fill-blank": {
    en: "Complete the sentence: {blank}",
    es: "Completa la frase: {blank}",
    pt: "Complete a frase: {blank}",
  },
  "choose-example": {
    en: 'Which sentence correctly uses "{term}"?',
    es: '¿Qué oración usa correctamente "{term}"?',
    pt: 'Qual frase usa "{term}" corretamente?',
  },
  "audio-to-word": {
    en: "Listen and choose the word you heard.",
    es: "Escucha y elige la palabra que oíste.",
    pt: "Ouça e escolha a palavra que você ouviu.",
  },
  "sentence-correction": {
    en: "Fix the mistake in this sentence: {blank}",
    es: "Corrige el error en esta oración: {blank}",
    pt: "Corrija o erro nesta frase: {blank}",
  },
  "sentence-order": {
    en: "Put the words in the correct order.",
    es: "Ordena las palabras correctamente.",
    pt: "Coloque as palavras na ordem correta.",
  },
  matching: {
    en: "Match the word with its translation.",
    es: "Relaciona la palabra con su traducción.",
    pt: "Relacione a palavra com sua tradução.",
  },
  "mistake-review": {
    en: 'Try again: "{term}"',
    es: 'Inténtalo de nuevo: "{term}"',
    pt: 'Tente de novo: "{term}"',
  },
};

function buildExplanation(item: VocabularyItem, interfaceLanguage: InterfaceLanguage): string {
  const templates: Record<InterfaceLanguage, string> = {
    en: `"${item.term}" means "${item.translation}".`,
    es: `"${item.term}" significa "${item.translation}".`,
    pt: `"${item.term}" significa "${item.translation}".`,
  };
  return templates[interfaceLanguage];
}

function blankOutTerm(example: string, term: string): string {
  const idx = example.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return example;
  return example.slice(0, idx) + "____" + example.slice(idx + term.length);
}

/**
 * Builds one quiz question per vocabulary item, cycling through question
 * types (translation / word-to-translation / fill-blank / choose-example) so
 * a lesson doesn't ask the exact same question shape every time. Distractor
 * options are drawn from the *other* words in the same lesson (same topic),
 * never from an unrelated word pool.
 */
export function generateQuizFromVocabulary(
  vocabulary: VocabularyItem[],
  targetLanguage: TargetLanguage,
  opts: { interfaceLanguage?: InterfaceLanguage; seed?: number | string } = {},
): QuizQuestion[] {
  const { interfaceLanguage = "pt", seed = targetLanguage } = opts;
  if (vocabulary.length < 2) return [];

  const seedNum = typeof seed === "number" ? seed : hashString(String(seed));
  const types: QuizQuestionType[] = ["word-to-translation", "meaning", "fill-blank", "choose-example"];

  return vocabulary.map((item, idx) => {
    const type = types[idx % types.length];
    const distractorPool = vocabulary.filter((v) => v.id !== item.id);
    const distractors = seededShuffle(distractorPool, seedNum + idx)
      .slice(0, 3)
      .map((v) => v.translation);

    let prompt: string;
    let options: string[];
    let correctAnswer: string;

    if (type === "fill-blank") {
      prompt = PROMPTS["fill-blank"][interfaceLanguage].replace(
        "{blank}",
        blankOutTerm(item.example, item.term),
      );
      options = seededShuffle([item.term, ...distractorPool.slice(0, 3).map((v) => v.term)], seedNum + idx);
      correctAnswer = item.term;
    } else if (type === "choose-example") {
      const wrongExamples = seededShuffle(distractorPool, seedNum + idx + 100)
        .slice(0, 3)
        .map((v) => v.example);
      prompt = PROMPTS["choose-example"][interfaceLanguage].replace("{term}", item.term);
      options = seededShuffle([item.example, ...wrongExamples], seedNum + idx);
      correctAnswer = item.example;
    } else {
      prompt = PROMPTS[type][interfaceLanguage].replace("{term}", item.term);
      options = seededShuffle([item.translation, ...distractors], seedNum + idx);
      correctAnswer = item.translation;
    }

    return {
      id: `quiz-${item.id}-${type}`,
      type,
      prompt,
      options,
      correctAnswer,
      explanation: buildExplanation(item, interfaceLanguage),
      targetLanguage,
      topic: item.topic,
      difficulty: item.difficulty,
      source: "local",
    };
  });
}

/** Removes duplicate questions (by id, and by identical prompt+answer pair). */
export function dedupeQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();
  const out: QuizQuestion[] = [];
  for (const q of questions) {
    const promptKey = `${q.prompt}::${q.correctAnswer}`;
    if (seenIds.has(q.id) || seenPrompts.has(promptKey)) continue;
    seenIds.add(q.id);
    seenPrompts.add(promptKey);
    out.push(q);
  }
  return out;
}

/** Filters out questions the user has already seen this session (by id). */
export function avoidRecentlySeenContent<T extends { id: string }>(
  items: T[],
  recentlySeenIds: Set<string> | string[],
): T[] {
  const seen = recentlySeenIds instanceof Set ? recentlySeenIds : new Set(recentlySeenIds);
  const remaining = items.filter((i) => !seen.has(i.id));
  // If everything has been seen (e.g. a short topic bank), fall back to the
  // full set rather than returning an empty quiz.
  return remaining.length > 0 ? remaining : items;
}
