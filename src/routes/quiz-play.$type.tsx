import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { TrueFalse } from "@/components/quiz/TrueFalse";
import {
  generateVocabQuiz,
  generateGrammarQuiz,
  generateMixedQuiz,
  QuizQuestion,
} from "@/data/quizEngine";
import { useStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronRight } from "@/components/lume/CustomIcons";
// @ts-ignore
import confetti from "canvas-confetti";

export const Route = createFileRoute("/quiz-play/$type")({
  component: QuizPlayPage,
});

function QuizPlayPage() {
  const { type } = Route.useParams();
  const nav = useNavigate();
  const { targetLanguage, addXP } = useStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Load quiz based on type
    let q: QuizQuestion[] = [];
    if (type === "vocab") {
      q = generateVocabQuiz(targetLanguage, "all", 5);
    } else if (type === "grammar") {
      q = generateGrammarQuiz(targetLanguage, "all", 5);
    } else {
      q = generateMixedQuiz(targetLanguage, "all", 5);
    }
    setQuestions(q);
  }, [type, targetLanguage]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        finishQuiz(isCorrect ? score + 1 : score);
      }
    }, 800);
  };

  const finishQuiz = (finalScore: number) => {
    setIsFinished(true);
    const xpEarned = finalScore * 5;
    if (xpEarned > 0) {
      addXP(xpEarned);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4CAF50", "#D4A23B", "#C4714A"],
      });
    }
  };

  if (!questions.length)
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-sans)" }}>
        Gerando quiz...
      </div>
    );

  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => nav({ to: "/quiz-hub" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          &times;
        </button>
        <div
          style={{
            flex: 1,
            margin: "0 24px",
            height: "8px",
            background: "var(--border)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${isFinished ? 100 : progress}%`,
              height: "100%",
              background: "var(--accent-green)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ fontWeight: 800, color: "var(--text-secondary)", fontSize: "14px" }}>
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ width: "100%", maxWidth: "500px" }}
            >
              {currentQ.type === "multiple_choice" && (
                <MultipleChoice
                  question={currentQ.prompt}
                  options={currentQ.options || []}
                  correctAnswer={currentQ.correctAnswer as string}
                  onAnswer={handleAnswer}
                />
              )}
              {currentQ.type === "true_false" && (
                <TrueFalse
                  question={currentQ.prompt}
                  correctAnswer={currentQ.correctAnswer as string}
                  explanation={currentQ.explanation}
                  onAnswer={handleAnswer}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", maxWidth: "400px" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(201,168,76,0.1)",
                  color: "var(--accent-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Trophy size={40} />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  fontWeight: 900,
                  marginBottom: "8px",
                  color: "var(--text-primary)",
                }}
              >
                Quiz Concluído!
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
                Você acertou {score} de {questions.length} perguntas.
              </p>
              <Link to="/quiz-hub" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "16px 32px",
                    borderRadius: "99px",
                    background: "var(--text-primary)",
                    color: "var(--bg)",
                    fontSize: "16px",
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "0 auto",
                  }}
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
