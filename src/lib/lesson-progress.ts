import { accountKey } from "@/lib/account-storage";
import { createClient } from "@supabase/supabase-js";
/**
 * LESSON PROGRESS TRACKING
 * Manages individual lesson completion and progress with Supabase + localStorage fallback
 */

import { supabase } from "./supabase";
import { withTimeout } from "./promise-timeout";

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
const pendingWrites = new Map<string, Promise<LessonProgress | null>>();
export function upsertLessonProgress(
  userId: string,
  lessonId: string,
  updates: Partial<LessonProgress>,
): Promise<LessonProgress | null> {
  const key = `${userId}:${lessonId}`;
  const previous = pendingWrites.get(key) || Promise.resolve(null);
  const next = previous
    .catch(() => null)
    .then(() => writeLessonProgress(userId, lessonId, updates));
  pendingWrites.set(key, next);
  void next.finally(() => {
    if (pendingWrites.get(key) === next) pendingWrites.delete(key);
  });
  return next;
}

async function writeLessonProgress(
  userId: string,
  lessonId: string,
  updates: Partial<LessonProgress>,
): Promise<LessonProgress | null> {
  const previous = getProgressLocally(userId, lessonId);
  // Replaying or a late autosave must never undo a completed lesson.
  if (previous?.status === "completed" && updates.status !== "completed") return previous;
  const snapshot = {
    ...previous,
    ...updates,
    user_id: userId,
    lesson_id: lessonId,
    updated_at: new Date().toISOString(),
  };
  saveProgressLocally(userId, lessonId, snapshot);
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

    // First create a missing row without replacing an existing completion.
    const insert = await withTimeout(
      supabase
        .from("lesson_progress")
        .upsert(data, { onConflict: "user_id,lesson_id", ignoreDuplicates: true }),
      6000,
    );
    if (insert.error) throw insert.error;
    let query = supabase
      .from("lesson_progress")
      .update(data)
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);
    if (updates.status !== "completed") query = query.neq("status", "completed");
    const { data: result, error } = await withTimeout(query.select().maybeSingle(), 6000);

    if (error) {
      console.warn("Supabase progress save failed, using localStorage:", error.message);
      saveProgressLocally(userId, lessonId, { ...snapshot, ...data });
      return data as LessonProgress;
    }

    if (result) saveProgressLocally(userId, lessonId, result);
    return result || getProgressLocally(userId, lessonId);
  } catch (error) {
    console.warn("Progress save error, using localStorage:", error);
    const data: any = {
      user_id: userId,
      lesson_id: lessonId,
      updated_at: new Date().toISOString(),
      ...updates,
    };
    saveProgressLocally(userId, lessonId, data);
    return data as LessonProgress;
  }
}

// Get progress for a specific lesson
export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .maybeSingle(),
      6000,
    );

    if (error) {
      return getProgressLocally(userId, lessonId);
    }

    const local = getProgressLocally(userId, lessonId);
    const merged = preferProgress(local, data);
    if (merged) saveProgressLocally(userId, lessonId, merged);
    return merged;
  } catch {
    return getProgressLocally(userId, lessonId);
  }
}

// Get all progress for user
export async function getAllLessonProgress(userId: string): Promise<LessonProgress[]> {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      6000,
    );

    if (error) {
      return getAllProgressLocally(userId);
    }

    const merged = new Map(getAllProgressLocally(userId).map((p) => [p.lesson_id, p]));
    for (const remote of data || []) {
      const progress = preferProgress(merged.get(remote.lesson_id) || null, remote)!;
      merged.set(remote.lesson_id, progress);
      saveProgressLocally(userId, remote.lesson_id, progress);
    }
    return [...merged.values()];
  } catch {
    return getAllProgressLocally(userId);
  }
}

// Durable per-account outbox. Failed writes stay pending for a later retry.
interface PendingCompletion {
  lessonId: string;
  xp: number;
  completedAt?: string;
}
function pendingKey(userId: string, lessonId = "") {
  return `lume-completion-outbox:${userId}:${lessonId}`;
}
function readPending(userId: string): Record<string, PendingCompletion> {
  try {
    const result: Record<string, PendingCompletion> = {};
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(pendingKey(userId))) {
        const item = JSON.parse(localStorage.getItem(key) || "null");
        if (item?.lessonId && Number.isFinite(item.xp)) result[item.lessonId] = item;
      }
    }
    return result;
  } catch {
    return {};
  }
}
export async function completeLesson(
  userId: string,
  lessonId: string,
  xpReward: number,
  _durationSeconds: number,
) {
  let completedAt = new Date().toISOString();
  try {
    completedAt =
      JSON.parse(localStorage.getItem(pendingKey(userId, lessonId)) || "null")?.completedAt ||
      completedAt;
  } catch {
    /* No prior pending write */
  }
  try {
    localStorage.setItem(
      pendingKey(userId, lessonId),
      JSON.stringify({ lessonId, xp: xpReward, completedAt }),
    );
  } catch {
    /* Storage unavailable */
  }
  try {
    // Bind this write to the initiating session: a token refresh/account
    // switch must never submit account A's outbox as account B.
    const { data: sessionData } = await withTimeout(supabase.auth.getSession(), 6000);
    if (sessionData.session?.user.id !== userId) throw new Error("Account changed");
    const client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${sessionData.session.access_token}` } },
      },
    );
    const { data, error } = await withTimeout<{ data: any; error: unknown }>(
      client.rpc("complete_lesson_atomic", {
        p_lesson_id: lessonId,
        p_completed_at: completedAt,
      }),
      8000,
    );
    if (error || !data?.success) throw error || new Error("Completion not confirmed");
    try {
      localStorage.removeItem(pendingKey(userId, lessonId));
    } catch {
      /* Storage unavailable */
    }
    saveProgressLocally(userId, lessonId, {
      user_id: userId,
      lesson_id: lessonId,
      status: "completed",
      completed_at: completedAt,
      progress: 100,
      xp_earned: data.alreadyCompleted
        ? getProgressLocally(userId, lessonId)?.xp_earned || xpReward
        : data.xpEarned || 0,
      updated_at: new Date().toISOString(),
    });
    return { ...data, pending: false } as {
      success: boolean;
      alreadyCompleted: boolean;
      xpEarned: number;
      totalXP: number;
      pending: boolean;
    };
  } catch {
    saveProgressLocally(userId, lessonId, {
      user_id: userId,
      lesson_id: lessonId,
      status: "completed",
      completed_at: completedAt,
      progress: 100,
      xp_earned: xpReward,
      updated_at: new Date().toISOString(),
    });
    return { success: false, alreadyCompleted: false, xpEarned: xpReward, pending: true };
  }
}
export async function flushPendingCompletions(userId: string) {
  let flushed = false;
  for (const item of Object.values(readPending(userId))) {
    const result = await completeLesson(userId, item.lessonId, item.xp, 0);
    if (!result.success) break;
    flushed = true;
  }
  return flushed;
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
    existing[lessonId] = preferProgress(existing[lessonId] || null, progress);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (error) {
    console.error("localStorage save error:", error);
  }
}

function preferProgress(
  local: LessonProgress | null,
  remote: LessonProgress | null,
): LessonProgress | null {
  if (!local) return remote;
  if (!remote) return local;
  if (local.status === "completed" && remote.status !== "completed") return local;
  if (remote.status === "completed" && local.status !== "completed") return remote;
  return local.updated_at > remote.updated_at ? local : remote;
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
    const current = parseInt(localStorage.getItem(accountKey("lume_xp")) || "0");
    localStorage.setItem(accountKey("lume_xp"), String(current + amount));
  } catch (error) {
    console.error("localStorage XP error:", error);
  }
}

// Get stats for dashboard
export async function getLessonStats(userId: string) {
  try {
    const progress = await getAllLessonProgress(userId);

    const completed = progress.filter((p) => p.status === "completed");
    const inProgress = progress.filter((p) => p.status === "in_progress");
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
