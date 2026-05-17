import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/hooks/useStore";

export function XPBar() {
  const { xp, level } = useStore();
  const [prevLevel, setPrevLevel] = useState(level);

  // Level thresholds
  const thresholds = [0, 100, 300, 600, 1000, 5000];
  const levelIdx = ["Beginner", "Explorer", "Conversationalist", "Fluent", "Native Soul"].indexOf(level);
  
  const minXP = thresholds[levelIdx];
  const maxXP = thresholds[levelIdx + 1];
  const progress = ((xp - minXP) / (maxXP - minXP)) * 100;

  useEffect(() => {
    if (level !== prevLevel) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2D4A3E", "#C4714A", "#D4C5A9"]
      });
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Level</span>
          <span className="font-display text-lg text-primary">{level}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{xp} / {maxXP} XP</span>
      </div>
      
      <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border/50">
        <motion.div
          className="h-full bg-terra"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
