import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { MessageCircle, Brain, Compass, Star, Flame } from "@/components/lume/CustomIcons";
import { MarketingSection } from "@/components/lume/MarketingSection";
import { LumeImage } from "@/components/lume/Illustrations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lume — Aprenda através de conversa, cultura e confiança" },
      {
        name: "description",
        content:
          "Prática de conversação com IA projetada como um complemento calmo e paciente para suas aulas particulares.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t, i18n } = useTranslation(["landing", "common"]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentLang = i18n.language || "pt";
  const mascotGreeting =
    {
      pt: "Olá! Sou o Lume. Que tal praticar um pouco hoje? Sem pressões!",
      en: "Hi! I'm Lume. How about practicing a bit today? No pressure!",
      es: "¡Hola! Soy Lume. ¿Qué tal practicar un poco hoy? ¡Sin presiones!",
    }[currentLang as "pt" | "en" | "es"] ||
    "Olá! Sou o Lume. Que tal praticar um pouco hoje? Sem pressões!";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(45,74,62,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(196,113,74,0.05) 0%, transparent 60%), var(--bg)",
        overflow: "hidden",
      }}
    >
      <AppHeader />
      <main style={{ animation: "pageEnter 0.6s ease forwards" }}>
        {/* Editorial Hero Layout (2 Columns) */}
        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "80px 24px 80px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* LEFT — text */}
          <div style={{ paddingRight: "20px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(45,74,62,0.08)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "24px",
                border: "1px solid rgba(45,74,62,0.1)",
              }}
            >
              Lume Platform
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
            >
              {t("landing:title")}
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: "32px 0 40px",
                maxWidth: "520px",
                fontWeight: 500,
              }}
            >
              {t("landing:subtitle")}
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
              <Link
                to="/signup"
                className="btn-premium"
                style={{
                  padding: "16px 36px",
                  borderRadius: "99px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {t("landing:ctaStart")}
              </Link>
              <Link
                to="/guest"
                className="btn-secondary-premium"
                style={{
                  padding: "16px 32px",
                  borderRadius: "99px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {t("landing:ctaTryFree")}
              </Link>
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              {t("landing:testimonial")}
            </p>
          </div>

          {/* RIGHT — live conversation preview card */}
          <div
            style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Mascot Lume */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "-90px",
                left: isMobile ? "12px" : "-70px",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: "16px",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "92px",
                  height: "92px",
                  borderRadius: "50%",
                  background: "var(--surface-raised)",
                  border: "2.5px solid var(--accent-green)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <LumeImage
                  src="/lume_mascot_hero.png"
                  alt="Lume Mascot"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  fallback="default"
                />
              </div>
              <div
                className="glass"
                style={{
                  padding: "10px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  border: "1.5px solid var(--border)",
                  maxWidth: "200px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  backdropFilter: "blur(10px)",
                  lineHeight: 1.4,
                  background: "rgba(255, 255, 255, 0.85)",
                }}
              >
                {mascotGreeting}
              </div>
            </motion.div>

            {/* Main card */}
            <div
              className="glass premium-shadow"
              style={{
                borderRadius: "32px",
                padding: "28px",
                border: "1.5px solid var(--border)",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* AI header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent-green), var(--accent-teal))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(45,74,62,0.2)",
                  }}
                >
                  <MessageCircle size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-primary)" }}>
                    Lume
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#4CAF50",
                        boxShadow: "0 0 8px #4CAF50AA",
                        animation: "pulse 2s infinite",
                      }}
                      className="animate-pulse"
                    />
                    <span
                      style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700 }}
                    >
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  className="glass"
                  style={{
                    padding: "14px 18px",
                    borderRadius: "4px 20px 20px 20px",
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    maxWidth: "88%",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  What did you do last weekend? Tell me — no pressure.
                </div>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "20px 20px 4px 20px",
                    background: "linear-gradient(135deg, var(--accent-green), var(--accent-teal))",
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "white",
                    maxWidth: "88%",
                    alignSelf: "flex-end",
                    boxShadow: "0 4px 12px rgba(45,74,62,0.15)",
                  }}
                >
                  I go to... a concert? My friend, she invite me last Saturday.
                </div>
                <div
                  className="glass"
                  style={{
                    padding: "14px 18px",
                    borderRadius: "4px 20px 20px 20px",
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    maxWidth: "88%",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  Love it! Small tip: "she <strong>invited</strong> me" — past tense. But your
                  meaning was totally clear. What kind of music?
                </div>
              </div>

              {/* Input */}
              <div
                style={{
                  padding: "12px 18px",
                  background: "var(--bg)",
                  borderRadius: "99px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1.5px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "14px", color: "#A8A8A0", flex: 1, fontWeight: 600 }}>
                  {t("common:search")}
                </span>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--accent-terra)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(196,109,75,0.3)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating XP badge */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: "4deg" }}
              style={{
                position: "absolute",
                top: "-18px",
                right: "-12px",
                zIndex: 3,
                background: "var(--surface-raised)",
                borderRadius: "18px",
                padding: "10px 16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1.5px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transform: "rotate(2.5deg)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-gold), #E5B84B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Star size={15} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 900, color: "var(--accent-green)" }}>
                  +15 XP
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>
                  Good session!
                </div>
              </div>
            </motion.div>

            {/* Floating streak — anchored to the main card, not leaking over word card */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: "-3deg" }}
              style={{
                position: "absolute",
                bottom: "-18px",
                left: "20px",
                zIndex: 4,
                background: "linear-gradient(135deg,#FF6B35,#FF8C42)",
                borderRadius: "16px",
                padding: "10px 16px",
                boxShadow: "0 10px 30px rgba(255,107,53,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transform: "rotate(-2deg)",
                cursor: "pointer",
              }}
            >
              <Flame size={18} color="white" fill="white" />
              <div style={{ fontSize: "13px", fontWeight: 900, color: "white" }}>
                5 days streak!
              </div>
            </motion.div>

            {/* Word card */}
            <div
              className="premium-shadow"
              style={{
                background: "linear-gradient(135deg, var(--accent-teal), var(--accent-green))",
                borderRadius: "24px",
                padding: "20px 24px",
                color: "white",
                marginTop: "28px",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 10px 30px rgba(27,58,75,0.2)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  opacity: 0.7,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Word of the day
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "2px",
                }}
              >
                Serendipity
              </div>
              <div style={{ fontSize: "14.5px", opacity: 0.9, fontWeight: 500 }}>
                Finding something good without looking
              </div>
            </div>
          </div>
        </section>

        {/* ===== MARKETING SECTION ===== */}
        <MarketingSection />

        {/* Features list */}
        <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "40px 24px 120px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-green)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "22px",
                  background: "rgba(45,74,62,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "28px",
                  color: "var(--accent-green)",
                }}
              >
                <Brain size={30} color="currentColor" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t("featureAITitle")}
              </h3>
              <p
                style={{
                  fontSize: "15.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  fontWeight: 500,
                }}
              >
                {t("featureAIDesc")}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-terra)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "22px",
                  background: "rgba(196,109,75,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "28px",
                  color: "var(--accent-terra)",
                }}
              >
                <Compass size={30} color="currentColor" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t("featureCultureTitle")}
              </h3>
              <p
                style={{
                  fontSize: "15.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  fontWeight: 500,
                }}
              >
                {t("featureCultureDesc")}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-gold)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "22px",
                  background: "rgba(212,162,59,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "28px",
                  color: "var(--accent-gold)",
                }}
              >
                <MessageCircle size={30} color="currentColor" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t("featureCalmTitle")}
              </h3>
              <p
                style={{
                  fontSize: "15.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  fontWeight: 500,
                }}
              >
                {t("featureCalmDesc")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface-raised)",
            opacity: 0.98,
          }}
        >
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "48px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "28px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: 900,
                color: "var(--accent-green)",
                letterSpacing: "-0.02em",
              }}
            >
              Lume
            </span>
            <div style={{ display: "flex", gap: "24px", fontSize: "14.5px" }}>
              <Link
                to="/guide"
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 700 }}
                className="hover:text-primary"
              >
                {t("common:guide")}
              </Link>
              <Link
                to="/lessons"
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 700 }}
                className="hover:text-primary"
              >
                {t("common:lessons")}
              </Link>
              <Link
                to="/guest"
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 700 }}
                className="hover:text-primary"
              >
                {t("common:practice")}
              </Link>
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              A calm and artistic speaking companion.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
