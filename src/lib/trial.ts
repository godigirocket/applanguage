/**
 * 24-HOUR FREE TRIAL SYSTEM
 * 
 * New users get 24h of Premium access from their first sign-in.
 * After 24h, they revert to free tier (10 lesson limit).
 * This is tracked client-side via localStorage and verified server-side via profiles.trial_started_at.
 */

const TRIAL_KEY = "lume_trial_started";
const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function startTrial(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(TRIAL_KEY)) {
    localStorage.setItem(TRIAL_KEY, Date.now().toString());
  }
}

export function getTrialStartTime(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TRIAL_KEY);
  return raw ? parseInt(raw, 10) : null;
}

export function isTrialActive(): boolean {
  const start = getTrialStartTime();
  if (!start) return false;
  return Date.now() - start < TRIAL_DURATION_MS;
}

export function getTrialRemainingMs(): number {
  const start = getTrialStartTime();
  if (!start) return 0;
  const remaining = TRIAL_DURATION_MS - (Date.now() - start);
  return Math.max(0, remaining);
}

export function getTrialRemainingFormatted(): string {
  const ms = getTrialRemainingMs();
  if (ms <= 0) return "0:00";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function hasTrialExpired(): boolean {
  const start = getTrialStartTime();
  if (!start) return false; // Never started = not expired, just never had trial
  return Date.now() - start >= TRIAL_DURATION_MS;
}
