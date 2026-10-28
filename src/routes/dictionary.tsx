import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { Search, Volume2, Bookmark } from "@/components/lume/CustomIcons";
import { getVocabularyForTopic } from "@/lib/language-content/vocabulary-engine";
import { TOPIC_LABELS, isCollection, topicLabel } from "@/lib/learning-collections";
import { useLearningRevision } from "@/hooks/useLearningRevision";
import { getSavedWords, saveWord } from "@/lib/language-content/saved-words";
import type { LessonTopic, VocabularyItem } from "@/lib/language-content/types";
import { useStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDictionaryEntry, type DictionaryResult } from "@/lib/language-apis/dictionaryApi";
import { speak, stopSpeaking } from "@/lib/language-apis/webSpeech";

export const Route = createFileRoute("/dictionary")({
  validateSearch: (search: Record<string, unknown>): { collection?: string } => ({
    collection: isCollection(search.collection) ? search.collection : undefined,
  }),
  component: DictionaryPage,
});

function DictionaryPage() {
  const { targetLanguage, interfaceLanguage } = useStore();
  const t = (pt: string, en: string, es: string) =>
    interfaceLanguage === "pt" ? pt : interfaceLanguage === "es" ? es : en;
  const revision = useLearningRevision();
  const { collection } = Route.useSearch();
  const [limit, setLimit] = useState(30);
  const [saved, setSaved] = useState(() => new Set(getSavedWords().map((w) => w.id)));
  useEffect(() => setSaved(new Set(getSavedWords().map((w) => w.id))), [revision]);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlineEntry, setOnlineEntry] = useState<DictionaryResult | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<"idle" | "loading" | "missing">("idle");
  const lookupGeneration = useRef(0);
  useEffect(() => {
    lookupGeneration.current++;
    setOnlineEntry(null);
    setOnlineStatus("idle");
    return () => {
      lookupGeneration.current++;
    };
  }, [search, targetLanguage]);
  useEffect(() => () => stopSpeaking(), []);
  async function lookupOnline() {
    const generation = ++lookupGeneration.current;
    setOnlineStatus("loading");
    const entry = await fetchDictionaryEntry(search);
    if (generation !== lookupGeneration.current) return;
    setOnlineEntry(entry);
    setOnlineStatus(entry ? "idle" : "missing");
  }

  const data = useMemo(
    () =>
      Object.keys(TOPIC_LABELS).flatMap((topic) =>
        getVocabularyForTopic(topic as LessonTopic, targetLanguage, {
          count: Infinity,
          interfaceLanguage,
        }).map((w) => ({
          ...w,
          word: w.term,
          category: w.topic,
          level: w.difficulty === "beginner" ? "A1" : w.difficulty === "intermediate" ? "B1" : "C1",
        })),
      ),
    [targetLanguage, interfaceLanguage],
  );
  useEffect(() => {
    setSelectedCategory(collection || "all");
    setLimit(30);
  }, [collection]);
  useEffect(() => {
    setLimit(30);
  }, [search, selectedLevel, selectedCategory, targetLanguage]);
  const handleSave = (word: VocabularyItem) => {
    saveWord(word);
    setSaved(new Set(getSavedWords().map((w) => w.id)));
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "all" || item.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleSpeak = (word: string) => {
    speak(word, targetLanguage);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 40px" }}>
        <header style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--text-primary)",
              marginBottom: "16px",
              fontWeight: 900,
            }}
          >
            {t("Dicionário Lume", "Lume Dictionary", "Diccionario Lume")}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: "1 1 100%", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-secondary)",
                }}
              >
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t(
                  "Buscar palavra ou tradução…",
                  "Search word or translation…",
                  "Buscar palabra o traducción…",
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 48px",
                  borderRadius: "16px",
                  border: "1.5px solid var(--border)",
                  background: "var(--surface-raised)",
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>
            <select
              aria-label={t("Níveis", "Levels", "Niveles")}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                flex: "1 1 140px",
                minWidth: 0,
                padding: "0 16px",
                borderRadius: "16px",
                border: "1.5px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">{t("Níveis", "Levels", "Niveles")}</option>
              {[...new Set(data.map((word) => word.level))].sort().map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              aria-label={t("Categorias", "Categories", "Categorías")}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                flex: "1 1 140px",
                minWidth: 0,
                padding: "0 16px",
                borderRadius: "16px",
                border: "1.5px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">{t("Categorias", "Categories", "Categorías")}</option>
              {Object.entries(TOPIC_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {topicLabel(id, interfaceLanguage)}
                </option>
              ))}
            </select>
          </div>
        </header>

        {targetLanguage === "en" && search.trim() && (
          <section
            style={{
              marginBottom: 24,
              padding: 20,
              borderRadius: 16,
              border: "1px solid var(--border)",
              overflowWrap: "anywhere",
            }}
          >
            <button
              className="btn-gold"
              onClick={lookupOnline}
              disabled={
                onlineStatus === "loading" || !/^[a-zA-Z][a-zA-Z' -]{0,59}$/.test(search.trim())
              }
            >
              {onlineStatus === "loading"
                ? t("Consultando…", "Looking up…", "Consultando…")
                : t(
                    "Consultar definição em inglês",
                    "Look up English definition",
                    "Consultar definición en inglés",
                  )}
            </button>
            <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-secondary)" }}>
              {t("Fonte opcional:", "Optional source:", "Fuente opcional:")}{" "}
              <a href="https://dictionaryapi.dev/" target="_blank" rel="noreferrer">
                Free Dictionary API
              </a>
              {t(
                ". Apenas a palavra pesquisada é enviada. O vocabulário local funciona sem essa consulta.",
                ". Only the searched word is sent. Local vocabulary works without this lookup.",
                ". Solo se envía la palabra buscada. El vocabulario local funciona sin esta consulta.",
              )}
            </p>
            <div aria-live="polite">
              {onlineEntry && (
                <div style={{ marginTop: 12 }}>
                  <strong>{onlineEntry.word}</strong> {onlineEntry.phonetic}
                  <p>{onlineEntry.definition}</p>
                  {onlineEntry.sourceUrl && (
                    <p style={{ fontSize: 12, marginTop: 8 }}>
                      <a href={onlineEntry.sourceUrl} target="_blank" rel="noreferrer">
                        {t("Fonte: Wiktionary", "Source: Wiktionary", "Fuente: Wiktionary")}
                      </a>
                      {onlineEntry.licenseUrl && (
                        <>
                          {" "}
                          ·{" "}
                          <a href={onlineEntry.licenseUrl} target="_blank" rel="noreferrer">
                            {onlineEntry.licenseName || t("Licença", "License", "Licencia")}
                          </a>
                        </>
                      )}
                    </p>
                  )}
                  {onlineEntry.example && (
                    <p style={{ marginTop: 8 }}>
                      {t("Exemplo:", "Example:", "Ejemplo:")} {onlineEntry.example}
                    </p>
                  )}
                </div>
              )}
              {onlineStatus === "missing" && (
                <p style={{ marginTop: 12 }}>
                  {t(
                    "A definição online não está disponível. Continue com as palavras e exemplos locais abaixo.",
                    "The online definition is unavailable. Continue with the local words and examples below.",
                    "La definición en línea no está disponible. Continúa con las palabras y ejemplos locales de abajo.",
                  )}
                </p>
              )}
            </div>
          </section>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "16px" }}>
          <AnimatePresence>
            {filtered.slice(0, limit).map((item) => (
              <motion.div
                data-testid="dictionary-word-card"
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <h3
                      style={{
                        flexWrap: "wrap",
                        overflowWrap: "anywhere",
                        maxWidth: "100%",
                        fontSize: "24px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {item.word}
                      <button
                        aria-label={`${t("Ouvir:", "Listen:", "Escuchar:")} ${item.word}`}
                        onClick={() => handleSpeak(item.word)}
                        style={{
                          background: "rgba(0,0,0,0.05)",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--accent-terra)",
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={
                          saved.has(item.id)
                            ? `${t("Palavra salva:", "Saved word:", "Palabra guardada:")} ${item.word}`
                            : `${t("Salvar palavra:", "Save word:", "Guardar palabra:")} ${item.word}`
                        }
                        disabled={saved.has(item.id)}
                        onClick={() => handleSave(item)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "var(--brand)",
                          cursor: "pointer",
                          padding: 8,
                        }}
                      >
                        <Bookmark size={18} fill={saved.has(item.id) ? "currentColor" : "none"} />
                      </button>
                    </h3>
                    <div
                      style={{
                        fontSize: "15px",
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                        fontStyle: "italic",
                      }}
                    >
                      {item.translation}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: "var(--surface)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.level}
                    </span>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: "rgba(76,175,80,0.1)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--accent-green)",
                      }}
                    >
                      {item.partOfSpeech}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px 16px",
                    background: "var(--bg)",
                    borderRadius: "12px",
                    borderLeft: "3px solid var(--border)",
                    minWidth: 0,
                    overflowWrap: "anywhere",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    "{item.example}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length > limit && (
            <button type="button" className="btn-gold" onClick={() => setLimit((n) => n + 30)}>
              {t("Mostrar mais palavras", "Show more words", "Mostrar más palabras")}
            </button>
          )}
          {filtered.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-secondary)" }}
            >
              {t("Nenhuma palavra encontrada.", "No words found.", "No se encontraron palabras.")}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
