/**
 * LESSON CONTENT - Vocabulary & Quizzes by Type
 * Real content for lesson execution
 */

// Vocabulary by lesson type
export const VOCAB_BY_TYPE: Record<string, Array<{ word: string; meaning: string; example: string }>> = {
  Grammar: [
    { word: "Present Perfect", meaning: "Tempo verbal para ações que começaram no passado e continuam no presente", example: "I have studied English for 5 years." },
    { word: "Conditional", meaning: "Estrutura usada para expressar possibilidades", example: "If I had money, I would travel." },
    { word: "Passive Voice", meaning: "Voz passiva - foco no objeto da ação", example: "The book was written by her." },
    { word: "Subjunctive", meaning: "Modo verbal para expressar desejo ou hipótese", example: "I wish I were taller." },
    { word: "Gerund", meaning: "Verbo com função de substantivo (-ing)", example: "Swimming is my favorite activity." },
  ],
  Vocabulary: [
    { word: "Resilient", meaning: "Resiliente - capaz de se recuperar", example: "She is a resilient person who never gives up." },
    { word: "Deadline", meaning: "Prazo final", example: "The deadline for this project is Friday." },
    { word: "Overwhelmed", meaning: "Sobrecarregado", example: "I feel overwhelmed with all this work." },
    { word: "Commute", meaning: "Deslocamento diário", example: "My daily commute takes one hour." },
    { word: "Sustainable", meaning: "Sustentável", example: "We need sustainable energy sources." },
  ],
  Pronunciation: [
    { word: "Thought", meaning: "Pensamento", example: "I thought about you yesterday." },
    { word: "Through", meaning: "Através", example: "We walked through the park." },
    { word: "Thorough", meaning: "Minucioso", example: "He did a thorough investigation." },
    { word: "Colonel", meaning: "Coronel", example: "The colonel gave the orders." },
    { word: "Choir", meaning: "Coro", example: "She sings in the church choir." },
  ],
  Listening: [
    { word: "Linking", meaning: "Ligação entre palavras na fala", example: "Come_on sounds like 'cummon'" },
    { word: "Reduction", meaning: "Redução de sons", example: "Going to → gonna" },
    { word: "Intonation", meaning: "Entonação", example: "Rising tone for questions" },
    { word: "Stress", meaning: "Ênfase em sílabas", example: "REcord (noun) vs reCORD (verb)" },
    { word: "Accent", meaning: "Sotaque regional", example: "British vs American pronunciation" },
  ],
  Reading: [
    { word: "Context Clues", meaning: "Pistas contextuais", example: "Use surrounding words to guess meaning." },
    { word: "Skimming", meaning: "Leitura rápida para ideia geral", example: "Skim the article for main points." },
    { word: "Scanning", meaning: "Busca por informação específica", example: "Scan for dates and names." },
    { word: "Inference", meaning: "Dedução do que não está explícito", example: "Infer the author's opinion." },
    { word: "Summary", meaning: "Resumo", example: "Write a summary of the text." },
  ],
  Writing: [
    { word: "Thesis", meaning: "Tese - ideia principal", example: "State your thesis in the introduction." },
    { word: "Paragraph", meaning: "Parágrafo", example: "Each paragraph needs a topic sentence." },
    { word: "Transition", meaning: "Transição entre ideias", example: "Use 'however' to show contrast." },
    { word: "Conclusion", meaning: "Conclusão", example: "Summarize your points in the conclusion." },
    { word: "Cohesion", meaning: "Coesão textual", example: "Use cohesive devices to link ideas." },
  ],
  Speaking: [
    { word: "Fluency", meaning: "Fluência", example: "Practice daily to improve your fluency." },
    { word: "Fillers", meaning: "Palavras de preenchimento", example: "Um, well, you know..." },
    { word: "Turn-taking", meaning: "Alternância de turno na conversa", example: "Wait for your turn to speak." },
    { word: "Clarification", meaning: "Pedido de esclarecimento", example: "Could you repeat that, please?" },
    { word: "Paraphrasing", meaning: "Reformulação", example: "Let me say that in another way..." },
  ],
};

// Quiz questions by lesson type
export const QUIZ_BY_TYPE: Record<string, Array<{ q: string; options: string[]; correct: string; explanation: string }>> = {
  Grammar: [
    {
      q: "Which sentence uses Present Perfect correctly?",
      options: ["I studied English yesterday.", "I have studied English for 5 years.", "I am studying English now.", "I will study English tomorrow."],
      correct: "I have studied English for 5 years.",
      explanation: "Present Perfect connects past to present with 'have/has + past participle'."
    },
    {
      q: "Identify the conditional sentence:",
      options: ["I eat breakfast every day.", "If I had money, I would travel.", "She is eating lunch.", "They went to the park."],
      correct: "If I had money, I would travel.",
      explanation: "Conditional sentences express hypothetical situations using 'if'."
    },
    {
      q: "Which is in Passive Voice?",
      options: ["She wrote the book.", "The book was written by her.", "She is writing a book.", "She will write a book."],
      correct: "The book was written by her.",
      explanation: "Passive voice uses 'be + past participle' and focuses on the object."
    },
  ],
  Vocabulary: [
    {
      q: "What does 'resilient' mean?",
      options: ["Weak", "Capable of recovering quickly", "Tired", "Confused"],
      correct: "Capable of recovering quickly",
      explanation: "'Resilient' describes someone who bounces back from difficulties."
    },
    {
      q: "A 'deadline' is:",
      options: ["A lifeline", "A final date for completion", "A type of line", "A dead end"],
      correct: "A final date for completion",
      explanation: "Deadline is the latest time by which something must be finished."
    },
    {
      q: "If someone is 'overwhelmed', they feel:",
      options: ["Happy", "Burdened with too much", "Energetic", "Hungry"],
      correct: "Burdened with too much",
      explanation: "'Overwhelmed' means feeling unable to cope with too many tasks."
    },
  ],
  Pronunciation: [
    {
      q: "How do you pronounce 'colonel'?",
      options: ["kol-oh-NEL", "KER-nel", "ko-LON-el", "COL-o-nel"],
      correct: "KER-nel",
      explanation: "'Colonel' is pronounced like 'kernel' despite its spelling."
    },
    {
      q: "Which word has a silent 'gh'?",
      options: ["Ghost", "Laugh", "Through", "Rough"],
      correct: "Through",
      explanation: "In 'through', the 'gh' is silent. It sounds like 'thru'."
    },
    {
      q: "'Thought' rhymes with:",
      options: ["Taught", "Though", "Through", "Tough"],
      correct: "Taught",
      explanation: "'Thought' and 'taught' both have the 'aw' sound."
    },
  ],
  Listening: [
    {
      q: "When native speakers say 'going to' quickly, it sounds like:",
      options: ["going-to", "gonna", "go-to", "goin"],
      correct: "gonna",
      explanation: "In fast speech, 'going to' reduces to 'gonna'."
    },
    {
      q: "What is 'linking' in speech?",
      options: ["Speaking slowly", "Connecting words smoothly", "Shouting", "Whispering"],
      correct: "Connecting words smoothly",
      explanation: "Linking means connecting the end of one word to the start of the next."
    },
    {
      q: "Rising intonation is typically used for:",
      options: ["Statements", "Commands", "Questions", "Exclamations"],
      correct: "Questions",
      explanation: "Questions usually end with rising intonation in English."
    },
  ],
  Reading: [
    {
      q: "What is 'skimming'?",
      options: ["Reading every word carefully", "Reading quickly for main ideas", "Reading backwards", "Reading out loud"],
      correct: "Reading quickly for main ideas",
      explanation: "Skimming means reading quickly to get the general sense."
    },
    {
      q: "Context clues help you:",
      options: ["Guess unknown word meanings", "Write faster", "Speak louder", "Listen better"],
      correct: "Guess unknown word meanings",
      explanation: "Context clues are hints in surrounding text that reveal word meanings."
    },
    {
      q: "'Inference' means:",
      options: ["Copying text exactly", "Understanding implied information", "Translating", "Memorizing"],
      correct: "Understanding implied information",
      explanation: "Inference is reading between the lines to understand what's not stated directly."
    },
  ],
  Writing: [
    {
      q: "A thesis statement should:",
      options: ["Be vague", "State the main argument", "Be very long", "Ask a question"],
      correct: "State the main argument",
      explanation: "A thesis clearly presents the main point or argument of an essay."
    },
    {
      q: "Which is a transition word?",
      options: ["Cat", "However", "Fast", "Blue"],
      correct: "However",
      explanation: "'However' shows contrast and helps connect ideas between sentences."
    },
    {
      q: "What should a conclusion do?",
      options: ["Introduce new topics", "Summarize main points", "Ask many questions", "Be one sentence"],
      correct: "Summarize main points",
      explanation: "A conclusion wraps up the essay by restating key ideas."
    },
  ],
  Speaking: [
    {
      q: "'Fluency' in speaking means:",
      options: ["Speaking without mistakes", "Speaking smoothly and naturally", "Speaking loudly", "Speaking in one language"],
      correct: "Speaking smoothly and naturally",
      explanation: "Fluency is about smooth, natural flow, not perfection."
    },
    {
      q: "Fillers like 'um' and 'well' are:",
      options: ["Always wrong", "Natural pause words", "Only for beginners", "Grammar mistakes"],
      correct: "Natural pause words",
      explanation: "Fillers give speakers time to think and are normal in conversation."
    },
    {
      q: "To ask for clarification, you can say:",
      options: ["I know everything", "Could you repeat that?", "Goodbye", "Thank you"],
      correct: "Could you repeat that?",
      explanation: "Asking for repetition helps ensure understanding in conversation."
    },
  ],
};

// Lesson types and topics
export const LESSON_TYPES = ["Grammar", "Vocabulary", "Pronunciation", "Listening", "Reading", "Writing", "Speaking"];

export const LESSON_TOPICS = [
  "Daily Conversations", "Business English", "Travel & Tourism", "Food & Dining", "Health & Wellness",
  "Technology", "Nature & Environment", "Culture & Arts", "Sports & Fitness", "Education",
  "Family & Relationships", "Shopping & Commerce", "Work & Career", "Hobbies & Interests", "Time & Schedules",
  "Money & Finance", "Housing & Real Estate", "Transportation", "Weather & Seasons", "Celebrations & Events",
];

export const LESSON_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const TYPE_COLORS: Record<string, string> = {
  Grammar: "#7850B4",
  Vocabulary: "#2D4A3E",
  Pronunciation: "#C4714A",
  Listening: "#1B3A4B",
  Reading: "#4A90E2",
  Writing: "#D4824A",
  Speaking: "#9B59B6",
};
