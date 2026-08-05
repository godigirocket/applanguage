interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
}

export function Logo({ size = 40, className = "", withText = true }: LogoProps) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{ textDecoration: "none", flexShrink: 0 }}
    >
      <img
        src="/brand/lume-logo-mark.png"
        alt="Lume"
        className="lume-logo-mark"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }}
      />

      {withText && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 900,
              fontSize: Math.round(size * 0.5),
              letterSpacing: 0,
              color: "var(--brand)",
              lineHeight: 1.1,
            }}
          >
            Lume
          </span>
          {size >= 32 && (
            <span
              className="lume-logo-tagline"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: Math.max(8, Math.round(size * 0.18)),
                color: "var(--text-secondary)",
                letterSpacing: 0,
                textTransform: "uppercase",
                fontWeight: 800,
                lineHeight: 1,
                marginTop: "2px",
              }}
            >
              Learn. Play. Grow.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
