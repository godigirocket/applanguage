/**
 * REAL CONTENT STATS - Números reais para marketing
 * NUNCA hardcodar números que podem ficar falsos
 */

import { generateLessonCatalog } from "@/data/lessonCatalog";

// Função para contar conteúdo real disponível
export function getRealContentStats() {
  // Lições: calculado dinamicamente
  const catalog = generateLessonCatalog([]);
  const totalLessons = catalog.length;

  // Idiomas: contagem real
  const languages = Array.from(new Set(catalog.map(l => l.language))).length;

  // Níveis: contagem real
  const levels = Array.from(new Set(catalog.map(l => l.level))).length;

  // Categorias: contagem real
  const categories = Array.from(new Set(catalog.map(l => l.category))).length;

  // Quizzes: ~3 perguntas por lição
  const quizzes = totalLessons * 3;

  // Jogos: contagem real (memory, hangman, quiz modes)
  const games = 5; // memory, hangman, quiz, vocabulary-lists, culture

  // Lições premium editoriais
  const premiumLessons = catalog.filter(l => l.isPremium).length;

  return {
    lessons: totalLessons,
    languages,
    levels,
    categories,
    quizzes,
    games,
    premiumLessons,
  };
}

// Funções helper para formatação
export function formatLessonsCount(isPT: boolean = true): string {
  const stats = getRealContentStats();
  if (isPT) {
    return stats.lessons >= 300 ? "300+ lições" : `${stats.lessons} lições`;
  }
  return stats.lessons >= 300 ? "300+ lessons" : `${stats.lessons} lessons`;
}

export function formatQuizzesCount(isPT: boolean = true): string {
  const stats = getRealContentStats();
  const roundedQuizzes = Math.floor(stats.quizzes / 100) * 100; // Arredondar para centena
  if (isPT) {
    return `${roundedQuizzes}+ questões`;
  }
  return `${roundedQuizzes}+ questions`;
}

export function formatGamesCount(): number {
  return getRealContentStats().games;
}

// Para uso em components
export const REAL_STATS = {
  get lessons() {
    return getRealContentStats().lessons;
  },
  get languages() {
    return getRealContentStats().languages;
  },
  get levels() {
    return getRealContentStats().levels;
  },
  get categories() {
    return getRealContentStats().categories;
  },
  get quizzes() {
    return getRealContentStats().quizzes;
  },
  get games() {
    return getRealContentStats().games;
  },
  get premiumLessons() {
    return getRealContentStats().premiumLessons;
  },
};

// Claims seguros para marketing
export const SAFE_MARKETING_CLAIMS = {
  pt: {
    lessons: "300+ lições estruturadas",
    quizzes: "900+ questões interativas",
    games: "5 modos de jogo",
    languages: "3 idiomas disponíveis",
    levels: "Do básico ao avançado",
    // Evitar claims específicos sem dados reais:
    // ❌ "10k estudantes", "98% satisfação", "2.847 alunos ativos"
  },
  en: {
    lessons: "300+ structured lessons",
    quizzes: "900+ interactive questions",
    games: "5 game modes",
    languages: "3 languages available",
    levels: "From beginner to advanced",
  },
  es: {
    lessons: "300+ lecciones estructuradas",
    quizzes: "900+ preguntas interactivas",
    games: "5 modos de juego",
    languages: "3 idiomas disponibles",
    levels: "De básico a avanzado",
  },
};

// Para substituir números falsos em landing/checkout
export function getMarketingNumbers(lang: "pt" | "en" | "es" = "pt") {
  const stats = getRealContentStats();
  
  return {
    lessons: {
      value: stats.lessons >= 300 ? "300+" : stats.lessons.toString(),
      label: SAFE_MARKETING_CLAIMS[lang].lessons,
    },
    quizzes: {
      value: "900+",
      label: SAFE_MARKETING_CLAIMS[lang].quizzes,
    },
    games: {
      value: stats.games.toString(),
      label: SAFE_MARKETING_CLAIMS[lang].games,
    },
    languages: {
      value: stats.languages.toString(),
      label: SAFE_MARKETING_CLAIMS[lang].languages,
    },
  };
}

/**
 * NUNCA usar:
 * - "12.000 lições" (só temos 304)
 * - "5.000 quizzes" (só temos ~900)
 * - "21 modos de jogo" (só temos 5)
 * - "10k estudantes" (sem dados reais)
 * - "98% satisfação" (sem dados reais)
 * - "2.847 alunos ativos" (sem dados reais)
 * - "maior plataforma", "mais eficaz", "melhor do mundo"
 * - "fluência garantida", "aprenda em X dias"
 */
