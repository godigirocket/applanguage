import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MarketingCard } from "./MarketingCard";

// Inline illustration SVGs — abstract, minimal, brand colors
function IllustrationAI() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 16 C6 10 10 6 16 6 C22 6 26 10 26 16 C26 22 22 26 16 26 C10 26 6 22 6 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.3" />
      <path
        d="M16 8V12M16 20V24M8 16H12M20 16H24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IllustrationCulture() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="5" ry="10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M6 16H26" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path
        d="M8 10H24M8 22H24"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function IllustrationChallenge() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M18 4L10 17H16L14 28L22 15H16L18 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}

function IllustrationCommunity() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="22" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="22" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 14C16 18 6 18.5 6 22M16 14C16 18 26 18.5 26 22"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

export function MarketingSection() {
  const { t } = useTranslation(["landing", "common"]);

  const cards = [
    {
      icon: <IllustrationAI />,
      title: t("landing:mktAITitle"),
      description: t("landing:mktAIDesc"),
      cta: t("landing:mktAICta"),
      href: "/login",
      accentColor: "var(--brand)",
      delay: 0,
    },
    {
      icon: <IllustrationCulture />,
      title: t("landing:mktCultureTitle"),
      description: t("landing:mktCultureDesc"),
      cta: t("landing:mktCultureCta"),
      href: "/culture",
      accentColor: "#1B3A4B",
      delay: 0.08,
    },
    {
      icon: <IllustrationChallenge />,
      title: t("landing:mktChallengeTitle"),
      description: t("landing:mktChallengeDesc"),
      cta: t("landing:mktChallengeCta"),
      href: "/home",
      accentColor: "var(--accent)",
      delay: 0.16,
    },
  ];

  return (
    <section 
      style={{ 
        maxWidth: "1120px", 
        margin: "0 auto", 
        padding: "80px 24px",
        position: "relative",
      }}
    >
      {/* Background image banner at the top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "32px",
          padding: "80px 48px",
          marginBottom: "64px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Dark overlay for readability */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(45,74,62,0.93) 0%, rgba(27,58,75,0.90) 100%)", zIndex: 0 }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "white",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            {t("landing:whyTitle")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "14px",
            }}
          >
            {t("landing:mktSectionTitle")}
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.95)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            {t("landing:mktSectionSubtitle")}
          </p>
        </div>
      </motion.div>

      {/* Cards grid — fixed 2×2 on desktop, 1-col on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
        className="marketing-grid"
      >
        {cards.map((card) => (
          <MarketingCard key={card.title} {...card} />
        ))}
      </div>

      {/* Bottom trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          marginTop: "64px",
          display: "flex",
          gap: "48px",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          { num: "10k+", label: t("landing:statStudents") },
          { num: "98%", label: t("landing:statSatisfaction") },
          { num: "3", label: t("landing:statLanguages") },
          { num: "500+", label: t("landing:statLessons") },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                fontWeight: 800,
                color: "var(--brand)",
                lineHeight: 1,
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginTop: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
