import { useState, useEffect } from "react";
import { vocabulary } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";

export function Flashcards() {
  const [cards, setCards] = useState(vocabulary.slice(0, 10)); // Just 10 for demo
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = (difficulty: "easy" | "medium" | "hard") => {
    // Basic implementation of Spaced Repetition log
    console.log(`Card marked as ${difficulty}`);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) return <div>No cards available.</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Flashcards</h2>

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
          <div className="absolute w-full h-full backface-hidden bg-card border border-border rounded-xl shadow-md flex items-center justify-center p-6 text-center">
            <h3 className="text-3xl font-bold">{currentCard.word}</h3>
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
              Difícil
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("medium");
              }}
              className="flex-1 py-3 rounded-lg bg-accent/10 text-accent font-semibold"
            >
              Bom
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext("easy");
              }}
              className="flex-1 py-3 rounded-lg bg-primary/10 text-primary font-semibold"
            >
              Fácil
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
