import { useEffect } from "react";
import { useStore } from "./useStore";
import { accountOwner } from "@/lib/account-storage";
import { getAllLessonProgress, flushPendingCompletions } from "@/lib/lesson-progress";
import { useQueryClient } from "@tanstack/react-query";
import { profileQueryOptions } from "./useProfile";
import { syncLearningState, LEARNING_CHANGED } from "@/lib/learning-state-sync";
import { setSyncStatus } from "@/lib/sync-status";

export function useLearningSync(userId?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!userId) {
      setSyncStatus("waiting");
      return;
    }
    let active = true;
    let running = false;
    let requested = false;
    let debounce: ReturnType<typeof setTimeout>;
    const sync = async () => {
      if (running) {
        requested = true;
        return;
      }
      if (!navigator.onLine) {
        setSyncStatus("offline");
        return;
      }
      running = true;
      setSyncStatus("syncing");
      try {
        const flushed = await flushPendingCompletions(userId);
        const [progress, profile] = await Promise.all([
          getAllLessonProgress(userId),
          queryClient.fetchQuery({
            ...profileQueryOptions(userId),
            staleTime: flushed ? 0 : 30_000,
          }),
        ]);
        if (!active || accountOwner() !== userId) return;
        const state = useStore.getState();
        useStore.setState({
          completedLessons: [
            ...new Set([
              ...state.completedLessons,
              ...progress.filter((p) => p.status === "completed").map((p) => p.lesson_id),
            ]),
          ],
        });
        if (profile) {
          state.setXP(Math.max(state.xp, profile.xp || 0));
          state.setStreak(Math.max(state.streak, profile.streak || 0));
        }
        await syncLearningState(userId);
        if (active && accountOwner() === userId) setSyncStatus("synced");
      } catch {
        if (active && accountOwner() === userId)
          setSyncStatus(navigator.onLine ? "error" : "offline");
      } finally {
        running = false;
        if (requested && active) {
          requested = false;
          void sync();
        }
      }
    };
    const changed = () => {
      clearTimeout(debounce);
      debounce = setTimeout(sync, 800);
    };
    const offline = () => setSyncStatus("offline");
    void sync();
    window.addEventListener("online", sync);
    window.addEventListener("focus", sync);
    window.addEventListener(LEARNING_CHANGED, changed);
    window.addEventListener("lume-learning-sync-request", sync);
    window.addEventListener("offline", offline);
    return () => {
      active = false;
      clearTimeout(debounce);
      window.removeEventListener("online", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener(LEARNING_CHANGED, changed);
      window.removeEventListener("lume-learning-sync-request", sync);
      window.removeEventListener("offline", offline);
    };
  }, [userId, queryClient]);
}
