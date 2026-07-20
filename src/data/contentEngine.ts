/**
 * CONTENT ENGINE - Real Lesson Integration
 * Now uses masterContent.json and filters by targetLanguage
 */

import masterContent from "./masterContent.json";
import { injectContextualVocabulary } from "./contextualVocabulary";

// Import real lesson data
const REAL_LESSONS = masterContent as any[];

// 50 CITIES DATA (kept for cultural content)
export const CITIES = [
  // English-speaking
  { id: 'london', name: 'London', country: 'UK', flag: '🇬🇧', lang: 'en', accent: 'British', lat: 51.5074, lng: -0.1278, content: 1850, image: 'london' },
  { id: 'nyc', name: 'New York', country: 'USA', flag: '🇺🇸', lang: 'en', accent: 'American', lat: 40.7128, lng: -74.0060, content: 2100, image: 'newyork' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', flag: '🇦🇺', lang: 'en', accent: 'Australian', lat: -33.8688, lng: 151.2093, content: 980, image: 'sydney' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', flag: '🇨🇦', lang: 'en', accent: 'Canadian', lat: 43.6532, lng: -79.3832, content: 850, image: 'toronto' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', lang: 'en', accent: 'Irish', lat: 53.3498, lng: -6.2603, content: 720, image: 'dublin' },
  
  // Spanish-speaking
  { id: 'madrid', name: 'Madrid', country: 'Spain', flag: '🇪🇸', lang: 'es', accent: 'Castilian', lat: 40.4168, lng: -3.7038, content: 1620, image: 'madrid' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', lang: 'es', accent: 'Catalan', lat: 41.3851, lng: 2.1734, content: 1580, image: 'barcelona' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', flag: '🇲🇽', lang: 'es', accent: 'Mexican', lat: 19.4326, lng: -99.1332, content: 1890, image: 'mexicocity' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', lang: 'es', accent: 'Rioplatense', lat: -34.6037, lng: -58.3816, content: 1420, image: 'buenosaires' },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', flag: '🇨🇴', lang: 'es', accent: 'Colombian', lat: 4.7110, lng: -74.0721, content: 1180, image: 'bogota' },
  
  // Portuguese-speaking  
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷', lang: 'pt', accent: 'Carioca', lat: -22.9068, lng: -43.1729, content: 1680, image: 'rio' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', flag: '🇧🇷', lang: 'pt', accent: 'Paulista', lat: -23.5505, lng: -46.6333, content: 1920, image: 'saopaulo' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', lang: 'pt', accent: 'European', lat: 38.7223, lng: -9.1393, content: 1350, image: 'lisbon' },
  
  // Other major cities
  { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', lang: 'fr', accent: 'Parisian', lat: 48.8566, lng: 2.3522, content: 1620, image: 'paris' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', lang: 'de', accent: 'Standard', lat: 52.5200, lng: 13.4050, content: 1420, image: 'berlin' },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', lang: 'it', accent: 'Roman', lat: 41.9028, lng: 12.4964, content: 1450, image: 'rome' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', lang: 'ja', accent: 'Standard', lat: 35.6762, lng: 139.6503, content: 1720, image: 'tokyo' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', flag: '🇰🇷', lang: 'ko', accent: 'Standard', lat: 37.5665, lng: 126.9780, content: 1280, image: 'seoul' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', flag: '🇨🇳', lang: 'zh', accent: 'Mandarin', lat: 31.2304, lng: 121.4737, content: 1180, image: 'shanghai' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', flag: '🇮🇳', lang: 'hi', accent: 'Hindi', lat: 19.0760, lng: 72.8777, content: 980, image: 'mumbai' },
];

// CACHE per language
let cachedLessonsEN: any[] | null = null;
let cachedLessonsES: any[] | null = null;
let cachedLessonsPT: any[] | null = null;

// Generate lessons filtered by target language from REAL masterContent
export function generateLessons(
  targetLanguage: "en" | "es" | "pt",
  count: number, 
  completedLessons: string[] = []
) {
  // Check cache for this language
  const cache = targetLanguage === 'en' ? cachedLessonsEN : targetLanguage === 'es' ? cachedLessonsES : cachedLessonsPT;
  
  if (cache && cache.length >= count) {
    return cache.slice(0, count).map(lesson => ({
      ...lesson,
      completed: completedLessons.includes(lesson.id),
      locked: false, // Home lessons are always unlocked for quick access
      progress: completedLessons.includes(lesson.id) ? 100 : 0,
    }));
  }

  // Filter real lessons by language
  const lessonsInLanguage = REAL_LESSONS.filter(lesson => lesson.language === targetLanguage);
  
  // Map to home format
  const lessons = lessonsInLanguage.slice(0, count).map((lesson, i) => {
    const isCompleted = completedLessons.includes(lesson.id);
    
    // Map level to difficulty
    const difficultyMap: Record<string, string> = {
      "A1": "Beginner",
      "A2": "Beginner", 
      "B1": "Intermediate",
      "B2": "Intermediate",
      "C1": "Advanced",
      "C2": "Advanced",
    };
    
    return {
      id: lesson.id,
      lessonNumber: i + 1,
      title: lesson.title,
      description: lesson.description || lesson.subtitle || `Master ${lesson.category}`,
      difficulty: difficultyMap[lesson.level] || "Intermediate",
      type: lesson.category ? lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1) : "Lesson",
      topic: lesson.category || "General",
      duration: parseInt(lesson.duration) || 6,
      xp: lesson.xp || 20,
      completed: isCompleted,
      locked: false,
      progress: isCompleted ? 100 : 0,
      language: lesson.language,
      level: lesson.level,
      category: lesson.category,
    };
  });
  
  // Cache for this language
  if (targetLanguage === 'en') cachedLessonsEN = lessons;
  else if (targetLanguage === 'es') cachedLessonsES = lessons;
  else cachedLessonsPT = lessons;
  
  return lessons;
}

// CACHE: Store generated quizzes per language
let cachedQuizzesEN: any[] | null = null;
let cachedQuizzesES: any[] | null = null;
let cachedQuizzesPT: any[] | null = null;

// Generate quiz content filtered by target language
export function generateQuizzes(
  targetLanguage: "en" | "es" | "pt",
  count: number
) {
  const cache = targetLanguage === 'en' ? cachedQuizzesEN : targetLanguage === 'es' ? cachedQuizzesES : cachedQuizzesPT;
  
  if (cache && cache.length >= count) {
    return cache.slice(0, count);
  }

  // Filter real lessons by language
  const lessonsInLanguage = REAL_LESSONS.filter(lesson => lesson.language === targetLanguage);
  
  const quizzes = [];
  for (let i = 0; i < Math.min(count, lessonsInLanguage.length); i++) {
    const lesson = lessonsInLanguage[i];
    quizzes.push({
      id: `quiz-${targetLanguage}-${i}`,
      title: `Quick Quiz: ${lesson.title}`,
      questions: 10,
      difficulty: lesson.level.startsWith('A') ? 'Beginner' : lesson.level.startsWith('B') ? 'Intermediate' : 'Advanced',
      xp: lesson.xp || 20,
      bestScore: null,
      language: targetLanguage,
      category: lesson.category,
    });
  }
  
  // Cache for this language
  if (targetLanguage === 'en') cachedQuizzesEN = quizzes;
  else if (targetLanguage === 'es') cachedQuizzesES = quizzes;
  else cachedQuizzesPT = quizzes;
  
  return quizzes;
}

// SIMULATED USERS for social features
export const SIMULATED_USERS = [
  { id: 1, name: 'Ana Silva', avatar: '👩', level: 42, xp: 12580, country: '🇧🇷', streak: 156 },
  { id: 2, name: 'Mike Chen', avatar: '👨', level: 38, xp: 10240, country: '🇺🇸', streak: 89 },
  { id: 3, name: 'Sophie Martin', avatar: '👩', level: 51, xp: 18760, country: '🇫🇷', streak: 234 },
  { id: 4, name: 'Carlos Méndez', avatar: '👨', level: 29, xp: 7120, country: '🇲🇽', streak: 67 },
  { id: 5, name: 'Yuki Tanaka', avatar: '👩', level: 46, xp: 15340, country: '🇯🇵', streak: 178 },
];

/**
 * Get full lesson detail with steps from masterContent
 * Injects contextual vocabulary to replace generic/repeated words
 */
export function getLessonDetail(lessonId: string): any | null {
  const lesson = REAL_LESSONS.find(l => l.id === lessonId);
  
  if (!lesson) {
    return null;
  }

  // Inject contextual vocabulary before returning
  return injectContextualVocabulary(lesson);
}

/**
 * Get lesson by language and index
 * Useful for sequential learning
 */
export function getLessonByLanguageAndIndex(
  targetLanguage: "en" | "es" | "pt",
  index: number
): any | null {
  const lessonsInLanguage = REAL_LESSONS.filter(l => l.language === targetLanguage);
  
  if (index < 0 || index >= lessonsInLanguage.length) {
    return null;
  }

  const lesson = lessonsInLanguage[index];
  return injectContextualVocabulary(lesson);
}

