import vocabularyData from "./vocabularyExpanded.json";
import grammarData from "./grammarExpanded.json";
import idiomsData from "./idiomsExpanded.json";

type Language = "en" | "es" | "pt";

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "fill_blank" | "true_false" | "matching" | "ordering";
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export function generateVocabQuiz(
  lang: Language,
  level: string,
  count: number = 5,
): QuizQuestion[] {
  const data = (vocabularyData as Record<string, any[]>)[lang] || [];
  if (!data.length) return [];

  const filtered = data.filter((item) => item.level === level || level === "all");
  if (!filtered.length) return [];
  const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, count);

  return selected.map((item) => {
    const distractors = data
      .filter((d) => d.id !== item.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => d.translation);

    const options = [item.translation, ...distractors].sort(() => 0.5 - Math.random());

    return {
      id: `q_vocab_${item.id}`,
      type: "multiple_choice" as const,
      prompt: `Qual é a tradução de "${item.word}"?`,
      options,
      correctAnswer: item.translation,
    };
  });
}

export function generateFillBlankQuiz(
  lang: Language,
  level: string,
  count: number = 3,
): QuizQuestion[] {
  const data = (vocabularyData as Record<string, any[]>)[lang] || [];
  if (!data.length) return [];

  const filtered = data.filter((item) => (item.level === level || level === "all") && item.example);
  if (!filtered.length) return [];
  const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, count);

  return selected.map((item) => {
    const blanked = item.example.replace(new RegExp(item.word, "i"), "______");
    return {
      id: `q_fill_${item.id}`,
      type: "fill_blank" as const,
      prompt: `Complete a frase: "${blanked}"`,
      correctAnswer: item.word,
      explanation: `A palavra correta é "${item.word}" (${item.translation}).`,
    };
  });
}

const GRAMMAR_QUIZ_STRINGS: Record<
  Language,
  {
    true: string;
    false: string;
    prompt: (title: string, explanation: string) => string;
    actualExplanation: (title: string, explanation: string) => string;
  }
> = {
  en: {
    true: "True",
    false: "False",
    prompt: (title, explanation) => `The rule "${title}" says: ${explanation}`,
    actualExplanation: (title, explanation) => `Actually, "${title}" means: ${explanation}`,
  },
  es: {
    true: "Verdadero",
    false: "Falso",
    prompt: (title, explanation) => `La regla "${title}" dice que: ${explanation}`,
    actualExplanation: (title, explanation) => `En realidad, "${title}" significa: ${explanation}`,
  },
  pt: {
    true: "Verdadeiro",
    false: "Falso",
    prompt: (title, explanation) => `A regra "${title}" diz que: ${explanation}`,
    actualExplanation: (title, explanation) => `Na verdade, "${title}" significa: ${explanation}`,
  },
};

export function generateGrammarQuiz(
  lang: Language,
  level: string,
  count: number = 3,
): QuizQuestion[] {
  const data = (grammarData as Record<string, any[]>)[lang] || [];
  if (!data.length) return [];

  const filtered = data.filter((item) => item.level === level || level === "all");
  if (!filtered.length) return [];
  const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, count);
  const strings = GRAMMAR_QUIZ_STRINGS[lang];

  return selected.map((item) => {
    // Mix in genuinely false statements (this rule's title paired with a
    // *different* rule's explanation) so the answer isn't always "true" —
    // otherwise the quiz is gameable by always picking the same option.
    const isFalseVariant = Math.random() < 0.5;
    const otherItems = filtered.filter((d) => d.id !== item.id);
    const wrongExplanation =
      otherItems.length > 0
        ? otherItems[Math.floor(Math.random() * otherItems.length)].explanation
        : null;

    const shownExplanation =
      isFalseVariant && wrongExplanation ? wrongExplanation : item.explanation;
    const isActuallyTrue = shownExplanation === item.explanation;

    return {
      id: `q_gram_${item.id}${isActuallyTrue ? "" : "_false"}`,
      type: "true_false" as const,
      prompt: strings.prompt(item.title, shownExplanation),
      options: [strings.true, strings.false],
      correctAnswer: isActuallyTrue ? strings.true : strings.false,
      explanation: isActuallyTrue
        ? item.exceptions?.[0]
        : strings.actualExplanation(item.title, item.explanation),
    };
  });
}

const IDIOM_QUIZ_PROMPT: Record<Language, (idiom: string) => string> = {
  en: (idiom) => `What does "${idiom}" mean?`,
  es: (idiom) => `¿Qué significa "${idiom}"?`,
  pt: (idiom) => `O que significa "${idiom}"?`,
};

export function generateIdiomQuiz(lang: Language, count: number = 3): QuizQuestion[] {
  const data = (idiomsData as Record<string, any[]>)[lang] || [];
  if (!data.length) return [];

  const selected = data.sort(() => 0.5 - Math.random()).slice(0, count);

  return selected.map((item) => {
    const distractors = data
      .filter((d) => d.id !== item.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => d.meaning);

    const options = [item.meaning, ...distractors].sort(() => 0.5 - Math.random());

    return {
      id: `q_idiom_${item.id}`,
      type: "multiple_choice" as const,
      prompt: IDIOM_QUIZ_PROMPT[lang](item.idiom),
      options,
      correctAnswer: item.meaning,
    };
  });
}

export function generateMixedQuiz(
  lang: Language,
  level: string,
  total: number = 5,
): QuizQuestion[] {
  const vocabCount = Math.max(2, Math.floor(total * 0.4));
  const gramCount = Math.max(1, Math.floor(total * 0.3));
  const idiomCount = total - vocabCount - gramCount;

  return [
    ...generateVocabQuiz(lang, level, vocabCount),
    ...generateGrammarQuiz(lang, level, gramCount),
    ...generateIdiomQuiz(lang, idiomCount),
  ].sort(() => 0.5 - Math.random());
}
