import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { Search, Volume2, Bookmark } from "@/components/lume/CustomIcons";
import vocabularyData from "@/data/vocabularyExpanded.json";
import { useStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dictionary")({
  component: DictionaryPage,
});

function DictionaryPage() {
  const { targetLanguage } = useStore();
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const data = (vocabularyData as Record<string, any[]>)[targetLanguage] || [];

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "all" || item.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleSpeak = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang =
        targetLanguage === "en" ? "en-US" : targetLanguage === "es" ? "es-ES" : "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
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
            Dicionário Lume
          </h1>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, position: "relative" }}>
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
                placeholder="Buscar palavra ou tradução..."
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
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                padding: "0 20px",
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
              <option value="all">Todos os Níveis</option>
              <option value="A1">A1 - Iniciante</option>
              <option value="A2">A2 - Básico</option>
              <option value="B1">B1 - Intermediário</option>
              <option value="B2">B2 - Independente</option>
              <option value="C1">C1 - Avançado</option>
            </select>
          </div>
        </header>

        <div style={{ display: "grid", gap: "16px" }}>
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
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
                  }}
                >
                  <div>
                    <h3
                      style={{
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
                  <div style={{ display: "flex", gap: "8px" }}>
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

          {filtered.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-secondary)" }}
            >
              Nenhuma palavra encontrada.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
