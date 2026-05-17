import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked?: boolean;
}

const ALL_BADGES: Badge[] = [
  { id: "first-spark", name: "First Spark", description: "Complete first conversation", icon: "🔥" },
  { id: "chatterbox", name: "Chatterbox", description: "10 conversations", icon: "💬" },
  { id: "culture-lover", name: "Culture Lover", description: "Complete Art & Culture", icon: "🎨" },
  { id: "world-traveler", name: "World Traveler", description: "Complete Travel", icon: "✈️" },
  { id: "professional", name: "Professional", description: "Complete Professional", icon: "💼" },
  { id: "confidence-builder", name: "Confidence Builder", description: "Complete Speaking Confidence 3x", icon: "🧠" },
  { id: "expression-collector", name: "Expression Collector", description: "Save 20 expressions", icon: "📚" },
  { id: "dedicated", name: "Dedicated", description: "60 total minutes", icon: "⏱️" },
  { id: "on-fire", name: "On Fire", description: "7-day streak", icon: "🔥🔥" },
];

export function BadgeGrid({ unlockedIds = [] }: { unlockedIds?: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {ALL_BADGES.map((b) => {
        const isUnlocked = unlockedIds.includes(b.id);
        return (
          <motion.div
            key={b.id}
            whileHover={{ y: -5 }}
            className={`relative p-6 rounded-[2rem] border flex flex-col items-center text-center transition-all duration-500 ${
              isUnlocked 
                ? "bg-card border-terra/30 shadow-soft" 
                : "bg-surface/50 border-border/40 opacity-60 grayscale"
            }`}
          >
            <div className="text-4xl mb-3">{b.icon}</div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-1">{b.name}</h4>
            <p className="text-[9px] text-muted-foreground leading-tight">{b.description}</p>
            
            {isUnlocked && (
              <div className="absolute top-2 right-2 text-terra">
                <CheckCircle2 size={14} />
              </div>
            )}
            {!isUnlocked && (
              <div className="absolute top-2 right-2 text-muted-foreground/30">
                <Lock size={14} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
