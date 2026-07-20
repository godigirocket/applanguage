export type TargetLanguage = "en" | "es" | "pt";
export type InterfaceLanguage = "en" | "es" | "pt";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LessonTopic =
  | "daily"
  | "travel"
  | "food"
  | "business"
  | "sports"
  | "fitness"
  | "culture"
  | "grammar"
  | "pronunciation"
  | "listening"
  | "shopping"
  | "health"
  | "technology"
  | "family"
  | "work";

export type VocabularySource =
  | "local"
  | "dictionaryapi"
  | "datamuse"
  | "tatoeba"
  | "libretranslate"
  | "manual";

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  definition?: string;
  example: string;
  exampleTranslation?: string;
  partOfSpeech?: string;
  difficulty: Difficulty;
  topic: LessonTopic;
  targetLanguage: TargetLanguage;
  audioUrl?: string;
  source: VocabularySource;
}

export type QuizQuestionType =
  | "translation"
  | "meaning"
  | "fill-blank"
  | "choose-example"
  | "audio-to-word"
  | "word-to-translation"
  | "sentence-correction"
  | "sentence-order"
  | "matching"
  | "mistake-review";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  targetLanguage: TargetLanguage;
  topic: LessonTopic;
  difficulty: Difficulty;
  source: string;
}

export interface LessonSentence {
  id: string;
  text: string;
  translation?: string;
  targetLanguage: TargetLanguage;
  topic: LessonTopic;
  source: VocabularySource;
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  topic: LessonTopic;
  targetLanguage: TargetLanguage;
  difficulty: Difficulty;
  vocabulary: VocabularyItem[];
  sentences: LessonSentence[];
  questions: QuizQuestion[];
  xp: number;
}

export interface SavedWord {
  id: string;
  term: string;
  translation: string;
  targetLanguage: TargetLanguage;
  topic: LessonTopic;
  strength: number;
  nextReviewAt: string;
  lastReviewedAt?: string;
  mistakes: number;
  correctAnswers: number;
}
