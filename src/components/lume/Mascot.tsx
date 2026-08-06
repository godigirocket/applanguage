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

export function Mascot({ state = "idle", size = 64 }: MascotProps) {
  const bounce = state === "celebrating" || state === "correct";

  return (
    <span
      role="img"
      aria-label={`Lume: ${state}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        animation: bounce
          ? "mascot-bounce 0.6s ease-in-out infinite"
          : undefined,
      }}
    >
      <img
        src="/brand/lume-companion.png"
        alt=""
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
