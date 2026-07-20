import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import vocabulary from "@/data/vocabulary.json";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Sparkles,
  Award,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/hangman")({
  component: HangmanGamePage,
});

function HangmanGamePage() {
  const { interfaceLanguage, targetLanguage, addXP, addLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Game vocab selection
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState<"victory" | "defeat" | null>(null);

  const maxMistakes = 6;

  useEffect(() => {
    startNewGame();
  }, [targetLanguage]);

  const startNewGame = () => {
    const words = vocabulary[targetLanguage as keyof typeof vocabulary] || [];
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord.word.toUpperCase());
      setTranslation(randomWord.translation);
      setExample(randomWord.example);
      setGuessedLetters(new Set());
      setMistakes(0);
      setShowModal(null);
    }
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter) || mistakes >= maxMistakes || isWinner || isLoser) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      setMistakes((m) => m + 1);
    }
  };

  const isWinner =
    word.length > 0 &&
    word.split("").every((l) => guessedLetters.has(l) || l === " " || l === "-" || l === "/");
  const isLoser = mistakes >= maxMistakes;

  useEffect(() => {
    if (isWinner && word.length > 0) {
      addXP(30);
      addLumes(10);
      // Play speech pronunciation
      handleSpeak(word);
      setTimeout(() => {
        setShowModal("victory");
      }, 400);
    } else if (isLoser) {
      handleSpeak(word);
      setTimeout(() => {
        setShowModal("defeat");
      }, 400);
    }
  }, [isWinner, isLoser]);

  const handleSpeak = (w: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(w);
      utterance.lang =
        targetLanguage === "en" ? "en-US" : targetLanguage === "es" ? "es-ES" : "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Mini translations
  const t = {
    title: isPT ? "Forca Lume" : isES ? "Ahorcado Lume" : "Lume Hangman",
    subtitle: isPT
      ? "Decifre expressões artísticas e expanda seu vocabulário."
      : isES
        ? "Descifra expresiones artísticas y expande tu vocabulario."
        : "Decipher artistic expressions and expand your vocabulary.",
    translationLabel: isPT ? "Tradução" : isES ? "Traducción" : "Translation",
    errors: isPT ? "Erros cometidos" : isES ? "Errores cometidos" : "Mistakes made",
    victoryTitle: isPT
      ? "Parabéns! Excelente!"
      : isES
        ? "¡Felicidades! ¡Excelente!"
        : "Magnificent! Well done!",
    defeatTitle: isPT
      ? "Que pena! Tente outra vez"
      : isES
        ? "¡Qué lástima! Inténtalo de nuevo"
        : "Oh no! Keep practicing",
    rewardText: isPT ? "Você conquistou:" : isES ? "Has conseguido:" : "You have earned:",
    correctWordLabel: isPT ? "A palavra era:" : isES ? "La palabra era:" : "The word was:",
    nextWord: isPT ? "Próxima Palavra" : isES ? "Siguiente Palabra" : "Next Word",
    tryAgain: isPT ? "Tentar Novamente" : isES ? "Intentar de Nuevo" : "Try Again",
    helpTitle: isPT ? "Como Jogar" : isES ? "Cómo Jugar" : "How to Play",
    helpText: isPT
      ? "Selecione as letras do teclado para desvendar a palavra correspondente à tradução dada. Cada erro desenha uma parte do boneco. Complete a palavra sem errar 6 vezes para ganhar 30 XP e 10 Lumes!"
      : isES
        ? "Selecciona las letras del teclado para descubrir la palabra correspondiente a la traducción. Cada error dibuja una parte de la figura. ¡Completa la palabra sin cometer 6 errores para ganar 30 XP y 10 Lumes!"
        : "Select letters from the keyboard to uncover the word that matches the translation. Each mistake draws part of the figure. Uncover the full word before making 6 mistakes to earn 30 XP and 10 Lumes!",
    keyboard: isPT ? "Teclado" : isES ? "Teclado" : "Keyboard",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 24px",
          animation: "pageEnter 0.5s ease",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Editorial Top Info */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "20px",
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
              WORD Puzzles
            </span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "36px",
                color: "var(--text-primary)",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {t.title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "4px" }}>
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
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

        {/* Central columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            alignItems: "center",
          }}
        >
          {/* Column 1: Hangman SVG Drawing */}
          <div
            className="glass"
            style={{
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <svg width="220" height="220" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
              {/* Hill foundation */}
              <path
                d="M 20 180 Q 50 170 80 180"
                fill="none"
                stroke="var(--border)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Gallows upright */}
              {mistakes >= 1 && (
                <line
                  x1="50"
                  y1="180"
                  x2="50"
                  y2="30"
                  stroke="var(--text-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ animation: "strokeDraw 0.4s ease" }}
                />
              )}
              {/* Gallows crossbar */}
              {mistakes >= 1 && (
                <line
                  x1="48"
                  y1="30"
                  x2="130"
                  y2="30"
                  stroke="var(--text-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              {/* Gallows angle brace */}
              {mistakes >= 1 && (
                <line
                  x1="50"
                  y1="60"
                  x2="80"
                  y2="30"
                  stroke="var(--text-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {/* Gallows rope */}
              {mistakes >= 2 && (
                <line
                  x1="125"
                  y1="30"
                  x2="125"
                  y2="60"
                  stroke="var(--accent-terra)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Character head */}
              {mistakes >= 3 && (
                <circle
                  cx="125"
                  cy="72"
                  r="12"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="3.5"
                  style={{ filter: "drop-shadow(0 0 3px rgba(196,113,74,0.25))" }}
                />
              )}
              {/* Character body */}
              {mistakes >= 4 && (
                <line
                  x1="125"
                  y1="84"
                  x2="125"
                  y2="125"
                  stroke="var(--text-primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}
              {/* Character arms */}
              {mistakes >= 5 && (
                <>
                  <line
                    x1="125"
                    y1="95"
                    x2="105"
                    y2="110"
                    stroke="var(--text-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="125"
                    y1="95"
                    x2="145"
                    y2="110"
                    stroke="var(--text-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}
              {/* Character legs */}
              {mistakes >= 6 && (
                <>
                  <line
                    x1="125"
                    y1="125"
                    x2="110"
                    y2="155"
                    stroke="var(--text-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="125"
                    y1="125"
                    x2="140"
                    y2="155"
                    stroke="var(--text-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: mistakes >= 4 ? "var(--accent-terra)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <AlertTriangle size={15} />
              {t.errors}:{" "}
              <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 900 }}>
                {mistakes} / {maxMistakes}
              </span>
            </div>
          </div>

          {/* Column 2: Word clue and blank spaces */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              className="glass"
              style={{
                borderRadius: "24px",
                padding: "24px 28px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--accent-green)",
                }}
              >
                {t.translationLabel}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "22px",
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  margin: "6px 0 0",
                }}
              >
                {translation}
              </p>
            </div>

            {/* Blank word lines */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
                padding: "20px 0",
              }}
            >
              {word.split("").map((letter, idx) => {
                const isSpecial = letter === " " || letter === "-" || letter === "/";
                const showLetter = guessedLetters.has(letter) || isLoser;
                return (
                  <div
                    key={idx}
                    style={{
                      width: letter === " " ? "20px" : "42px",
                      height: "52px",
                      borderBottom: isSpecial ? "none" : "3px solid var(--border)",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: 800,
                      color:
                        isLoser && !guessedLetters.has(letter)
                          ? "var(--accent-terra)"
                          : "var(--brand)",
                      fontFamily: "var(--font-display)",
                      transition: "all 0.2s",
                      paddingBottom: "2px",
                    }}
                  >
                    {isSpecial ? (letter === " " ? "" : letter) : showLetter ? letter : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Keyboard Input Panel */}
        <section
          className="glass"
          style={{
            borderRadius: "28px",
            padding: "24px 28px",
            border: "1.5px solid var(--border)",
            background: "var(--surface-raised)",
          }}
        >
          <h3
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-secondary)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {t.keyboard}
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {alphabet.map((letter) => {
              const isUsed = guessedLetters.has(letter);
              const isMatch = word.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => guessLetter(letter)}
                  disabled={isUsed || isWinner || isLoser}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: !isUsed
                      ? "var(--bg)"
                      : isMatch
                        ? "rgba(45,74,62,0.1)"
                        : "var(--border)",
                    color: !isUsed
                      ? "var(--text-primary)"
                      : isMatch
                        ? "var(--brand)"
                        : "var(--text-secondary)",
                    fontWeight: 800,
                    fontSize: "15px",
                    cursor: isUsed ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    opacity: isUsed && !isMatch ? 0.4 : 1,
                    boxShadow: !isUsed ? "0 2px 6px rgba(0,0,0,0.02)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isUsed) e.currentTarget.style.borderColor = "var(--brand)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isUsed) e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Floating Back Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <Link
            to="/games"
            style={{
              padding: "12px 24px",
              borderRadius: "99px",
              background: "var(--surface-raised)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              transition: "all 0.2s",
            }}
          >
            {t.backPlay}
          </Link>
        </div>

        {/* VICTORY / DEFEAT MODAL OVERLAY */}
        <AnimatePresence>
          {showModal && (
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
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="glass premium-shadow"
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "32px",
                  maxWidth: "460px",
                  width: "100%",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "24px",
                }}
              >
                {/* Visual Icon */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background:
                      showModal === "victory" ? "rgba(45,74,62,0.1)" : "rgba(196,113,74,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: showModal === "victory" ? "var(--brand)" : "var(--accent-terra)",
                  }}
                >
                  {showModal === "victory" ? <Award size={36} /> : <AlertTriangle size={36} />}
                </div>

                {/* Typography info */}
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "28px",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      margin: "0 0 6px",
                    }}
                  >
                    {showModal === "victory" ? t.victoryTitle : t.defeatTitle}
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                    {t.correctWordLabel}
                  </p>

                  {/* Big Target Word Card */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      margin: "12px 0",
                      background: "var(--bg)",
                      borderRadius: "16px",
                      padding: "14px 20px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "24px",
                        fontWeight: 900,
                        color: "var(--brand)",
                      }}
                    >
                      {word}
                    </span>
                    <button
                      onClick={() => handleSpeak(word)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  <p
                    style={{ fontStyle: "italic", fontSize: "15px", color: "var(--text-primary)" }}
                  >
                    "{translation}"
                  </p>
                </div>

                {/* Example sentence box */}
                {example && (
                  <div
                    style={{
                      padding: "16px",
                      background: "var(--bg)",
                      borderRadius: "16px",
                      borderLeft: "4px solid var(--brand)",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Context Sentence
                    </span>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "var(--text-primary)",
                        lineHeight: 1.5,
                        margin: "4px 0 0",
                        fontStyle: "italic",
                      }}
                    >
                      "{example}"
                    </p>
                  </div>
                )}

                {/* Rewards Grid */}
                {showModal === "victory" && (
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
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
                        <Sparkles size={14} color="#F39C12" style={{ marginRight: "6px" }} />
                        +30 XP
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
                )}

                {/* Buttons */}
                <button
                  onClick={startNewGame}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "var(--brand)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(45,74,62,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {showModal === "victory" ? t.nextWord : t.tryAgain}
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HOW TO PLAY DIALOG */}
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
                      fontFamily: "var(--font-sans)",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0,
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
                      color: "var(--text-secondary)",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </div>

                <p
                  style={{
                    fontSize: "14.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {t.helpText}
                </p>

                <button
                  onClick={() => setShowHelp(false)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "var(--brand)",
                    color: "white",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
