/**
 * One-off migration, run twice in this project's history:
 *  1) Patches all 630 existing lessons: the card `description` was always
 *     hardcoded Portuguese regardless of the lesson's target language, and the
 *     in-lesson "Gramática: X" quiz (the 2nd quiz-type step, actually rendered
 *     as the lesson's 3rd question) always had the real answer at index 0 with
 *     nonsense distractors ("This is a structurally incorrect sequence."),
 *     making it trivially guessable rather than a real grammar check.
 *  2) Generates ~50 new lesson volumes x 3 languages for the 10 topics that
 *     had vocabulary/quiz-engine support but zero structured lessons (sports,
 *     fitness, family, work, shopping, culture, grammar, pronunciation,
 *     listening, daily), using the same real content engines already
 *     powering the 5 existing topics (travel/food/business/technology/health)
 *     instead of generic template filler.
 *
 * Run with: npx tsx scripts/build-full-content.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getVocabularyForTopic } from "../src/lib/language-content/vocabulary-engine";
import { ALL_TOPICS, TOPIC_META } from "../src/lib/language-content/topics";
import type { LessonTopic, TargetLanguage } from "../src/lib/language-content/types";
import grammarData from "../src/data/grammarExpanded.json";
import idiomsData from "../src/data/idiomsExpanded.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "..", "src", "data", "masterContent.json");

const EXISTING_TOPICS: LessonTopic[] = ["travel", "food", "business", "technology", "health"];
const NEW_TOPICS: LessonTopic[] = ALL_TOPICS.filter((t) => !EXISTING_TOPICS.includes(t));
const VOLUMES_PER_TOPIC = 50;
const LANGS: TargetLanguage[] = ["en", "es", "pt"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const TOPIC_TITLE_TO_TOPIC: Record<string, LessonTopic> = {
  "At the Airport": "travel",
  "En el Aeropuerto": "travel",
  "No Aeroporto": "travel",
  "Ordering Coffee": "food",
  "Pidiendo un Café": "food",
  "Pedindo um Café": "food",
  "Job Interview Prep": "business",
  "Entrevista de Trabajo": "business",
  "Entrevista de Emprego": "business",
  "Digital Communication": "technology",
  "Vida Digital": "technology",
  "Comunicação Digital": "technology",
  "Feelings & Health": "health",
  "Salud y Sentimientos": "health",
  "Saúde e Sentimentos": "health",
};

const categoryColors: Record<string, string> = {
  vocabulary: "#FF7A45",
  grammar: "#7850B4",
  listening: "#1B3A4B",
  speaking: "#C4714A",
  idioms: "#4A90E2",
};
const CATEGORIES = ["vocabulary", "grammar", "listening", "speaking", "idioms"];

const DESCRIPTION_TEMPLATE: Record<TargetLanguage, (topic: string) => string> = {
  en: (t) => `Master ${t} through vocabulary, conversation, grammar, and audio.`,
  es: (t) => `Domina ${t} a través de vocabulario, conversación, gramática y audio.`,
  pt: (t) => `Domine ${t} através de vocabulário, conversação, gramática e áudios.`,
};

const TRANSLATION_QUIZ_PROMPT: Record<TargetLanguage, (term: string) => string> = {
  en: (term) => `What is the correct translation for "${term}"?`,
  es: (term) => `¿Cuál es la traducción correcta para "${term}"?`,
  pt: (term) => `Qual é a tradução correta para "${term}"?`,
};

const GRAMMAR_STEP_PROMPT: Record<TargetLanguage, (title: string) => string> = {
  en: (title) => `Which sentence correctly demonstrates "${title}"?`,
  es: (title) => `¿Qué oración demuestra correctamente "${title}"?`,
  pt: (title) => `Qual frase demonstra corretamente "${title}"?`,
};

const INTRO_TEXT: Record<TargetLanguage, (level: string, topic: string) => string> = {
  en: (level, t) =>
    `In this ${level}-level lesson, we'll explore essential vocabulary and phrases about "${t}". Get ready to level up your real-world communication skills!`,
  es: (level, t) =>
    `En esta lección de nivel ${level}, exploraremos vocabulario y frases esenciales sobre "${t}". ¡Prepárate para mejorar tus habilidades de comunicación real!`,
  pt: (level, t) =>
    `Nesta lição de nível ${level}, vamos explorar vocabulário e frases essenciais sobre "${t}". Prepare-se para elevar suas habilidades de comunicação real!`,
};

const IDIOM_STEP: Record<TargetLanguage, { label: string; meaning: string }> = {
  en: { label: "Idiom", meaning: "It means" },
  es: { label: "Modismo", meaning: "Significa" },
  pt: { label: "Expressão Idiomática", meaning: "O significado é" },
};

const PRACTICE_PROMPT: Record<TargetLanguage, (topic: string, level: string) => string> = {
  en: (t, level) => `You're practicing "${t}" at ${level} level. Say something related to Lume!`,
  es: (t, level) => `Estás practicando "${t}" en nivel ${level}. ¡Dile algo relacionado a Lume!`,
  pt: (t, level) =>
    `Você está praticando o tema "${t}" em nível ${level}. Diga algo relacionado para Lume!`,
};

interface RawStep {
  type: string;
  [key: string]: unknown;
}
interface RawLesson {
  id: string;
  title: string;
  language: TargetLanguage;
  level: string;
  duration: string;
  xp: number;
  color: string;
  description: string;
  category: string;
  icon: string;
  subtitle: string;
  topic?: LessonTopic;
  steps: RawStep[];
}

type GrammarItem = { id: string; title: string; explanation: string; examples: string[] };
type IdiomItem = { id: string; idiom: string; meaning: string; examples: string[] };
const grammarByLang = grammarData as unknown as Record<TargetLanguage, GrammarItem[]>;
const idiomsByLang = idiomsData as unknown as Record<TargetLanguage, IdiomItem[]>;

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
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function baseTitle(title: string): string {
  return title.replace(/\s*-\s*Volume(n)?\s*\d+$/i, "").trim();
}

function buildGrammarQuizStep(lang: TargetLanguage, seedKey: string): RawStep {
  const bank = grammarByLang[lang];
  const seedNum = hashString(seedKey);
  const rand = mulberry32(seedNum);
  const grammarItem = bank[Math.floor(rand() * bank.length)];
  const correct = grammarItem.examples[Math.floor(rand() * grammarItem.examples.length)];

  const otherItems = shuffleWithSeed(
    bank.filter((g) => g.id !== grammarItem.id),
    seedNum + 1,
  ).slice(0, 3);
  const distractors = otherItems.map(
    (g) => g.examples[Math.floor(mulberry32(hashString(g.id + seedKey))() * g.examples.length)],
  );

  const options = shuffleWithSeed(
    [correct, ...distractors].filter((v, i, arr) => arr.indexOf(v) === i),
    seedNum + 2,
  );

  return {
    type: "quiz",
    title: `Gramática: ${grammarItem.title}`,
    question: GRAMMAR_STEP_PROMPT[lang](grammarItem.title),
    options,
    correct: options.indexOf(correct),
  };
}

// --- Phase 1: patch the 630 existing lessons (description + grammar quiz) ---
function patchExistingLesson(lesson: RawLesson): RawLesson {
  const key = baseTitle(lesson.title);
  const topic = TOPIC_TITLE_TO_TOPIC[key];
  if (topic) lesson.topic = topic;

  lesson.description = DESCRIPTION_TEMPLATE[lesson.language](key);

  const grammarStepIdx = lesson.steps.findIndex(
    (s, i) =>
      s.type === "quiz" && lesson.steps.filter((x, j) => x.type === "quiz" && j <= i).length === 2,
  );
  if (grammarStepIdx >= 0) {
    lesson.steps[grammarStepIdx] = buildGrammarQuizStep(lesson.language, lesson.id + "-grammar");
  }

  return lesson;
}

// --- Phase 2: generate new lessons for the 10 missing topics ---
function generateTopicLessons(topic: LessonTopic, lang: TargetLanguage): RawLesson[] {
  const glossLanguage: TargetLanguage = lang === "pt" ? "en" : "pt";
  const topicLabel = TOPIC_META[topic].label[lang];
  const langGrammar = grammarByLang[lang];
  const langIdioms = idiomsByLang[lang];
  const lessons: RawLesson[] = [];

  for (let i = 0; i < VOLUMES_PER_TOPIC; i++) {
    const volume = i + 1;
    const seedKey = `${topic}-${lang}-v${volume}`;
    const level = LEVELS[Math.floor(i / (VOLUMES_PER_TOPIC / LEVELS.length))] || "A2";
    const difficulty: "beginner" | "intermediate" | "advanced" =
      level <= "A2" ? "beginner" : level <= "B2" ? "intermediate" : "advanced";
    const category = CATEGORIES[i % CATEGORIES.length];
    const color = categoryColors[category] || "#FF7A45";
    const icon = category === "listening" ? "🎧" : category === "grammar" ? "📖" : "🗣️";

    const vocabItems = getVocabularyForTopic(topic, lang, {
      difficulty,
      interfaceLanguage: glossLanguage,
      count: 3,
      seed: seedKey,
    });
    if (vocabItems.length < 3) continue;

    const title = `${topicLabel} - Volume ${volume}`;
    const steps: RawStep[] = [];

    steps.push({
      type: "intro",
      title: `Bem-vindo: ${title}`,
      text: INTRO_TEXT[lang](level, topicLabel),
    });

    steps.push({
      type: "vocab",
      title: "Vocabulário do Dia",
      words: vocabItems.map((v) => ({ word: v.term, meaning: v.translation, example: v.example })),
    });

    // Translation quiz (vocab word 0)
    {
      const target = vocabItems[0];
      const extraPool = getVocabularyForTopic(topic, lang, {
        difficulty,
        interfaceLanguage: glossLanguage,
        count: 6,
        seed: `${seedKey}-quiz`,
      });
      const distractors = extraPool
        .filter((v) => v.term !== target.term)
        .map((v) => v.translation)
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .slice(0, 3);
      const options = shuffleWithSeed(
        [target.translation, ...distractors],
        hashString(seedKey + "-quiz"),
      );
      steps.push({
        type: "quiz",
        title: "Desafio de Tradução",
        question: TRANSLATION_QUIZ_PROMPT[glossLanguage](target.term),
        options,
        correct: options.indexOf(target.translation),
      });
    }

    // Listening (vocab word 1)
    {
      const target = vocabItems[1];
      const distractorWords = [vocabItems[0].term, vocabItems[2]?.term].filter(Boolean) as string[];
      const extra = getVocabularyForTopic(topic, lang, {
        difficulty,
        count: 6,
        seed: `${seedKey}-listen`,
      }).find((v) => v.term !== target.term && !distractorWords.includes(v.term));
      const options = shuffleWithSeed(
        [target.term, ...distractorWords, extra?.term]
          .filter((v, idx, arr): v is string => Boolean(v) && arr.indexOf(v) === idx)
          .slice(0, 4),
        hashString(seedKey + "-listen"),
      );
      steps.push({
        type: "listening",
        title: "Desafio de Compreensão Auditiva",
        question: "Ouça a frase com atenção e selecione a palavra correta pronunciada.",
        audioText: target.example,
        options,
        correct: options.indexOf(target.term),
      });
    }

    // Speaking (pronunciation) — vocab word 2's real example sentence
    steps.push({
      type: "speaking",
      title: "Prática de Pronúncia",
      text: "Fale a seguinte frase em voz alta no microfone:",
      targetPhrase: vocabItems[2].example,
    });

    // Translation (free-text) step — uses vocab word 0's own sentence pair
    steps.push({
      type: "translation",
      title: "Desafio de Escrita",
      question: `${vocabItems[0].example}`,
      targetPhrase: vocabItems[0].example,
      correctTranslation: vocabItems[0].exampleTranslation || vocabItems[0].translation,
      explanation: `"${vocabItems[0].example}" → "${vocabItems[0].exampleTranslation || vocabItems[0].translation}"`,
    });

    // Drag & drop — real same-language distractor tokens from the topic pool
    {
      const sentence = vocabItems[1].example;
      const answerTokens = sentence
        .split(/\s+/)
        .map((w) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ""));
      const answerSet = new Set(answerTokens.map((w) => w.toLowerCase()));
      const distractorPool = getVocabularyForTopic(topic, lang, {
        difficulty,
        count: 10,
        seed: `${seedKey}-dragdrop`,
      })
        .flatMap((v) => v.term.split(/\s+/))
        .filter((w) => !answerSet.has(w.toLowerCase()));
      const realDistractors = shuffleWithSeed(
        [...new Set(distractorPool)],
        hashString(seedKey + "-dd"),
      ).slice(0, 3);
      const tokens = shuffleWithSeed(
        [...answerTokens, ...realDistractors],
        hashString(seedKey + "-dd-shuffle"),
      );
      steps.push({
        type: "dragdrop",
        title: "Organize a Frase",
        question: `Ordene as palavras para formar a frase: "${sentence}"`,
        sentence,
        tokens,
        answerTokens,
      });
    }

    // Grammar quiz — real distractors, localized to the lesson's own language
    steps.push(buildGrammarQuizStep(lang, seedKey + "-grammar"));

    // Idiom speaking (not currently rendered in-app, kept for schema parity/future use)
    {
      const idiomItem = langIdioms[i % langIdioms.length];
      steps.push({
        type: "speaking",
        title: `${IDIOM_STEP[lang].label}: ${idiomItem.idiom}`,
        text: `${IDIOM_STEP[lang].meaning}: "${idiomItem.meaning}". ${
          lang === "pt"
            ? "Pronuncie a frase de exemplo:"
            : lang === "es"
              ? "Pronuncia la frase de ejemplo:"
              : "Say the example sentence out loud:"
        }`,
        targetPhrase: idiomItem.examples[0],
      });
    }

    steps.push({
      type: "practice",
      title:
        lang === "pt"
          ? "Conversação Livre Lume AI"
          : lang === "es"
            ? "Conversación Libre Lume AI"
            : "Free Chat with Lume AI",
      chatPrompt: PRACTICE_PROMPT[lang](topicLabel, level),
    });

    const seed = volume;
    lessons.push({
      id: `lesson-${lang}-${topic}-${volume}`,
      title,
      language: lang,
      level,
      duration: `${5 + (seed % 6)} min`,
      xp: 40 + (seed % 30),
      color,
      description: DESCRIPTION_TEMPLATE[lang](topicLabel),
      category,
      icon,
      subtitle: `${topicLabel} (${level})`,
      topic,
      steps,
    });
  }

  return lessons;
}

// --- Run ---
const raw = fs.readFileSync(FILE_PATH, "utf8");
const existingLessons: RawLesson[] = JSON.parse(raw);
const patched = existingLessons.map(patchExistingLesson);

const generated: RawLesson[] = [];
for (const topic of NEW_TOPICS) {
  for (const lang of LANGS) {
    generated.push(...generateTopicLessons(topic, lang));
  }
}

const all = [...patched, ...generated];
fs.writeFileSync(FILE_PATH, JSON.stringify(all, null, 2) + "\n", "utf8");

for (const lang of LANGS) {
  const perLang = all.filter((l) => l.language === lang);
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "data", `masterContent.${lang}.json`),
    JSON.stringify(perLang, null, 2) + "\n",
    "utf8",
  );
  console.log(`masterContent.${lang}.json: ${perLang.length} lessons`);
}

console.log(
  `Total: ${all.length} lessons (${existingLessons.length} patched + ${generated.length} new)`,
);
