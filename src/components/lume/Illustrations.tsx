import React from "react";

// ============================================================
// LUME SVG ILLUSTRATION LIBRARY — 30 inline abstract SVGs
// All use only 2 brand colors at most. Stroke-based, minimal.
// ============================================================

interface IllustrationProps {
  size?: number;
  primary?: string;
  secondary?: string;
  style?: React.CSSProperties;
}

const def = (primary = "var(--brand)", secondary = "var(--accent)") => ({ primary, secondary });

// 1. Globe / World
export function IlluGlobe({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <circle cx="24" cy="24" r="18" stroke={primary} strokeWidth="1.5" />
      <ellipse
        cx="24"
        cy="24"
        rx="8"
        ry="18"
        stroke={primary}
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity=".6"
      />
      <path d="M6 24h36M8 14h32M8 34h32" stroke={primary} strokeWidth="1" opacity=".4" />
      <circle cx="38" cy="10" r="5" fill={secondary} opacity=".25" />
      <path d="M36 10l1.5 1.5L40 8" stroke={secondary} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 2. Microphone
export function IlluMic({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <rect x="17" y="8" width="14" height="20" rx="7" stroke={primary} strokeWidth="1.5" />
      <path d="M10 26a14 14 0 0 0 28 0" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <line
        x1="24"
        y1="40"
        x2="24"
        y2="46"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="46"
        x2="32"
        y2="46"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="18" r="3" fill={secondary} opacity=".4" />
    </svg>
  );
}

// 3. Book / Open book
export function IlluBook({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 12 C24 12 14 10 8 14v24c6-4 16-2 16-2V12Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".06"
      />
      <path
        d="M24 12 C24 12 34 10 40 14v24c-6-4-16-2-16-2V12Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".06"
      />
      <line x1="24" y1="12" x2="24" y2="36" stroke={secondary} strokeWidth="1.5" />
    </svg>
  );
}

// 4. Headphones
export function IlluHeadphones({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M8 26c0-8.8 7.2-16 16-16s16 7.2 16 16"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="26"
        width="8"
        height="14"
        rx="4"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".1"
      />
      <rect
        x="34"
        y="26"
        width="8"
        height="14"
        rx="4"
        stroke={primary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".1"
      />
    </svg>
  );
}

// 5. Speech bubbles
export function IlluChat({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M6 10h26a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H14l-8 5v-5-3A3 3 0 0 1 6 10Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".06"
      />
      <path
        d="M18 26h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2l-4 4v-4H18a3 3 0 0 1-3-3V29a3 3 0 0 1 3-3Z"
        stroke={secondary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".06"
      />
    </svg>
  );
}

// 6. Star / Achievement
export function IlluStar({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6l4.5 12 13 1-10 9.5 3 13-10.5-6.5L14 41.5l3-13-10-9.5 13-1Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".1"
      />
      <circle cx="24" cy="24" r="5" fill={secondary} opacity=".5" />
    </svg>
  );
}

// 7. Trophy
export function IlluTrophy({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M14 8h20v16a10 10 0 0 1-20 0V8Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".08"
      />
      <path d="M8 12H14M34 12h6" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="34" x2="24" y2="42" stroke={primary} strokeWidth="1.5" />
      <line
        x1="14"
        y1="42"
        x2="34"
        y2="42"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 8. Lightning / Zap
export function IlluZap({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M28 4L10 26h16L20 44l22-24H26L28 4Z"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={secondary}
        fillOpacity=".15"
      />
    </svg>
  );
}

// 9. Calendar / Daily
export function IlluCalendar({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <rect
        x="6"
        y="10"
        width="36"
        height="32"
        rx="4"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".05"
      />
      <path d="M6 20h36" stroke={primary} strokeWidth="1" opacity=".5" />
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="14"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="6"
        x2="32"
        y2="14"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="20" y="26" width="8" height="8" rx="2" fill={secondary} opacity=".5" />
    </svg>
  );
}

// 10. Music note
export function IlluMusic({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path d="M20 36V14l24-4v22" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <circle
        cx="16"
        cy="36"
        r="6"
        stroke={primary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".15"
      />
      <circle
        cx="40"
        cy="32"
        r="6"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".1"
      />
    </svg>
  );
}

// 11. Map pin / Travel
export function IlluMapPin({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6a14 14 0 0 1 14 14c0 10-14 28-14 28S10 30 10 20A14 14 0 0 1 24 6Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".08"
      />
      <circle
        cx="24"
        cy="20"
        r="6"
        stroke={secondary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".2"
      />
    </svg>
  );
}

// 12. Flame / Streak
export function IlluFlame({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6c0 0-12 12-12 22a12 12 0 0 0 24 0C36 18 24 6 24 6Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".1"
      />
      <path
        d="M24 24c0 0-6 4-6 8a6 6 0 0 0 12 0C30 28 24 24 24 24Z"
        stroke={secondary}
        strokeWidth="1"
        fill={secondary}
        fillOpacity=".2"
      />
    </svg>
  );
}

// 13. Diamond / Premium
export function IlluDiamond({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6l18 14-18 22L6 20Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".08"
      />
      <path d="M6 20h36" stroke={secondary} strokeWidth="1" opacity=".5" />
      <path d="M14 12l6 8M34 12l-6 8" stroke={primary} strokeWidth="1" opacity=".5" />
    </svg>
  );
}

// 14. Compass
export function IlluCompass({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <circle cx="24" cy="24" r="18" stroke={primary} strokeWidth="1.5" />
      <path d="M24 12v4M24 32v4M12 24h4M32 24h4" stroke={primary} strokeWidth="1" opacity=".5" />
      <path
        d="M24 16l-5 16 5-5 5 5Z"
        stroke={secondary}
        strokeWidth="1.2"
        fill={secondary}
        fillOpacity=".3"
      />
    </svg>
  );
}

// 15. Puzzle piece
export function IlluPuzzle({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <rect
        x="8"
        y="8"
        width="14"
        height="14"
        rx="2"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".07"
      />
      <path d="M22 13a4 4 0 0 1 4 0" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
      <rect
        x="26"
        y="8"
        width="14"
        height="14"
        rx="2"
        stroke={secondary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".07"
      />
      <rect
        x="8"
        y="26"
        width="14"
        height="14"
        rx="2"
        stroke={secondary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".07"
      />
      <path d="M13 22a4 4 0 0 0 0 4" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <rect
        x="26"
        y="26"
        width="14"
        height="14"
        rx="2"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".07"
      />
    </svg>
  );
}

// 16. Infinity / Flow
export function IlluInfinity({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M8 24c0-6 4.5-10 10-10s10 10 16 10 10-4 10-10-4.5-10-10-10-10 10-16 10-10 4-10 10Z"
        stroke={primary}
        strokeWidth="1.5"
      />
      <circle cx="18" cy="24" r="3" fill={secondary} opacity=".5" />
      <circle cx="30" cy="24" r="3" fill={primary} opacity=".3" />
    </svg>
  );
}

// 17. Language / ABC
export function IlluABC({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <text
        x="4"
        y="30"
        fontFamily="serif"
        fontSize="24"
        fontWeight="800"
        fill={primary}
        opacity=".7"
      >
        A
      </text>
      <text
        x="18"
        y="32"
        fontFamily="serif"
        fontSize="20"
        fontWeight="700"
        fill={secondary}
        opacity=".6"
      >
        B
      </text>
      <text
        x="30"
        y="34"
        fontFamily="serif"
        fontSize="16"
        fontWeight="600"
        fill={primary}
        opacity=".5"
      >
        C
      </text>
    </svg>
  );
}

// 18. Certificate / Badge
export function IlluBadge({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <circle
        cx="24"
        cy="20"
        r="12"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".06"
      />
      <path d="M18 34l6 8 6-8" stroke={secondary} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 22l4 4 7-7" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 19. Wave / Audio
export function IlluWave({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M4 24 C8 16 12 32 16 24 C20 16 24 32 28 24 C32 16 36 32 40 24 C42 20 44 24 44 24"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 30 C8 26 12 34 16 30 C20 26 24 34 28 30"
        stroke={secondary}
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  );
}

// 20. Clock / Timer
export function IlluClock({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <circle cx="24" cy="24" r="18" stroke={primary} strokeWidth="1.5" />
      <path
        d="M24 12v12l8 6"
        stroke={secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="2" fill={primary} />
    </svg>
  );
}

// 21. Pen / Write
export function IlluPen({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M32 8l8 8-24 24H8v-8Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".06"
      />
      <path d="M28 12l8 8" stroke={secondary} strokeWidth="1.5" />
      <path d="M8 40l4-4" stroke={secondary} strokeWidth="1" opacity=".5" />
    </svg>
  );
}

// 22. Network / Community
export function IlluNetwork({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <circle cx="24" cy="12" r="6" stroke={primary} strokeWidth="1.5" />
      <circle cx="8" cy="36" r="6" stroke={secondary} strokeWidth="1.5" />
      <circle cx="40" cy="36" r="6" stroke={secondary} strokeWidth="1.5" />
      <path d="M20 16L10 32M28 16L38 32M14 36h20" stroke={primary} strokeWidth="1" opacity=".5" />
    </svg>
  );
}

// 23. Sprout / Growth
export function IlluSprout({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <line
        x1="24"
        y1="44"
        x2="24"
        y2="18"
        stroke={primary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 30 C24 30 16 26 14 18 C18 18 24 22 24 30Z"
        stroke={primary}
        strokeWidth="1"
        fill={primary}
        fillOpacity=".12"
      />
      <path
        d="M24 24 C24 24 32 20 34 12 C30 12 24 16 24 24Z"
        stroke={secondary}
        strokeWidth="1"
        fill={secondary}
        fillOpacity=".12"
      />
    </svg>
  );
}

// 24. Palette / Art
export function IlluPalette({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6C14 6 6 14 6 24s8 18 18 18c2 0 4-2 4-4s-1-2-1-4c0-3 2-6 6-6 1 0 3 0 4 1a18 18 0 0 0 5-11A18 18 0 0 0 24 6Z"
        stroke={primary}
        strokeWidth="1.5"
      />
      <circle cx="14" cy="22" r="2.5" fill={secondary} opacity=".7" />
      <circle cx="22" cy="12" r="2.5" fill={primary} opacity=".7" />
      <circle cx="32" cy="14" r="2.5" fill={secondary} opacity=".5" />
    </svg>
  );
}

// 25. Crown
export function IlluCrown({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M6 34L12 16l12 12 12-12 6 18H6Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".08"
      />
      <line
        x1="6"
        y1="38"
        x2="42"
        y2="38"
        stroke={secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="16" r="3" fill={secondary} opacity=".6" />
    </svg>
  );
}

// 26. Rocket
export function IlluRocket({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6 C34 6 40 16 40 26H8C8 16 14 6 24 6Z"
        stroke={primary}
        strokeWidth="1.5"
        fill={primary}
        fillOpacity=".08"
      />
      <path d="M8 26l-4 8 8-4M40 26l4 8-8-4" stroke={secondary} strokeWidth="1.2" />
      <rect x="19" y="26" width="10" height="14" rx="2" stroke={primary} strokeWidth="1.5" />
      <circle
        cx="24"
        cy="18"
        r="4"
        stroke={secondary}
        strokeWidth="1"
        fill={secondary}
        fillOpacity=".2"
      />
    </svg>
  );
}

// 27. Eye / Observe
export function IlluEye({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M6 24C6 24 12 12 24 12s18 12 18 12-6 12-18 12S6 24 6 24Z"
        stroke={primary}
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="6"
        stroke={secondary}
        strokeWidth="1.5"
        fill={secondary}
        fillOpacity=".15"
      />
      <circle cx="24" cy="24" r="2" fill={primary} />
    </svg>
  );
}

// 28. Sparkles / Magic
export function IlluSparkles({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path
        d="M24 6l3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"
        stroke={primary}
        strokeWidth="1.2"
        fill={primary}
        fillOpacity=".1"
      />
      <path
        d="M38 30l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5Z"
        stroke={secondary}
        strokeWidth="1"
        fill={secondary}
        fillOpacity=".15"
      />
      <path
        d="M10 36l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"
        stroke={secondary}
        strokeWidth="1"
        fill={secondary}
        fillOpacity=".15"
      />
    </svg>
  );
}

// 29. Progress bars / Chart
export function IlluChart({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <rect x="6" y="30" width="8" height="12" rx="2" fill={secondary} opacity=".5" />
      <rect x="20" y="20" width="8" height="22" rx="2" fill={primary} opacity=".5" />
      <rect x="34" y="12" width="8" height="30" rx="2" fill={primary} opacity=".8" />
      <path d="M6 42h36" stroke={primary} strokeWidth="1" opacity=".3" />
    </svg>
  );
}

// 30. Signal / Antenna
export function IlluSignal({
  size = 48,
  primary = "var(--brand)",
  secondary = "var(--accent)",
  style,
}: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <path d="M12 36a17 17 0 0 1 0-24" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 36a17 17 0 0 0 0-24" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 30a9 9 0 0 1 0-12" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 30a9 9 0 0 0 0-12" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill={secondary} />
    </svg>
  );
}

// Category icon map for lessons
export const CATEGORY_ILLUSTRATIONS: Record<string, React.FC<IllustrationProps>> = {
  grammar: IlluPen,
  vocabulary: IlluABC,
  listening: IlluHeadphones,
  speaking: IlluMic,
  culture: IlluGlobe,
  music: IlluMusic,
  travel: IlluMapPin,
  professional: IlluBadge,
  idioms: IlluChat,
  all: IlluSparkles,
  default: IlluBook,
};

export function CategoryIllustration({ category, size = 40 }: { category: string; size?: number }) {
  const Comp = CATEGORY_ILLUSTRATIONS[category] || CATEGORY_ILLUSTRATIONS.default;
  return <Comp size={size} />;
}

// ============================================================
// LUME ASSET LOADER (CDN 3D / Fallback System)
// ============================================================
export interface LumeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: keyof typeof CATEGORY_ILLUSTRATIONS | React.ReactNode;
  fallbackSize?: number;
  fallbackStyle?: React.CSSProperties;
}

export function LumeImage({
  src,
  alt,
  fallback,
  className,
  style,
  fallbackSize = 48,
  fallbackStyle,
  ...props
}: LumeImageProps) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    setError(false);
    setLoaded(false);

    if (!src) {
      setError(true);
      return;
    }

    // Check if the image is already fully loaded from cache
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }

    // 2-second timeout to trigger SVG fallback
    const timer = setTimeout(() => {
      if (imgRef.current && !imgRef.current.complete) {
        console.warn(`LumeImage: Timeout loading ${src}. Triggering SVG fallback.`);
        setError(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [src]);

  if (error || !src) {
    if (typeof fallback === "string" && CATEGORY_ILLUSTRATIONS[fallback]) {
      const FallbackComp = CATEGORY_ILLUSTRATIONS[fallback];
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...style,
            ...fallbackStyle,
          }}
          className={className}
        >
          <FallbackComp size={fallbackSize} />
        </div>
      );
    }
    if (React.isValidElement(fallback)) {
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...style,
            ...fallbackStyle,
          }}
          className={className}
        >
          {fallback}
        </div>
      );
    }
    // Default fallback
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
          ...fallbackStyle,
        }}
        className={className}
      >
        <IlluGlobe size={fallbackSize} />
      </div>
    );
  }

  return (
    <img
      {...props}
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
      onLoad={(e) => {
        setLoaded(true);
        props.onLoad?.(e);
      }}
      onError={(e) => {
        setError(true);
        props.onError?.(e);
      }}
    />
  );
}
