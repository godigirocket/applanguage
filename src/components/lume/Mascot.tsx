export type MascotState =
  | "idle"
  | "happy"
  | "thinking"
  | "correct"
  | "wrong"
  | "celebrating"
  | "sleepy"
  | "listening"
  | "speaking";

interface MascotProps {
  state?: MascotState;
  size?: number;
}

/** Friendly SVG blob mascot — pure shapes, no external assets, cheap to animate via CSS. */
export function Mascot({ state = "idle", size = 96 }: MascotProps) {
  const eyes = renderEyes(state);
  const mouth = renderMouth(state);
  const bounce = state === "celebrating" || state === "correct";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Lume mascot: ${state}`}
      style={{
        animation: bounce ? "mascot-bounce 0.6s ease-in-out infinite" : "mascot-idle 3.2s ease-in-out infinite",
      }}
    >
      <defs>
        <linearGradient id="mascot-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9466" />
          <stop offset="100%" stopColor="#FF7A45" />
        </linearGradient>
      </defs>

      {/* ears */}
      <circle cx="30" cy="34" r="14" fill="#FF7A45" opacity="0.9" />
      <circle cx="90" cy="34" r="14" fill="#FF7A45" opacity="0.9" />

      {/* body */}
      <circle cx="60" cy="66" r="46" fill="url(#mascot-body)" />

      {/* cheeks */}
      <circle cx="34" cy="74" r="7" fill="#ffffff" opacity="0.25" />
      <circle cx="86" cy="74" r="7" fill="#ffffff" opacity="0.25" />

      {eyes}
      {mouth}

      {state === "thinking" && (
        <g opacity="0.9">
          <circle cx="96" cy="30" r="3" fill="#94A3B8" />
          <circle cx="103" cy="20" r="4" fill="#94A3B8" />
          <circle cx="112" cy="8" r="5" fill="#94A3B8" />
        </g>
      )}

      {state === "listening" && (
        <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M14 60 Q8 66 14 72" />
          <path d="M106 60 Q112 66 106 72" />
        </g>
      )}

      {state === "sleepy" && (
        <text x="90" y="26" fontSize="16" fill="#94A3B8" fontWeight="700">
          z
        </text>
      )}
    </svg>
  );
}

function renderEyes(state: MascotState) {
  if (state === "wrong") {
    return (
      <g stroke="#1c1c1a" strokeWidth="3" strokeLinecap="round">
        <path d="M40 58 L48 66 M48 58 L40 66" />
        <path d="M72 58 L80 66 M80 58 L72 66" />
      </g>
    );
  }
  if (state === "sleepy") {
    return (
      <g stroke="#1c1c1a" strokeWidth="3" strokeLinecap="round">
        <path d="M38 62 Q44 66 50 62" />
        <path d="M70 62 Q76 66 82 62" />
      </g>
    );
  }
  if (state === "celebrating" || state === "correct" || state === "happy") {
    return (
      <g stroke="#1c1c1a" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M38 64 Q44 56 50 64" />
        <path d="M70 64 Q76 56 82 64" />
      </g>
    );
  }
  // idle / thinking / listening / speaking: simple dot eyes
  return (
    <g fill="#1c1c1a">
      <circle cx="44" cy="62" r="5" />
      <circle cx="76" cy="62" r="5" />
    </g>
  );
}

function renderMouth(state: MascotState) {
  switch (state) {
    case "wrong":
      return <path d="M46 84 Q60 76 74 84" stroke="#1c1c1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />;
    case "celebrating":
    case "correct":
      return <path d="M42 80 Q60 100 78 80" stroke="#1c1c1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />;
    case "speaking":
      return <ellipse cx="60" cy="86" rx="9" ry="7" fill="#1c1c1a" />;
    case "sleepy":
      return <ellipse cx="60" cy="84" rx="5" ry="3" fill="#1c1c1a" />;
    case "thinking":
      return <circle cx="64" cy="84" r="4" fill="#1c1c1a" />;
    default:
      return <path d="M46 80 Q60 90 74 80" stroke="#1c1c1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />;
  }
}
