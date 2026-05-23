import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Animated number counter
export function AnimatedCounter({
  value,
  duration = 1.2,
  suffix = "",
  prefix = "",
  style,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, duration, motionVal, rounded]);

  return (
    <span style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// Animated SVG check mark drawing itself
export function AnimatedCheck({
  size = 24,
  color = "var(--brand)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M7 12l3 3 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

// Typing indicator (3 pulsing dots)
export function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "12px 16px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--text-secondary)",
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// Mic pulse ring
export function MicPulseRing({
  recording = false,
  size = 56,
}: {
  recording?: boolean;
  size?: number;
}) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {recording && (
        <>
          <motion.div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
            }}
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
            }}
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          />
        </>
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: recording
            ? "linear-gradient(135deg, var(--accent), var(--brand))"
            : "var(--brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: recording ? "0 0 20px rgba(196,113,74,0.4)" : "none",
          transition: "all 0.3s",
        }}
      >
        {/* Microphone SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="white" strokeWidth="1.5" />
          <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line
            x1="12"
            y1="17"
            x2="12"
            y2="22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="22"
            x2="16"
            y2="22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

// Star burst animation (for saving expressions)
export function StarBurst({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      initial={{ opacity: 1, scale: 0.5, y: 0 }}
      animate={{ opacity: 0, scale: 1.5, y: -60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4l2.5 8H28l-7 5 2.5 8-8-5.5-8 5.5 2.5-8-7-5h9.5Z"
          fill="#D4A23B"
          opacity=".9"
        />
      </svg>
    </motion.div>
  );
}

// Circular progress timer
export function CircularTimer({
  seconds,
  total,
  size = 60,
  color = "var(--accent)",
}: {
  seconds: number;
  total: number;
  size?: number;
  color?: string;
}) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / total) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--border)"
        strokeWidth="3"
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transition={{ duration: 0.3 }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: `rotate(90deg) translate(0, 0)`,
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
        fontSize="14"
        fontWeight="800"
        fill="var(--text-primary)"
      >
        {seconds}
      </text>
    </svg>
  );
}

// Card flip wrapper
export function FlipCard({
  front,
  back,
  flipped,
  height = 200,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  height?: number;
}) {
  return (
    <div style={{ perspective: "1000px", height }}>
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{front}</div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// Stagger entrance wrapper for lists
export function StaggerList({
  children,
  stagger = 0.08,
}: {
  children: React.ReactNode[];
  stagger?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}

// Audio wave bars (for speaking animation)
export function AudioWaveBars({ active = false, bars = 5 }: { active?: boolean; bars?: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center", height: "24px" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: "3px",
            borderRadius: "2px",
            background: "var(--brand)",
            transformOrigin: "bottom",
          }}
          animate={
            active ? { height: ["8px", `${14 + Math.random() * 10}px`, "8px"] } : { height: "4px" }
          }
          transition={
            active
              ? { duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
