export type TopicSlug =
  | "daily-life" | "art-culture" | "professional" | "free-talk"
  | "speaking-confidence" | "music-expression" | "travel" | "relationships";

export interface Topic {
  slug: TopicSlug;
  icon: string; // Now refers to a Lucide icon name
  title: string;
  description: string;
  description_pt: string;
  category: string;
  color: string;
  vocab: { pt: string[]; en: string[] };
  culturalTip: { pt: string; en: string };
}

export const TOPICS: Topic[] = [
  {
    slug: "daily-life", icon: "Coffee", title: "Daily Life",
    description: "Real conversations for everyday situations",
    description_pt: "Conversas reais para situações do dia a dia",
    category: "everyday", color: "#C4714A",
    vocab: {
      pt: ["padaria", "trânsito", "vizinho", "rotina", "fila"],
      en: ["errand", "commute", "neighbor", "routine", "queue"],
    },
    culturalTip: {
      pt: "No Brasil, é comum cumprimentar com 'bom dia' até estranhos no elevador.",
      en: "Small talk about the weather is a friendly default opener in English.",
    },
  },
  {
    slug: "art-culture", icon: "Palette", title: "Art & Culture",
    description: "Discuss art, cinema, music and creativity",
    description_pt: "Discuta arte, cinema, música e criatividade",
    category: "culture", color: "#1B3A4B",
    vocab: {
      pt: ["enredo", "trilha sonora", "exposição", "ensaio", "obra"],
      en: ["plot", "soundtrack", "exhibit", "essay", "masterpiece"],
    },
    culturalTip: {
      pt: "Cinema brasileiro tem nomes como Glauber Rocha e Fernanda Montenegro.",
      en: "Mentioning a recent A24 film is great cultural shorthand in English.",
    },
  },
  {
    slug: "professional", icon: "Briefcase", title: "Professional",
    description: "Work, interviews and business English",
    description_pt: "Trabalho, entrevistas e inglês para negócios",
    category: "professional", color: "#2D4A3E",
    vocab: {
      pt: ["prazo", "reunião", "entrega", "feedback", "cargo"],
      en: ["deadline", "stakeholder", "deliverable", "feedback", "role"],
    },
    culturalTip: {
      pt: "Em entrevistas brasileiras, contar uma história pessoal pode ajudar.",
      en: "In English-speaking interviews, the STAR framework is a safe bet.",
    },
  },
  {
    slug: "free-talk", icon: "MessageCircle", title: "Free Talk",
    description: "Open conversation about anything you want",
    description_pt: "Conversa aberta sobre o que você quiser",
    category: "free", color: "#D4C5A9",
    vocab: { pt: [], en: [] },
    culturalTip: { pt: "", en: "" },
  },
  {
    slug: "speaking-confidence", icon: "Brain", title: "Speaking Confidence",
    description: "Practice without fear of making mistakes",
    description_pt: "Pratique sem medo de cometer erros",
    category: "confidence", color: "#C4714A",
    vocab: {
      pt: ["acho que…", "tipo assim", "deixa eu pensar", "na verdade", "então"],
      en: ["I think…", "kind of", "let me think", "actually", "so"],
    },
    culturalTip: {
      pt: "Pausas e 'né?' soam naturais — não precisa ter medo de respirar.",
      en: "Filler words like 'well' and 'you know' make you sound human.",
    },
  },
  {
    slug: "music-expression", icon: "Music", title: "Music & Expression",
    description: "Songs, emotions and creative language",
    description_pt: "Músicas, emoções e linguagem criativa",
    category: "culture", color: "#2D4A3E",
    vocab: {
      pt: ["letra", "refrão", "saudade", "emoção", "melodia"],
      en: ["lyric", "chorus", "longing", "mood", "melody"],
    },
    culturalTip: {
      pt: "MPB usa muita metáfora — Caetano e Chico são ouro para conversar.",
      en: "Talking about a song's vibe is a low-pressure way to share feelings.",
    },
  },
  {
    slug: "travel", icon: "Plane", title: "Travel",
    description: "Airports, hotels, directions, real situations",
    description_pt: "Aeroportos, hotéis, direções, situações reais",
    category: "everyday", color: "#1B3A4B",
    vocab: {
      pt: ["embarque", "bagagem", "pousada", "endereço", "passagem"],
      en: ["boarding", "luggage", "lodging", "directions", "ticket"],
    },
    culturalTip: {
      pt: "No Brasil, gorjeta de 10% no restaurante já está incluída na conta.",
      en: "In the US, 18–20% tipping at restaurants is the social norm.",
    },
  },
  {
    slug: "relationships", icon: "Heart", title: "Relationships & Social",
    description: "Friendships, social life, small talk",
    description_pt: "Amizades, vida social, conversas casuais",
    category: "social", color: "#D4C5A9",
    vocab: {
      pt: ["amizade", "rolê", "encontro", "afeto", "cumplicidade"],
      en: ["friendship", "hangout", "date", "care", "trust"],
    },
    culturalTip: {
      pt: "Brasileiros costumam abraçar e demonstrar afeto rapidamente.",
      en: "In English, 'How are you?' is often a greeting, not a real question.",
    },
  },
];

export const TOPIC_BY_SLUG: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t]),
);

export const MOODS = [
  { slug: "calm" as const,       icon: "Leaf", label: "Calm",       hint: "Encouragement, less correction", color: "#4A7A5A" },
  { slug: "intensive" as const,  icon: "Zap", label: "Intensive",  hint: "Precise grammar feedback", color: "#1B3A4B" },
  { slug: "cultural" as const,   icon: "Palette", label: "Cultural",   hint: "Context and references", color: "#C4714A" },
  { slug: "confidence" as const, icon: "Dumbbell", label: "Confidence", hint: "Unlock your speech", color: "#C9A84C" },
];