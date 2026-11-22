import { accountKey } from "@/lib/account-storage";

export const DAILY_FREE_SECONDS = 20 * 60;
const ACCESS_KEY = "lume_daily_free_access";

export type FreeAccessState = {
  day: string;
  usedSeconds: number;
  lastActiveAt: number | null;
};

const today = (now = Date.now()) => new Date(now).toLocaleDateString("en-CA");

function read(now = Date.now()): FreeAccessState {
  const blank = { day: today(now), usedSeconds: 0, lastActiveAt: null };
  if (typeof window === "undefined") return blank;
  try {
    const value = JSON.parse(localStorage.getItem(accountKey(ACCESS_KEY)) || "null");
    if (!value || value.day !== blank.day) return blank;
    return {
      day: blank.day,
      usedSeconds: Math.max(0, Math.min(DAILY_FREE_SECONDS, Number(value.usedSeconds) || 0)),
      lastActiveAt: Number.isFinite(value.lastActiveAt) ? value.lastActiveAt : null,
    };
  } catch {
    return blank;
  }
}

function write(state: FreeAccessState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(accountKey(ACCESS_KEY), JSON.stringify(state));
  } catch {
    // The product remains usable when private browsing rejects local storage.
  }
}

export function getFreeAccessState(now = Date.now()) {
  const state = read(now);
  return {
    ...state,
    remainingSeconds: Math.max(0, DAILY_FREE_SECONDS - state.usedSeconds),
    exhausted: state.usedSeconds >= DAILY_FREE_SECONDS,
  };
}

/** Count only visible foreground time. A long backgrounded tab can never
 * silently consume a full day's allowance. */
export function recordFreeAccess(now = Date.now()) {
  const state = read(now);
  const elapsed = state.lastActiveAt ? Math.min(30, Math.max(0, (now - state.lastActiveAt) / 1000)) : 0;
  const next: FreeAccessState = {
    ...state,
    usedSeconds: Math.min(DAILY_FREE_SECONDS, Math.round(state.usedSeconds + elapsed)),
    lastActiveAt: now,
  };
  write(next);
  return getFreeAccessState(now);
}

export function pauseFreeAccess(now = Date.now()) {
  const state = read(now);
  if (state.lastActiveAt) recordFreeAccess(now);
  write({ ...read(now), lastActiveAt: null });
}

export function formatFreeAccess(seconds: number) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.max(0, seconds) % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
