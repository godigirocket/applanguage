import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

interface MarketingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  delay?: number;
  accentColor?: string;
  disabled?: boolean;
}

export function MarketingCard({
  icon,
  title,
  description,
  cta,
  href,
  delay = 0,
  accentColor = "var(--brand)",
  disabled = false,
}: MarketingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(16px)",
        border: "1.5px solid var(--border)",
        borderRadius: "28px",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        cursor: disabled ? "default" : "pointer",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.25s, border-color 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          background: `radial-gradient(circle at 100% 0%, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon block */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: `${accentColor}15`,
          border: `1.5px solid ${accentColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accentColor,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "8px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            fontWeight: 500,
          }}
        >
          {description}
        </p>
      </div>

      {/* CTA */}
      {disabled ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--text-secondary)",
            marginTop: "auto",
            opacity: 0.6,
          }}
        >
          {cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6h7M7 3.5L9.5 6 7 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <Link
          to={href as any}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 800,
            color: accentColor,
            textDecoration: "none",
            marginTop: "auto",
            transition: "gap 0.18s",
          }}
          className="group"
        >
          {cta}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transition: "transform 0.18s" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as SVGSVGElement).style.transform = "translateX(3px)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as SVGSVGElement).style.transform = "translateX(0)")
            }
          >
            <path
              d="M2.5 6h7M7 3.5L9.5 6 7 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      )}
    </motion.div>
  );
}
