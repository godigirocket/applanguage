// src/store/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  xp: number;
  lumes: number;
  streak: number;
  lastPlayedDate: string | null;
  survivalLives: number;
  survivalScore: number;
  timeRaceScore: number;
  dailyQuestsProgress: Record<string, number>;
  completedQuests: string[];

  addXp: (amount: number) => void;
  addLumes: (amount: number) => void;
  updateStreak: () => void;

  // Survival
  setSurvivalLives: (lives: number) => void;
  incrementSurvivalScore: () => void;
  resetSurvival: () => void;

  // Time Race
  incrementTimeRaceScore: (points: number) => void;
  resetTimeRace: () => void;

  // Daily Quests
  updateQuestProgress: (questId: string, amount: number) => void;
  completeQuest: (questId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      lumes: 0,
      streak: 0,
      lastPlayedDate: null,
      survivalLives: 3,
      survivalScore: 0,
      timeRaceScore: 0,
      dailyQuestsProgress: {},
      completedQuests: [],

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      addLumes: (amount) => set((state) => ({ lumes: state.lumes + amount })),

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const lastPlayed = get().lastPlayedDate;

        if (lastPlayed !== today) {
          if (lastPlayed) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastPlayed === yesterday.toISOString().split("T")[0]) {
              set((state) => ({ streak: state.streak + 1, lastPlayedDate: today }));
            } else {
              set({ streak: 1, lastPlayedDate: today });
            }
          } else {
            set({ streak: 1, lastPlayedDate: today });
          }
        }
      },

      setSurvivalLives: (lives) => set({ survivalLives: lives }),
      incrementSurvivalScore: () => set((state) => ({ survivalScore: state.survivalScore + 1 })),
      resetSurvival: () => set({ survivalLives: 3, survivalScore: 0 }),

      incrementTimeRaceScore: (points) =>
        set((state) => ({ timeRaceScore: state.timeRaceScore + points })),
      resetTimeRace: () => set({ timeRaceScore: 0 }),

      updateQuestProgress: (questId, amount) =>
        set((state) => ({
          dailyQuestsProgress: {
            ...state.dailyQuestsProgress,
            [questId]: (state.dailyQuestsProgress[questId] || 0) + amount,
          },
        })),

      completeQuest: (questId) =>
        set((state) => {
          if (state.completedQuests.includes(questId)) return state;
          return { completedQuests: [...state.completedQuests, questId] };
        }),
    }),
    {
      name: "lume-game-storage",
    },
  ),
);
