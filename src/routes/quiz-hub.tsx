import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { StaggerList } from "@/components/lume/Animations";
import { CategoryIllustration } from "@/components/lume/Illustrations";
import { Brain, Star, CheckCircle, ChevronRight } from "@/components/lume/CustomIcons";
import { motion } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { TopicScenario } from "@/components/lume/TopicScenario";
import { pickRotatingTopic } from "@/lib/language-content/game-questions";

export const Route = createFileRoute("/quiz-hub")({
  component: QuizHubPage,
});

const QUIZ_TYPES = [
  {
    id: "vocab",
    title: { pt: "Vocabulário Rápido", en: "Quick Vocabulary" },
    desc: {
      pt: "Traduza e associe palavras sob pressão.",
      en: "Translate and match words under pressure.",
    },
    category: "vocabulary",
    color: "#4CAF50",
  },
  {
    id: "grammar",
    title: { pt: "Verdadeiro ou Falso", en: "True or False" },
    desc: { pt: "Teste suas regras gramaticais.", en: "Test your grammar rules." },
    category: "grammar",
    color: "#D4A23B",
  },
  {
    id: "listening",
    title: { pt: "Escuta", en: "Listening" },
    desc: {
      pt: "Ouça a palavra e escolha a opção certa.",
      en: "Listen to the word and pick the right option.",
    },
    category: "listening",
    color: "#1B3A4B",
  },
  {
    id: "pronunciation",
    title: { pt: "Pronúncia", en: "Pronunciation" },
    desc: {
      pt: "Fale em voz alta e receba uma nota na hora.",
      en: "Speak out loud and get an instant score.",
    },
    category: "speaking",
    color: "#C4714A",
  },
  {
    id: "review",
    title: { pt: "Revisão", en: "Review" },
    desc: { pt: "Revise as palavras que você salvou.", en: "Review the words you've saved." },
    category: "all",
    color: "#9B59B6",
  },
  {
    id: "travel",
    title: { pt: "Viagem", en: "Travel" },
    desc: {
      pt: "Vocabulário de aeroporto, hotel e turismo.",
      en: "Airport, hotel and travel vocabulary.",
    },
    category: "travel",
    color: "#2D4A3E",
  },
  {
    id: "business",
    title: { pt: "Negócios", en: "Business" },
    desc: { pt: "Vocabulário de trabalho e entrevistas.", en: "Work and interview vocabulary." },
    category: "professional",
    color: "#4E8FB7",
  },
  {
    id: "mixed",
    title: { pt: "Desafio Misto", en: "Mixed Challenge" },
    desc: {
      pt: "Uma mistura de tudo para testar seus limites.",
      en: "A mix of everything to test your limits.",
    },
    category: "culture",
    color: "#D4A23B",
  },
];

function QuizHubPage() {
  const { language } = useStore();
  const isPt = language === "pt";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TopicScenario topic={pickRotatingTopic("quiz-hub")} />
      <div style={{ position: "relative", zIndex: 1 }}>
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
                      {isPt ? quiz.title.pt : quiz.title.en}
                    </h3>
                    <p
                      style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}
                    >
                      {isPt ? quiz.desc.pt : quiz.desc.en}
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
    </div>
  );
}
