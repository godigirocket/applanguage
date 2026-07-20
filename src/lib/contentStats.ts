/**
 * LUME PLATFORM - 30,000 LEARNING CONTENT ITEMS
 * ============================================
 * Distribuição completa de conteúdo por setor
 */

export const PLATFORM_STATS = {
  // TOTAL GERAL
  total: 30000,
  
  // CULTURAL IMMERSION (30% - 9,000 items)
  culture: {
    total: 9000,
    cities: 50,
    countries: 25,
    videos: 2100,      // Vídeos autênticos de nativos
    podcasts: 1800,    // Podcasts e áudios culturais
    stories: 1900,     // Histórias e contos locais
    recipes: 950,      // Receitas típicas regionais
    landmarks: 1050,   // Pontos turísticos e história
    traditions: 800,   // Festivais e tradições
    slang: 400,        // Gírias e expressões regionais
  },
  
  // STRUCTURED LESSONS (40% - 12,000 items)
  lessons: {
    total: 12000,
    grammar: 2400,     // Lições de gramática
    vocabulary: 3200,  // Vocabulário temático
    pronunciation: 1600, // Treino de pronúncia
    reading: 1800,     // Textos e compreensão
    writing: 1200,     // Exercícios de escrita
    listening: 1800,   // Áudios e compreensão auditiva
  },
  
  // CONVERSATION PRACTICE (15% - 4,500 items)
  conversation: {
    total: 4500,
    aiDialogues: 2000,  // Diálogos com IA (TOPICS)
    scenarios: 1200,    // Cenários de conversação
    roleplay: 800,      // Simulações de situações
    smallTalk: 500,     // Conversas casuais
  },
  
  // QUIZZES & TESTS (10% - 3,000 items)
  quizzes: {
    total: 3000,
    vocabulary: 1000,
    grammar: 800,
    listening: 600,
    cultural: 600,
  },
  
  // GAMES & INTERACTIVE (5% - 1,500 items)
  games: {
    total: 1500,
    wordGames: 600,
    memoryGames: 400,
    challenges: 300,
    competitions: 200,
  },
};

// Níveis de dificuldade distribuídos
export const DIFFICULTY_DISTRIBUTION = {
  beginner: 10500,      // 35%
  intermediate: 12000,  // 40%
  advanced: 7500,       // 25%
};

// Idiomas com conteúdo
export const LANGUAGES = {
  english: {
    name: "Inglês",
    contentCount: 15000,  // 50% do conteúdo
    variants: ["US", "UK", "AU", "CA"],
  },
  spanish: {
    name: "Espanhol",
    contentCount: 9000,   // 30% do conteúdo
    variants: ["ES", "MX", "AR", "CO"],
  },
  portuguese: {
    name: "Português",
    contentCount: 6000,   // 20% do conteúdo
    variants: ["BR", "PT"],
  },
};

// Categorias de tópicos de conversação
export const CONVERSATION_TOPICS = {
  dailyLife: { count: 800, label: "Dia a Dia" },
  travel: { count: 650, label: "Viagens" },
  work: { count: 600, label: "Trabalho" },
  relationships: { count: 550, label: "Relacionamentos" },
  hobbies: { count: 500, label: "Hobbies" },
  food: { count: 480, label: "Comida" },
  health: { count: 420, label: "Saúde" },
  technology: { count: 500, label: "Tecnologia" },
};

// Função helper para formatar números
export const formatCount = (num: number) => num.toLocaleString("pt-BR");

// Validação: soma total deve ser 30,000
const validateTotal = () => {
  const sum = 
    PLATFORM_STATS.culture.total +
    PLATFORM_STATS.lessons.total +
    PLATFORM_STATS.conversation.total +
    PLATFORM_STATS.quizzes.total +
    PLATFORM_STATS.games.total;
  
  if (sum !== PLATFORM_STATS.total) {
    console.error(`❌ Content stats mismatch! Expected ${PLATFORM_STATS.total}, got ${sum}`);
  } else {
    console.log(`✅ Content stats validated: ${formatCount(PLATFORM_STATS.total)} items`);
  }
};

validateTotal();
