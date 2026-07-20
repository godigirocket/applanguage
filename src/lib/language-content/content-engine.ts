import type { Difficulty, InterfaceLanguage, LessonContent, LessonTopic, TargetLanguage } from "./types";
import { TOPIC_META } from "./topics";
import { getVocabularyForTopic } from "./vocabulary-engine";
import { generateQuizFromVocabulary, dedupeQuestions, avoidRecentlySeenContent } from "./quiz-engine";
import { getVocabularySentences } from "./sentence-engine";

const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  beginner: 30,
  intermediate: 45,
  advanced: 60,
};

/**
 * Builds a full, real lesson for a topic + target language: vocabulary drawn
 * from the topic's own curated bank (never a generic/unrelated word pool),
 * example sentences, and a quiz generated from that same vocabulary.
 *
 * `seed` — pass the lesson id (or a volume/index number) so different
 * lessons on the same topic show different words instead of always the
 * same fixed subset.
 */
export function getLessonContent(
  lessonId: string,
  targetLanguage: TargetLanguage,
  opts: {
    topic?: LessonTopic;
    difficulty?: Difficulty;
    interfaceLanguage?: InterfaceLanguage;
    wordCount?: number;
    recentlySeenWordIds?: string[];
  } = {},
): LessonContent {
  const {
    topic = "daily",
    difficulty = "beginner",
    interfaceLanguage = "pt",
    wordCount = 5,
    recentlySeenWordIds = [],
  } = opts;

  const vocabularyPool = getVocabularyForTopic(topic, targetLanguage, {
    difficulty,
    interfaceLanguage,
    count: wordCount * 3, // oversample so avoidRecentlySeenContent has room to pick from
    seed: lessonId,
  });

  const vocabulary = avoidRecentlySeenContent(vocabularyPool, recentlySeenWordIds).slice(0, wordCount);
  const sentences = getVocabularySentences(vocabulary);
  const questions = dedupeQuestions(
    generateQuizFromVocabulary(vocabulary, targetLanguage, { interfaceLanguage, seed: lessonId }),
  );

  const label = TOPIC_META[topic].label[interfaceLanguage];

  return {
    id: lessonId,
    title: label,
    description:
      interfaceLanguage === "pt"
        ? `Vocabulário e prática sobre ${label.toLowerCase()}.`
        : interfaceLanguage === "es"
          ? `Vocabulario y práctica sobre ${label.toLowerCase()}.`
          : `Vocabulary and practice about ${label.toLowerCase()}.`,
    topic,
    targetLanguage,
    difficulty,
    vocabulary,
    sentences,
    questions,
    xp: XP_BY_DIFFICULTY[difficulty],
  };
}

/**
 * Picks a topic + difficulty for the user's next lesson based on progress,
 * instead of always handing back the same fixed content. Simple, deterministic
 * rules: cycle through topics not recently completed, and nudge difficulty up
 * once enough lessons at the current level are done.
 */
export function getPersonalizedLesson(opts: {
  targetLanguage: TargetLanguage;
  topics: LessonTopic[];
  completedLessons: string[];
  learnedWordCount: number;
}): { topic: LessonTopic; difficulty: Difficulty } {
  const { topics, completedLessons, learnedWordCount } = opts;
  if (topics.length === 0) return { topic: "daily", difficulty: "beginner" };

  const index = completedLessons.length % topics.length;
  const topic = topics[index];

  const difficulty: Difficulty =
    learnedWordCount > 60 ? "advanced" : learnedWordCount > 25 ? "intermediate" : "beginner";

  return { topic, difficulty };
}
