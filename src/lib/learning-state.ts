export interface QuizAttempt {
  id?: string;
  date: string;
  score: number;
  total: number;
}
export interface LearningState {
  attempts: QuizAttempt[];
  reviews: Record<
    string,
    { wordId: string; interval: number; lastReview: number; correctStreak: number }
  >;
  words: Record<string, Record<string, unknown>>;
  recentIds: string[];
  bestStreak: number;
}
export const emptyLearningState = (): LearningState => ({
  attempts: [],
  reviews: {},
  words: {},
  recentIds: [],
  bestStreak: 0,
});
export const attemptId = (a: QuizAttempt) => a.id || `${a.date}:${a.score}/${a.total}`;
export function mergeLearningState(left: LearningState, right: LearningState): LearningState {
  const attempts = [
    ...new Map(
      [...left.attempts, ...right.attempts]
        .filter(
          (a) =>
            a &&
            Number.isFinite(Date.parse(a.date)) &&
            Number.isInteger(a.total) &&
            a.total > 0 &&
            Number.isInteger(a.score) &&
            a.score >= 0 &&
            a.score <= a.total,
        )
        .map((a) => [attemptId(a), { ...a, id: attemptId(a) }]),
    ).values(),
  ]
    .sort((a, b) => a.date.localeCompare(b.date) || attemptId(a).localeCompare(attemptId(b)))
    .slice(-100);
  const reviews = { ...left.reviews },
    words = { ...left.words };
  for (const [id, value] of Object.entries(right.reviews))
    if (
      value &&
      Number.isFinite(value.lastReview) &&
      (!reviews[id] || value.lastReview > reviews[id].lastReview)
    )
      reviews[id] = value;
  const stamp = (w: Record<string, unknown>) => String(w.lastReviewedAt || w.updatedAt || "");
  const reviewed = (w: Record<string, unknown>) =>
    Boolean(w.lastReviewedAt) || Number(w.correctAnswers) > 0 || Number(w.mistakes) > 0;
  for (const [id, value] of Object.entries(right.words))
    if (
      value &&
      typeof value.term === "string" &&
      (!words[id] ||
        Number(reviewed(value)) > Number(reviewed(words[id])) ||
        (reviewed(value) === reviewed(words[id]) && stamp(value) > stamp(words[id])))
    )
      words[id] = value;
  return {
    attempts,
    reviews,
    words,
    recentIds: [
      ...new Set(
        [...left.recentIds, ...right.recentIds].filter((x) => typeof x === "string").reverse(),
      ),
    ]
      .reverse()
      .slice(-300),
    bestStreak: Math.max(left.bestStreak || 0, right.bestStreak || 0),
  };
}
export function quizStreaks(attempts: QuizAttempt[]) {
  let currentStreak = 0,
    bestStreak = 0;
  for (const a of attempts) {
    currentStreak = a.total > 0 && a.score / a.total >= 0.7 ? currentStreak + 1 : 0;
    bestStreak = Math.max(bestStreak, currentStreak);
  }
  return { currentStreak, bestStreak };
}
