import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Lock,
  Star,
  Book,
  Mic,
  Volume2,
  Sparkles,
  BookOpen,
} from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, typeof Book> = {
  vocabulary: Sparkles,
  grammar: Book,
  listening: Volume2,
  speaking: Mic,
  idioms: BookOpen,
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
  const activeIndex = visibleLessons.findIndex((lesson) => !lesson.completed && !lesson.locked);

  const handleClick = (lesson: any) => {
    if (lesson.locked) {
      toast.info(isPT ? "Complete a licao anterior primeiro!" : "Complete the previous lesson first!");
      return;
    }
    nav({ to: `/lesson/${lesson.id}` as any });
  };

  const getOffset = (index: number): number => {
    const pattern = [-58, -28, 14, 48, 24, -18, -54, -20, 22, 58, 30, -12];
    return pattern[index % pattern.length];
  };

  return (
    <div className="progress-path" style={{ padding: "32px 16px", maxWidth: "420px", margin: "0 auto" }}>
      {visibleLessons.map((lesson, i) => {
        const isActive = i === activeIndex;
        const isCompleted = lesson.completed;
        const isLocked = lesson.locked;
        const CategoryIcon = CATEGORY_ICONS[lesson.category] || Book;

        return (
          <div key={lesson.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 && (
              <div
                className={`path-connector ${
                  isCompleted ? "path-connector-done" : isActive ? "path-connector-active" : "path-connector-locked"
                }`}
              />
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.035, type: "spring", bounce: 0.36 }}
              style={{ transform: `translateX(${getOffset(i)}px)` }}
            >
              <button
                onClick={() => handleClick(lesson)}
                className={`path-node animated-container ${
                  isActive ? "path-node-active" : isCompleted ? "path-node-completed" : "path-node-locked"
                }`}
                aria-label={`${lesson.title} - ${
                  isCompleted
                    ? isPT
                      ? "Completa"
                      : "Completed"
                    : isLocked
                      ? isPT
                        ? "Bloqueada"
                        : "Locked"
                      : isPT
                        ? "Disponivel"
                        : "Available"
                }`}
                title={lesson.title}
              >
                {isCompleted ? (
                  <Star size={30} color="currentColor" />
                ) : isLocked ? (
                  <Lock size={24} color="var(--text-soft)" />
                ) : (
                  <CategoryIcon size={30} color="currentColor" />
                )}
              </button>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: "8px", textAlign: "center", maxWidth: "150px" }}
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

      {lessons.length > maxVisible && (
        <div style={{ marginTop: "24px" }}>
          <div className="path-connector path-connector-locked" />
          <div className="path-more-pill">
            +{lessons.length - maxVisible} {isPT ? "licoes disponiveis" : "lessons available"}
          </div>
        </div>
      )}
    </div>
  );
}
