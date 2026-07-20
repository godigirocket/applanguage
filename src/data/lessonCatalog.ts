/**
 * LESSON CATALOG - Real, Generated Lessons
 * Uses lessonEngine.ts + vocabularyExpanded.json to create real, navigable content
 */

import { getLessonCatalogue, type Lesson as EngineLesson, type LessonStep as EngineLessonStep, type TargetLanguage as EngineLanguage } from "./lessonEngine";
import { ALL_LESSONS } from "@/lib/lessons-data";

export type LessonLanguage = "en" | "es" | "pt";
export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type LessonCategory = "vocabulary" | "grammar" | "listening" | "reading" | "speaking";

export interface LessonCard {
  id: string;
  title: string;
  description: string;
  language: LessonLanguage;
  level: LessonLevel;
  category: LessonCategory;
  duration: number; // minutes
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: string; // display type
  locked: boolean;
  completed: boolean;
  progress: number; // 0-100
  isPremium: boolean; // manual editorial lessons
  engineSteps?: EngineLessonStep[]; // real, language-matched steps from lessonEngine (when available)
}

// Map engine lessons to our card format
function engineLessonToCard(engineLesson: EngineLesson, index: number, completedLessons: string[]): LessonCard {
  const id = engineLesson.id;
  const completed = completedLessons.includes(id);
  
  // Progressive unlock: lesson N requires lesson N-1 to be completed
  const prevLessonId = index > 0 ? `lume-${engineLesson.category}-${engineLesson.language}-${index}` : null;
  const locked = index > 0 && prevLessonId ? !completedLessons.includes(prevLessonId) : false;

  // Map levels
  const levelMap: Record<string, LessonLevel> = {
    "A1": "A1",
    "A2": "A2",
    "B1": "B1",
    "B2": "B2",
    "C1": "C1",
    "C2": "C2",
  };

  const level = levelMap[engineLesson.level] || "A2";

  // Map difficulty
  const difficultyMap: Record<LessonLevel, "Beginner" | "Intermediate" | "Advanced"> = {
    "A1": "Beginner",
    "A2": "Beginner",
    "B1": "Intermediate",
    "B2": "Intermediate",
    "C1": "Advanced",
    "C2": "Advanced",
  };

  return {
    id,
    title: engineLesson.title,
    description: engineLesson.description,
    language: engineLesson.language as LessonLanguage,
    level,
    category: engineLesson.category,
    duration: parseInt(engineLesson.duration) || 6,
    xp: engineLesson.xp,
    difficulty: difficultyMap[level],
    type: capitalizeFirst(engineLesson.category),
    locked,
    completed,
    progress: completed ? 100 : 0,
    isPremium: false,
    engineSteps: engineLesson.steps,
  };
}

// Convert manual lessons to cards
function manualLessonToCard(manualLesson: typeof ALL_LESSONS[0], completedLessons: string[]): LessonCard {
  const completed = completedLessons.includes(manualLesson.id);

  // Map level string to CEFR
  const levelMap: Record<string, LessonLevel> = {
    "Beginner": "A2",
    "Intermediate": "B1",
    "Advanced": "C1",
  };

  const level = levelMap[manualLesson.level] || "A2";

  // Map category
  const categoryMap: Record<string, LessonCategory> = {
    "Vocabulary": "vocabulary",
    "Vocabulário": "vocabulary",
    "Grammar": "grammar",
    "Gramática": "grammar",
    "Idioms": "vocabulary",
    "Expressões": "vocabulary",
    "Culture": "reading",
    "Cultura": "reading",
  };

  const category = categoryMap[manualLesson.category] || "vocabulary";

  return {
    id: manualLesson.id,
    title: manualLesson.title,
    description: manualLesson.description,
    language: manualLesson.language as LessonLanguage,
    level,
    category,
    duration: parseInt(manualLesson.duration) || 5,
    xp: manualLesson.xp,
    difficulty: manualLesson.level as "Beginner" | "Intermediate" | "Advanced",
    type: manualLesson.category,
    locked: false, // Manual lessons always unlocked
    completed,
    progress: completed ? 100 : 0,
    isPremium: true, // Editorial quality
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ══════════════════════════════════════════════════════════════
// MAIN CATALOG GENERATION
// ══════════════════════════════════════════════════════════════

let cachedCatalog: LessonCard[] | null = null;

export function generateLessonCatalog(completedLessons: string[] = []): LessonCard[] {
  // Use cache if already generated (performance optimization)
  if (cachedCatalog && cachedCatalog.length > 0) {
    // Update only locked/completed status
    return cachedCatalog.map(lesson => ({
      ...lesson,
      completed: completedLessons.includes(lesson.id),
      progress: completedLessons.includes(lesson.id) ? 100 : lesson.progress,
      locked: lesson.isPremium ? false : checkIfLocked(lesson.id, completedLessons, cachedCatalog!),
    }));
  }

  const catalog: LessonCard[] = [];

  // 1. Add manual editorial lessons (4 premium quality)
  ALL_LESSONS.slice(0, 4).forEach(lesson => {
    catalog.push(manualLessonToCard(lesson, completedLessons));
  });

  // 2. Generate lessons from engine for each language
  // NOTE: vocabularyExpanded.json only has 15 real words per language today, and each
  // generated lesson draws 3-4 of them. 100/language meant the same 15 words got reshuffled
  // ~20x over, which is exactly the "content keeps repeating" complaint. Capped lower until
  // the vocab pool itself is expanded with more real, curated words (a content task, not a
  // code fix) — that's the actual constraint on lesson count, not this number.
  const languages: EngineLanguage[] = ["en", "es", "pt"];
  const lessonsPerLanguage = 20;

  languages.forEach(lang => {
    const engineLessons = getLessonCatalogue(lang, lessonsPerLanguage);
    engineLessons.forEach((engineLesson, index) => {
      catalog.push(engineLessonToCard(engineLesson, index, completedLessons));
    });
  });

  // Cache for future calls
  cachedCatalog = catalog;

  return catalog;
}

// Check if lesson should be locked
function checkIfLocked(lessonId: string, completedLessons: string[], allLessons: LessonCard[]): boolean {
  // Find lesson index
  const index = allLessons.findIndex(l => l.id === lessonId);
  if (index <= 0) return false; // First lesson always unlocked
  
  // Check if previous lesson is completed
  const prevLesson = allLessons[index - 1];
  return !completedLessons.includes(prevLesson.id);
}

// ══════════════════════════════════════════════════════════════
// CATALOG STATS
// ══════════════════════════════════════════════════════════════

export function getCatalogStats() {
  const catalog = generateLessonCatalog();

  const byLanguage = {
    en: catalog.filter(l => l.language === "en").length,
    es: catalog.filter(l => l.language === "es").length,
    pt: catalog.filter(l => l.language === "pt").length,
  };

  const byLevel = {
    A1: catalog.filter(l => l.level === "A1").length,
    A2: catalog.filter(l => l.level === "A2").length,
    B1: catalog.filter(l => l.level === "B1").length,
    B2: catalog.filter(l => l.level === "B2").length,
    C1: catalog.filter(l => l.level === "C1").length,
    C2: catalog.filter(l => l.level === "C2").length,
  };

  const byCategory = {
    vocabulary: catalog.filter(l => l.category === "vocabulary").length,
    grammar: catalog.filter(l => l.category === "grammar").length,
    listening: catalog.filter(l => l.category === "listening").length,
    reading: catalog.filter(l => l.category === "reading").length,
    speaking: catalog.filter(l => l.category === "speaking").length,
  };

  const byDifficulty = {
    Beginner: catalog.filter(l => l.difficulty === "Beginner").length,
    Intermediate: catalog.filter(l => l.difficulty === "Intermediate").length,
    Advanced: catalog.filter(l => l.difficulty === "Advanced").length,
  };

  return {
    total: catalog.length,
    premium: catalog.filter(l => l.isPremium).length,
    byLanguage,
    byLevel,
    byCategory,
    byDifficulty,
  };
}

// Get real counts for marketing
export function getRealContentCounts() {
  const stats = getCatalogStats();
  
  return {
    lessons: stats.total,
    languages: Object.keys(stats.byLanguage).length,
    levels: Object.values(stats.byLevel).filter(count => count > 0).length,
    categories: Object.values(stats.byCategory).filter(count => count > 0).length,
  };
}

console.log(`✅ Lesson Catalog: ${getCatalogStats().total} real lessons available`);
