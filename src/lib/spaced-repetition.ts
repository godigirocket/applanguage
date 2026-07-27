/**
 * SPACED REPETITION ENGINE
 * 
 * Simple SM-2 inspired algorithm for reviewing saved vocabulary words.
 * Tracks last review time and interval per word in localStorage.
 */

const SR_KEY = "lume_spaced_repetition";

interface SREntry {
  wordId: string;
  interval: number; // hours until next review
  lastReview: number; // timestamp
  correctStreak: number;
}

function getSRData(): Record<string, SREntry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(SR_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSRData(data: Record<string, SREntry>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SR_KEY, JSON.stringify(data));
}

export function initWordForReview(wordId: string): void {
  const data = getSRData();
  if (!data[wordId]) {
    data[wordId] = {
      wordId,
      interval: 4, // First review in 4 hours
      lastReview: Date.now(),
      correctStreak: 0,
    };
    saveSRData(data);
  }
}

export function markReviewed(wordId: string, correct: boolean): void {
  const data = getSRData();
  const entry = data[wordId];
  if (!entry) return;

  if (correct) {
    entry.correctStreak++;
    // SM-2 inspired: interval grows with correct streak
    // 4h → 12h → 1d → 3d → 7d → 14d → 30d
    const intervals = [4, 12, 24, 72, 168, 336, 720];
    entry.interval = intervals[Math.min(entry.correctStreak, intervals.length - 1)];
  } else {
    entry.correctStreak = 0;
    entry.interval = 4; // Reset to 4 hours
  }
  entry.lastReview = Date.now();
  saveSRData(data);
}

export function getWordsDueForReview(): string[] {
  const data = getSRData();
  const now = Date.now();
  const due: string[] = [];

  for (const [wordId, entry] of Object.entries(data)) {
    const elapsed = (now - entry.lastReview) / (60 * 60 * 1000); // hours
    if (elapsed >= entry.interval) {
      due.push(wordId);
    }
  }

  return due;
}

export function getReviewCount(): number {
  return getWordsDueForReview().length;
}

export function getTotalTrackedWords(): number {
  return Object.keys(getSRData()).length;
}
