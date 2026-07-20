import { motion } from "framer-motion";

interface LumeAvatarProps {
  size?: number;
  animated?: boolean;
  glow?: boolean;
  variant?: "default" | "happy" | "celebrate";
}

/**
 * Compact Lume firefly mascot avatar.
 * Renders as a circular SVG avatar — perfect for small avatars in cards/headers.
 * Inspired by the LumiMascot used in the lesson player.
 */
export function LumeAvatar({
  size = 44,
  animated = true,
  glow = true,
  variant = "default",
}: LumeAvatarProps) {
  const glowColor =
    variant === "celebrate" ? "#FF6B35" : variant === "happy" ? "#4CAF50" : "#F4B34A";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #F4F1EA 0%, #E2D4B7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: glow
          ? `0 4px 14px rgba(244,179,74,0.25), inset 0 -4px 8px rgba(244,179,74,0.15)`
          : "none",
      }}
    >
      <motion.svg
        width={size * 0.85}
        height={size * 0.85}
        viewBox="0 0 100 100"
        fill="none"
        animate={animated ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id={`fireflyGlow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.9" />
            <stop offset="60%" stopColor={glowColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow tail */}
        <motion.circle
          cx="50"
          cy="68"
          r="22"
          fill={`url(#fireflyGlow-${size})`}
          animate={animated ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body */}
        <circle cx="50" cy="52" r="22" fill="#FAFAF5" stroke="#D4C5A9" strokeWidth="1.5" />

        {/* Ears */}
        <ellipse cx="38" cy="32" rx="5" ry="9" fill="#FAFAF5" stroke="#D4C5A9" strokeWidth="1.5" transform="rotate(-15 38 32)" />
        <ellipse cx="62" cy="32" rx="5" ry="9" fill="#FAFAF5" stroke="#D4C5A9" strokeWidth="1.5" transform="rotate(15 62 32)" />

        {/* Inner ears */}
        <ellipse cx="38" cy="34" rx="2.5" ry="5" fill="#F4B34A" opacity="0.6" transform="rotate(-15 38 34)" />
        <ellipse cx="62" cy="34" rx="2.5" ry="5" fill="#F4B34A" opacity="0.6" transform="rotate(15 62 34)" />

        {/* Eyes */}
        <circle cx="42" cy="50" r="3" fill="#1C1C1A" />
        <circle cx="58" cy="50" r="3" fill="#1C1C1A" />

        {/* Eye highlights */}
        <circle cx="43" cy="49" r="1" fill="#fff" />
        <circle cx="59" cy="49" r="1" fill="#fff" />

        {/* Cute smile */}
        <path d="M44 58 Q50 62 56 58" stroke="#1C1C1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </motion.svg>
    </div>
  );
}
