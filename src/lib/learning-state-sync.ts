import { accountKey, accountOwner } from "./account-storage";
import { supabase } from "@/integrations/supabase/client";
import {
  emptyLearningState,
  mergeLearningState,
  quizStreaks,
  type LearningState,
} from "./learning-state";

export const LEARNING_CHANGED = "lume-learning-data-changed";
export function notifyLearningChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LEARNING_CHANGED));
}
function read(key: string, fallback: any) {
  try {
    return JSON.parse(localStorage.getItem(accountKey(key)) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export function readLearningState(): LearningState {
  const stats = read("lume-quiz-stats", {}),
    saved = read("lume-saved-words", []);
  return mergeLearningState(emptyLearningState(), {
    attempts: Array.isArray(stats.history) ? stats.history : [],
    reviews: read("lume_spaced_repetition", {}),
    words: Object.fromEntries(
      (Array.isArray(saved) ? saved : [])
        .filter((w) => w && typeof w.id === "string")
        .map((w) => [w.id, w]),
    ),
    recentIds: read("lume-quiz-recent-ids", []),
    bestStreak: Number(stats.bestStreak) || 0,
  });
}
function persist(state: LearningState) {
  const streak = quizStreaks(state.attempts);
  localStorage.setItem(
    accountKey("lume-quiz-stats"),
    JSON.stringify({
      history: state.attempts,
      ...streak,
      bestStreak: Math.max(streak.bestStreak, state.bestStreak),
    }),
  );
  localStorage.setItem(accountKey("lume_spaced_repetition"), JSON.stringify(state.reviews));
  localStorage.setItem(accountKey("lume-saved-words"), JSON.stringify(Object.values(state.words)));
  localStorage.setItem(accountKey("lume-quiz-recent-ids"), JSON.stringify(state.recentIds));
  window.dispatchEvent(new Event("lume-learning-data-restored"));
}
export async function syncLearningState(userId: string) {
  if (accountOwner() !== userId) return;
  const snapshot = readLearningState();
  const { data, error } = await (supabase as any).rpc("sync_learning_state", { p_state: snapshot });
  if (error) throw new Error("Learning sync unavailable");
  if (accountOwner() !== userId) return;
  // Local reviews/answers made while the request was in flight must survive.
  persist(mergeLearningState(data as LearningState, readLearningState()));
}
