import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { TrueFalse } from "@/components/quiz/TrueFalse";
import { PronunciationChallenge } from "@/components/PronunciationChallenge";
import {
  recordQuizCompletion,
  getRecentlySeenQuestionIds,
  recordSeenQuestionIds,
  buildQuestionsForType,
  pickRotatingTopic,
  ALL_TOPICS,
  type UnifiedQuestion,
  type LessonTopic,
} from "@/lib/language-content";
import { speak, isTTSSupported } from "@/lib/language-apis/webSpeech";
import { useStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronRight, Volume2 } from "@/components/lume/CustomIcons";
import { BookX } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { TopicScenario } from "@/components/lume/TopicScenario";

function scenarioTopicForType(type: string): LessonTopic {
  return (ALL_TOPICS as string[]).includes(type) ? (type as LessonTopic) : pickRotatingTopic(type);
}

export const Route = createFileRoute("/quiz-play/$type")({
  component: QuizPlayPage,
});

function QuizPlayPage() {
  const { type } = Route.useParams();
  const nav = useNavigate();
  const { targetLanguage, interfaceLanguage, addXP } = useStore();
  const isPT = interfaceLanguage === "pt";

  const [questions, setQuestions] = useState<UnifiedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [pronunciationResolved, setPronunciationResolved] = useState<boolean | null>(null);
  // Deliberately depends on type/targetLanguage even though the factory doesn't
  // read them — a new session must get a fresh "already completed" flag.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasCompletedRef = useMemo(() => ({ current: false }), [type, targetLanguage]);

  useEffect(() => {
    const recentIds = getRecentlySeenQuestionIds();
    const q = buildQuestionsForType(type, targetLanguage, recentIds, 6, interfaceLanguage);
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setPronunciationResolved(null);
    hasCompletedRef.current = false;
    if (q.length > 0) recordSeenQuestionIds(q.map((item) => item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, targetLanguage]);

  const handleAnswer = (isCorrect: boolean) => {
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPronunciationResolved(null);
      } else {
        finishQuiz(nextScore);
      }
    }, 800);
  };

  const finishQuiz = (finalScore: number) => {
    setIsFinished(true);
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    recordQuizCompletion(finalScore, questions.length);

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

  if (!questions.length) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <BookX size={40} style={{ color: "var(--text-secondary)" }} />
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
          {isPT
            ? type === "review"
              ? "Nenhuma palavra para revisar agora"
              : "Ainda não há conteúdo para este quiz"
            : type === "review"
              ? "No words due for review yet"
              : "No content for this quiz yet"}
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "360px" }}>
          {isPT
            ? type === "review"
              ? "Salve palavras nas lições e volte aqui quando estiverem prontas para revisão."
              : "Tente outro modo de quiz na aba de Jogos."
            : type === "review"
              ? "Save words during lessons and come back once they're due for review."
              : "Try a different quiz mode from the Games tab."}
        </p>
        <Link to="/quiz-hub" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "var(--brand)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            {isPT ? "Voltar" : "Go back"}
          </button>
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <TopicScenario
        topic={scenarioTopicForType(type)}
        intensity="subtle"
        seed={`${type}-${currentIndex}`}
      />

      {/* Top Bar */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
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
              {currentQ.kind === "choice" && (
                <MultipleChoice
                  question={currentQ.prompt}
                  options={currentQ.options}
                  correctAnswer={currentQ.correctAnswer}
                  explanation={currentQ.explanation}
                  explanationLabel={isPT ? "Explicação:" : "Explanation:"}
                  onAnswer={handleAnswer}
                />
              )}

              {currentQ.kind === "truefalse" && (
                <TrueFalse
                  question={currentQ.prompt}
                  options={currentQ.options}
                  correctAnswer={currentQ.correctAnswer}
                  explanation={currentQ.explanation}
                  explanationLabel={isPT ? "Explicação:" : "Explanation:"}
                  onAnswer={handleAnswer}
                />
              )}

              {currentQ.kind === "listening" && (
                <ListeningQuestion
                  audioText={currentQ.audioText}
                  options={currentQ.options}
                  correctAnswer={currentQ.correctAnswer}
                  explanation={currentQ.explanation}
                  targetLanguage={targetLanguage}
                  isPT={isPT}
                  onAnswer={handleAnswer}
                />
              )}

              {currentQ.kind === "pronunciation" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}
                >
                  <PronunciationChallenge
                    targetPhrase={currentQ.targetPhrase}
                    targetLanguage={targetLanguage}
                    onSuccess={() => setPronunciationResolved(true)}
                    onFailure={() => setPronunciationResolved(false)}
                  />
                  {pronunciationResolved !== null && (
                    <button
                      onClick={() => handleAnswer(pronunciationResolved)}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        border: "none",
                        background: "var(--brand)",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {isPT ? "Continuar →" : "Continue →"}
                    </button>
                  )}
                </div>
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
                {isPT ? "Quiz Concluído!" : "Quiz Complete!"}
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
                {isPT
                  ? `Você acertou ${score} de ${questions.length} perguntas.`
                  : `You got ${score} of ${questions.length} questions right.`}
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
                  {isPT ? "Continuar" : "Continue"} <ChevronRight size={20} />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ListeningQuestion({
  audioText,
  options,
  correctAnswer,
  explanation,
  targetLanguage,
  isPT,
  onAnswer,
}: {
  audioText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  targetLanguage: "en" | "es" | "pt";
  isPT: boolean;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const ttsSupported = isTTSSupported();

  useEffect(() => {
    if (ttsSupported) speak(audioText, targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioText]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => ttsSupported && speak(audioText, targetLanguage)}
          disabled={!ttsSupported}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            background: "var(--brand)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: ttsSupported ? "pointer" : "not-allowed",
            opacity: ttsSupported ? 1 : 0.5,
          }}
        >
          <Volume2 size={28} />
        </button>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600 }}>
          {ttsSupported
            ? isPT
              ? "Ouça a palavra e escolha a opção certa"
              : "Listen to the word and choose the right option"
            : isPT
              ? "Seu navegador não suporta áudio — escolha pela leitura"
              : "Your browser doesn't support audio — choose from reading"}
        </span>
      </div>
      <MultipleChoice
        question={isPT ? "O que você ouviu?" : "What did you hear?"}
        options={options}
        correctAnswer={correctAnswer}
        explanation={explanation}
        explanationLabel={isPT ? "Explicação:" : "Explanation:"}
        onAnswer={onAnswer}
      />
    </div>
  );
}
