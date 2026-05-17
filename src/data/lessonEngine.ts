import vocabulary from './vocabulary.json';

export type LessonCategory = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking';
export type TargetLanguage = 'en' | 'es' | 'fr';

export interface LessonStep {
  type: 'intro' | 'vocabulary' | 'quiz' | 'practice' | 'listening' | 'speaking';
  title?: string;
  content?: string;
  words?: { word: string; meaning: string; example: string }[];
  question?: string;
  options?: string[];
  correct?: number;
  prompt?: string;
  audioText?: string;
  targetPhrase?: string;
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
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function generateLesson(language: TargetLanguage, category: LessonCategory, seed: number): Lesson {
  const rand = mulberry32(seed);
  const vocabList = vocabulary[language as keyof typeof vocabulary] || [];
  
  if (vocabList.length === 0) {
      return generateFallbackLesson(language, category, seed);
  }

  // Helper to get a random word
  const getRandomWord = () => vocabList[Math.floor(rand() * vocabList.length)];

  if (category === 'vocabulary') {
    const selectedWords = [];
    const usedIndices = new Set<number>();
    while (selectedWords.length < 5 && selectedWords.length < vocabList.length) {
      const idx = Math.floor(rand() * vocabList.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selectedWords.push(vocabList[idx]);
      }
    }

    const quizOptions = selectedWords.map(w => w.translation);
    for (let i = quizOptions.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [quizOptions[i], quizOptions[j]] = [quizOptions[j], quizOptions[i]];
    }
    const correctIdx = quizOptions.indexOf(selectedWords[0].translation);

    return {
      id: `vocab-${language}-${seed}`,
      title: `Vocabulary Builder #${seed}`,
      language,
      level: 'A1',
      duration: '5 min',
      xp: 20,
      color: '#2D4A3E',
      description: 'Aprenda novas palavras essenciais e pratique seu uso.',
      category: 'vocabulary',
      steps: [
        { type: 'intro', title: 'Novas Palavras', content: 'Vamos expandir seu vocabulário hoje.' },
        { type: 'vocabulary', words: selectedWords.map(w => ({ word: w.word, meaning: w.translation, example: w.example })) },
        { type: 'quiz', question: `O que significa a palavra "${selectedWords[0].word}"?`, options: quizOptions, correct: correctIdx },
        { type: 'practice', prompt: `Tente usar a palavra "${selectedWords[0].word}" em uma frase curta.` }
      ]
    };
  }

  if (category === 'listening') {
    const targetWord = getRandomWord();
    const otherWords = [getRandomWord(), getRandomWord(), getRandomWord()];
    const options = [targetWord.word, ...otherWords.map(w => w.word)];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      id: `listen-${language}-${seed}`,
      title: `Listening Practice #${seed}`,
      language,
      level: 'A2',
      duration: '4 min',
      xp: 25,
      color: '#1B3A4B',
      description: 'Treine seus ouvidos com frases faladas por nativos virtuais.',
      category: 'listening',
      steps: [
        { type: 'intro', title: 'Compreensão Auditiva', content: 'Ouça o áudio com atenção e responda a pergunta.' },
        { type: 'listening', audioText: targetWord.example, question: `Qual destas palavras foi mencionada no áudio?`, options: options, correct: options.indexOf(targetWord.word) }
      ]
    };
  }

  if (category === 'speaking') {
    const targetWord = getRandomWord();
    return {
      id: `speak-${language}-${seed}`,
      title: `Pronunciation Coach #${seed}`,
      language,
      level: 'A2',
      duration: '3 min',
      xp: 30,
      color: '#C4714A',
      description: 'Fale no microfone e receba feedback em tempo real da sua pronúncia.',
      category: 'speaking',
      steps: [
        { type: 'intro', title: 'Treinador de Pronúncia', content: 'Aperte o microfone, leia a frase em voz alta e veja como você se sai.' },
        { type: 'speaking', targetPhrase: targetWord.example }
      ]
    };
  }

  return generateFallbackLesson(language, category, seed);
}

function generateFallbackLesson(language: TargetLanguage, category: LessonCategory, seed: number): Lesson {
   return {
    id: `generic-${language}-${seed}`,
    title: `Sessão de Prática #${seed}`,
    language,
    level: 'A1',
    duration: '5 min',
    xp: 15,
    color: '#7850B4',
    description: 'Sessão de prática geral.',
    category,
    steps: [{ type: 'intro', title: 'Bem-vindo', content: 'Vamos praticar.' }]
  };
}

export function getLessonCatalogue(language: TargetLanguage, count: number = 30): Lesson[] {
    const lessons: Lesson[] = [];
    for (let i = 1; i <= count; i++) {
        const catValue = i % 3;
        let cat: LessonCategory = 'vocabulary';
        if (catValue === 1) cat = 'listening';
        if (catValue === 2) cat = 'speaking';
        lessons.push(generateLesson(language, cat, i));
    }
    return lessons;
}
