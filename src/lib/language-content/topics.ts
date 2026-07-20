import type { LessonTopic } from "./types";

export interface TopicMeta {
  slug: LessonTopic;
  icon: string; // lucide-react icon name
  label: { en: string; es: string; pt: string };
}

export const TOPIC_META: Record<LessonTopic, TopicMeta> = {
  daily: {
    slug: "daily",
    icon: "Coffee",
    label: { en: "Daily Life", es: "Vida Cotidiana", pt: "Vida Cotidiana" },
  },
  travel: {
    slug: "travel",
    icon: "Plane",
    label: { en: "Travel", es: "Viajes", pt: "Viagem" },
  },
  food: {
    slug: "food",
    icon: "UtensilsCrossed",
    label: { en: "Food", es: "Comida", pt: "Comida" },
  },
  business: {
    slug: "business",
    icon: "Briefcase",
    label: { en: "Business", es: "Negocios", pt: "Negócios" },
  },
  sports: {
    slug: "sports",
    icon: "Trophy",
    label: { en: "Sports", es: "Deportes", pt: "Esportes" },
  },
  fitness: {
    slug: "fitness",
    icon: "Dumbbell",
    label: { en: "Fitness", es: "Fitness", pt: "Fitness" },
  },
  culture: {
    slug: "culture",
    icon: "Landmark",
    label: { en: "Culture", es: "Cultura", pt: "Cultura" },
  },
  grammar: {
    slug: "grammar",
    icon: "BookOpen",
    label: { en: "Grammar", es: "Gramática", pt: "Gramática" },
  },
  pronunciation: {
    slug: "pronunciation",
    icon: "Mic",
    label: { en: "Pronunciation", es: "Pronunciación", pt: "Pronúncia" },
  },
  listening: {
    slug: "listening",
    icon: "Headphones",
    label: { en: "Listening", es: "Escucha", pt: "Escuta" },
  },
  shopping: {
    slug: "shopping",
    icon: "ShoppingBag",
    label: { en: "Shopping", es: "Compras", pt: "Compras" },
  },
  health: {
    slug: "health",
    icon: "HeartPulse",
    label: { en: "Health", es: "Salud", pt: "Saúde" },
  },
  technology: {
    slug: "technology",
    icon: "Smartphone",
    label: { en: "Technology", es: "Tecnología", pt: "Tecnologia" },
  },
  family: {
    slug: "family",
    icon: "Users",
    label: { en: "Family", es: "Familia", pt: "Família" },
  },
  work: {
    slug: "work",
    icon: "Building2",
    label: { en: "Work", es: "Trabajo", pt: "Trabalho" },
  },
};

export const ALL_TOPICS: LessonTopic[] = Object.keys(TOPIC_META) as LessonTopic[];
