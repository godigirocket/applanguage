export interface LessonStep {
  type: "intro" | "vocab" | "quiz" | "speaking" | "practice";
  title: string;
  text?: string;
  word?: string;
  translation?: string;
  example?: string;
  audioText?: string;
  question?: string;
  options?: string[];
  correct?: string;
  explanation?: string;
  targetPhrase?: string;
  chatPrompt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  language: "en" | "pt" | "es" | "fr";
  level: string;
  duration: string;
  xp: number;
  color: string;
  description: string;
  category: string;
  steps: LessonStep[];
  icon?: string;
  subtitle?: string;
}

export const ALL_LESSONS: Lesson[] = [
  {
    id: "lesson-en-vocab-1",
    title: "The Art of Coffee & Small Talk",
    language: "en",
    level: "Beginner",
    duration: "5 min",
    xp: 50,
    color: "#8B5A2B",
    description:
      "Learn how to order your favorite coffee and engage in polite conversation at the cafe.",
    category: "Vocabulary",
    icon: "☕",
    subtitle: "Daily Social Life",
    steps: [
      {
        type: "intro",
        title: "Welcome to London!",
        text: "In English-speaking cultures, ordering coffee is not just a transaction—it is an art of politeness. You will learn key words, pronunciation, and how to have a pleasant interaction.",
      },
      {
        type: "vocab",
        title: "Key Term: A Latte",
        word: "Latte",
        translation: "Café com leite expresso",
        example: "I would like a large latte with oat milk, please.",
      },
      {
        type: "quiz",
        title: "Polite Request",
        question: "Which of the following is the most polite way to ask for a coffee?",
        options: [
          "Give me coffee.",
          "Can I have a coffee, please?",
          "I want a coffee.",
          "Coffee now.",
        ],
        correct: "Can I have a coffee, please?",
        explanation:
          "Adding 'Can I have... please' represents standard polite social norms in English.",
      },
      {
        type: "speaking",
        title: "Speak with Confidence!",
        targetPhrase: "Can I get a double espresso to go, please?",
      },
      {
        type: "practice",
        title: "AI Interactive Cafe",
        chatPrompt:
          "You are the friendly barista. Greet the customer and ask for their coffee order.",
      },
    ],
  },
  {
    id: "lesson-en-idiom-1",
    title: "Idioms: Under the Weather",
    language: "en",
    level: "Intermediate",
    duration: "4 min",
    xp: 60,
    color: "#4A90E2",
    description:
      "Master expressions related to health, feelings, and the unpredictable British weather.",
    category: "Idioms",
    icon: "🌧️",
    subtitle: "Colloquial English",
    steps: [
      {
        type: "intro",
        title: "Unwell or just raining?",
        text: "Idioms give you the native touch. Today, we will explore the popular phrase 'under the weather' and how to use it gracefully.",
      },
      {
        type: "vocab",
        title: "Idiom: Under the weather",
        word: "Under the weather",
        translation: "Sentir-se indisposto ou doente",
        example: "I am feeling a bit under the weather today, so I might skip the meeting.",
      },
      {
        type: "quiz",
        title: "Meaning Quiz",
        question: "If Sarah is 'under the weather', what does it mean?",
        options: [
          "She is outside in the rain.",
          "She is feeling slightly sick.",
          "She is extremely happy.",
          "She is angry.",
        ],
        correct: "She is feeling slightly sick.",
        explanation: "'Under the weather' is widely used to express minor illnesses like a cold.",
      },
      {
        type: "speaking",
        title: "Try Pronouncing",
        targetPhrase: "I am sorry, I am feeling a bit under the weather today.",
      },
      {
        type: "practice",
        title: "Apologizing to the Manager",
        chatPrompt:
          "You are Sarah's manager. Sarah just texted you saying she is under the weather. Reply with empathy and wish her a speedy recovery.",
      },
    ],
  },
  {
    id: "lesson-en-culture-1",
    title: "Punctuality & Business Culture",
    language: "en",
    level: "Advanced",
    duration: "6 min",
    xp: 75,
    color: "#2D4A3E",
    description:
      "Understand the deep significance of punctuality in US and UK corporate environments.",
    category: "Culture",
    icon: "💼",
    subtitle: "Professional Etiquette",
    steps: [
      {
        type: "intro",
        title: "Five minutes early is on time",
        text: "In professional environments in English-speaking nations, time is a highly valued resource. Arriving late without notice can severely damage your professional reputation.",
      },
      {
        type: "vocab",
        title: "Business Concept: High Punctuality",
        word: "Punctual",
        translation: "Pontual / Rigoroso com o horário",
        example: "He is highly valued because he is always punctual and reliable.",
      },
      {
        type: "quiz",
        title: "Interview Standard",
        question: "What is the expected arrival time for a job interview?",
        options: [
          "Right on the dot",
          "5-10 minutes early",
          "15 minutes late",
          "Exactly 1 hour early",
        ],
        correct: "5-10 minutes early",
        explanation:
          "Arriving 5 to 10 minutes early shows preparation and respect for the interviewer's calendar.",
      },
      {
        type: "speaking",
        title: "Acknowledge punctuality",
        targetPhrase: "Thank you for your time, I appreciate you meeting with me today.",
      },
      {
        type: "practice",
        title: "The Business Greeting",
        chatPrompt:
          "You are the hiring director. Welcome the candidate who just arrived early. Show your appreciation for their punctuality.",
      },
    ],
  },
  {
    id: "lesson-pt-vocab-1",
    title: "O Famoso 'Jeitinho' e Convivência",
    language: "pt",
    level: "Intermediate",
    duration: "5 min",
    xp: 50,
    color: "#27AE60",
    description:
      "Aprenda a lidar com a flexibilidade e a hospitalidade calorosa da cultura brasileira.",
    category: "Vocabulary",
    icon: "🇧🇷",
    subtitle: "Cultura Brasileira",
    steps: [
      {
        type: "intro",
        title: "Bem-vindo ao Brasil!",
        text: "O 'jeitinho brasileiro' representa a capacidade única de improvisar e encontrar soluções criativas com simpatia diante de dificuldades.",
      },
      {
        type: "vocab",
        title: "Termo Chave: Dar um jeito",
        word: "Dar um jeito",
        translation: "To find a creative solution or work around a problem",
        example: "Não se preocupe, no final a gente sempre dá um jeito!",
      },
      {
        type: "quiz",
        title: "Significado Real",
        question: "O que melhor define 'dar um jeito' no cotidiano brasileiro?",
        options: [
          "Desistir do problema",
          "Encontrar uma solução criativa/alternativa",
          "Reclamar da situação",
          "Seguir regras rígidas",
        ],
        correct: "Encontrar uma solução criativa/alternativa",
        explanation: "'Dar um jeito' exprime adaptabilidade e otimismo diante de imprevistos.",
      },
      {
        type: "speaking",
        title: "Pronúncia Fluida",
        targetPhrase: "Fica tranquilo, a gente dá um jeito nisso!",
      },
      {
        type: "practice",
        title: "Resolvendo Imprevistos",
        chatPrompt:
          "Você é um recepcionista simpático de pousada. Um hóspede chegou sem reserva, ajude-o a 'dar um jeito' com hospitalidade.",
      },
    ],
  },
];

// This file previously appended ~146 procedurally-generated filler lessons here
// (ids "lesson-gen-en/pt/es-N"), with "Term #N" / "Termo #N" / "Término #N" baked
// into every title, vocab word, quiz question and option. It was unreachable dead
// code (src/data/lessonCatalog.ts only ever reads ALL_LESSONS.slice(0, 4)) but still
// ran on every import, and matched exactly the "fake counter content" pattern
// reported by users, so the generator has been removed rather than left in place.
