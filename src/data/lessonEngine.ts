import vocabulary from "./vocabulary.json";

export type LessonCategory = "vocabulary" | "grammar" | "listening" | "reading" | "speaking";
export type TargetLanguage = "en" | "es" | "pt";

export interface LessonStep {
  type: "intro" | "vocabulary" | "quiz" | "practice" | "listening" | "speaking";
  title?: string;
  content?: string;
  words?: { word: string; meaning: string; example: string }[];
  question?: string;
  options?: string[];
  correct?: number;
  prompt?: string;
  audioText?: string;
  targetPhrase?: string;
  Asset_Visual_Description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  language: TargetLanguage;
  level: string;
  duration: string;
  xp: number;
  color: string;
  description: string;
  category: LessonCategory;
  steps: LessonStep[];
}

// Pseudo-random generator based on seed (id)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateLesson(
  language: TargetLanguage,
  category: LessonCategory,
  seed: number,
): Lesson {
  const rand = mulberry32(seed);
  const vocabList = vocabulary[language as keyof typeof vocabulary] || [];

  if (vocabList.length === 0) {
    return generateFallbackLesson(language, category, seed);
  }

  // Helper to shuffle array pseudo-randomly
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Helper to get random item from array
  const randomItem = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // Choose colors and meta based on category
  let themeColor = "#2D4A3E";
  let catTitle = "Vocabulário";
  let level = "A2";
  let xp = 40;
  let duration = "6 min";
  let desc = "Domine novas expressões e consolide com IA.";

  if (category === "listening") {
    themeColor = "#1B3A4B";
    catTitle = "Audição";
    level = "B1";
    xp = 45;
    duration = "7 min";
    desc = "Desafie seus ouvidos e melhore a pronúncia.";
  } else if (category === "speaking") {
    themeColor = "#C4714A";
    catTitle = "Conversação";
    level = "B2";
    xp = 50;
    duration = "8 min";
    desc = "Fale em voz alta e receba notas de voz reais.";
  } else if (category === "grammar") {
    themeColor = "#7850B4";
    catTitle = "Estrutura";
    level = "B1";
    xp = 45;
    duration = "7 min";
    desc = "Descubra a estrutura e fluxo da língua.";
  }

  // Get a unique selection of 4 words for options and questions
  const shuffledVocab = shuffle(vocabList);
  const mainWords = shuffledVocab.slice(0, 3);
  const distractorWords = shuffledVocab.slice(3, 7);

  // Steps Builder: Make it an elite multi-step journey!
  const steps: LessonStep[] = [];

  // Step 1: Rich Introduction
  steps.push({
    type: "intro",
    title: `Sessão Premium: ${catTitle} #${seed}`,
    content: `Bem-vindo a esta jornada interativa Lume! Hoje, vamos guiar você por um conjunto rico de palavras expressivas, testes auditivos, pronúncia e uma conversa final com nossa IA.`,
  });

  const visualTypes = ["termômetro", "gráfico", "moedas"];
  const stepVisual = visualTypes[seed % visualTypes.length];

  // Step 2: Vocabulary Presentation (3 words with definitions and examples)
  steps.push({
    type: "vocabulary",
    words: mainWords.map((w) => ({
      word: w.word,
      meaning: w.translation,
      example: w.example,
    })),
    Asset_Visual_Description: stepVisual,
  });

  // Step 3: Vocabulary Multiple Choice Quiz (based on Word 1)
  const quizWord = mainWords[0];
  const quizOptions = shuffle([
    quizWord.translation,
    distractorWords[0].translation,
    distractorWords[1].translation,
    distractorWords[2].translation,
  ]);
  steps.push({
    type: "quiz",
    question: `Qual é o significado correto da palavra "${quizWord.word}"?`,
    options: quizOptions,
    correct: quizOptions.indexOf(quizWord.translation),
    Asset_Visual_Description: stepVisual,
  });

  // Step 4: Listening Comprehension (based on Word 2)
  const listenWord = mainWords[1];
  const listenOptions = shuffle([
    listenWord.word,
    distractorWords[0].word,
    distractorWords[1].word,
    distractorWords[3].word,
  ]);
  steps.push({
    type: "listening",
    audioText: listenWord.example,
    question: `Ouça o áudio com atenção. Qual palavra foi pronunciada na frase?`,
    options: listenOptions,
    correct: listenOptions.indexOf(listenWord.word),
  });

  // Step 5: Accent & Speaking Coach (based on Word 3)
  const speakWord = mainWords[2];
  steps.push({
    type: "speaking",
    title: "Treinamento de Pronúncia",
    content:
      "Aperte o microfone abaixo e leia a frase nativa em voz alta para receber sua nota instantânea.",
    targetPhrase: speakWord.example,
  });

  // Step 6: Interactive AI Conversation consolidation
  steps.push({
    type: "practice",
    prompt: `Olá! Vamos praticar o que você aprendeu hoje. Tente usar uma das seguintes expressões em nossa conversa: "${mainWords[0].word}" ou "${mainWords[2].word}". Como vai o seu dia?`,
    Asset_Visual_Description: stepVisual,
  });

  return {
    id: `premium-${category}-${language}-${seed}`,
    title: `${catTitle} Elite: ${mainWords[0].word}`,
    language,
    level,
    duration,
    xp,
    color: themeColor,
    description: `Aprenda sobre "${mainWords[0].word}", treine sua fala com "${speakWord.word}" e converse com a IA.`,
    category,
    steps,
  };
}

function generateFallbackLesson(
  language: TargetLanguage,
  category: LessonCategory,
  seed: number,
): Lesson {
  return {
    id: `generic-${language}-${seed}`,
    title: `Sessão de Prática #${seed}`,
    language,
    level: "A1",
    duration: "5 min",
    xp: 15,
    color: "#7850B4",
    description: "Sessão de prática geral para aprimoramento.",
    category,
    steps: [{ type: "intro", title: "Bem-vindo", content: "Vamos praticar." }],
  };
}

export function getLessonCatalogue(language: TargetLanguage, count: number = 1200): Lesson[] {
  const lessons: Lesson[] = [];
  const categories: LessonCategory[] = ["vocabulary", "listening", "speaking", "grammar"];

  for (let i = 1; i <= count; i++) {
    const cat = categories[(i - 1) % categories.length];
    lessons.push(generateLesson(language, cat, i));
  }
  return lessons;
}
