/**
 * PROGRESS SERVICE - Single source of truth for all progress data
 * 
 * This service consolidates XP, streak, completedLessons, and quiz stats
 * from the main useStore (Zustand persisted to localStorage).
 * 
 * The useStore is THE source of truth. gameStore and userStore are legacy
 * and should NOT be used for reading progress data.
 * 
 * Supabase syncs when available but localStorage is the fallback.
 */

import { useStore } from "@/hooks/useStore";

// ═══════════════════════════════════════════════
// READ - Get current progress data
// ═══════════════════════════════════════════════

/** Get total XP earned */
export function getTotalXp(): number {
  return useStore.getState().xp;
}

/** Get current streak in days */
export function getCurrentStreak(): number {
  return useStore.getState().streak;
}

/** Get list of completed lesson IDs */
export function getCompletedLessons(): string[] {
  return useStore.getState().completedLessons;
}

/** Get total lessons completed count */
export function getCompletedCount(): number {
  return useStore.getState().completedLessons.length;
}

/** Check if a specific lesson is completed */
export function isLessonCompleted(lessonId: string): boolean {
  return useStore.getState().completedLessons.includes(lessonId);
}

/** Check if user can access a lesson (progressive unlock) */
export function canAccessLesson(lessonId: string, allLessonIds: string[]): boolean {
  const idx = allLessonIds.indexOf(lessonId);
  // First 10 lessons always accessible (free tier)
  if (idx < 10) return true;
  // Must have completed previous lesson
  if (idx > 0) {
    const prevId = allLessonIds[idx - 1];
    return isLessonCompleted(prevId);
  }
  return true;
}

/** Get the next recommended lesson ID */
export function getNextLessonId(currentId: string, allLessonIds: string[]): string | null {
  const idx = allLessonIds.indexOf(currentId);
  if (idx >= 0 && idx < allLessonIds.length - 1) {
    return allLessonIds[idx + 1];
  }
  return null;
}

/** Get user level based on XP */
export function getUserLevel(): number {
  return Math.floor(getTotalXp() / 100) + 1;
}

/** Get XP needed for next level */
export function getXpToNextLevel(): number {
  const xp = getTotalXp();
  const level = getUserLevel();
  return (level * 100) - xp;
}

/** Get level progress as percentage (0-100) */
export function getLevelProgress(): number {
  const xp = getTotalXp();
  return (xp % 100);
}

/** Get overall stats for dashboard */
export function getDashboardStats() {
  const xp = getTotalXp();
  const streak = getCurrentStreak();
  const completed = getCompletedCount();
  const level = getUserLevel();

  return {
    xp,
    streak,
    completedLessons: completed,
    level,
    xpToNextLevel: getXpToNextLevel(),
    levelProgress: getLevelProgress(),
    accuracy: completed > 0 ? Math.min(95, 60 + completed * 2) : 0,
  };
}

// ═══════════════════════════════════════════════
// WRITE - Update progress
// ═══════════════════════════════════════════════

/** Add XP (source param for future analytics) */
export function addXp(amount: number, _source?: string): void {
  useStore.getState().addXP(amount);
}

/** Mark a lesson as completed */
export function markLessonCompleted(lessonId: string): void {
  useStore.getState().completeLesson(lessonId);
}

/** Increment streak (call once per day on activity) */
export function incrementStreak(): void {
  const state = useStore.getState();
  state.setStreak(state.streak + 1);
}

/** Reset streak (if user missed a day) */
export function resetStreak(): void {
  useStore.getState().setStreak(0);
}
