import type { LessonTopic } from "./language-content/types";
export const TOPIC_LABELS: Record<LessonTopic, string> = {
  daily: "Dia a dia",
  travel: "Viagem",
  food: "Alimentação",
  business: "Negócios",
  sports: "Esportes",
  fitness: "Exercícios",
  culture: "Cultura",
  grammar: "Gramática",
  pronunciation: "Pronúncia",
  listening: "Compreensão oral",
  shopping: "Compras",
  health: "Saúde",
  technology: "Tecnologia",
  family: "Família",
  work: "Trabalho",
};
const ENGLISH: Record<LessonTopic, string> = {
  daily: "Daily life",
  travel: "Travel",
  food: "Food",
  business: "Business",
  sports: "Sports",
  fitness: "Fitness",
  culture: "Culture",
  grammar: "Grammar",
  pronunciation: "Speaking",
  listening: "Listening",
  shopping: "Shopping",
  health: "Health",
  technology: "Technology",
  family: "Family",
  work: "Work",
};
const SPANISH: Record<LessonTopic, string> = {
  daily: "Día a día",
  travel: "Viajes",
  food: "Alimentación",
  business: "Negocios",
  sports: "Deportes",
  fitness: "Ejercicio",
  culture: "Cultura",
  grammar: "Gramática",
  pronunciation: "Expresión oral",
  listening: "Comprensión oral",
  shopping: "Compras",
  health: "Salud",
  technology: "Tecnología",
  family: "Familia",
  work: "Trabajo",
};
export function topicLabel(topic: string, language: string) {
  return (
    (language === "es" ? SPANISH : language === "en" ? ENGLISH : TOPIC_LABELS)[
      topic as LessonTopic
    ] || topic
  );
}
export function isCollection(value: unknown): value is LessonTopic {
  return typeof value === "string" && Object.hasOwn(TOPIC_LABELS, value);
}
export function summarizeSkills(
  lessons: Array<{ id: string; topic?: string; xp: number; locked?: boolean }>,
  completed: string[],
  language = "pt",
) {
  const done = new Set(completed);
  return Object.entries(TOPIC_LABELS)
    .map(([topic, title]) => {
      const items = lessons.filter((l) => l.topic === topic);
      const finished = items.filter((l) => done.has(l.id));
      const next = items.find((l) => !done.has(l.id) && !l.locked);
      return {
        id: topic,
        title: topicLabel(topic, language),
        total: items.length,
        completed: finished.length,
        xp: finished.reduce((n, l) => n + l.xp, 0),
        percent: items.length ? Math.round((finished.length / items.length) * 100) : 0,
        nextId: next?.id,
      };
    })
    .filter((s) => s.total);
}
