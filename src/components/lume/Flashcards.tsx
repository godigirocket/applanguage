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
    hard: isPT ? "Difícil" : isES ? "Difícil" : "Hard",
    medium: isPT ? "Bom" : isES ? "Bien" : "Good",
    easy: isPT ? "Fácil" : isES ? "Fácil" : "Easy",
    noCards: isPT
      ? "Nenhum cartão disponível."
      : isES
        ? "No hay tarjetas disponibles."
        : "No cards available.",
  };

  if (!currentCard) return <div>{t.noCards}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">{t.title}</h2>

      <div
        className="relative w-full max-w-sm aspect-[4/3] perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-card border border-border rounded-xl shadow-md flex flex-col items-center justify-center gap-3 p-6 text-center">
            <h3 className="text-3xl font-bold">{currentCard.term}</h3>
            {isTTSSupported() && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentCard.term, targetLanguage);
                }}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-primary text-primary-foreground border border-primary/20 rounded-xl shadow-md flex flex-col items-center justify-center p-6 text-center rotate-y-180">
            <h3 className="text-2xl font-bold mb-4">{currentCard.translation}</h3>
            <p className="text-sm opacity-80 italic">{currentCard.example}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 flex gap-4 w-full max-w-sm"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("hard");
              }}
              className="flex-1 py-3 rounded-lg bg-destructive/10 text-destructive font-semibold"
            >
              {t.hard}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("medium");
              }}
              className="flex-1 py-3 rounded-lg bg-accent/10 text-accent font-semibold"
            >
              {t.medium}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("easy");
              }}
              className="flex-1 py-3 rounded-lg bg-primary/10 text-primary font-semibold"
            >
              {t.easy}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
