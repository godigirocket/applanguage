import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { AppHeader } from "@/components/lume/AppHeader";
import { getVocabularyForTopic, ALL_TOPICS } from "@/lib/language-content";
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
} from "@/components/lume/CustomIcons";

type VocItem = {
  id: string;
  word: string;
  translation: string;
  pronunciationHint?: string;
};

export function LumeMatch() {
  const nav = useNavigate();
  const { interfaceLanguage, targetLanguage, addXP, addLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Game States
  const [leftCards, setLeftCards] = useState<VocItem[]>([]);
  const [rightCards, setRightCards] = useState<VocItem[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<VocItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<VocItem | null>(null);

  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [incorrectIds, setIncorrectIds] = useState<Set<string>>(new Set());

  const [round, setRound] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  // Trilingual strings
  const t = {
    title: isPT ? "Lume Match" : isES ? "Lume Match" : "Lume Match",
    subtitle: isPT
      ? "Associe cada expressão ao seu significado correto."
      : isES
        ? "Asocia cada expresión con su significado correcto."
        : "Match each expression to its correct meaning.",
    round: isPT ? "Rodada" : isES ? "Ronda" : "Round",
    attempts: isPT ? "Erros" : isES ? "Errores" : "Mistakes",
    victoryTitle: isPT
      ? "Combinação Perfeita!"
      : isES
        ? "¡Combinación Perfecta!"
        : "Perfect Match!",
    victoryDesc: isPT
      ? "Você dominou as associações desta rodada!"
      : isES
        ? "¡Has dominado las asociaciones de esta ronda!"
        : "You successfully matched all terms in the pool!",
    rewardText: isPT ? "Recompensas:" : isES ? "Recompensas:" : "Rewards:",
    playAgain: isPT ? "Jogar Novamente" : isES ? "Jugar de Nuevo" : "Play Again",
    helpTitle: isPT ? "Como Jogar" : isES ? "Cómo Jugar" : "How to Play",
    helpText: isPT
      ? "Selecione uma palavra na coluna esquerda e sua tradução correspondente na coluna direita. Ao acertar, as cartas ficarão verdes e serão marcadas. Complete as 3 rodadas para vencer e ganhar XP!"
      : isES
        ? "Selecciona una palabra en la columna izquierda y su traducción correspondiente en la derecha. Si aciertas, las cartas se pondrán verdes. ¡Completa las 3 rondas para ganar!"
        : "Select a word in the left column and its corresponding translation in the right column. Match all 4 pairs correctly to clear each round. Complete 3 rounds to win bonus XP!",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
  };

  useEffect(() => {
    startNewGame();
  }, [targetLanguage]);

  const startNewGame = () => {
    setRound(1);
    setAttempts(0);
    setShowVictory(false);
    loadRound(1);
  };

  const loadRound = (currentRound: number) => {
    // Rotate topic per round so each round feels distinct, and pull real,
    // properly localized vocabulary (en/es/pt) from the content engine
    // instead of the old 15-word-per-language static bank.
    const topic = ALL_TOPICS[(currentRound - 1) % ALL_TOPICS.length];
    const rawList = getVocabularyForTopic(topic, targetLanguage, {
      count: 4,
      seed: `lumematch-${currentRound}`,
    });

    if (!rawList || rawList.length < 4) return;

    const selectedWords: VocItem[] = rawList.map((item) => ({
      id: item.id,
      word: item.term,
      translation: item.translation,
    }));

    // Shuffle left column and right column separately
    const leftCols = [...selectedWords].sort(() => Math.random() - 0.5);
    const rightCols = [...selectedWords].sort(() => Math.random() - 0.5);

    setLeftCards(leftCols);
    setRightCards(rightCols);

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setIncorrectIds(new Set());
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

  // Perform match checks
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft.id === selectedRight.id) {
        // MATCH SUCCESS
        const newMatched = new Set(matchedIds);
        newMatched.add(selectedLeft.id);
        setMatchedIds(newMatched);

        sounds.playClick();
        handleSpeak(selectedLeft.word);

        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all matched
        if (newMatched.size === 4) {
          setTimeout(() => {
            if (round < 3) {
              setRound((r) => r + 1);
              loadRound(round + 1);
            } else {
              // Final Victory
              addXP(40);
              addLumes(10);
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
              });
              setShowVictory(true);
            }
          }, 800);
        }
      } else {
        // MATCH FAIL
        const newIncorrect = new Set<string>();
        newIncorrect.add(selectedLeft.id);
        setIncorrectIds(newIncorrect);

        setAttempts((a) => a + 1);
        sounds.playClick(); // play generic feedback

        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setIncorrectIds(new Set());
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
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

        {/* Stats Row */}
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
            <span
              style={{
                fontSize: "9px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
              }}
            >
              {t.round}
            </span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
              {round} / 3
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
            <span
              style={{
                fontSize: "9px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--accent-terra)",
              }}
            >
              {t.attempts}
            </span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-terra)" }}>
              {attempts}
            </span>
          </div>
        </div>

        {/* Matchboard Area */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "8px",
          }}
        >
          {/* LEFT column (Words in target language) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {leftCards.map((card) => {
              const isMatched = matchedIds.has(card.id);
              const isSelected = selectedLeft?.id === card.id;
              const isIncorrect = incorrectIds.has(card.id);

              let cardBg = "var(--surface-raised)";
              let cardBorder = "1.5px solid var(--border)";
              let textColor = "var(--text-primary)";

              if (isMatched) {
                cardBg = "rgba(45, 74, 62, 0.08)";
                cardBorder = "2px solid var(--brand)";
                textColor = "var(--brand)";
              } else if (isIncorrect) {
                cardBg = "rgba(196, 109, 75, 0.08)";
                cardBorder = "2px solid var(--accent-terra)";
                textColor = "var(--accent-terra)";
              } else if (isSelected) {
                cardBorder = "2px solid var(--accent-gold)";
                cardBg = "rgba(212, 162, 59, 0.05)";
              }

              return (
                <motion.div
                  key={`left-${card.id}`}
                  onClick={() => {
                    if (isMatched || isIncorrect) return;
                    setSelectedLeft(isSelected ? null : card);
                  }}
                  animate={isIncorrect ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="glass premium-shadow"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "20px",
                    cursor: isMatched ? "default" : "pointer",
                    background: cardBg,
                    border: cardBorder,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minHeight: "68px",
                    transition: "border 0.2s, background-color 0.2s",
                  }}
                >
                  {isMatched && <CheckCircle size={16} />}
                  <span>{card.word}</span>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT column (Translations) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rightCards.map((card) => {
              const isMatched = matchedIds.has(card.id);
              const isSelected = selectedRight?.id === card.id;
              const isIncorrect =
                selectedLeft &&
                selectedRight &&
                selectedLeft.id !== selectedRight.id &&
                selectedRight.id === card.id;

              let cardBg = "var(--surface-raised)";
              let cardBorder = "1.5px solid var(--border)";
              let textColor = "var(--text-primary)";

              if (isMatched) {
                cardBg = "rgba(45, 74, 62, 0.08)";
                cardBorder = "2px solid var(--brand)";
                textColor = "var(--brand)";
              } else if (isIncorrect) {
                cardBg = "rgba(196, 109, 75, 0.08)";
                cardBorder = "2px solid var(--accent-terra)";
                textColor = "var(--accent-terra)";
              } else if (isSelected) {
                cardBorder = "2px solid var(--accent-gold)";
                cardBg = "rgba(212, 162, 59, 0.05)";
              }

              return (
                <motion.div
                  key={`right-${card.id}`}
                  onClick={() => {
                    if (isMatched || isIncorrect) return;
                    setSelectedRight(isSelected ? null : card);
                  }}
                  animate={isIncorrect ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="glass premium-shadow"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "20px",
                    cursor: isMatched ? "default" : "pointer",
                    background: cardBg,
                    border: cardBorder,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minHeight: "68px",
                    transition: "border 0.2s, background-color 0.2s",
                  }}
                >
                  {isMatched && <CheckCircle size={16} />}
                  <span>{card.translation}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

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

        {/* HELP OVERLAY */}
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
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      margin: "0 0 6px",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.victoryTitle}
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {t.victoryDesc}
                  </p>
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
                      ✨ +40 XP
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
