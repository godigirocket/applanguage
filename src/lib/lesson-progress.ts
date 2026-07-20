/**
 * LESSON PROGRESS TRACKING
 * Manages individual lesson completion and progress with Supabase + localStorage fallback
 */

import { supabase } from "./supabase";

export interface LessonProgress {
  id?: string;
  user_id: string;
  lesson_id: string;
  status: string;
  score?: number | null;
  xp_earned: number;
  progress: number; // 0-100
  current_step?: number | null;
  total_steps?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at: string;
  created_at?: string;
}

// Upsert progress (create or update)
export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  updates: Partial<LessonProgress>
): Promise<LessonProgress | null> {
  try {
    const now = new Date().toISOString();
    const data: any = {
      user_id: userId,
      lesson_id: lessonId,
      updated_at: now,
      ...updates,
    };

    // If completing, set completed_at
    if (updates.status === "completed" && !updates.completed_at) {
      data.completed_at = now;
    }

    // If starting, set started_at
    if (updates.status === "in_progress" && !updates.started_at) {
      data.started_at = now;
    }

    const { data: result, error } = await supabase
      .from("lesson_progress")
      .upsert(data, { onConflict: "user_id,lesson_id" })
      .select()
      .single();

    if (error) {
      console.warn("Supabase progress save failed, using localStorage:", error.message);
      saveProgressLocally(userId, lessonId, data);
      return data as LessonProgress;
    }

    return result;
  } catch (error) {
    console.warn("Progress save error, using localStorage:", error);
    const data: any = { user_id: userId, lesson_id: lessonId, updated_at: new Date().toISOString(), ...updates };
    saveProgressLocally(userId, lessonId, data);
    return data as LessonProgress;
  }
}

// Get progress for a specific lesson
export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  try {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) {
      return getProgressLocally(userId, lessonId);
    }

    return data;
  } catch {
    return getProgressLocally(userId, lessonId);
  }
}

// Get all progress for user
export async function getAllLessonProgress(userId: string): Promise<LessonProgress[]> {
  try {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return getAllProgressLocally(userId);
    }

    return data || [];
  } catch {
    return getAllProgressLocally(userId);
  }
}

// Complete a lesson (awards XP, prevents duplicate awards)
export async function completeLesson(
  userId: string,
  lessonId: string,
  xpReward: number,
  durationSeconds: number
): Promise<{ success: boolean; alreadyCompleted: boolean; xpEarned: number }> {
  try {
    // Check if already completed
    const existing = await getLessonProgress(userId, lessonId);
    
    if (existing?.status === "completed") {
      return { success: true, alreadyCompleted: true, xpEarned: 0 };
    }

    // Mark as completed
    await upsertLessonProgress(userId, lessonId, {
      status: "completed",
      progress: 100,
      xp_earned: xpReward,
      completed_at: new Date().toISOString(),
    });

    // Update user profile XP
    await updateUserXP(userId, xpReward);

    return { success: true, alreadyCompleted: false, xpEarned: xpReward };
  } catch (error) {
    console.error("Complete lesson error:", error);
    // Fallback: save to localStorage
    const existing = getProgressLocally(userId, lessonId);
    if (existing?.status === "completed") {
      return { success: true, alreadyCompleted: true, xpEarned: 0 };
    }

    saveProgressLocally(userId, lessonId, {
      user_id: userId,
      lesson_id: lessonId,
      status: "completed",
      progress: 100,
      xp_earned: xpReward,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    addLocalXP(xpReward);

    return { success: true, alreadyCompleted: false, xpEarned: xpReward };
  }
}

// Update user XP in profiles table
async function updateUserXP(userId: string, xpToAdd: number) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", userId)
      .single();

    const currentXP = profile?.xp || 0;
    const newXP = currentXP + xpToAdd;

    await supabase
      .from("profiles")
      .update({ xp: newXP, updated_at: new Date().toISOString() })
      .eq("id", userId);
  } catch (error) {
    console.warn("XP update failed, using localStorage");
    addLocalXP(xpToAdd);
  }
}

// ══════════════════════════════════════════════════════════════
// LOCALSTORAGE FALLBACK (when Supabase unavailable)
// ══════════════════════════════════════════════════════════════

function getProgressKey(userId: string): string {
  return `lume_lesson_progress_${userId}`;
}

function saveProgressLocally(userId: string, lessonId: string, progress: any) {
  if (typeof localStorage === "undefined") return;
  
  try {
    const key = getProgressKey(userId);
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    existing[lessonId] = progress;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (error) {
    console.error("localStorage save error:", error);
  }
}

function getProgressLocally(userId: string, lessonId: string): LessonProgress | null {
  if (typeof localStorage === "undefined") return null;
  
  try {
    const key = getProgressKey(userId);
    const all = JSON.parse(localStorage.getItem(key) || "{}");
    return all[lessonId] || null;
  } catch {
    return null;
  }
}

function getAllProgressLocally(userId: string): LessonProgress[] {
  if (typeof localStorage === "undefined") return [];
  
  try {
    const key = getProgressKey(userId);
    const all = JSON.parse(localStorage.getItem(key) || "{}");
    return Object.values(all);
  } catch {
    return [];
  }
}

function addLocalXP(amount: number) {
  if (typeof localStorage === "undefined") return;
  
  try {
    const current = parseInt(localStorage.getItem("lume_xp") || "0");
    localStorage.setItem("lume_xp", String(current + amount));
  } catch (error) {
    console.error("localStorage XP error:", error);
  }
}

// Get stats for dashboard
export async function getLessonStats(userId: string) {
  try {
    const progress = await getAllLessonProgress(userId);
    
    const completed = progress.filter(p => p.status === "completed");
    const inProgress = progress.filter(p => p.status === "in_progress");
    const totalXP = completed.reduce((sum, p) => sum + (p.xp_earned || 0), 0);
    
    return {
      total: progress.length,
      completed: completed.length,
      inProgress: inProgress.length,
      totalXP,
      completionRate: progress.length > 0 ? (completed.length / progress.length) * 100 : 0,
    };
  } catch {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      totalXP: 0,
      completionRate: 0,
    };
  }
}
