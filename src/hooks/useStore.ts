import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Msg = { role: "user" | "assistant"; content: string };
type Level = "Beginner" | "Explorer" | "Conversationalist" | "Fluent" | "Native Soul";
type TargetLanguage = "en" | "es" | "fr";

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
  targetLanguage: TargetLanguage;
  dailyChallenges: DailyChallenge[];
  
  setXP: (xp: number) => void;
  setLumes: (lumes: number) => void;
  setStreak: (streak: number) => void;
  setLevel: (level: Level) => void;
  setInterfaceLanguage: (lang: "pt" | "en" | "es") => void;
  setTargetLanguage: (lang: TargetLanguage) => void;
  addXP: (amount: number) => void;
  addLumes: (amount: number) => void;
  completeChallenge: (id: string) => void;
}

const getLevelName = (xp: number): Level => {
  if (xp < 100) return "Beginner";
  if (xp < 300) return "Explorer";
  if (xp < 600) return "Conversationalist";
  if (xp < 1000) return "Fluent";
  return "Native Soul";
};

const initialChallenges: DailyChallenge[] = [
  { id: '1', title: 'Faça 1 lição', completed: false, reward: 10 },
  { id: '2', title: 'Pratique pronúncia por 2 minutos', completed: false, reward: 15 },
  { id: '3', title: 'Salve 5 novas palavras', completed: false, reward: 20 },
];

export const useStore = create<LumeState>()(
  persist(
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
      targetLanguage: "en",
      dailyChallenges: initialChallenges,
      
      setXP: (xp) => set({ xp, level: getLevelName(xp) }),
      setLumes: (lumes) => set({ lumes }),
      setStreak: (streak) => set({ streak }),
      setLevel: (level) => set({ level }),
      setInterfaceLanguage: (interfaceLanguage) => set({ interfaceLanguage }),
      setTargetLanguage: (targetLanguage) => set({ targetLanguage }),
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        return { xp: newXP, level: getLevelName(newXP) };
      }),
      addLumes: (amount) => set((state) => ({ lumes: state.lumes + amount })),
      completeChallenge: (id) => set((state) => ({
        dailyChallenges: state.dailyChallenges.map(c => 
          c.id === id && !c.completed ? { ...c, completed: true } : c
        ),
        lumes: state.dailyChallenges.find(c => c.id === id && !c.completed) 
          ? state.lumes + (state.dailyChallenges.find(c => c.id === id)!.reward)
          : state.lumes
      })),
    }),
    {
      name: 'lume-storage',
      partialize: (state) => ({ 
        onboardingStep: state.onboardingStep,
        xp: state.xp,
        lumes: state.lumes,
        streak: state.streak,
        level: state.level,
        interfaceLanguage: state.interfaceLanguage,
        targetLanguage: state.targetLanguage,
        dailyChallenges: state.dailyChallenges
      }),
    }
  )
);
