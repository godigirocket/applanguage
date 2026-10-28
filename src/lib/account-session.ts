import { useStore, flushStoreWrites } from "@/hooks/useStore";
import { useUserStore } from "@/store/userStore";
import { accountKey, accountOwner, pauseAccountWrites, selectAccount } from "./account-storage";

let switching: Promise<void> = Promise.resolve();
let initialized = false;
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Memory-only session if browser storage is unavailable. */
  }
}
export function switchAccount(userId: string | null, migrateLegacy = false) {
  switching = switching
    .catch(() => {})
    .then(async () => {
      if (initialized && accountOwner() === (userId || "guest")) return;
      await flushStoreWrites();
      selectAccount(userId);
      pauseAccountWrites(true);
      try {
        // Clear memory even if browser persistence is unavailable.
        useStore.persist.setOptions({ name: accountKey("lume-storage") });
        useUserStore.persist.setOptions({ name: accountKey("lume-user-settings") });
        useStore.setState(useStore.getInitialState(), true);
        useUserStore.setState(useUserStore.getInitialState(), true);
        // A legacy snapshot has no owner. Import it only for the session already
        // present at upgrade, never for a newly signed-in account. Keep originals.
        for (const [store, base] of [
          [useStore, "lume-storage"],
          [useUserStore, "lume-user-settings"],
        ] as const) {
          const key = accountKey(base);
          if (migrateLegacy && userId && !read("lume-legacy-owner") && !read(key)) {
            const legacy = read(base);
            if (legacy) write(key, legacy);
          }
          store.persist.setOptions({ name: key });
        }
        if (
          migrateLegacy &&
          userId &&
          (!read("lume-legacy-owner") || read("lume-legacy-owner") === userId)
        ) {
          for (const base of [
            "lume-saved-words",
            "lume_spaced_repetition",
            "lume_profile",
            "lume_xp",
            "lume_streak",
            "lume_last_day",
            "lume_saved_expressions",
            "lume_user_level",
            "lume_level",
            "lume_target_language",
            "lume_trial_started",
            "lume-quiz-stats",
            "lume-quiz-recent-ids",
          ]) {
            const legacy = read(base);
            if (legacy && !read(accountKey(base))) write(accountKey(base), legacy);
          }
          write("lume-legacy-owner", userId);
        }
        await Promise.all([useStore.persist.rehydrate(), useUserStore.persist.rehydrate()]);
        initialized = true;
      } finally {
        pauseAccountWrites(false);
      }
      window.dispatchEvent(new Event("lume-account-changed"));
    });
  return switching;
}
