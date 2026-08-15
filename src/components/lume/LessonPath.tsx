import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Lock,
  Star,
  Book,
  Mic,
  Volume2,
  Sparkles,
  BookOpen,
  ChevronDown,
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
  /** How many nodes to show before collapsing the rest behind a "show more" pill. */
  maxVisible?: number;
}

// Layout constants — tuned to read as a compact, winding map instead of one
// tall straight column. Node size shrinks for anything that isn't the
// current lesson, so the eye lands on the active one instead of a wall of
// identical circles.
const CONTAINER_WIDTH = 300;
const STEP_Y = 74;
const ACTIVE_LABEL_EXTRA = 46;
const NODE_SIZE_LOCKED = 46;
const NODE_SIZE_DONE = 48;
const NODE_SIZE_ACTIVE = 62;
// Same amplitude shape as before, just centered on the narrower container.
const OFFSET_PATTERN = [-24, 34, -34, 20, -14, 30, -30, 14, -20, 26, -26, 10];

function nodeSize(isActive: boolean, isCompleted: boolean) {
  return isActive ? NODE_SIZE_ACTIVE : isCompleted ? NODE_SIZE_DONE : NODE_SIZE_LOCKED;
}

// Smooth "S" curve through a sequence of points — the standard trick is to
// use each point's own x as its Bezier control-point x and the vertical
// midpoint between consecutive points as the control-point y, which keeps
// the curve monotonic top-to-bottom while still flowing left-right.
function buildCurvePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function LessonPath({ lessons, maxVisible = 5 }: LessonPathProps) {
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const [shown, setShown] = useState(maxVisible);

  const visibleLessons = lessons.slice(0, shown);
  const activeIndex = visibleLessons.findIndex((lesson) => !lesson.completed && !lesson.locked);

  const handleClick = (lesson: any) => {
    if (lesson.locked) {
      toast.info(isPT ? "Complete a licao anterior primeiro!" : "Complete the previous lesson first!");
      return;
    }
    nav({ to: `/lesson/${lesson.id}` as any });
  };

  // Precompute every node's center (x, y) once so the SVG curve and the
  // node buttons agree pixel-for-pixel — flexbox + a separately-drawn line
  // is how the old version drifted apart (and how the zigzag transform got
  // silently dropped by Framer Motion's own transform management).
  const { points, containerHeight } = useMemo(() => {
    const center = CONTAINER_WIDTH / 2;
    let y = 40;
    const pts = visibleLessons.map((lesson, i) => {
      const isActive = i === activeIndex;
      const x = center + OFFSET_PATTERN[i % OFFSET_PATTERN.length];
      const point = { x, y, size: nodeSize(isActive, lesson.completed), isActive };
      y += STEP_Y + (isActive ? ACTIVE_LABEL_EXTRA : 0);
      return point;
    });
    return { points: pts, containerHeight: y + 40 };
  }, [visibleLessons, activeIndex]);

  const fullPathD = useMemo(() => buildCurvePath(points), [points]);
  const progressPathD = useMemo(() => {
    const cutoff = activeIndex === -1 ? points.length : activeIndex + 1;
    return buildCurvePath(points.slice(0, cutoff));
  }, [points, activeIndex]);

  const remaining = lessons.length - shown;

  return (
    <div
      className="progress-path"
      style={{ width: `min(100%, ${CONTAINER_WIDTH}px)`, margin: "0 auto", position: "relative" }}
    >
      <svg
        width={CONTAINER_WIDTH}
        height={containerHeight}
        viewBox={`0 0 ${CONTAINER_WIDTH} ${containerHeight}`}
        style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 0 }}
        aria-hidden="true"
      >
        <path d={fullPathD} className="path-curve path-curve-locked" fill="none" />
        {progressPathD && <path d={progressPathD} className="path-curve path-curve-done" fill="none" />}
      </svg>

      <div style={{ position: "relative", height: containerHeight, zIndex: 1 }}>
        {visibleLessons.map((lesson, i) => {
          const isActive = i === activeIndex;
          const isCompleted = lesson.completed;
          const isLocked = lesson.locked;
          const CategoryIcon = CATEGORY_ICONS[lesson.category] || Book;
          const { x, y, size } = points[i];

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.035, type: "spring", bounce: 0.36 }}
              style={{
                position: "absolute",
                left: x,
                top: y,
                x: "-50%",
                y: "-50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => handleClick(lesson)}
                className={`path-node animated-container ${
                  isActive ? "path-node-active" : isCompleted ? "path-node-completed" : "path-node-locked"
                }`}
                style={{ width: `${size}px`, height: `${size}px` }}
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
                  <Star size={isActive ? 26 : 18} color="currentColor" />
                ) : isLocked ? (
                  <Lock size={isActive ? 22 : 16} color="var(--text-soft)" />
                ) : (
                  <CategoryIcon size={isActive ? 26 : 18} color="currentColor" />
                )}
              </button>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: "8px",
                    textAlign: "center",
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
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
          );
        })}
      </div>

      {remaining > 0 && (
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
          <button
            className="path-more-pill path-more-pill-button"
            onClick={() => setShown((s) => Math.min(lessons.length, s + maxVisible))}
          >
            +{remaining} {isPT ? "licoes disponiveis" : "lessons available"}
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
