import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { StaggerList } from "@/components/lume/Animations";
import { CategoryIllustration } from "@/components/lume/Illustrations";
import { Brain, Star, CheckCircle, ChevronRight } from "@/components/lume/CustomIcons";
import { motion } from "framer-motion";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/quiz-hub")({
  component: QuizHubPage,
});

const QUIZ_TYPES = [
  {
    id: "vocab",
    title: "Vocabulário Rápido",
    desc: "Traduza e associe palavras sob pressão.",
    category: "vocabulary",
    color: "#4CAF50",
  },
  {
    id: "grammar",
    title: "Verdadeiro ou Falso",
    desc: "Teste suas regras gramaticais.",
    category: "grammar",
    color: "#D4A23B",
  },
  {
    id: "mixed",
    title: "Desafio Misto",
    desc: "Uma mistura de tudo para testar seus limites.",
    category: "culture",
    color: "#4E8FB7",
  },
];

function QuizHubPage() {
  const { language } = useStore();
  const isPt = language === "pt";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 40px" }}>
        <header style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--accent-terra)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <Brain size={14} />
            <span>{isPt ? "Central de Desafios" : "Challenge Hub"}</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 48px)",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            {isPt ? "Lume Quizzes" : "Lume Quizzes"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "0 auto",
              fontWeight: 500,
            }}
          >
            {isPt
              ? "Mais de 15 formatos interativos para fixar seu conhecimento."
              : "Over 15 interactive formats to anchor your knowledge."}
          </p>
        </header>

        <StaggerList stagger={0.1}>
          {QUIZ_TYPES.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/quiz-play/${quiz.id}` as any}
              style={{ textDecoration: "none", display: "block", marginBottom: "16px" }}
            >
              <motion.div
                className="card-hover glass premium-shadow"
                style={{
                  padding: "24px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  background: "var(--surface-raised)",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: `rgba(0,0,0,0.03)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIllustration category={quiz.category as any} size={36} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {quiz.desc}
                  </p>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            </Link>
          ))}
        </StaggerList>
      </main>
    </div>
  );
}
