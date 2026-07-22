import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LessonTopic } from "@/lib/language-content";

interface Palette {
  a: string;
  b: string;
  c: string;
}

// Minimalist, low-saturation blob palettes per topic — chosen to stay calm
// and legible behind real content (never full-strength color), while still
// giving each topic/lesson a distinct visual mood. These are the light-theme
// values; toDarkVariant() derives a deeper, glow-on-navy version for dark
// mode instead of a second hand-authored palette set.
const PALETTES: Record<LessonTopic, Palette> = {
  travel: { a: "#BFE3F5", b: "#FCEFD0", c: "#E4F3EA" },
  food: { a: "#FBE0C4", b: "#FFF3D6", c: "#F6CFC0" },
  business: { a: "#D6E0F0", b: "#EDE7D9", c: "#C9D6E8" },
  technology: { a: "#CFE0F7", b: "#E3D9F7", c: "#D2ECF2" },
  health: { a: "#CDE6E8", b: "#E9F0F6", c: "#D6E2EE" },
  sports: { a: "#FBD6C9", b: "#FCE7C6", c: "#F5C6C6" },
  fitness: { a: "#FAD4CE", b: "#FBE3D0", c: "#F2C9D6" },
  culture: { a: "#F3DCC2", b: "#F0E3C8", c: "#E8CBAE" },
  grammar: { a: "#E1D8F0", b: "#EDE4F5", c: "#D9DCF0" },
  pronunciation: { a: "#CBEAE8", b: "#DFF3EE", c: "#C7DCEA" },
  listening: { a: "#D6D9F5", b: "#E5E1F5", c: "#CFDCF0" },
  shopping: { a: "#F6D6E3", b: "#FCE7EE", c: "#EAD3E8" },
  daily: { a: "#E8E4D6", b: "#F1EFE4", c: "#DCE6D9" },
  family: { a: "#FBE7C6", b: "#FCF0D8", c: "#F2DCC4" },
  work: { a: "#D8DEE8", b: "#E7E9EE", c: "#CBD4E0" },
};

// Sub-scene labels per topic, used only to derive a stable variant count —
// stepping through a lesson/topic rotates through these moods via seeded
// palette + layout jitter rather than needing bespoke illustrated art for
// each one (keeps this fully CSS/SVG, no images, no canvas).
const SCENARIO_VARIANTS: Record<LessonTopic, string[]> = {
  travel: ["airport", "city-map", "hotel", "train-station"],
  food: ["restaurant", "market", "kitchen", "coffee-shop"],
  sports: ["stadium", "gym", "running-track", "court"],
  fitness: ["gym", "yoga-room", "park-run", "home-workout"],
  business: ["office", "meeting-room", "presentation", "coworking"],
  culture: ["museum", "street-festival", "landmark", "gallery"],
  daily: ["bedroom", "street", "store", "home"],
  shopping: ["mall", "checkout", "clothing-store", "supermarket"],
  health: ["clinic", "pharmacy", "doctor-room", "wellness"],
  work: ["desk", "team-call", "office", "calendar"],
  family: ["living-room", "park", "family-table", "home"],
  technology: ["laptop", "app-screen", "server-room", "workspace"],
  grammar: ["notebook", "blackboard", "study-desk", "cards"],
  pronunciation: ["microphone", "sound-wave", "studio", "conversation"],
  listening: ["headphones", "podcast", "radio", "conversation"],
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// A "glow on navy" version of a light pastel: same hue, deeper and a touch
// more saturated so it reads as an ambient wash instead of washing out
// against the dark premium background.
function toDarkVariant(hex: string): string {
  const [h, s] = hexToHsl(hex);
  return hslToHex(h, Math.min(s + 15, 60), 26);
}

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(el.classList.contains("dark")));
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

interface TopicScenarioProps {
  topic: LessonTopic;
  intensity?: "subtle" | "normal";
  /** Varies the composition (palette shade + blob layout) within the topic's
   * mood family — pass the lesson id, or `${lessonId}-${stepIndex}` so the
   * scenery visibly shifts as the learner advances instead of staying static. */
  seed?: string | number;
}

/**
 * Full-bleed ambient background: three soft blurred blobs in a topic-specific
 * palette, drifting slowly. Fixed to the viewport (not the page's full
 * scroll height) so the percentage-based blob offsets below stay anchored to
 * what's actually visible — on long scrolling pages an absolutely-positioned
 * wrapper spanning the whole document pushes "top: -10%" far off-screen.
 */
export function TopicScenario({ topic, intensity = "normal", seed = topic }: TopicScenarioProps) {
  const isDark = useIsDarkMode();
  // framer-motion's `animate` prop runs its own rAF loop — it isn't a CSS
  // @keyframes animation, so the global prefers-reduced-motion override in
  // styles.css can't touch it. Respect it explicitly, and it doubles as a
  // real perf win: three permanently-animating large blur filters is
  // meaningful, continuous compositing cost on lower-end phones.
  const reduceMotion = useReducedMotion();
  const basePalette = PALETTES[topic] ?? PALETTES.daily;
  const palette = isDark
    ? {
        a: toDarkVariant(basePalette.a),
        b: toDarkVariant(basePalette.b),
        c: toDarkVariant(basePalette.c),
      }
    : basePalette;
  const opacity = intensity === "subtle" ? (isDark ? 0.5 : 0.35) : isDark ? 0.7 : 0.55;

  const variants = SCENARIO_VARIANTS[topic] ?? SCENARIO_VARIANTS.daily;
  const seedNum = hashString(`${topic}::${seed}`);
  const variantIndex = seedNum % variants.length;
  // Small deterministic jitter per variant so the three blobs don't sit in
  // the exact same spot lesson after lesson, without needing new art.
  const jitterX = ((seedNum % 17) - 8) * 1.2; // -9.6..9.6
  const jitterY = (((seedNum >> 3) % 17) - 8) * 1.2;
  const phase = (variantIndex / variants.length) * 6; // seconds, staggers the drift loop

  return (
    <div
      aria-hidden="true"
      data-scenario-variant={variants[variantIndex]}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: `calc(-10% + ${jitterY}px)`,
          left: `calc(-10% + ${jitterX}px)`,
          width: "55vw",
          height: "55vw",
          maxWidth: "560px",
          maxHeight: "560px",
          borderRadius: "50%",
          background: palette.a,
          filter: "blur(48px)",
          opacity,
          willChange: reduceMotion ? undefined : "transform",
        }}
        animate={reduceMotion ? undefined : { x: [0, 30, -10, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: phase }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: `calc(-15% + ${-jitterX}px)`,
          width: "45vw",
          height: "45vw",
          maxWidth: "480px",
          maxHeight: "480px",
          borderRadius: "50%",
          background: palette.b,
          filter: "blur(52px)",
          opacity,
          willChange: reduceMotion ? undefined : "transform",
        }}
        animate={reduceMotion ? undefined : { x: [0, -25, 15, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: phase }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: `calc(-15% + ${-jitterY}px)`,
          left: "20%",
          width: "40vw",
          height: "40vw",
          maxWidth: "420px",
          maxHeight: "420px",
          borderRadius: "50%",
          background: palette.c,
          filter: "blur(50px)",
          opacity,
          willChange: reduceMotion ? undefined : "transform",
        }}
        animate={reduceMotion ? undefined : { x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: phase }}
      />
    </div>
  );
}
