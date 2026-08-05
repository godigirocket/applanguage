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

export function Mascot({ state = "idle", size = 96 }: MascotProps) {
  const bounce = state === "celebrating" || state === "correct";

  return (
    <span
      className={`lume-companion lume-companion-${state}`}
      role="img"
      aria-label={`Lume companion: ${state}`}
      style={{
        width: size,
        height: size,
        animation: bounce
          ? "mascot-bounce 0.6s ease-in-out infinite"
          : "mascot-idle 3.2s ease-in-out infinite",
      }}
    >
      <img src="/brand/lume-companion.png" alt="" draggable={false} />
      <span className="lume-companion-glow" aria-hidden="true" />
    </span>
  );
}
