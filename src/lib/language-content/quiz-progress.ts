/**
 * Real, localStorage-backed quiz completion tracking — feeds /progress and
 * badge checks instead of the hardcoded `quizzesCompleted: 0` that was there
 * before. Also tracks recently-answered question ids so quiz generation can
 * avoid repeating the same questions across sessions.
 */

const STATS_KEY = "lume-quiz-stats";
const RECENT_IDS_KEY = "lume-quiz-recent-ids";
const MAX_TRACKED_IDS = 300;
const MAX_HISTORY = 100;

interface QuizAttempt {
  date: string;
  score: number;
  total: number;
}

interface QuizStats {
  history: QuizAttempt[];
  currentStreak: number;
  bestStreak: number;
}

function readStats(): QuizStats {
  if (typeof window === "undefined") return { history: [], currentStreak: 0, bestStreak: 0 };
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as QuizStats) : { history: [], currentStreak: 0, bestStreak: 0 };
  } catch {
    return { history: [], currentStreak: 0, bestStreak: 0 };
  }
}

function writeStats(stats: QuizStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // storage full/disabled — stats just won't persist this session
  }
}

/** Records one completed quiz attempt. Safe to call exactly once per finished quiz. */
export function recordQuizCompletion(score: number, total: number): void {
  const stats = readStats();
  const passed = total > 0 && score / total >= 0.7;

  stats.history.push({ date: new Date().toISOString(), score, total });
  if (stats.history.length > MAX_HISTORY) stats.history = stats.history.slice(-MAX_HISTORY);

  stats.currentStreak = passed ? stats.currentStreak + 1 : 0;
  stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);

  writeStats(stats);
}

export function getQuizStats(): { quizzesCompleted: number; bestQuizStreak: number } {
  const stats = readStats();
  return { quizzesCompleted: stats.history.length, bestQuizStreak: stats.bestStreak };
}

function readRecentIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_IDS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function getRecentlySeenQuestionIds(): Set<string> {
  return new Set(readRecentIds());
}

/** Appends newly-seen question ids, capping the tracked list so it doesn't grow forever. */
export function recordSeenQuestionIds(ids: string[]): void {
  if (typeof window === "undefined" || ids.length === 0) return;
  try {
    const existing = readRecentIds();
    const merged = [...existing, ...ids];
    const capped = merged.slice(Math.max(0, merged.length - MAX_TRACKED_IDS));
    localStorage.setItem(RECENT_IDS_KEY, JSON.stringify(capped));
  } catch {
    // storage full/disabled — repetition avoidance just resets this session
  }
}
