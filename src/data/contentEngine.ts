/**
 * CONTENT ENGINE - Real Lesson Integration
 *
 * masterContent.json used to be one ~2MB-per-language file with all 710
 * lessons' full content (vocab, quiz, listening steps included), and
 * getAllMasterLessons()/generateLessons()/generateQuizzes() all loaded that
 * entire file — even /home and /lessons, which only render title/level/
 * category/xp/duration, and even opening ONE lesson by id, which loaded
 * all 710 lessons' full steps just to find one. That was the single
 * biggest source of load-time lag in the app.
 *
 * scripts/split-master-content.mjs pre-splits each language's content into:
 *   - lessons/index.<lang>.json — lightweight metadata only (~210KB vs ~2MB)
 *   - lessons/detail/<lang>/<id>.json — one ~3KB file per lesson with the
 *     full `steps` array, fetched only when that lesson is actually opened.
 */

type TargetLang = "en" | "es" | "pt";

// Metadata-only listing (no `steps`) for every lesson in a language —
// what /home, /lessons, and id/order lookups actually need.
async function loadIndexForLanguage(targetLanguage: TargetLang): Promise<any[]> {
  switch (targetLanguage) {
    case "en":
      return (await import("./lessons/index.en.json")).default as any[];
    case "es":
      return (await import("./lessons/index.es.json")).default as any[];
    case "pt":
      return (await import("./lessons/index.pt.json")).default as any[];
  }
}

// Vite code-splits each matched file into its own lazily-loaded chunk, so
// this registers 2130 tiny import()s without eagerly loading any of them.
const lessonDetailLoaders = import.meta.glob("./lessons/detail/*/*.json", {
  import: "default",
}) as Record<string, () => Promise<any>>;

async function loadLessonDetail(targetLanguage: TargetLang, id: string): Promise<any | undefined> {
  const loader = lessonDetailLoaders[`./lessons/detail/${targetLanguage}/${id}.json`];
  return loader ? loader() : undefined;
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

// CACHE per language — holds only the lightweight index (no `steps`)
const lessonsIndexCache: Partial<Record<TargetLang, any[]>> = {};

async function getIndex(targetLanguage: TargetLang): Promise<any[]> {
  let index = lessonsIndexCache[targetLanguage];
  if (!index) {
    index = await loadIndexForLanguage(targetLanguage);
    lessonsIndexCache[targetLanguage] = index;
  }
  return index;
}

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const TIER_TO_CEFR: Record<string, string> = {
  beginner: "A1",
  intermediate: "B1",
  advanced: "C1",
};

// Onboarding stores a 3-tier word ("beginner"/"intermediate"/"advanced"),
// while the in-app level modal/auto-adjust popup store a 6-tier CEFR code
// ("A1".."C2") under the same `learningLevel`/`userLevel` fields — normalize
// either shape to a CEFR anchor used to pick where a user's curriculum starts.
export function normalizeStartLevel(rawLevel: string | undefined | null): string | undefined {
  if (!rawLevel) return undefined;
  const lower = rawLevel.toLowerCase();
  if (TIER_TO_CEFR[lower]) return TIER_TO_CEFR[lower];
  const upper = rawLevel.toUpperCase();
  return CEFR_LEVELS.includes(upper) ? upper : undefined;
}

export function cefrToTier(cefr: string | undefined): string {
  if (!cefr) return "All";
  if (cefr.startsWith("A")) return "Beginner";
  if (cefr.startsWith("B")) return "Intermediate";
  if (cefr.startsWith("C")) return "Advanced";
  return "All";
}

// Generate lessons filtered by target language from REAL masterContent
export async function generateLessons(
  targetLanguage: TargetLang,
  count: number,
  completedLessons: string[] = [],
  options: { progressiveLock?: boolean; startLevel?: string } = {},
) {
  const { progressiveLock = false, startLevel } = options;
  const lessonsInLanguage = await getIndex(targetLanguage);

  const difficultyMap: Record<string, string> = {
    A1: "Beginner",
    A2: "Beginner",
    B1: "Intermediate",
    B2: "Intermediate",
    C1: "Advanced",
    C2: "Advanced",
  };

  // A user who picked "Advanced" at onboarding shouldn't have to grind through
  // hundreds of A1 lessons first — find where their chosen level first shows
  // up in the curriculum and treat everything before that as already unlocked
  // (freely available for review), applying the strict sequential lock only
  // from that point on.
  const startIndex = startLevel
    ? Math.max(
        0,
        lessonsInLanguage.findIndex((lesson) => lesson.level === startLevel),
      )
    : 0;

  return lessonsInLanguage.slice(0, count).map((lesson, i) => {
    const isCompleted = completedLessons.includes(lesson.id);
    // Duolingo-style progression: lesson N only unlocks once lesson N-1 (in
    // curriculum order) is completed. Callers that want quick access to
    // anything (e.g. the /home dashboard) opt out via progressiveLock=false.
    const locked =
      progressiveLock &&
      i > startIndex &&
      !completedLessons.includes(lessonsInLanguage[i - 1].id);
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
      locked,
      progress: isCompleted ? 100 : 0,
      language: lesson.language,
      level: lesson.level,
      category: lesson.category,
    };
  });
}

// Metadata-only lesson list (no `steps`) for the given language — used for
// id/order lookups (e.g. "what's the next lesson after this one") that
// don't need any lesson's full vocab/quiz/listening content.
export async function getAllMasterLessons(targetLanguage: TargetLang): Promise<any[]> {
  return getIndex(targetLanguage);
}

// Fetches one full lesson (all its `steps`) by id — the only place that
// actually loads a lesson's full content, and only for the one lesson
// being opened, not the other 709 in that language.
export async function getMasterLessonById(
  id: string,
  targetLanguage: TargetLang,
): Promise<any | undefined> {
  return loadLessonDetail(targetLanguage, id);
}

// Generate quiz content filtered by target language
export async function generateQuizzes(targetLanguage: TargetLang, count: number) {
  const lessonsInLanguage = await getIndex(targetLanguage);

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

// getLessonDetail / getLessonByLanguageAndIndex removed — dead code (never
// called from anywhere in the app) that routed through the also-dead
// injectContextualVocabulary in ./contextualVocabulary.ts, which has been
// deleted. Real per-lesson content now comes from src/lib/language-content.
