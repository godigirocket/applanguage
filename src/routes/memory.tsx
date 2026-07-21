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
  HelpCircle,
  ArrowRight,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/memory")({
  component: MemoryGamePage,
});

type Card = {
  id: number;
  text: string;
  matchId: number;
  isFlipped: boolean;
  isMatched: boolean;
  type: "word" | "translation";
};

function MemoryGamePage() {
  const { interfaceLanguage, targetLanguage, addXP, addLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, [targetLanguage]);

  const initializeGame = () => {
    const words = vocabulary[targetLanguage as keyof typeof vocabulary]?.slice(0, 6) || [];
    const initialCards: Card[] = [];

    words.forEach((w, idx) => {
      initialCards.push({
        id: idx * 2,
        text: w.word,
        matchId: idx,
        isFlipped: false,
        isMatched: false,
        type: "word",
      });
      initialCards.push({
        id: idx * 2 + 1,
        text: w.translation,
        matchId: idx,
        isFlipped: false,
        isMatched: false,
        type: "translation",
      });
    });

    // Shuffle
    initialCards.sort(() => Math.random() - 0.5);
    setCards(initialCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setShowModal(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].matchId === cards[secondIdx].matchId) {
        // Correct Match
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          // Audio pronounce the original word
          const matchedWord =
            cards[firstIdx].type === "word" ? cards[firstIdx].text : cards[secondIdx].text;
          handleSpeak(matchedWord);

          if (newMatchCount === 6) {
            addXP(50);
            addLumes(15);
            setTimeout(() => {
              setShowModal(true);
            }, 600);
          }
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const handleSpeak = (w: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(w);
      utterance.lang =
        targetLanguage === "en" ? "en-US" : targetLanguage === "es" ? "es-ES" : "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trilingual UI strings
  const t = {
    title: isPT ? "Memória Lume" : isES ? "Memoria Lume" : "Lume Memory",
    subtitle: isPT
      ? "Associe as expressões correspondentes para treinar sua retenção cognitiva."
      : isES
        ? "Asocia las expresiones correspondientes para entrenar tu retención cognitiva."
        : "Match corresponding expressions to build deep cognitive retention.",
    moves: isPT ? "Movimentos realizados" : isES ? "Movimientos realizados" : "Moves made",
    matches: isPT ? "Pares encontrados" : isES ? "Pares encontrados" : "Pairs matched",
    victoryTitle: isPT ? "Memória Impecável!" : isES ? "¡Memoria Impecable!" : "Impeccable Memory!",
    victoryDesc: isPT
      ? "Você encontrou todos os pares perfeitamente!"
      : isES
        ? "¡Encontraste todos los pares a la perfección!"
        : "You matched all vocabulary cards successfully!",
    rewardText: isPT ? "Bônus recebido:" : isES ? "Bono recibido:" : "Bonus earned:",
    playAgain: isPT ? "Jogar Novamente" : isES ? "Jugar de Nuevo" : "Play Again",
    helpTitle: isPT ? "Como Jogar" : isES ? "Cómo Jugar" : "How to Play",
    helpText: isPT
      ? "Clique nas cartas para revelá-las. Encontre o par correspondente de cada expressão no idioma estudado com sua tradução. Ao formar um par, você ouvirá a pronúncia nativa! Complete o jogo em menos movimentos para exercitar seu cérebro."
      : isES
        ? "Haz clic en las cartas para revelarlas. Encuentra la traducción correspondiente de cada palabra. ¡Al formar una pareja, escucharás la pronunciación nativa! Completa el juego en el menor número de movimientos posible."
        : "Tap cards to flip them. Find matching pairs between words and translations. When you form a match, you will hear native pronunciation! Complete the board in as few moves as possible to maximize cognitive training.",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
    flipLabel: isPT ? "Clique para virar" : isES ? "Click para girar" : "Click to flip",
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
        {/* Editorial Top Section */}
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
              COGNITIVE PAIRS
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
              onClick={initializeGame}
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

        {/* Game Stats Info Bar */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div
            className="glass"
            style={{
              flex: 1,
              minWidth: "140px",
              borderRadius: "16px",
              padding: "12px 20px",
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
                fontWeight: 950,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-secondary)",
              }}
            >
              {t.moves}
            </span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
              {moves}
            </span>
          </div>

          <div
            className="glass"
            style={{
              flex: 1,
              minWidth: "140px",
              borderRadius: "16px",
              padding: "12px 20px",
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
                fontWeight: 950,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--accent-terra)",
              }}
            >
              {t.matches}
            </span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-terra)" }}>
              {matches} / 6
            </span>
          </div>
        </div>

        {/* 3D Cards Grid board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            perspective: "1000px", // Required for 3D card flipping
          }}
        >
          {cards.map((card, idx) => {
            const showFace = card.isFlipped || card.isMatched;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: "110px",
                  position: "relative",
                  cursor: card.isMatched || card.isFlipped ? "default" : "pointer",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* CARD FRONT SIDE (Face down - hidden initially) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, var(--surface-raised), var(--surface))",
                    border: "1.5px solid var(--border)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backfaceVisibility: "hidden",
                    zIndex: 2,
                    transform: "rotateY(0deg)",
                  }}
                >
                  {/* Subtle elegant Lume monogram */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "24px",
                      fontWeight: 900,
                      color: "rgba(255,122,69,0.18)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    L
                  </span>
                  <span
                    style={{
                      fontSize: "7px",
                      fontWeight: 900,
                      letterSpacing: "0.12em",
                      color: "var(--text-secondary)",
                      opacity: 0.5,
                      marginTop: "4px",
                    }}
                  >
                    LUME
                  </span>
                </div>

                {/* CARD BACK SIDE (Face up - shown when flipped/matched) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "20px",
                    background: card.isMatched ? "rgba(255,122,69,0.06)" : "var(--surface-raised)",
                    color: "var(--text-primary)",
                    border: card.isMatched ? "2px solid var(--brand)" : "1.5px solid var(--border)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    textAlign: "center",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    zIndex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: card.text.length > 15 ? "13px" : "15px",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      margin: 0,
                      color: card.isMatched ? "var(--brand)" : "var(--text-primary)",
                    }}
                  >
                    {card.text}
                  </p>

                  {card.isMatched && card.type === "word" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(card.text);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--brand)",
                        marginTop: "8px",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back navigation */}
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

        {/* VICTORY MODAL OVERLAY */}
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
                {/* Visual Icon */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(255,122,69,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand)",
                  }}
                >
                  <Award size={36} />
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
                    {t.victoryTitle}
                  </h2>
                  <p
                    style={{
                      fontSize: "14.5px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
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
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {t.moves}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginTop: "4px",
                      }}
                    >
                      {moves}
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
                        letterSpacing: "0.08em",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {t.matches}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--brand)",
                        marginTop: "4px",
                      }}
                    >
                      6 / 6
                    </div>
                  </div>
                </div>

                {/* Rewards Grid */}
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
                        background: "rgba(255,122,69,0.06)",
                        border: "1px solid rgba(255,122,69,0.15)",
                        color: "var(--brand)",
                        fontSize: "13px",
                        fontWeight: 800,
                      }}
                    >
                      <Sparkles size={14} color="#F39C12" style={{ marginRight: "6px" }} />
                      +50 XP
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
                      🪙 +15 Lumes
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  onClick={initializeGame}
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
                    boxShadow: "0 4px 16px rgba(255,122,69,0.25)",
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
