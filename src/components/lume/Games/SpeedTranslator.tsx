import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { SENTENCE_BANK } from "@/data/massiveContent";
import { sounds } from "@/lib/soundEffects";
import { AppHeader } from "@/components/lume/AppHeader";
import { toast } from "sonner";
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

type SentenceItem = {
  en: string;
  pt: string;
  es: string;
};

type Lang = "en" | "es" | "pt";

// The sentence is shown in whichever language the user actually reads
// (their interface language) and must be assembled in the language they're
// learning. If those happen to be the same, fall back to a different source
// so there's always a real translation to perform.
function sourceLanguageFor(interfaceLanguage: Lang, targetLanguage: Lang): Lang {
  if (interfaceLanguage !== targetLanguage) return interfaceLanguage;
  return targetLanguage === "en" ? "pt" : "en";
}

export function SpeedTranslator() {
  const nav = useNavigate();
  const { interfaceLanguage, targetLanguage, addXP, addLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Game States
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Word pills states
  const [pills, setPills] = useState<string[]>([]);
  const [assembled, setAsassembled] = useState<string[]>([]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const timerRef = useRef<any>(null);

  // Trilingual UI strings
  const t = {
    title: isPT ? "Speed Translator" : isES ? "Speed Translator" : "Speed Translator",
    subtitle: isPT
      ? "Traduza a frase rapidamente tocando nos blocos de palavras!"
      : isES
        ? "¡Traduce la frase rápidamente tocando los bloques de palabras!"
        : "Translate the phrase rapidly by tapping word blocks!",
    streak: isPT ? "Combo" : isES ? "Combo" : "Streak",
    score: isPT ? "Acertos" : isES ? "Aciertos" : "Correct",
    gameOver: isPT ? "Fim de Jogo!" : isES ? "¡Fin del Juego!" : "Game Over!",
    gameOverDesc: isPT
      ? "O tempo acabou! Mas você fez uma excelente sessão."
      : isES
        ? "¡Se acabó el tiempo! Pero has hecho una sesión excelente."
        : "Time ran out! But you practiced really well.",
    rewardText: isPT ? "Recompensas:" : isES ? "Recompensas:" : "Rewards:",
    playAgain: isPT ? "Jogar Novamente" : isES ? "Jugar de Nuevo" : "Play Again",
    helpTitle: isPT ? "Como Jogar" : isES ? "Cómo Jugar" : "How to Play",
    helpText: isPT
      ? "Toque nos blocos de palavras para formar a tradução da frase exibida no topo. Se errar, você perde 3 segundos! Se acertar, ganha +5 segundos. Complete o máximo que puder antes do tempo acabar!"
      : isES
        ? "Toca los bloques de palabras para formar la traducción correcta. Si te equivocas, ¡pierdes 3 segundos! Si aciertas, ganas 5 segundos extra."
        : "Tap word pills in order to construct the translation of the phrase. Correct answers add +5 seconds, while incorrect submissions subtract -3 seconds. Translate as many as you can before the clock runs out!",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
    check: isPT ? "Verificar" : isES ? "Comprobar" : "Check",
    clear: isPT ? "Limpar" : isES ? "Limpiar" : "Clear",
  };

  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetLanguage]);

  const startNewGame = () => {
    // Collect all sentences from BANK
    const allSentences = Object.values(SENTENCE_BANK).flat();
    const shuffled = [...allSentences].sort(() => Math.random() - 0.5);

    setSentences(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(20); // start with 20 seconds
    setIsGameOver(false);

    loadSentence(shuffled[0]);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    // Award XP proportional to score
    const earnedXP = Math.min(100, score * 15);
    const earnedLumes = Math.min(15, Math.floor(score * 2.5));
    if (earnedXP > 0) {
      addXP(earnedXP);
    }
    if (earnedLumes > 0) {
      addLumes(earnedLumes);
    }
    if (score >= 3) {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const loadSentence = (item: SentenceItem) => {
    if (!item) return;

    const targetPhrase = item[targetLanguage as Lang];

    // Split target phrase into words, filtering out punctuation
    const targetWords = targetPhrase
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    // Get 4 random distractor words from other sentences
    const allSentences = Object.values(SENTENCE_BANK).flat();
    const distractors = allSentences
      .filter((s) => s.en !== item.en)
      .slice(0, 3)
      .map((s) => s[targetLanguage as Lang])
      .join(" ")
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .slice(0, 3);

    // Combine and shuffle pills
    const allPills = [...targetWords, ...distractors].sort(() => Math.random() - 0.5);

    setPills(allPills);
    setAsassembled([]);
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        targetLanguage === "en" ? "en-US" : targetLanguage === "es" ? "es-ES" : "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePillClick = (word: string, index: number) => {
    // Add to assembled
    setAsassembled((prev) => [...prev, word]);
    // Remove one instance from pills
    setPills((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    sounds.playClick();
  };

  const handleAssembledClick = (word: string, index: number) => {
    // Remove from assembled
    setAsassembled((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    // Add back to pills
    setPills((prev) => [...prev, word]);
    sounds.playClick();
  };

  const checkAnswer = () => {
    const currentItem = sentences[currentIdx];
    if (!currentItem) return;

    const targetPhrase = currentItem[targetLanguage as Lang];
    const targetNorm = targetPhrase
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .join(" ");

    const assembledNorm = assembled.join(" ").toLowerCase();

    if (assembledNorm === targetNorm) {
      // CORRECT
      sounds.playClick(); // play success
      handleSpeak(targetPhrase);
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setTimeLeft((prev) => Math.min(30, prev + 6)); // Add 6 seconds max 30s

      const nextIdx = currentIdx + 1;
      if (nextIdx < sentences.length) {
        setCurrentIdx(nextIdx);
        loadSentence(sentences[nextIdx]);
      } else {
        handleGameOver();
      }
    } else {
      // INCORRECT
      sounds.playClick(); // play fail feedback
      setStreak(0);
      setShakeTrigger(true);
      setTimeLeft((prev) => Math.max(0, prev - 4)); // subtract 4 seconds
      setTimeout(() => setShakeTrigger(false), 500);
      toast.error(isPT ? "Tradução incorreta! -4s" : "Incorrect translation! -4s");
    }
  };

  const clearAssembled = () => {
    setPills((prev) => [...prev, ...assembled]);
    setAsassembled([]);
    sounds.playClick();
  };

  const currentItem = sentences[currentIdx];
  const sourceLanguage = sourceLanguageFor(interfaceLanguage as Lang, targetLanguage as Lang);
  const displayPhrase = currentItem ? currentItem[sourceLanguage] : "";

  // Calculate percentage of timer circle
  const strokeDashoffset = 251.2 - (251.2 * timeLeft) / 30;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "680px",
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

        {/* Dashboard: Timer and Streaks */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Streak indicator */}
          <div
            className="glass"
            style={{
              padding: "10px 18px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔥</span>
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                {t.streak}
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>
                {streak}
              </div>
            </div>
          </div>

          {/* Circular Countdown Timer */}
          <div
            style={{
              position: "relative",
              width: "70px",
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 100 100"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--border)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={timeLeft < 6 ? "var(--accent-terra)" : "var(--brand)"}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "18px",
                fontWeight: 900,
                color: timeLeft < 6 ? "var(--accent-terra)" : "var(--text-primary)",
              }}
            >
              {timeLeft}s
            </span>
          </div>

          {/* Correct count */}
          <div
            className="glass"
            style={{
              padding: "10px 18px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>✅</span>
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                {t.score}
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>
                {score}
              </div>
            </div>
          </div>
        </div>

        {/* Translation Card Dashboard */}
        {!isGameOver && currentItem && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Phrase to Translate */}
            <div
              className="glass"
              style={{
                padding: "24px",
                borderRadius: "24px",
                border: "1.5px solid var(--border)",
                background: "var(--surface-raised)",
                textAlign: "center",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--accent-terra)",
                  position: "absolute",
                  top: "14px",
                  left: "20px",
                }}
              >
                Frase original
              </span>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: "12px 0 0",
                  lineHeight: 1.5,
                }}
              >
                {displayPhrase}
              </p>
            </div>

            {/* Assembled Phrase Area */}
            <motion.div
              animate={shakeTrigger ? { x: [-6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="glass"
              style={{
                minHeight: "80px",
                padding: "16px",
                borderRadius: "24px",
                border: shakeTrigger
                  ? "2px solid var(--accent-terra)"
                  : "1.5px solid var(--border)",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignContent: "flex-start",
                justifyContent: "center",
              }}
            >
              {assembled.length === 0 ? (
                <span
                  style={{
                    color: "var(--text-secondary)",
                    opacity: 0.5,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    margin: "auto",
                  }}
                >
                  {isPT ? "Toque nas palavras abaixo..." : "Tap words below..."}
                </span>
              ) : (
                assembled.map((word, idx) => (
                  <motion.div
                    key={`assembled-${idx}`}
                    layoutId={`word-${word}-${idx}`}
                    onClick={() => handleAssembledClick(word, idx)}
                    className="glass premium-shadow"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      background: "var(--brand)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(45,74,62,0.15)",
                    }}
                  >
                    {word}
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Pills Pool Area */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                minHeight: "80px",
                padding: "8px 0",
              }}
            >
              {pills.map((word, idx) => (
                <motion.button
                  key={`pill-${idx}`}
                  layoutId={`word-${word}-${idx}`}
                  onClick={() => handlePillClick(word, idx)}
                  className="glass premium-shadow hover:scale-105 active:scale-95"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "var(--surface-raised)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    border: "1.5px solid var(--border)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    transition: "all 0.15s",
                  }}
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {/* Verification actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
              <button
                onClick={clearAssembled}
                disabled={assembled.length === 0}
                className="btn-secondary-premium"
                style={{
                  borderRadius: "16px",
                  padding: "14px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  opacity: assembled.length === 0 ? 0.5 : 1,
                  cursor: assembled.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {t.clear}
              </button>
              <button
                onClick={checkAnswer}
                disabled={assembled.length === 0}
                className="btn-premium"
                style={{
                  borderRadius: "16px",
                  padding: "14px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  background:
                    assembled.length === 0
                      ? "var(--border)"
                      : "linear-gradient(135deg, var(--brand), var(--accent-teal))",
                  opacity: assembled.length === 0 ? 0.5 : 1,
                  cursor: assembled.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {t.check}
              </button>
            </div>
          </div>
        )}

        {/* Back navigation link */}
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
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      margin: 0,
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.helpTitle}
                  </h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ×
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
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

        {/* GAME OVER MODAL */}
        <AnimatePresence>
          {isGameOver && (
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
                    background: "rgba(196,109,75,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-terra)",
                  }}
                >
                  <AlertTriangle size={36} />
                </div>

                <div>
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      margin: "0 0 6px",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.gameOver}
                  </h2>
                  <p
                    style={{
                      fontSize: "14.5px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {t.gameOverDesc}
                  </p>
                </div>

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
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {t.score}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginTop: "4px",
                      }}
                    >
                      {score}
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
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                      }}
                    >
                      XP {isPT ? "Ganho" : "Earned"}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--brand)",
                        marginTop: "4px",
                      }}
                    >
                      +{Math.min(100, score * 15)} XP
                    </div>
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                    }}
                  >
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
                      ✨ +{Math.min(100, score * 15)} XP
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
                      🪙 +{Math.min(15, Math.floor(score * 2.5))} Lumes
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
