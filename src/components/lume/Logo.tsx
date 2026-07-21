import React from "react";

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
      {/* Watercolor globe image */}
      <img
        src="/logo.png"
        alt="Lume"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: "12px",
          flexShrink: 0,
          display: "block",
        }}
      />

      {/* Wordmark */}
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
              fontWeight: 800,
              fontSize: Math.round(size * 0.5),
              letterSpacing: "0.04em",
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
                fontFamily: "DM Sans, sans-serif",
                fontSize: Math.max(8, Math.round(size * 0.2)),
                color: "var(--text-secondary)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
                lineHeight: 1,
                marginTop: "2px",
              }}
            >
              Learn · Play · Grow
            </span>
          )}
        </div>
      )}
    </div>
  );
}
