import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decryptFromStorage } from "@/lib/crypto";
import { dailyQuests } from "@/data/content";
import { accountWritesPaused } from "@/lib/account-storage";

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const SHOP_PRICES: Record<string, number> = {
  freeze: 50,
  "theme-dark": 100,
  "avatar-crown": 200,
  "bonus-xp": 150,
};
// These are local preferences/game state, not auth secrets. Synchronous
// commits survive an immediate reload; legacy encrypted snapshots still load.
const persistenceQueue: Promise<void> = Promise.resolve();
let latestSnapshot = "";
export function flushStoreWrites() {
  return persistenceQueue;
}

type Msg = { role: "user" | "assistant"; content: string };
type Level = "Beginner" | "Explorer" | "Conversationalist" | "Fluent" | "Native Soul";
type TargetLanguage = "en" | "es" | "pt";

interface DailyChallenge {
  id: string;
  title: string;
  completed: boolean;
  reward: number;
}

interface LumeState {
  // Chat
  messages: Msg[];
  setMessages: (messages: Msg[]) => void;
  addMessage: (message: Msg) => void;
  clearMessages: () => void;

  // Recording & UI State
  isRecording: boolean;
  isThinking: boolean;
  setIsRecording: (state: boolean) => void;
  setIsThinking: (state: boolean) => void;

  // Audio State
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;

  // Onboarding / Profile
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Gamification & Settings
  xp: number;
  lumes: number; // Virtual currency
  streak: number;
  level: Level;
  interfaceLanguage: "pt" | "en" | "es";
  language: "pt" | "en" | "es"; // Reactive alias for interfaceLanguage
  targetLanguage: TargetLanguage;
  dailyChallenges: DailyChallenge[];

  // Security
  isLocked: boolean;
  setIsLocked: (state: boolean) => void;
  pinCode: string;
  setPinCode: (pin: string) => void;
  pinEnabled: boolean;
  setPinEnabled: (enabled: boolean) => void;

  setXP: (xp: number) => void;
  setLumes: (lumes: number) => void;
  setStreak: (streak: number) => void;
  setLevel: (level: Level) => void;
  setInterfaceLanguage: (lang: "pt" | "en" | "es") => void;
  setTargetLanguage: (lang: TargetLanguage) => void;
  addXP: (amount: number) => void;
  addLumes: (amount: number) => void;
  completeChallenge: (id: string) => void;
  // Adaptive difficulty
  learningLevel: string;
  setLearningLevel: (level: string) => void;

  // Lesson Progress
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  questDate: string;
  questProgress: Record<string, number>;
  claimedQuests: string[];
  resetDailyQuests: () => void;
  trackQuest: (id: string, amount?: number) => void;
  claimQuest: (id: string) => boolean;
  inventory: string[];
  doubleXpUntil: number;
  lastStudyDate: string;
  recordStudy: () => void;
  buyItem: (id: string) => boolean;

  // Avatar
  avatarId: string | null;
  setAvatarId: (avatarId: string) => void;

  // Kid Mode — set at onboarding, restricts content/community for ages 4-10
  isKidAccount: boolean;
  kidAge: number | null;
  setKidAccount: (isKid: boolean, age?: number | null) => void;
}

type PersistedLumeState = Pick<
  LumeState,
  | "onboardingStep"
  | "xp"
  | "lumes"
  | "streak"
  | "level"
  | "interfaceLanguage"
  | "language"
  | "targetLanguage"
  | "dailyChallenges"
  | "pinCode"
  | "pinEnabled"
  | "learningLevel"
  | "completedLessons"
  | "avatarId"
  | "isKidAccount"
  | "kidAge"
  | "questDate"
  | "questProgress"
  | "claimedQuests"
  | "inventory"
  | "doubleXpUntil"
  | "lastStudyDate"
>;

const getLevelName = (xp: number): Level => {
  if (xp < 100) return "Beginner";
  if (xp < 300) return "Explorer";
  if (xp < 600) return "Conversationalist";
  if (xp < 1000) return "Fluent";
  return "Native Soul";
};

const initialChallenges: DailyChallenge[] = [
  { id: "1", title: "Faça 1 lição", completed: false, reward: 10 },
  { id: "2", title: "Pratique pronúncia por 2 minutes", completed: false, reward: 15 },
  { id: "3", title: "Salve 5 novas palavras", completed: false, reward: 20 },
];

export const useStore = create<LumeState>()(
  persist<LumeState, [], [], PersistedLumeState>(
    (set, get) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),

      isRecording: false,
      isThinking: false,
      setIsRecording: (isRecording) => set({ isRecording }),
      setIsThinking: (isThinking) => set({ isThinking }),

      isPlaying: false,
      setIsPlaying: (isPlaying) => set({ isPlaying }),

      onboardingStep: 1,
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),

      xp: 0,
      lumes: 0,
      streak: 0,
      level: "Beginner",
      interfaceLanguage: "pt",
      language: "pt",
      targetLanguage: "en",
      dailyChallenges: initialChallenges,

      isLocked: false,
      setIsLocked: (isLocked) => set({ isLocked }),
      pinCode: "1234",
      setPinCode: (pinCode) => set({ pinCode }),
      pinEnabled: false,
      setPinEnabled: (pinEnabled) => set({ pinEnabled }),

      setXP: (xp) => set({ xp, level: getLevelName(xp) }),
      setLumes: (lumes) => set({ lumes }),
      setStreak: (streak) => set({ streak }),
      setLevel: (level) => set({ level }),
      setInterfaceLanguage: (interfaceLanguage) =>
        set({ interfaceLanguage, language: interfaceLanguage }),
      setTargetLanguage: (targetLanguage) => set({ targetLanguage }),
      addXP: (amount) =>
        set((state) => {
          if (!Number.isFinite(amount) || amount <= 0) return state;
          const earned = Math.round(amount * (state.doubleXpUntil > Date.now() ? 2 : 1));
          const newXP = state.xp + earned;
          const progress = state.questDate === localDay() ? state.questProgress : {};
          return {
            xp: newXP,
            level: getLevelName(newXP),
            questDate: localDay(),
            claimedQuests: state.questDate === localDay() ? state.claimedQuests : [],
            questProgress: { ...progress, "dq-2": (progress["dq-2"] || 0) + earned },
          };
        }),
      addLumes: (amount) => set((state) => ({ lumes: state.lumes + amount })),
      completeChallenge: (id) =>
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map((c) =>
            c.id === id && !c.completed ? { ...c, completed: true } : c,
          ),
          lumes: state.dailyChallenges.find((c) => c.id === id && !c.completed)
            ? state.lumes + state.dailyChallenges.find((c) => c.id === id)!.reward
            : state.lumes,
        })),
      learningLevel: "",
      setLearningLevel: (learningLevel) => set({ learningLevel }),

      completedLessons: [],
      completeLesson: (lessonId) =>
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state;
          const progress = state.questDate === localDay() ? state.questProgress : {};
          return {
            completedLessons: [...state.completedLessons, lessonId],
            questDate: localDay(),
            claimedQuests: state.questDate === localDay() ? state.claimedQuests : [],
            questProgress: { ...progress, "dq-1": (progress["dq-1"] || 0) + 1 },
          };
        }),

      questDate: localDay(),
      questProgress: {},
      claimedQuests: [],
      inventory: [],
      doubleXpUntil: 0,
      lastStudyDate: "",
      resetDailyQuests: () =>
        set((state) =>
          state.questDate === localDay()
            ? state
            : { questDate: localDay(), questProgress: {}, claimedQuests: [] },
        ),
      trackQuest: (id, amount = 1) =>
        set((state) => {
          const progress = state.questDate === localDay() ? state.questProgress : {};
          return {
            questDate: localDay(),
            claimedQuests: state.questDate === localDay() ? state.claimedQuests : [],
            questProgress: { ...progress, [id]: (progress[id] || 0) + Math.max(0, amount) },
          };
        }),
      claimQuest: (id) => {
        get().resetDailyQuests();
        const state = get();
        const quest = dailyQuests.find((q) => q.id === id);
        if (
          !quest ||
          state.claimedQuests.includes(id) ||
          (state.questProgress[id] || 0) < quest.target
        )
          return false;
        // Claim + wallet update are one synchronous transaction, including rapid taps.
        set({
          claimedQuests: [...state.claimedQuests, id],
          xp: state.xp + quest.xpReward,
          level: getLevelName(state.xp + quest.xpReward),
          lumes: state.lumes + quest.lumesReward,
        });
        return true;
      },
      recordStudy: () =>
        set((state) => {
          const today = localDay();
          if (state.lastStudyDate === today) return state;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const before = new Date();
          before.setDate(before.getDate() - 2);
          const freeze =
            state.lastStudyDate === localDay(before) && state.inventory.includes("freeze");
          return {
            lastStudyDate: today,
            streak: state.lastStudyDate === localDay(yesterday) || freeze ? state.streak + 1 : 1,
            inventory: freeze ? state.inventory.filter((id) => id !== "freeze") : state.inventory,
          };
        }),
      buyItem: (id) => {
        const state = get();
        const price = SHOP_PRICES[id];
        if (
          !price ||
          state.lumes < price ||
          state.inventory.includes(id) ||
          (id === "bonus-xp" && state.doubleXpUntil > Date.now())
        )
          return false;
        set({
          lumes: state.lumes - price,
          inventory: id === "bonus-xp" ? state.inventory : [...state.inventory, id],
          doubleXpUntil: id === "bonus-xp" ? Date.now() + 30 * 60 * 1000 : state.doubleXpUntil,
        });
        return true;
      },

      avatarId: null,
      setAvatarId: (avatarId) => set({ avatarId }),

      isKidAccount: false,
      kidAge: null,
      setKidAccount: (isKid, age = null) =>
        set({ isKidAccount: isKid, kidAge: isKid ? age : null }),
    }),
    {
      name: "lume-storage:guest",
      skipHydration: true,
      storage: {
        getItem: async (name) => {
          if (typeof window === "undefined") return null;
          let raw: string | null;
          try {
            raw = localStorage.getItem(name);
          } catch {
            return null;
          }
          if (!raw) return null;
          try {
            if (raw.startsWith("{")) return JSON.parse(raw);
            const decrypted = await decryptFromStorage(raw, "lume-editorial-keyphrase");
            return JSON.parse(decrypted);
          } catch (e) {
            try {
              return JSON.parse(raw);
            } catch {
              return null;
            }
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return Promise.resolve();
          if (accountWritesPaused()) return Promise.resolve();
          const rawStr = JSON.stringify(value);
          if (latestSnapshot === `${name}:${rawStr}`) return persistenceQueue;
          latestSnapshot = `${name}:${rawStr}`;
          try {
            localStorage.setItem(name, rawStr);
          } catch {
            /* Storage disabled/full. */
          }
          return persistenceQueue;
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
      partialize: (state): PersistedLumeState => ({
        onboardingStep: state.onboardingStep,
        xp: state.xp,
        lumes: state.lumes,
        streak: state.streak,
        level: state.level,
        interfaceLanguage: state.interfaceLanguage,
        language: state.language,
        targetLanguage: state.targetLanguage,
        dailyChallenges: state.dailyChallenges,
        pinCode: state.pinCode,
        pinEnabled: state.pinEnabled,
        learningLevel: state.learningLevel,
        completedLessons: state.completedLessons,
        avatarId: state.avatarId,
        isKidAccount: state.isKidAccount,
        kidAge: state.kidAge,
        questDate: state.questDate,
        questProgress: state.questProgress,
        claimedQuests: state.claimedQuests,
        inventory: state.inventory,
        doubleXpUntil: state.doubleXpUntil,
        lastStudyDate: state.lastStudyDate,
      }),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== "undefined" && state?.interfaceLanguage) {
          import("i18next").then((i18n) => {
            i18n.default.changeLanguage(state.interfaceLanguage);
          });
        }
      },
    },
  ),
);
