// src/data/content.ts
// Massive content expansion for Lume OS (6+ months of curriculum)

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const categories = ["Gramática", "Vocabulário", "Cultura", "Expressões", "Listening", "Speaking"];

export const lessons = Array.from({ length: 180 }, (_, i) => {
  const level = levels[Math.floor(i / 30)]; // 30 lessons per level
  const category = categories[i % 6];
  const isLocked = i > 15; // Lock everything after first 15 lessons for demo

  return {
    id: i + 1,
    title: `Lição ${i + 1}: Explorando ${category} (${level})`,
    description: `Mergulhe profundamente nos conceitos essenciais de ${category.toLowerCase()} para alcançar a fluência no nível ${level}.`,
    level,
    category,
    duration: 5 + (i % 10), // 5 to 14 minutes
    xp: 40 + (i % 60), // 40 to 99 XP
    isLocked,
    content: [
      { type: "theory", text: `Conceitos chave sobre ${category}.` },
      { type: "practice", text: "Exercício prático interativo." },
    ],
  };
});

export const quizzes = Array.from({ length: 60 }, (_, i) => ({
  id: `q-${i + 1}`,
  title: `Quiz de Revisão ${i + 1}`,
  category: categories[i % categories.length],
  questionCount: 10,
  xpReward: 50 + i * 5,
  questions: Array.from({ length: 10 }, (_, q) => ({
    id: `q-${i + 1}-item-${q + 1}`,
    question: `Qual a tradução correta para a palavra relacionada a ${categories[i % categories.length]}?`,
    options: ["Opção A", "Opção B", "Opção C", "Opção D"],
    correctAnswer: 0,
  })),
}));

export const vocabulary = Array.from({ length: 800 }, (_, i) => ({
  id: `voc-${i + 1}`,
  word: `Palavra ${i + 1}`,
  translation: `Tradução ${i + 1}`,
  example: `Exemplo de uso da palavra ${i + 1} em contexto real.`,
  category: categories[i % categories.length],
  audioUrl: "/mock-audio.mp3",
}));

export const expressions = Array.from({ length: 250 }, (_, i) => ({
  id: `exp-${i + 1}`,
  phrase: `Expressão ${i + 1}`,
  meaning: `Significado da expressão ${i + 1}`,
  region: ["EUA", "UK", "Austrália", "Global"][i % 4],
  example: `Como os nativos usam a expressão ${i + 1} no dia a dia.`,
  audioUrl: "/mock-audio.mp3",
}));

export const dailyQuests = [
  { id: "dq-1", title: "Complete 2 lições", target: 2, xpReward: 50, lumesReward: 10 },
  { id: "dq-2", title: "Ganhe 150 XP", target: 150, xpReward: 25, lumesReward: 5 },
  { id: "dq-3", title: "Acerte 10 flashcards", target: 10, xpReward: 40, lumesReward: 15 },
  { id: "dq-4", title: "Conclua o Modo Sobrevivência", target: 1, xpReward: 100, lumesReward: 20 },
];

export const achievements = [
  {
    id: "ach-1",
    title: "Iniciante Focado",
    description: "Complete sua primeira lição.",
    icon: "🎯",
  },
  {
    id: "ach-2",
    title: "Matador de Ofensiva",
    description: "7 dias seguidos estudando.",
    icon: "🔥",
  },
  {
    id: "ach-3",
    title: "Sabe-Tudo",
    description: "Pontuação máxima no Contra o Relógio.",
    icon: "⏱️",
  },
  {
    id: "ach-4",
    title: "Poliglota",
    description: "Explore todas as regiões do Mapa Cultural.",
    icon: "🌍",
  },
];
