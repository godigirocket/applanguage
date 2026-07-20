import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import confetti from "canvas-confetti";

/**
 * Helper functions para gerenciar métricas do usuário (XP, Streak, Progresso)
 */

export interface LessonCompletionData {
  lessonId: string;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // em segundos
  perfectScore: boolean;
}

/**
 * Calcula e adiciona XP baseado no desempenho da lição
 */
export function awardLessonXP(data: LessonCompletionData) {
  const { addXP, xp } = useUserStore.getState();
  
  let totalXP = data.xpEarned;
  
  // Bônus por pontuação perfeita
  if (data.perfectScore) {
    totalXP += Math.floor(data.xpEarned * 0.5); // +50% bonus
    toast.success("🎯 Pontuação Perfeita! +50% XP Bônus", {
      description: `Você ganhou ${Math.floor(data.xpEarned * 0.5)} XP extra!`,
    });
  }
  
  // Bônus por velocidade (menos de 30 segundos por questão)
  const avgTimePerQuestion = data.timeSpent / data.totalQuestions;
  if (avgTimePerQuestion < 30) {
    const speedBonus = Math.floor(data.xpEarned * 0.25); // +25% bonus
    totalXP += speedBonus;
    toast.success("⚡ Velocidade Impressionante! +25% XP", {
      description: `Você ganhou ${speedBonus} XP extra!`,
    });
  }
  
  // Adiciona XP
  addXP(totalXP);
  
  // Animação visual de XP
  showXPAnimation(totalXP);
  
  // Verifica level up
  checkLevelUp(xp + totalXP);
  
  return totalXP;
}

/**
 * Incrementa streak diário
 */
export function updateDailyStreak() {
  const { streak, incrementStreak, setStreak } = useUserStore.getState();
  
  // Verifica última atividade (implementar com localStorage ou Supabase)
  const lastActivity = localStorage.getItem("lastActivityDate");
  const today = new Date().toDateString();
  
  if (lastActivity === today) {
    // Já praticou hoje
    return streak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActivity === yesterday.toDateString()) {
    // Mantém streak
    incrementStreak();
    localStorage.setItem("lastActivityDate", today);
    
    const newStreak = streak + 1;
    
    // Celebração de milestone
    if (newStreak % 7 === 0) {
      toast.success(`🔥 ${newStreak} Dias de Ofensiva!`, {
        description: "Você está em chamas! Continue assim!",
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF6B35", "#FF8C42", "#FFA500"],
      });
    } else {
      toast.success(`🔥 Ofensiva de ${newStreak} dias!`, {
        description: "Continue praticando todos os dias!",
      });
    }
    
    return newStreak;
  } else {
    // Perdeu streak
    if (streak > 0) {
      toast.error("💔 Ofensiva Perdida", {
        description: `Você tinha ${streak} dias. Comece de novo!`,
      });
    }
    setStreak(1);
    localStorage.setItem("lastActivityDate", today);
    return 1;
  }
}

/**
 * Atualiza progresso de quest diária
 */
export function updateQuestProgress(questId: string, amount: number = 1) {
  const { updateQuestProgress, quests, addXP, addLumes } = useUserStore.getState();
  
  updateQuestProgress(questId, amount);
  
  // Verifica se completou a quest
  const quest = quests.find((q) => q.id === questId);
  if (quest && quest.current + amount >= quest.target && !quest.completed) {
    // Quest completada!
    addXP(quest.xpReward);
    addLumes(quest.lumesReward);
    
    toast.success(`✅ Quest Completa: ${quest.title}`, {
      description: `+${quest.xpReward} XP, +${quest.lumesReward} Lumes`,
    });
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  }
}

/**
 * Calcula porcentagem de progresso da lição
 */
export function calculateLessonProgress(
  currentStep: number,
  totalSteps: number
): number {
  return Math.round((currentStep / totalSteps) * 100);
}

/**
 * Mostra animação de XP ganho
 */
function showXPAnimation(xp: number) {
  const element = document.createElement("div");
  element.className = "xp-gain-animation";
  element.textContent = `+${xp} XP`;
  element.style.left = "50%";
  element.style.top = "50%";
  element.style.transform = "translate(-50%, -50%)";
  
  document.body.appendChild(element);
  
  setTimeout(() => {
    element.remove();
  }, 1500);
}

/**
 * Verifica e celebra level up
 */
function checkLevelUp(newXP: number) {
  const levels = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 100 },
    { level: 3, xpRequired: 250 },
    { level: 4, xpRequired: 500 },
    { level: 5, xpRequired: 1000 },
    { level: 6, xpRequired: 1500 },
    { level: 7, xpRequired: 2500 },
    { level: 8, xpRequired: 4000 },
    { level: 9, xpRequired: 6000 },
    { level: 10, xpRequired: 10000 },
  ];
  
  const currentLevel = levels.findIndex((l) => newXP < l.xpRequired) - 1;
  const previousXP = newXP - useUserStore.getState().xp;
  const previousLevel = levels.findIndex((l) => previousXP < l.xpRequired) - 1;
  
  if (currentLevel > previousLevel && currentLevel >= 0) {
    // LEVEL UP!
    toast.success(`🎉 Level Up! Nível ${currentLevel + 1}`, {
      description: "Você desbloqueou novas conquistas!",
      duration: 5000,
    });
    
    // Confetti especial
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#2D4A3E", "#4CAF50", "#D4A23B"],
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#2D4A3E", "#4CAF50", "#D4A23B"],
      });
    }, 100);
  }
}

/**
 * Calcula combo multiplier baseado em acertos consecutivos
 */
export function calculateComboMultiplier(consecutiveCorrect: number): number {
  if (consecutiveCorrect >= 10) return 3.0;
  if (consecutiveCorrect >= 7) return 2.5;
  if (consecutiveCorrect >= 5) return 2.0;
  if (consecutiveCorrect >= 3) return 1.5;
  return 1.0;
}

/**
 * Mostra feedback de resposta correta
 */
export function showCorrectAnswerFeedback(consecutiveCorrect: number) {
  const multiplier = calculateComboMultiplier(consecutiveCorrect);
  
  if (multiplier > 1) {
    toast.success(`🔥 Combo x${multiplier}!`, {
      description: `${consecutiveCorrect} acertos seguidos!`,
      duration: 2000,
    });
  } else {
    toast.success("✅ Correto!", {
      duration: 1500,
    });
  }
}

/**
 * Mostra feedback de resposta incorreta
 */
export function showIncorrectAnswerFeedback(explanation?: string) {
  toast.error("❌ Incorreto", {
    description: explanation || "Tente novamente!",
    duration: 3000,
  });
}

/**
 * Salva progresso da lição no localStorage
 */
export function saveLessonProgress(
  lessonId: string,
  currentStep: number,
  totalSteps: number,
  answers: Record<string, any>
) {
  const progress = {
    lessonId,
    currentStep,
    totalSteps,
    answers,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(progress));
}

/**
 * Carrega progresso salvo da lição
 */
export function loadLessonProgress(lessonId: string) {
  const saved = localStorage.getItem(`lesson_progress_${lessonId}`);
  if (!saved) return null;
  
  try {
    const progress = JSON.parse(saved);
    
    // Verifica se o progresso não está muito antigo (24 horas)
    const hoursSinceLastSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
    if (hoursSinceLastSave > 24) {
      localStorage.removeItem(`lesson_progress_${lessonId}`);
      return null;
    }
    
    return progress;
  } catch {
    return null;
  }
}

/**
 * Limpa progresso salvo da lição
 */
export function clearLessonProgress(lessonId: string) {
  localStorage.removeItem(`lesson_progress_${lessonId}`);
}

/**
 * Calcula estatísticas de desempenho
 */
export function calculatePerformanceStats(
  correctAnswers: number,
  totalQuestions: number,
  timeSpent: number
) {
  const accuracy = (correctAnswers / totalQuestions) * 100;
  const avgTimePerQuestion = timeSpent / totalQuestions;
  
  let performance: "excellent" | "good" | "average" | "needs_improvement";
  
  if (accuracy >= 90 && avgTimePerQuestion < 30) {
    performance = "excellent";
  } else if (accuracy >= 75) {
    performance = "good";
  } else if (accuracy >= 60) {
    performance = "average";
  } else {
    performance = "needs_improvement";
  }
  
  return {
    accuracy: Math.round(accuracy),
    avgTimePerQuestion: Math.round(avgTimePerQuestion),
    performance,
    stars: accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : accuracy >= 60 ? 1 : 0,
  };
}

/**
 * Gera mensagem motivacional baseada no desempenho
 */
export function getMotivationalMessage(performance: string): string {
  const messages = {
    excellent: [
      "Incrível! Você está dominando!",
      "Perfeito! Continue assim!",
      "Excelente trabalho! Você é uma estrela!",
      "Fantástico! Seu esforço está valendo a pena!",
    ],
    good: [
      "Muito bem! Você está progredindo!",
      "Ótimo trabalho! Continue praticando!",
      "Bom desempenho! Você está no caminho certo!",
      "Legal! Você está melhorando a cada dia!",
    ],
    average: [
      "Bom começo! Continue praticando!",
      "Você está aprendendo! Não desista!",
      "Progresso constante! Continue assim!",
      "Cada erro é uma oportunidade de aprender!",
    ],
    needs_improvement: [
      "Não desista! A prática leva à perfeição!",
      "Continue tentando! Você vai conseguir!",
      "Cada tentativa te deixa mais perto do sucesso!",
      "Aprender leva tempo. Você está no caminho certo!",
    ],
  };
  
  const messageList = messages[performance as keyof typeof messages] || messages.average;
  return messageList[Math.floor(Math.random() * messageList.length)];
}
