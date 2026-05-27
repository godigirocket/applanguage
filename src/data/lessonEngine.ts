import vocabulary from "./vocabularyExpanded.json";

export type LessonCategory = "vocabulary" | "grammar" | "listening" | "reading" | "speaking";
export type TargetLanguage = "en" | "es" | "pt";

export interface LessonStep {
  type: "intro" | "vocabulary" | "quiz" | "practice" | "listening" | "speaking";
  title?: string;
  content?: string;
  words?: { word: string; meaning: string; example: string }[];
  question?: string;
  options?: string[];
  correct?: number;
  prompt?: string;
  audioText?: string;
  targetPhrase?: string;
  Asset_Visual_Description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  language: TargetLanguage;
  level: string;
  duration: string;
  xp: number;
  color: string;
  description: string;
  category: LessonCategory;
  steps: LessonStep[];
}

// Pseudo-random generator based on seed (id)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateLesson(
  language: TargetLanguage,
  category: LessonCategory,
  seed: number,
): Lesson {
  const rand = mulberry32(seed);
  const vocabList = vocabulary[language as keyof typeof vocabulary] || [];

  if (vocabList.length === 0) {
    return generateFallbackLesson(language, category, seed);
  }

  // Helper to shuffle array pseudo-randomly
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ── Themed title & meta lookup ──────────────────────────────────────────────
  let themeColor = "#2D4A3E";
  let catKey: "vocabulary" | "grammar" | "listening" | "speaking" = "vocabulary";
  let level = "A2";
  let xp = 40;
  let duration = "6 min";

  if (category === "listening") {
    themeColor = "#1B3A4B"; catKey = "listening"; level = "B1"; xp = 45; duration = "7 min";
  } else if (category === "speaking") {
    themeColor = "#C4714A"; catKey = "speaking"; level = "B2"; xp = 50; duration = "8 min";
  } else if (category === "grammar") {
    themeColor = "#7850B4"; catKey = "grammar"; level = "B1"; xp = 45; duration = "7 min";
  }

  const TITLE_POOLS: Record<string, string[]> = {
    vocabulary: [
      "The Art of Small Talk", "Urban Slang Decoded", "Feelings & Emotions Unlocked",
      "Business Vocabulary Power-Up", "Food & Flavors Around the World",
      "Travel Talk: Airport to Hotel", "Digital Age Expressions",
      "Nature & Environment Words", "Family & Relationships Vocab",
      "Health & Wellness Language", "Music & Arts Vocabulary", "Sports & Competition Terms",
      "Time & Schedule Expressions", "Money & Finance Words", "Colors, Shapes & Descriptions",
      "Workplace Jargon Mastery", "Social Media Language", "Clothing & Fashion Words",
      "Home & Furniture Vocabulary", "Weather & Seasons Expressions",
      "Cooking & Recipes Language", "Technology & Gadgets Terms",
      "Shopping & Commerce Vocab", "Education & Learning Words",
      "Personality & Character Traits", "Directions & Transportation",
      "Celebrations & Festivities", "Animals & Wildlife Words",
      "Body & Health Vocabulary", "Crime & Justice Terms",
      "Politics & Society Language", "Science & Discovery Words",
      "Literature & Storytelling", "Architecture & Cities",
      "Professions & Careers Vocab", "Idioms of the Street",
      "Phrasal Verbs Power Hour", "Synonyms & Nuances", "Antonyms & Contrasts",
      "Compound Words Workshop", "False Friends Alert",
      "Words with Multiple Meanings", "Borrowed Words from English",
      "Latin Roots in Modern Vocab", "Slang from the 2000s to Now",
      "Gen Z Dictionary Explained", "Words That Don't Translate",
      "Onomatopoeia & Sound Words", "Words for Silence & Solitude", "Love & Romance Language",
    ],
    grammar: [
      "Tense Mastery: Present Perfect", "Conditional Sentences Unpacked",
      "Passive Voice Workshop", "Modal Verbs: Can, Could, Would",
      "Reported Speech Demystified", "Articles: A, An, The — Master It",
      "Prepositions of Time & Place", "Conjunctions & Sentence Flow",
      "Relative Clauses Deep Dive", "Subject-Verb Agreement Rules",
      "Phrasal Verbs in Action", "Gerund vs. Infinitive: The Battle",
      "Question Formation Mastery", "Negation Patterns Explained",
      "Comparatives & Superlatives", "Adjective Order: The Secret Rule",
      "Direct vs Indirect Speech", "Future Tenses: Which One When?",
      "Past Simple vs Past Perfect", "Collocations: Words That Pair",
      "Intensifiers & Hedging Words", "Punctuation for Clarity",
      "Countable vs Uncountable Nouns", "Pronouns: Personal, Possessive",
      "Verb Tenses: The Full Map", "Subjunctive Mood Explained",
      "Linking Words for Essays", "Discourse Markers in Speech",
      "Parallel Structure in Writing", "Ellipsis & Substitution",
      "Cleft Sentences for Emphasis", "Inversion: Formal English",
      "Mixed Conditionals", "Wishes & Regrets: If Only...",
      "Determiners & Quantifiers", "Prefixes & Suffixes Workshop",
      "Nominalization in Academic Text", "Adverb Placement Rules",
      "Verb Patterns: Sense Verbs", "Causative Structures: Have & Get",
      "Participle Clauses in Writing", "Fronting for Emphasis",
      "Concession & Contrast Clauses", "Purpose & Result Clauses",
      "Avoiding Dangling Modifiers", "The Oxford Comma Debate",
      "Run-on Sentences Fixed", "Active Reading of Grammar",
      "Grammar for Polite Requests", "Error Correction Strategies",
    ],
    listening: [
      "Decoding Fast Speech", "Accents of the English World",
      "Listen & Catch Contractions", "News English: Key Phrases",
      "Song Lyrics as Learning Tools", "Podcast Comprehension Skills",
      "Linking Sounds: Liaison", "Intonation Patterns in Dialogue",
      "Minimal Pairs: Sound Distinctions", "Formal vs. Casual Spoken English",
      "British vs. American Sound Shifts", "Australian & NZ Accent Clues",
      "South African English Patterns", "Rhythm & Stress in Sentences",
      "Phone Calls & Audio Etiquette", "Movie Scene Comprehension",
      "Interview & Podcast Listening", "Sports Commentary Decoded",
      "Political Speech Patterns", "Academic Lecture Listening",
      "Reductions: Gonna, Wanna, Hafta", "Numbers & Dates in Fast Speech",
      "Fillers: Uh, Um, Like, You Know", "Emotional Cues in Voice",
      "Sarcasm & Irony Detection", "Customer Service Calls",
      "Airport & Travel Announcements", "Medical Appointment Listening",
      "Job Interview Audio Simulation", "Storytelling Patterns in Speech",
      "Comedy & Jokes: The Timing", "Slang in Songs: Decoded",
      "Documentary Narration Styles", "Pronunciation in Context",
      "Echo Questions in Conversation", "Shadowing Technique Workout",
      "Dictation Practice Session", "Radio English Comprehension",
      "TED Talk Listening Challenge", "Debate & Argument Structures",
      "Instructions & Directions Audio", "Weather Forecast Listening",
      "News Headlines Speed Drill", "Conversation Fillers Mastered",
      "Empathy & Support Phrases", "Academic Discussion Listening",
      "Cultural References in Audio", "Speed Listening Challenge",
      "Children's English Clues", "Register: Formal to Casual",
    ],
    speaking: [
      "First Impressions: Self-Introduction", "Small Talk That Actually Works",
      "Disagree Without Offending", "Telling Your Life Story",
      "Asking for Directions Confidently", "Ordering Food Like a Local",
      "Job Interview Speaking Mastery", "Giving a Toast or Short Speech",
      "Phone & Video Call Etiquette", "Expressing Opinions Boldly",
      "Negotiating & Persuading", "Apologizing & Forgiving Well",
      "Emotions: Putting Feelings to Words", "Humor & Light Conversation",
      "Storytelling with Impact", "Talking About Your Passions",
      "Discussing News & Current Events", "Pronunciation of Tough Sounds",
      "Stress & Rhythm in Real Speech", "British vs American Accent",
      "Academic Discussion & Seminar Talk", "Debate Strategies",
      "Presenting Data & Statistics", "Roleplay: Doctor's Appointment",
      "Roleplay: Hotel & Travel", "Roleplay: At the Bank",
      "Roleplay: Customer Complaint", "Roleplay: Job Interview",
      "Cold-Call Confidence", "Networking at Events",
      "Small Talk at a Party", "Talking About Movies & Books",
      "Expressing Agreement Politely", "How to Give Good Feedback",
      "Explaining Complex Ideas Simply", "Talking About Goals & Plans",
      "Making Recommendations", "Describing People & Places",
      "Talking About Routines", "Talking About the Past",
      "Describing Hypothetical Scenarios", "Persuasion & Influencing",
      "Dealing with Silence Comfortably", "Speed Monologue Challenge",
      "Spontaneous Speaking 60s", "Pronunciation Patterns Workshop",
      "Tongue Twisters for Fluency", "Shadowing Native Speakers",
      "Accent Reduction Techniques", "Public Speaking in English",
    ],
  };

  const INTRO_POOL: Record<string, string[]> = {
    vocabulary: [
      "Words are the building blocks of communication. In this session, you'll encounter high-frequency vocabulary used by native speakers in daily life — with real examples from conversations, social media, and workplace settings.",
      "Expanding your vocabulary is one of the fastest paths to fluency. Today's lesson handpicks expressions that will make you sound natural and confident in any situation. Get ready to discover words you'll want to use immediately.",
      "The richest speakers aren't those who know the most words — they're those who use the right word at the right moment. This session focuses on precision, nuance, and the cultural context that makes vocabulary come alive.",
      "Language is living and constantly evolving. Explore vocabulary that native speakers actually use right now — from Gen Z slang to professional jargon — so you always sound current and authentic.",
      "Every great conversationalist started by learning one word at a time. This lesson curates the most impactful vocabulary from today's theme, with examples, collocations, and mnemonics to make them stick permanently.",
    ],
    grammar: [
      "Grammar is not a cage — it's a map. Once you understand the underlying logic of the language, you gain the freedom to say exactly what you mean, with confidence and precision.",
      "Many learners fear grammar, but it's really just a set of patterns that native speakers use intuitively. Today we break down those patterns into clear, memorable rules with plenty of real-world examples.",
      "Grammar rules exist to make communication clearer. This session explores a key structure that will immediately elevate your writing, speaking, and comprehension to a more advanced level.",
      "The best way to internalize grammar is to see it in context. Today's session uses authentic sentences from news, conversations, and literature to demonstrate how this structure really works in practice.",
      "Even advanced speakers make grammar errors when they haven't fully internalized certain rules. This lesson zeroes in on a commonly misused structure and gives you the tools to master it once and for all.",
    ],
    listening: [
      "Listening is the most underrated language skill. Most learners spend hours on vocabulary and grammar, but forget that understanding natural, fast speech requires dedicated training. Today's session targets the patterns that make native speech hard to decode.",
      "Native speakers don't speak the way textbooks teach. They link words, drop sounds, and use rhythm to convey meaning. This session trains your ear to catch these subtle patterns and understand rapid conversation.",
      "Audio comprehension is the gateway to fluency. When you can effortlessly understand native speakers — with all their speed, accents, and informal expressions — the language truly becomes yours.",
      "Every accent tells a story. In this listening session, we expose you to authentic spoken language from different regions, training your brain to adapt to the beautiful diversity of the English-speaking world.",
      "Great listeners make great speakers. When you internalize the rhythm, intonation, and flow of native speech, it naturally improves your own pronunciation. Today's audio challenge is designed to do exactly that.",
    ],
    speaking: [
      "Speaking is where language becomes real. All the vocabulary and grammar you learn only truly activates when you put it into practice out loud. This session creates the perfect environment to push your speaking further.",
      "Confidence in speaking comes from repetition and feedback. Today's practice gives you structured prompts to build sentences, tell stories, and express opinions — all while training you to sound more fluent and natural.",
      "The biggest barrier to speaking is fear of making mistakes. But mistakes are how brains learn best. Today we create a safe space to experiment with the language and build unstoppable speaking confidence.",
      "Fluency isn't about speaking without pausing — it's about expressing your ideas smoothly, even when you're still learning. This session focuses on strategies real speakers use to keep conversations flowing.",
      "Great speakers are great listeners who've learned to imitate and adapt. Today we blend shadowing, spontaneous speech, and guided roleplay to accelerate your spoken English to a whole new level.",
    ],
  };

  const titlePool = TITLE_POOLS[catKey] || TITLE_POOLS.vocabulary;
  const introPool = INTRO_POOL[catKey] || INTRO_POOL.vocabulary;
  const lessonTitle = titlePool[seed % titlePool.length];
  const introText = introPool[seed % introPool.length];

  const TIPS = [
    "💡 Try using today's words in a sentence you write yourself — personal examples stick 3× longer.",
    "💡 Say each new word out loud 3 times. Your mouth muscles need practice too!",
    "💡 Connect new words to emotions or personal memories to remember them more easily.",
    "💡 Review this lesson again in 24 hours — spaced repetition doubles retention.",
    "💡 Write 3 sentences using today's new words before you sleep tonight.",
  ];
  const tip = TIPS[seed % TIPS.length];

  // Get a unique selection of words for options and questions
  const shuffledVocab = shuffle(vocabList);
  const mainWords = shuffledVocab.slice(0, 3);
  const distractorWords = shuffledVocab.slice(3, 7);

  // Steps Builder
  const steps: LessonStep[] = [];

  steps.push({
    type: "intro",
    title: lessonTitle,
    content: `${introText}\n\n${tip}`,
  });

  const visualTypes = ["termômetro", "gráfico", "moedas"];
  const stepVisual = visualTypes[seed % visualTypes.length];

  steps.push({
    type: "vocabulary",
    words: mainWords.map((w) => ({
      word: w.word,
      meaning: w.translation,
      example: w.example,
    })),
    Asset_Visual_Description: stepVisual,
  });

  const quizWord = mainWords[0];
  const quizOptions = shuffle([
    quizWord.translation,
    distractorWords[0].translation,
    distractorWords[1].translation,
    distractorWords[2].translation,
  ]);
  steps.push({
    type: "quiz",
    question: `Qual é o significado correto de "${quizWord.word}"?`,
    options: quizOptions,
    correct: quizOptions.indexOf(quizWord.translation),
    Asset_Visual_Description: stepVisual,
  });

  const listenWord = mainWords[1];
  const listenOptions = shuffle([
    listenWord.word,
    distractorWords[0].word,
    distractorWords[1].word,
    distractorWords[3].word,
  ]);
  steps.push({
    type: "listening",
    audioText: listenWord.example,
    question: `Ouça com atenção. Qual palavra foi pronunciada na frase?`,
    options: listenOptions,
    correct: listenOptions.indexOf(listenWord.word),
  });

  const speakWord = mainWords[2];
  steps.push({
    type: "speaking",
    title: "Treinamento de Pronúncia",
    content: "Pressione o microfone e leia a frase em voz alta para receber sua nota instantânea.",
    targetPhrase: speakWord.example,
  });

  steps.push({
    type: "practice",
    prompt: `Olá! Vamos consolidar o que você aprendeu em "${lessonTitle}". Tente usar uma destas expressões: "${mainWords[0].word}" ou "${mainWords[2].word}". Como foi seu dia?`,
    Asset_Visual_Description: stepVisual,
  });

  return {
    id: `lume-${category}-${language}-${seed}`,
    title: lessonTitle,
    language,
    level,
    duration,
    xp,
    color: themeColor,
    description: `${introText.slice(0, 90)}...`,
    category,
    steps,
  };
}

function generateFallbackLesson(
  language: TargetLanguage,
  category: LessonCategory,
  seed: number,
): Lesson {
  const fallbackTitles = [
    "Language Foundations", "Core Expression Builder", "Essential Communication",
    "Fluency Fundamentals", "Vocabulary Deep Dive",
  ];
  return {
    id: `lume-${language}-${seed}`,
    title: fallbackTitles[seed % fallbackTitles.length],
    language,
    level: "A1",
    duration: "5 min",
    xp: 15,
    color: "#7850B4",
    description: "Sessão de prática essencial para consolidar os fundamentos da língua.",
    category,
    steps: [
      {
        type: "intro",
        title: fallbackTitles[seed % fallbackTitles.length],
        content: "Bem-vindo a esta sessão de prática. Vamos começar com o essencial!",
      },
    ],
  };
}

export function getLessonCatalogue(language: TargetLanguage, count: number = 1200): Lesson[] {
  const lessons: Lesson[] = [];
  const categories: LessonCategory[] = ["vocabulary", "listening", "speaking", "grammar"];

  for (let i = 1; i <= count; i++) {
    const cat = categories[(i - 1) % categories.length];
    lessons.push(generateLesson(language, cat, i));
  }
  return lessons;
}
