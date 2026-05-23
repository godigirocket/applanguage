// src/components/Logo.tsx
export function LumeLogo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  const blockSize = size * 1.4;
  const fontSize = size * 1.6;
  const subSize = size * 0.28;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* Monogram Block */}
      <div
        style={{
          width: blockSize,
          height: blockSize,
          borderRadius: `${size * 0.36}px`,
          background: "linear-gradient(145deg, #2D4A3E 0%, #1B3A4B 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(29,58,75,0.30), 0 2px 8px rgba(0,0,0,0.12)",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle inner glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.10) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* L monogram */}
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: fontSize,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 12px rgba(0,0,0,0.22)",
            marginBottom: size * 0.02,
          }}
        >
          L
        </div>
        {/* LUME wordmark below L */}
        <div
          style={{
            fontSize: subSize,
            fontWeight: 800,
            color: "#C4714A",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            lineHeight: 1,
            marginTop: `-${size * 0.12}px`,
          }}
        >
          LUME
        </div>
      </div>

      {/* Wordmark & Tagline */}
      {showText && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: size * 0.58,
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Lume
          </div>
          {size >= 32 && (
            <div
              style={{
                fontSize: size * 0.22,
                color: "var(--text-secondary)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                lineHeight: 1,
                marginTop: "3px",
              }}
            >
              Learn · Play · Grow
            </div>
          )}
        </div>
      )}
    </div>
  );
}
