import { create } from "zustand";
import { persist } from "zustand/middleware";
import { encryptForStorage, decryptFromStorage } from "@/lib/crypto";

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

  // Avatar
  avatarId: string | null;
  setAvatarId: (avatarId: string) => void;
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
    (set) => ({
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
          const newXP = state.xp + amount;
          return { xp: newXP, level: getLevelName(newXP) };
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
          return { completedLessons: [...state.completedLessons, lessonId] };
        }),

      avatarId: null,
      setAvatarId: (avatarId) => set({ avatarId }),
    }),
    {
      name: "lume-storage",
      storage: {
        getItem: async (name) => {
          if (typeof window === "undefined") return null;
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
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
        setItem: async (name, value) => {
          if (typeof window === "undefined") return;
          try {
            const rawStr = JSON.stringify(value);
            const encrypted = await encryptForStorage(rawStr, "lume-editorial-keyphrase");
            localStorage.setItem(name, encrypted);
          } catch (e) {
            localStorage.setItem(name, JSON.stringify(value));
          }
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
