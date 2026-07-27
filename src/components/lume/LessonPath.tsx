/**
 * DUOLINGO-STYLE LESSON PATH
 * Vertical progress tree with connected nodes showing lesson progression.
 * Active node pulses, completed nodes are gold, locked ones are gray.
 */

import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Lock, CheckCircle, Star, Book, Mic, Volume2, Sparkles, BookOpen } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, typeof Book> = {
  vocabulary: Sparkles,
  grammar: Book,
  listening: Volume2,
  speaking: Mic,
  idioms: BookOpen,
};

const CATEGORY_EMOJIS: Record<string, string> = {
  vocabulary: "📝",
  grammar: "📖",
  listening: "🎧",
  speaking: "🗣️",
  idioms: "💬",
};

interface LessonPathProps {
  lessons: any[];
  maxVisible?: number;
}

export function LessonPath({ lessons, maxVisible = 20 }: LessonPathProps) {
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const visibleLessons = lessons.slice(0, maxVisible);

  // Find the first non-completed, non-locked lesson (the "active" one)
  const activeIndex = visibleLessons.findIndex(
    (l) => !l.completed && !l.locked
  );

  const handleClick = (lesson: any) => {
    if (lesson.locked) {
      toast.info(isPT ? "Complete a lição anterior primeiro!" : "Complete the previous lesson first!");
      return;
    }
    nav({ to: `/lesson/${lesson.id}` as any });
  };

  // Zigzag offsets to make the path feel organic (like Duolingo's winding road)
  const getOffset = (index: number): number => {
    const pattern = [0, 30, 50, 30, 0, -30, -50, -30];
    return pattern[index % pattern.length];
  };

  return (
    <div className="progress-path" style={{ padding: "32px 16px", maxWidth: "400px", margin: "0 auto" }}>
      {visibleLessons.map((lesson, i) => {
        const isActive = i === activeIndex;
        const isCompleted = lesson.completed;
        const isLocked = lesson.locked;
        const emoji = CATEGORY_EMOJIS[lesson.category] || "📚";

        return (
          <div key={lesson.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Connector line (except first) */}
            {i > 0 && (
              <div
                className={`path-connector ${isCompleted ? "path-connector-done" : isActive ? "path-connector-active" : "path-connector-locked"}`}
              />
            )}

            {/* Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", bounce: 0.4 }}
              style={{ transform: `translateX(${getOffset(i)}px)` }}
            >
              <button
                onClick={() => handleClick(lesson)}
                className={`path-node ${isActive ? "path-node-active" : isCompleted ? "path-node-completed" : "path-node-locked"}`}
                aria-label={`${lesson.title} - ${isCompleted ? (isPT ? "Completa" : "Completed") : isLocked ? (isPT ? "Bloqueada" : "Locked") : (isPT ? "Disponível" : "Available")}`}
                title={lesson.title}
              >
                {isCompleted ? (
                  <span style={{ fontSize: "28px" }}>⭐</span>
                ) : isLocked ? (
                  <Lock size={24} color="var(--text-soft)" />
                ) : (
                  <span style={{ fontSize: "28px" }}>{emoji}</span>
                )}
              </button>

              {/* Label below active node */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: "8px",
                    textAlign: "center",
                    maxWidth: "140px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {lesson.title?.split(" - ")[0] || lesson.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    +{lesson.xp || 20} XP
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        );
      })}

      {/* "See All" button at bottom */}
      {lessons.length > maxVisible && (
        <div style={{ marginTop: "24px" }}>
          <div className="path-connector path-connector-locked" />
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "99px",
              background: "var(--surface-raised)",
              border: "2.5px solid var(--border)",
              borderBottomWidth: "5px",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            +{lessons.length - maxVisible} {isPT ? "lições disponíveis" : "lessons available"}
          </div>
        </div>
      )}
    </div>
  );
}
