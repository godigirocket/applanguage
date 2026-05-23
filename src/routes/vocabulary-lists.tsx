import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { BookOpen, ChevronRight, Lock } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { motion } from "framer-motion";

export const Route = createFileRoute("/vocabulary-lists")({
  component: VocabularyListsPage,
});

const LISTS = [
  {
    id: "essential-100",
    title: "Essential 100",
    desc: "As 100 palavras mais usadas no dia a dia.",
    count: 100,
    locked: false,
    progress: 45,
  },
  {
    id: "business",
    title: "Business English",
    desc: "Vocabulário para reuniões e e-mails.",
    count: 150,
    locked: false,
    progress: 10,
  },
  {
    id: "travel",
    title: "Viagem & Aeroporto",
    desc: "Não passe aperto na imigração ou no hotel.",
    count: 80,
    locked: true,
    progress: 0,
  },
  {
    id: "emotions",
    title: "Sentimentos & Emoções",
    desc: "Expresse exatamente como se sente.",
    count: 60,
    locked: true,
    progress: 0,
  },
];

function VocabularyListsPage() {
  const { language } = useStore();
  const isPt = language === "pt";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 40px" }}>
        <header style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--accent-terra)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <BookOpen size={14} />
            <span>{isPt ? "Coleções Temáticas" : "Thematic Collections"}</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontWeight: 900,
            }}
          >
            Listas de Vocabulário
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: 500 }}>
            Estude pacotes de palavras focados nos seus objetivos.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {LISTS.map((list) => (
            <motion.div
              key={list.id}
              whileHover={!list.locked ? { y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" } : {}}
              style={{
                padding: "24px",
                borderRadius: "24px",
                background: "var(--surface-raised)",
                border: "1.5px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                opacity: list.locked ? 0.7 : 1,
                filter: list.locked ? "grayscale(0.5)" : "none",
                position: "relative",
                overflow: "hidden",
              }}
              className="card-hover premium-shadow"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-primary)",
                  }}
                >
                  {list.locked ? <Lock size={20} /> : <BookOpen size={20} />}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--text-secondary)",
                    background: "var(--surface)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                  }}
                >
                  {list.count} palavras
                </span>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {list.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {list.desc}
                </p>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "8px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>Progresso</span>
                  <span>{list.progress}%</span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "var(--surface)",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${list.progress}%`,
                      background: "var(--accent-green)",
                      borderRadius: "99px",
                    }}
                  />
                </div>
              </div>

              {!list.locked && (
                <Link to="/dictionary" style={{ position: "absolute", inset: 0, zIndex: 10 }} />
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
