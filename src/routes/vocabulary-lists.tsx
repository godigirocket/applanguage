import {useLearningRevision} from "@/hooks/useLearningRevision";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { TOPIC_LABELS,topicLabel } from "@/lib/learning-collections";
import { getVocabularyForTopic } from "@/lib/language-content/vocabulary-engine";
import { getSavedWords } from "@/lib/language-content/saved-words";
import type { LessonTopic } from "@/lib/language-content/types";
export const Route = createFileRoute("/vocabulary-lists")({ component: VocabularyListsPage });
function VocabularyListsPage() {
  const { targetLanguage, interfaceLanguage } = useStore();
  useLearningRevision();
  const t=(pt:string,en:string,es:string)=>interfaceLanguage==="pt"?pt:interfaceLanguage==="es"?es:en;
  const saved = new Map(getSavedWords().map((word) => [word.id, word]));
  const collections = Object.entries(TOPIC_LABELS).map(([id, title]) => {
    const words = getVocabularyForTopic(id as LessonTopic, targetLanguage, {
      count: Infinity,
      interfaceLanguage,
    });
    const learned = words.filter((w) => (saved.get(w.id)?.correctAnswers || 0) > 0).length;
    return {
      id,
      title:topicLabel(id,interfaceLanguage),
      count: words.length,
      learned,
      percent: words.length ? Math.round((learned / words.length) * 100) : 0,
    };
  });
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 900 }}>
          {t("Coleções de vocabulário","Vocabulary collections","Colecciones de vocabulario")}
        </h1>
        <p style={{ margin: "12px 0 28px", color: "var(--text-secondary)" }}>
          {t("Palavras reais por tema. Salve e revise para acompanhar o que aprendeu.","Real words by topic. Save and review to track what you learned.","Palabras reales por tema. Guarda y repasa para seguir tu aprendizaje.")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))",
            gap: 20,
          }}
        >
          {collections.map((list) => (
            <Link
              key={list.id}
              to="/dictionary"
              search={{ collection: list.id }}
              className="lume-card"
              style={{
                padding: 24,
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{list.title}</h2>
              <p style={{ margin: "12px 0" }}>
                {list.count} {t("palavras","words","palabras")} · {list.learned} {t("revisadas corretamente","reviewed correctly","repasadas correctamente")}
              </p>
              <progress
                aria-label={`${t("Progresso em","Progress in","Progreso en")} ${list.title}`}
                max={Math.max(1, list.count)}
                value={list.learned}
                style={{ width: "100%", accentColor: "var(--brand)" }}
              />
              <p style={{ marginTop: 12 }}>{list.percent}% · {t("Abrir coleção","Open collection","Abrir colección")} →</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
