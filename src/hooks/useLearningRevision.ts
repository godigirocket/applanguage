import { useSyncExternalStore } from "react";
let revision = 0;
const listeners = new Set<() => void>();
const events = [
  "lume-learning-data-restored",
  "lume-learning-data-changed",
  "lume-account-changed",
];
function changed() {
  revision++;
  listeners.forEach((fn) => fn());
}
function subscribe(fn: () => void) {
  if (!listeners.size) events.forEach((name) => window.addEventListener(name, changed));
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    if (!listeners.size) events.forEach((name) => window.removeEventListener(name, changed));
  };
}
export function useLearningRevision() {
  return useSyncExternalStore(
    subscribe,
    () => revision,
    () => 0,
  );
}
