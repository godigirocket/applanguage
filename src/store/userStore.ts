import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface DailyQuestData {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  lumesReward: number;
}

export interface UserStoreState {
  userLevel: UserLevel | "";
  setUserLevel: (level: UserLevel) => void;

  xp: number;
  addXP: (amount: number) => void;
  setXP: (amount: number) => void;

  lumes: number;
  addLumes: (amount: number) => void;
  setLumes: (amount: number) => void;

  streak: number;
  setStreak: (amount: number) => void;
  incrementStreak: () => void;

  consecutiveCorrect: number;
  addConsecutiveCorrect: () => void;
  resetConsecutiveCorrect: () => void;

  consecutiveIncorrect: number;
  addConsecutiveIncorrect: () => void;
  resetConsecutiveIncorrect: () => void;

  // Daily Quests tracking
  quests: DailyQuestData[];
  setQuests: (quests: DailyQuestData[]) => void;
  updateQuestProgress: (questId: string, amount: number) => void;

  // App settings
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  interfaceLanguage: "pt" | "en" | "es";
  setInterfaceLanguage: (lang: "pt" | "en" | "es") => void;

  targetLanguage: "pt" | "en" | "es";
  setTargetLanguage: (lang: "pt" | "en" | "es") => void;
}

const initialQuests: DailyQuestData[] = [
  {
    id: "dq-1",
    title: "Complete 2 lições",
    target: 2,
    current: 0,
    completed: false,
    xpReward: 50,
    lumesReward: 10,
  },
  {
    id: "dq-2",
    title: "Ganhe 150 XP",
    target: 150,
    current: 0,
    completed: false,
    xpReward: 25,
    lumesReward: 5,
  },
  {
    id: "dq-3",
    title: "Acerte 10 flashcards",
    target: 10,
    current: 0,
    completed: false,
    xpReward: 40,
    lumesReward: 15,
  },
  {
    id: "dq-4",
    title: "Conclua o Modo Sobrevivência",
    target: 1,
    current: 0,
    completed: false,
    xpReward: 100,
    lumesReward: 20,
  },
];

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      userLevel: "",
      setUserLevel: (userLevel) => set({ userLevel }),

      xp: 0,
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
      setXP: (xp) => set({ xp }),

      lumes: 0,
      addLumes: (amount) => set((state) => ({ lumes: state.lumes + amount })),
      setLumes: (lumes) => set({ lumes }),

      streak: 0,
      setStreak: (streak) => set({ streak }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

      consecutiveCorrect: 0,
      addConsecutiveCorrect: () =>
        set((state) => ({
          consecutiveCorrect: state.consecutiveCorrect + 1,
          consecutiveIncorrect: 0, // Reset incorrect on a correct answer
        })),
      resetConsecutiveCorrect: () => set({ consecutiveCorrect: 0 }),

      consecutiveIncorrect: 0,
      addConsecutiveIncorrect: () =>
        set((state) => ({
          consecutiveIncorrect: state.consecutiveIncorrect + 1,
          consecutiveCorrect: 0, // Reset correct on an incorrect answer
        })),
      resetConsecutiveIncorrect: () => set({ consecutiveIncorrect: 0 }),

      quests: initialQuests,
      setQuests: (quests) => set({ quests }),
      updateQuestProgress: (questId, amount) =>
        set((state) => ({
          quests: state.quests.map((q) => {
            if (q.id !== questId) return q;
            const nextVal = Math.min(q.target, q.current + amount);
            const completedNow = nextVal >= q.target && !q.completed;
            return {
              ...q,
              current: nextVal,
              completed: nextVal >= q.target,
              // Reward is handled by caller or side-effect
            };
          }),
        })),

      theme: "light",
      setTheme: (theme) => set({ theme }),

      interfaceLanguage: "pt",
      setInterfaceLanguage: (interfaceLanguage) => set({ interfaceLanguage }),

      targetLanguage: "en",
      setTargetLanguage: (targetLanguage) => set({ targetLanguage }),
    }),
    {
      name: "lume-user-settings",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    },
  ),
);
