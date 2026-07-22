import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import {
  getVocabularyForTopic,
  saveWord,
  markWordCorrect,
  markWordWrong,
  ALL_TOPICS,
  type LessonTopic,
} from "@/lib/language-content";
import { speak, isTTSSupported } from "@/lib/language-apis/webSpeech";
import { Volume2 } from "lucide-react";

function pickTodaysTopic(): LessonTopic {
  const day = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < day.length; i++) h = (Math.imul(31, h) + day.charCodeAt(i)) | 0;
  return ALL_TOPICS[Math.abs(h) % ALL_TOPICS.length];
}

export function Flashcards() {
  const { targetLanguage, interfaceLanguage, addXP } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const cards = useMemo(
    () =>
      getVocabularyForTopic(pickTodaysTopic(), targetLanguage, { count: 12, seed: "flashcards" }),
    [targetLanguage],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [targetLanguage]);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (currentCard) saveWord(currentCard);
  }, [currentCard]);

  const handleNext = (difficulty: "easy" | "medium" | "hard") => {
    if (currentCard) {
      if (difficulty === "hard") {
        markWordWrong(currentCard.id);
      } else {
        markWordCorrect(currentCard.id);
        addXP(2);
      }
    }
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const t = {
    title: "Flashcards",
    tapToFlip: isPT ? "Toque para virar" : isES ? "Toca para voltear" : "Tap to flip",
    hard: isPT ? "Difícil" : isES ? "Difícil" : "Hard",
    medium: isPT ? "Bom" : isES ? "Bien" : "Good",
    easy: isPT ? "Fácil" : isES ? "Fácil" : "Easy",
    noCards: isPT
      ? "Nenhum cartão disponível."
      : isES
        ? "No hay tarjetas disponibles."
        : "No cards available.",
  };

  if (!currentCard) {
    return <div style={{ padding: "24px", color: "var(--text-secondary)" }}>{t.noCards}</div>;
  }

  const cardFaceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "var(--shadow-soft)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 800,
          marginBottom: "8px",
          color: "var(--text-primary)",
        }}
      >
        {t.title}
      </h2>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
        {currentIndex + 1} / {cards.length} · {t.tapToFlip}
      </p>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "360px",
          aspectRatio: "4 / 3",
          perspective: "1200px",
          cursor: "pointer",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div
            style={{
              ...cardFaceStyle,
              background: "var(--card-bg)",
              border: "2px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <h3 style={{ fontSize: "30px", fontWeight: 800, margin: 0 }}>{currentCard.term}</h3>
            {isTTSSupported() && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentCard.term, targetLanguage);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  padding: "6px",
                }}
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>

          {/* Back */}
          <div
            style={{
              ...cardFaceStyle,
              background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
              color: "#fff",
              transform: "rotateY(180deg)",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 12px" }}>
              {currentCard.translation}
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.9, fontStyle: "italic", margin: 0 }}>
              {currentCard.example}
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "12px",
              width: "100%",
              maxWidth: "360px",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("hard");
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.1)",
                color: "var(--danger)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.hard}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("medium");
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid rgba(245,158,11,0.3)",
                background: "rgba(245,158,11,0.1)",
                color: "var(--warning)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.medium}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("easy");
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid rgba(34,197,94,0.3)",
                background: "rgba(34,197,94,0.1)",
                color: "var(--success)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.easy}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
