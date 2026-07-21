import { motion } from "framer-motion";
import type { LessonTopic } from "@/lib/language-content";

interface Palette {
  a: string;
  b: string;
  c: string;
}

// Minimalist, low-saturation blob palettes per topic — chosen to stay calm
// and legible behind real content (never full-strength color), while still
// giving each topic/lesson a distinct visual mood.
const PALETTES: Record<LessonTopic, Palette> = {
  travel: { a: "#BFE3F5", b: "#FCEFD0", c: "#E4F3EA" },
  food: { a: "#FBE0C4", b: "#FFF3D6", c: "#F6CFC0" },
  business: { a: "#D6E0F0", b: "#EDE7D9", c: "#C9D6E8" },
  technology: { a: "#CFE0F7", b: "#E3D9F7", c: "#D2ECF2" },
  health: { a: "#D3EEDD", b: "#E9F6E1", c: "#CDE8E6" },
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

interface TopicScenarioProps {
  topic: LessonTopic;
  intensity?: "subtle" | "normal";
}

/**
 * Full-bleed ambient background: three soft blurred blobs in a topic-specific
 * palette, drifting slowly. Fixed to the viewport (not the page's full
 * scroll height) so the percentage-based blob offsets below stay anchored to
 * what's actually visible — on long scrolling pages an absolutely-positioned
 * wrapper spanning the whole document pushes "top: -10%" far off-screen.
 */
export function TopicScenario({ topic, intensity = "normal" }: TopicScenarioProps) {
  const palette = PALETTES[topic] ?? PALETTES.daily;
  const opacity = intensity === "subtle" ? 0.35 : 0.55;

  return (
    <div
      aria-hidden="true"
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
          top: "-10%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: "560px",
          maxHeight: "560px",
          borderRadius: "50%",
          background: palette.a,
          filter: "blur(70px)",
          opacity,
        }}
        animate={{ x: [0, 30, -10, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: "-15%",
          width: "45vw",
          height: "45vw",
          maxWidth: "480px",
          maxHeight: "480px",
          borderRadius: "50%",
          background: palette.b,
          filter: "blur(80px)",
          opacity,
        }}
        animate={{ x: [0, -25, 15, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "20%",
          width: "40vw",
          height: "40vw",
          maxWidth: "420px",
          maxHeight: "420px",
          borderRadius: "50%",
          background: palette.c,
          filter: "blur(75px)",
          opacity,
        }}
        animate={{ x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
