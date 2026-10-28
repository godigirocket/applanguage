import { useSyncExternalStore } from "react";
export type SyncStatus = "waiting" | "syncing" | "synced" | "offline" | "error";
let status: SyncStatus = "waiting";
const listeners = new Set<() => void>();
export function setSyncStatus(value: SyncStatus) {
  status = value;
  listeners.forEach((fn) => fn());
}
export function useSyncStatus() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => status,
    () => "waiting" as SyncStatus,
  );
}
