/**
 * CONTENT ENGINE - Real Lesson Integration
 *
 * masterContent.json used to be one ~2MB file with all 3 languages' lessons,
 * loaded in full any time a single-language user visited /home. It's split
 * into masterContent.en.json / .es.json / .pt.json, and only the target
 * language's file is dynamically imported — roughly a 3x smaller download
 * for a typical single-language session.
 */

type TargetLang = "en" | "es" | "pt";

async function loadLessonsForLanguage(targetLanguage: TargetLang): Promise<any[]> {
  switch (targetLanguage) {
    case "en":
      return (await import("./masterContent.en.json")).default as any[];
    case "es":
      return (await import("./masterContent.es.json")).default as any[];
    case "pt":
      return (await import("./masterContent.pt.json")).default as any[];
  }
}

// 50 CITIES DATA (kept for cultural content)
export const CITIES = [
  // English-speaking
  {
    id: "london",
    name: "London",
    country: "UK",
    flag: "🇬🇧",
    lang: "en",
    accent: "British",
    lat: 51.5074,
    lng: -0.1278,
    content: 1850,
    image: "london",
  },
  {
    id: "nyc",
    name: "New York",
    country: "USA",
    flag: "🇺🇸",
    lang: "en",
    accent: "American",
    lat: 40.7128,
    lng: -74.006,
    content: 2100,
    image: "newyork",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    lang: "en",
    accent: "Australian",
    lat: -33.8688,
    lng: 151.2093,
    content: 980,
    image: "sydney",
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    lang: "en",
    accent: "Canadian",
    lat: 43.6532,
    lng: -79.3832,
    content: 850,
    image: "toronto",
  },
  {
    id: "dublin",
    name: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    lang: "en",
    accent: "Irish",
    lat: 53.3498,
    lng: -6.2603,
    content: 720,
    image: "dublin",
  },

  // Spanish-speaking
  {
    id: "madrid",
    name: "Madrid",
    country: "Spain",
    flag: "🇪🇸",
    lang: "es",
    accent: "Castilian",
    lat: 40.4168,
    lng: -3.7038,
    content: 1620,
    image: "madrid",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    lang: "es",
    accent: "Catalan",
    lat: 41.3851,
    lng: 2.1734,
    content: 1580,
    image: "barcelona",
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    flag: "🇲🇽",
    lang: "es",
    accent: "Mexican",
    lat: 19.4326,
    lng: -99.1332,
    content: 1890,
    image: "mexicocity",
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    flag: "🇦🇷",
    lang: "es",
    accent: "Rioplatense",
    lat: -34.6037,
    lng: -58.3816,
    content: 1420,
    image: "buenosaires",
  },
  {
    id: "bogota",
    name: "Bogotá",
    country: "Colombia",
    flag: "🇨🇴",
    lang: "es",
    accent: "Colombian",
    lat: 4.711,
    lng: -74.0721,
    content: 1180,
    image: "bogota",
  },

  // Portuguese-speaking
  {
    id: "rio",
    name: "Rio de Janeiro",
    country: "Brazil",
    flag: "🇧🇷",
    lang: "pt",
    accent: "Carioca",
    lat: -22.9068,
    lng: -43.1729,
    content: 1680,
    image: "rio",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    lang: "pt",
    accent: "Paulista",
    lat: -23.5505,
    lng: -46.6333,
    content: 1920,
    image: "saopaulo",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    lang: "pt",
    accent: "European",
    lat: 38.7223,
    lng: -9.1393,
    content: 1350,
    image: "lisbon",
  },

  // Other major cities
  {
    id: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    lang: "fr",
    accent: "Parisian",
    lat: 48.8566,
    lng: 2.3522,
    content: 1620,
    image: "paris",
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    lang: "de",
    accent: "Standard",
    lat: 52.52,
    lng: 13.405,
    content: 1420,
    image: "berlin",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    lang: "it",
    accent: "Roman",
    lat: 41.9028,
    lng: 12.4964,
    content: 1450,
    image: "rome",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    lang: "ja",
    accent: "Standard",
    lat: 35.6762,
    lng: 139.6503,
    content: 1720,
    image: "tokyo",
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    lang: "ko",
    accent: "Standard",
    lat: 37.5665,
    lng: 126.978,
    content: 1280,
    image: "seoul",
  },
  {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    flag: "🇨🇳",
    lang: "zh",
    accent: "Mandarin",
    lat: 31.2304,
    lng: 121.4737,
    content: 1180,
    image: "shanghai",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    flag: "🇮🇳",
    lang: "hi",
    accent: "Hindi",
    lat: 19.076,
    lng: 72.8777,
    content: 980,
    image: "mumbai",
  },
];

// CACHE per language
const lessonsCache: Partial<Record<TargetLang, any[]>> = {};

// Generate lessons filtered by target language from REAL masterContent
export async function generateLessons(
  targetLanguage: TargetLang,
  count: number,
  completedLessons: string[] = [],
) {
  let lessonsInLanguage = lessonsCache[targetLanguage];
  if (!lessonsInLanguage) {
    lessonsInLanguage = await loadLessonsForLanguage(targetLanguage);
    lessonsCache[targetLanguage] = lessonsInLanguage;
  }

  const difficultyMap: Record<string, string> = {
    A1: "Beginner",
    A2: "Beginner",
    B1: "Intermediate",
    B2: "Intermediate",
    C1: "Advanced",
    C2: "Advanced",
  };

  return lessonsInLanguage.slice(0, count).map((lesson, i) => {
    const isCompleted = completedLessons.includes(lesson.id);
    return {
      id: lesson.id,
      lessonNumber: i + 1,
      title: lesson.title,
      description: lesson.description || lesson.subtitle || `Master ${lesson.category}`,
      difficulty: difficultyMap[lesson.level] || "Intermediate",
      type: lesson.category
        ? lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)
        : "Lesson",
      topic: lesson.category || "General",
      duration: parseInt(lesson.duration) || 6,
      xp: lesson.xp || 20,
      completed: isCompleted,
      locked: false, // Home lessons are always unlocked for quick access
      progress: isCompleted ? 100 : 0,
      language: lesson.language,
      level: lesson.level,
      category: lesson.category,
    };
  });
}

// Raw, full-fidelity lesson list (all `steps`, not the trimmed card shape
// generateLessons() returns) for the given language, cached alongside it.
export async function getAllMasterLessons(targetLanguage: TargetLang): Promise<any[]> {
  let lessonsInLanguage = lessonsCache[targetLanguage];
  if (!lessonsInLanguage) {
    lessonsInLanguage = await loadLessonsForLanguage(targetLanguage);
    lessonsCache[targetLanguage] = lessonsInLanguage;
  }
  return lessonsInLanguage;
}

// Fetches one full lesson (all its `steps`) by id, from the same
// masterContent source that generateLessons() uses for the /home and
// /lessons card listings — so clicking a card always opens the lesson it
// actually advertised, instead of an unrelated lesson from a different
// legacy content system.
export async function getMasterLessonById(
  id: string,
  targetLanguage: TargetLang,
): Promise<any | undefined> {
  const lessonsInLanguage = await getAllMasterLessons(targetLanguage);
  return lessonsInLanguage.find((l) => l.id === id);
}

// Generate quiz content filtered by target language
export async function generateQuizzes(targetLanguage: TargetLang, count: number) {
  let lessonsInLanguage = lessonsCache[targetLanguage];
  if (!lessonsInLanguage) {
    lessonsInLanguage = await loadLessonsForLanguage(targetLanguage);
    lessonsCache[targetLanguage] = lessonsInLanguage;
  }

  const quizzes = [];
  for (let i = 0; i < Math.min(count, lessonsInLanguage.length); i++) {
    const lesson = lessonsInLanguage[i];
    quizzes.push({
      id: `quiz-${targetLanguage}-${i}`,
      title: `Quick Quiz: ${lesson.title}`,
      questions: 10,
      difficulty: lesson.level.startsWith("A")
        ? "Beginner"
        : lesson.level.startsWith("B")
          ? "Intermediate"
          : "Advanced",
      xp: lesson.xp || 20,
      bestScore: null,
      language: targetLanguage,
      category: lesson.category,
    });
  }

  return quizzes;
}

// SIMULATED_USERS moved to ./communityUsers.ts so routes that only need the
// user list (e.g. community.tsx) don't have to load masterContent too.

// getLessonDetail / getLessonByLanguageAndIndex removed — dead code (never
// called from anywhere in the app) that routed through the also-dead
// injectContextualVocabulary in ./contextualVocabulary.ts, which has been
// deleted. Real per-lesson content now comes from src/lib/language-content.
