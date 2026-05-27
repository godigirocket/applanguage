import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { AppHeader } from "@/components/lume/AppHeader";
import { sounds } from "@/lib/soundEffects";
// @ts-ignore
import confetti from "canvas-confetti";
import {
  Volume2,
  Sparkles,
  Award,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "@/components/lume/CustomIcons";

type TriviaQuestion = {
  id: string;
  lang: "pt" | "en";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const TRIVIA_BANK: TriviaQuestion[] = [
  {
    id: "q1",
    lang: "pt",
    question: "Qual famoso museu de arte moderna com estrutura suspensa vermelha fica localizado na Avenida Paulista em São Paulo?",
    options: ["Pinacoteca", "MASP", "MAM", "MAC"],
    correct: 1,
    explanation: "O MASP (Museu de Arte de São Paulo Assis Chateaubriand) é famoso por seus pilares vermelhos e vão livre na Av. Paulista."
  },
  {
    id: "q2",
    lang: "en",
    question: "Which US city is famous for its vibrant Art Deco historic district located along Ocean Drive?",
    options: ["Los Angeles", "New York", "Miami", "Chicago"],
    correct: 2,
    explanation: "Miami Beach contains the world's largest collection of Art Deco architecture, especially concentrated along Ocean Drive."
  },
  {
    id: "q3",
    lang: "pt",
    question: "Qual é a comida de rua mais famosa de Berlim, que leva salsicha de porco cozida e depois frita com molho de ketchup e curry?",
    options: ["Bratwurst", "Sauerkraut", "Currywurst", "Schnitzel"],
    correct: 2,
    explanation: "O Currywurst é um clássico de Berlim, inventado em 1949 por Herta Heuwer."
  },
  {
    id: "q4",
    lang: "en",
    question: "Which landmark is Vancouver famous for having a gorgeous, shaky suspension bridge surrounded by pine trees?",
    options: ["Golden Gate", "Capilano Suspension Bridge", "Brooklyn Bridge", "Clifton Suspension Bridge"],
    correct: 1,
    explanation: "The Capilano Suspension Bridge is a 140-meter long simple suspension bridge crossing the Capilano River in Vancouver."
  },
  {
    id: "q5",
    lang: "pt",
    question: "Qual prato tradicional mexicano consiste em carne de porco cozida lentamente e marinada com achiote, servida em tortilhas?",
    options: ["Burritos", "Quesadillas", "Tacos al Pastor", "Enchiladas"],
    correct: 2,
    explanation: "Os Tacos al Pastor são feitos com carne de porco fatiada no espeto giratório, influenciada por imigrantes libaneses."
  },
  {
    id: "q6",
    lang: "en",
    question: "Which Tokyo neighborhood is worldwide famous for having the busiest pedestrian crossing in the world?",
    options: ["Akihabara", "Shinjuku", "Shibuya", "Harajuku"],
    correct: 2,
    explanation: "Shibuya Crossing is a popular landmark, sending up to 3,000 pedestrians across the street at every green light."
  },
  {
    id: "q7",
    lang: "pt",
    question: "Qual monumento histórico em Roma é considerado o maior anfiteatro do mundo, famoso pelas lutas de gladiadores?",
    options: ["Panteão", "Coliseu", "Fórum Romano", "Castelo de Santo Ângelo"],
    correct: 1,
    explanation: "O Coliseu foi construído sob o império dos Flávios no século I d.C. e comportava até 80.000 espectadores."
  },
  {
    id: "q8",
    lang: "en",
    question: "What is the name of the traditional British food consisting of battered fish served with deep-fried potato chips?",
    options: ["Shepherd's Pie", "Fish and Chips", "Bangers and Mash", "Sunday Roast"],
    correct: 1,
    explanation: "Fish and Chips is a national staple of the United Kingdom, becoming popular in the 1860s."
  },
  {
    id: "q9",
    lang: "pt",
    question: "Qual salgado frito recheado com frango desfiado é considerado a paixão gastronômica de São Paulo?",
    options: ["Pastel", "Empada", "Coxinha", "Pão de Queijo"],
    correct: 2,
    explanation: "A Coxinha de frango é o salgado mais popular e tradicional de São Paulo, consumido a qualquer hora do dia."
  },
  {
    id: "q10",
    lang: "en",
    question: "Which French city is famous for landmarks like the Eiffel Tower and the Notre-Dame Cathedral?",
    options: ["Lyon", "Marseille", "Paris", "Nice"],
    correct: 2,
    explanation: "Paris, the capital of France, houses the Eiffel Tower, the Notre-Dame Cathedral, and the Louvre Museum."
  }
];

export function CulturalTrivia() {
  const nav = useNavigate();
  const { interfaceLanguage, addXP, addLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Game States
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  // Trilingual UI strings
  const t = {
    title: isPT ? "Trivia Cultural" : isES ? "Trivia Cultural" : "Cultural Trivia",
    subtitle: isPT
      ? "Teste seus conhecimentos sobre as capitais culturais mapeadas pelo Lume!"
      : isES
        ? "¡Pon a prueba tus conocimientos sobre las ciudades culturales del mundo!"
        : "Test your knowledge on the global cultural hubs mapped by Lume!",
    questionNum: isPT ? "Questão" : isES ? "Pregunta" : "Question",
    scoreText: isPT ? "Acertos" : isES ? "Aciertos" : "Correct",
    next: isPT ? "Continuar" : isES ? "Continuar" : "Continue",
    check: isPT ? "Verificar" : isES ? "Comprobar" : "Check",
    victoryTitle: isPT ? "Explorador Cultural!" : isES ? "¡Explorador Cultural!" : "Cultural Explorer!",
    victoryDesc: isPT
      ? "Você demonstrou um conhecimento impecável sobre o mundo!"
      : isES
        ? "¡Has demostrado un conocimiento impecable sobre el mundo!"
        : "You demonstrated an outstanding knowledge about cultural landmarks!",
    rewardText: isPT ? "Recompensas:" : isES ? "Recompensas:" : "Rewards:",
    playAgain: isPT ? "Jogar Novamente" : isES ? "Jugar de Nuevo" : "Play Again",
    helpTitle: isPT ? "Como Jogar" : isES ? "Cómo Jugar" : "How to Play",
    helpText: isPT
      ? "Leia a pergunta com atenção e escolha uma das 4 opções. Clique em Verificar para confirmar. O mascote Lume reagirá de acordo com sua resposta! Complete as 5 questões para ganhar prêmios de XP!"
      : isES
        ? "Lee la pregunta y elige una opción. ¡El duende Lume reaccionará si aciertas o fallas! Completa las 5 preguntas."
        : "Read each question carefully and select one of the four options. Click check to confirm. Complete all 5 questions to receive your XP rewards!",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
  };

  useEffect(() => {
    startNewGame();
  }, [interfaceLanguage]);

  const startNewGame = () => {
    // Filter questions based on interface language if possible, or shuffle all
    const curLang = interfaceLanguage === "pt" ? "pt" : "en";
    const filtered = TRIVIA_BANK.filter((q) => q.lang === curLang);
    const pool = filtered.length >= 5 ? filtered : TRIVIA_BANK;
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    
    setQuestions(shuffled);
    setCurrentIdx(0);
    setSelected(null);
    setIsAnswered(false);
    setScore(0);
    setShowVictory(false);
  };

  const checkAnswer = () => {
    if (selected === null) return;
    setIsAnswered(true);
    
    const q = questions[currentIdx];
    if (selected === q.correct) {
      setScore((s) => s + 1);
      sounds.playClick(); // play correct
    } else {
      sounds.playClick(); // play wrong
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setIsAnswered(false);
    
    const nextIdx = currentIdx + 1;
    if (nextIdx < 5) {
      setCurrentIdx(nextIdx);
    } else {
      // Game Complete
      addXP(30);
      addLumes(10);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setShowVictory(true);
    }
  };

  const currentQuestion = questions[currentIdx];

  // Simplified inline vector firefly mascot that reacts dynamically
  const renderMiniMascot = () => {
    const q = questions[currentIdx];
    const isCorrect = selected === q?.correct;
    
    // determine mascot expression / glow color
    let glowColor = "#F4B34A"; // happy gold
    let tailScale = [1, 1.25, 1];
    
    if (isAnswered) {
      glowColor = isCorrect ? "#4CAF50" : "#C46D4B"; // green or orange-red
      tailScale = isCorrect ? [1, 1.4, 1] : [1, 1.05, 1];
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
        <motion.svg
          width="90"
          height="90"
          viewBox="0 0 140 140"
          fill="none"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.04))" }}
        >
          <defs>
            <radialGradient id="triviaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={glowColor} stopOpacity="1" />
              <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="triviaWing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <motion.circle
            cx="70"
            cy="92"
            r="26"
            fill="url(#triviaGlow)"
            animate={{ scale: tailScale, opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <path d="M58 64 C28 50 18 20 48 24 C58 26 62 38 60 52" fill="url(#triviaWing)" stroke="#C9A84C" strokeWidth="1.5" />
          <path d="M82 64 C112 50 122 20 92 24 C82 26 78 38 80 52" fill="url(#triviaWing)" stroke="#C9A84C" strokeWidth="1.5" />
          <circle cx="70" cy="72" r="26" fill="#F4F1EA" stroke="#E1DBD0" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="60" cy="66" r="6" fill="#1C1C1A" />
          <circle cx="62" cy="64" r="2" fill="white" />
          <circle cx="80" cy="66" r="6" fill="#1C1C1A" />
          <circle cx="82" cy="64" r="2" fill="white" />
          {/* Smile */}
          <path d="M66 74 Q70 77 74 74" stroke="#C9A84C" strokeWidth="2" fill="none" />
        </motion.svg>
        {isAnswered && (
          <div
            className="glass"
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 800,
              color: isCorrect ? "var(--brand)" : "var(--accent-terra)",
              border: isCorrect ? "1px solid var(--brand)" : "1px solid var(--accent-terra)",
              background: isCorrect ? "rgba(45,74,62,0.06)" : "rgba(196,109,75,0.06)",
              textAlign: "center",
              maxWidth: "260px",
            }}
          >
            {isCorrect ? (isPT ? "Brilhante! Você acertou." : "Brilliant! You got it.") : (isPT ? "Sem pressa! Aprenda com o erro." : "No worries! Keep learning.")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "pageEnter 0.5s ease",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--accent-terra)",
              }}
            >
              Lume Arcade
            </span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "32px",
                color: "var(--text-primary)",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {t.title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "2px" }}>
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowHelp(true)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={startNewGame}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </header>

        {/* Dashboard: Question Number and Correct Score */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            className="glass"
            style={{
              flex: 1,
              borderRadius: "16px",
              padding: "10px 16px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", color: "var(--text-secondary)" }}>
              {t.questionNum}
            </span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
              {currentIdx + 1} / 5
            </span>
          </div>

          <div
            className="glass"
            style={{
              flex: 1,
              borderRadius: "16px",
              padding: "10px 16px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", color: "var(--brand)" }}>
              {t.scoreText}
            </span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand)" }}>
              {score}
            </span>
          </div>
        </div>

        {/* Active Question Panel */}
        {!showVictory && currentQuestion && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Lume Reactive Mascot */}
            {renderMiniMascot()}

            {/* Question Text */}
            <div
              className="glass"
              style={{
                padding: "24px",
                borderRadius: "24px",
                border: "1.5px solid var(--border)",
                background: "var(--surface-raised)",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {currentQuestion.question}
              </p>
            </div>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selected === idx;
                const isCorrectOption = idx === currentQuestion.correct;
                
                let optionBg = "var(--surface-raised)";
                let optionBorder = "1.5px solid var(--border)";
                let optionColor = "var(--text-primary)";

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionBg = "rgba(45, 74, 62, 0.08)";
                    optionBorder = "2px solid var(--brand)";
                    optionColor = "var(--brand)";
                  } else if (isSelected) {
                    optionBg = "rgba(196, 109, 75, 0.08)";
                    optionBorder = "2px solid var(--accent-terra)";
                    optionColor = "var(--accent-terra)";
                  }
                } else if (isSelected) {
                  optionBorder = "2px solid var(--accent-gold)";
                  optionBg = "rgba(212, 162, 59, 0.05)";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelected(idx)}
                    className="glass premium-shadow hover:scale-101 active:scale-99"
                    style={{
                      padding: "16px 20px",
                      borderRadius: "18px",
                      background: optionBg,
                      border: optionBorder,
                      color: optionColor,
                      fontSize: "14.5px",
                      fontWeight: 700,
                      textAlign: "left",
                      cursor: isAnswered ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "18px",
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.4)",
                  fontSize: "13.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                <strong>{isPT ? "Curiosidade:" : "Did you know?"}</strong> {currentQuestion.explanation}
              </div>
            )}

            {/* Action buttons */}
            <div>
              {!isAnswered ? (
                <button
                  onClick={checkAnswer}
                  disabled={selected === null}
                  className="btn-premium"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "16px",
                    background: selected === null ? "var(--border)" : "linear-gradient(135deg, var(--brand), var(--accent-teal))",
                    color: selected === null ? "#A8A8A0" : "white",
                    cursor: selected === null ? "not-allowed" : "pointer",
                  }}
                >
                  {t.check}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn-premium"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "16px",
                  }}
                >
                  {t.next}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back navigation */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <button
            onClick={() => nav({ to: "/games" })}
            className="btn-secondary-premium"
            style={{ padding: "12px 24px", borderRadius: "99px", fontSize: "13px" }}
          >
            {t.backPlay}
          </button>
        </div>

        {/* HELP MODAL */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <motion.div
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                className="glass premium-shadow"
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "28px",
                  maxWidth: "400px",
                  width: "100%",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                    {t.helpTitle}
                  </h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-secondary)" }}
                  >
                    ×
                  </button>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {t.helpText}
                </p>
                <button
                  onClick={() => setShowHelp(false)}
                  className="btn-premium"
                  style={{ width: "100%", padding: "12px", borderRadius: "14px" }}
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VICTORY OVERLAY */}
        <AnimatePresence>
          {showVictory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <motion.div
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                className="glass premium-shadow"
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "32px",
                  maxWidth: "440px",
                  width: "100%",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(45,74,62,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand)",
                  }}
                >
                  <Award size={36} />
                </div>

                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)" }}>
                    {t.victoryTitle}
                  </h2>
                  <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {t.victoryDesc}
                  </p>
                </div>

                {/* Performance stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--bg)",
                      borderRadius: "16px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", color: "var(--text-secondary)" }}>
                      {t.scoreText}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                      {score} / 5
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      background: "var(--bg)",
                      borderRadius: "16px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", color: "var(--text-secondary)" }}>
                      XP {isPT ? "Ganho" : "Earned"}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--brand)", marginTop: "4px" }}>
                      +30 XP
                    </div>
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "8px" }}>
                    {t.rewardText}
                  </div>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <div
                      style={{
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "rgba(45,74,62,0.06)",
                        border: "1px solid rgba(45,74,62,0.15)",
                        color: "var(--brand)",
                        fontSize: "13px",
                        fontWeight: 800,
                      }}
                    >
                      ✨ +30 XP
                    </div>
                    <div
                      style={{
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "rgba(201,168,76,0.06)",
                        border: "1px solid rgba(201,168,76,0.15)",
                        color: "#C9A84C",
                        fontSize: "13px",
                        fontWeight: 800,
                      }}
                    >
                      🪙 +10 Lumes
                    </div>
                  </div>
                </div>

                <button
                  onClick={startNewGame}
                  className="btn-premium"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {t.playAgain}
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
