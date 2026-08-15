import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { useEffect, useState, lazy, Suspense } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { Brain, Compass, Star, Flame, MessageCircle } from "@/components/lume/CustomIcons";
import { LumeAvatar } from "@/components/lume/LumeAvatar";
import { InlineIllustration } from "@/components/lume/InlineIllustrations";

// Lazy load apenas MarketingSection (não crítico)
const MarketingSection = lazy(() => import("@/components/lume/MarketingSection").then(m => ({ default: m.MarketingSection })));

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
    links: [
      // Preload critical assets
      { rel: "preload", as: "image", href: "/logo.png" },
      // DNS prefetch for external resources
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
    ],
  }),
  component: Landing,
  // Disable SSR for this route temporarily
  loader: async () => {
    if (typeof window === "undefined") {
      return null;
    }
    return null;
  },
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t, i18n } = useTranslation(["landing", "common"]);

  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If already logged in, go to home
  useEffect(() => {
    if (user) nav({ to: "/home" });
  }, [user, nav]);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Marca como carregado após o primeiro render
    setIsLoaded(true);
    
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
        position: "relative",
      }}
    >
      {/* Decorative floating blobs - otimizado */}
      <div className="decorative-blob blob-1" />
      <div className="decorative-blob blob-2" />
      <div className="decorative-blob blob-3" />

      <AppHeader />
      <main style={{ animation: "pageEnter 0.3s ease forwards" }}>
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
                background: "linear-gradient(135deg, rgba(45,74,62,0.1), rgba(196,113,74,0.08))",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "24px",
                border: "1px solid rgba(45,74,62,0.15)",
                boxShadow: "0 2px 12px rgba(45,74,62,0.08)",
              }}
              className="scale-in"
            >
              ✨ Lume Platform
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
              className="gradient-text-brand"
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
                className="btn-premium glow-brand"
                style={{
                  padding: "16px 36px",
                  borderRadius: "99px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                🚀 {t("landing:ctaStart")}
              </Link>
              <Link
                to="/login"
                className="btn-secondary-premium hover-spring"
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

            {/* Main card com MAIS ANIMAÇÕES */}
            <div
              className="glass-vivid premium-shadow crossover-card"
              style={{
                borderRadius: "32px",
                padding: "32px",
                border: "2px solid var(--border)",
                position: "relative",
                zIndex: 2,
                overflow: "hidden",
              }}
            >
              {/* Partículas flutuantes decorativas */}
              <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0 }}
                style={{ position: "absolute", top: "15%", right: "10%", fontSize: "20px" }}
              >
                💬
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                style={{ position: "absolute", top: "40%", left: "8%", fontSize: "18px" }}
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                style={{ position: "absolute", bottom: "20%", right: "15%", fontSize: "16px" }}
              >
                🎯
              </motion.div>
              
              {/* AI header — Lume avatar + name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "24px",
                  paddingBottom: "18px",
                  borderBottom: "2px solid var(--border)",
                  position: "relative",
                }}
              >
                {/* Logo as mascot avatar com pulso */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LumeAvatar size={48} animated glow />
                </motion.div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 900, fontSize: "17px", color: "var(--text-primary)" }}>
                      Lume
                    </div>
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      style={{ fontSize: "16px" }}
                    >
                      🤖
                    </motion.span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#4CAF50",
                        boxShadow: "0 0 10px #4CAF50AA",
                      }}
                    />
                    <span
                      style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 700 }}
                    >
                      Online
                    </span>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontSize: "12px" }}
                    >
                      • Respondendo...
                    </motion.span>
                  </div>
                </div>
                
                {/* Badge "AI Powered" */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: "6px 12px",
                    background: "linear-gradient(135deg, var(--accent-green), var(--accent-teal))",
                    borderRadius: "99px",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(45,74,62,0.25)",
                  }}
                >
                  ⚡ AI
                </motion.div>
              </div>

              {/* Messages com animações */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass"
                  style={{
                    padding: "16px 20px",
                    borderRadius: "6px 22px 22px 22px",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    maxWidth: "88%",
                    border: "2px solid var(--border)",
                    position: "relative",
                  }}
                >
                  What did you do last weekend? Tell me — no pressure.
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ marginLeft: "4px" }}
                  >
                    💭
                  </motion.span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "22px 22px 6px 22px",
                    background: "linear-gradient(135deg, var(--accent-green), var(--accent-teal))",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "white",
                    maxWidth: "88%",
                    alignSelf: "flex-end",
                    boxShadow: "0 6px 16px rgba(45,74,62,0.2)",
                    position: "relative",
                  }}
                >
                  I go to... a concert? My friend, she invite me last Saturday.
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    style={{ marginLeft: "4px" }}
                  >
                    🎵
                  </motion.span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass"
                  style={{
                    padding: "16px 20px",
                    borderRadius: "6px 22px 22px 22px",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    maxWidth: "88%",
                    border: "2px solid var(--border)",
                  }}
                >
                  Love it! Small tip: "she <strong>invited</strong> me" — past tense. But your
                  meaning was totally clear. What kind of music?
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    style={{ marginLeft: "4px" }}
                  >
                    ✅
                  </motion.span>
                </motion.div>
              </div>

              {/* Input com animação */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: "14px 20px",
                  background: "var(--bg)",
                  borderRadius: "99px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  border: "2px solid var(--border)",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: "15px", color: "#A8A8A0", flex: 1, fontWeight: 600 }}>
                  {t("common:search")}
                </span>
                
                {/* Ícone de microfone animado */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ["0 0 0 0 rgba(196,113,74,0.4)", "0 0 0 8px rgba(196,113,74,0)", "0 0 0 0 rgba(196,113,74,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--accent-terra)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(196,109,75,0.35)",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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
                </motion.div>
              </motion.div>
            </div>

            {/* Floating XP badge com MAIS ANIMAÇÕES */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: "-5deg" }}
              animate={{ opacity: 1, scale: 1, rotate: "2.5deg" }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, rotate: "5deg", y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "absolute",
                top: "-20px",
                right: "-14px",
                zIndex: 3,
                background: "var(--surface-raised)",
                borderRadius: "20px",
                padding: "12px 18px",
                boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                border: "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              {/* Partículas de XP */}
              <motion.div
                animate={{ y: [-20, -40], opacity: [1, 0], scale: [0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                style={{ position: "absolute", top: "10px", left: "15px", fontSize: "12px" }}
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [-20, -40], opacity: [1, 0], scale: [0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 0.3 }}
                style={{ position: "absolute", top: "10px", right: "15px", fontSize: "12px" }}
              >
                ⭐
              </motion.div>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-gold), #E5B84B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(212,162,59,0.35)",
                }}
              >
                <Star size={17} color="white" fill="white" />
              </motion.div>
              
              <div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  style={{ fontSize: "15px", fontWeight: 900, color: "var(--accent-green)" }}
                >
                  +15 XP
                </motion.div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>
                  Good session! 🎉
                </div>
              </div>
            </motion.div>

            {/* Floating streak com MAIS ANIMAÇÕES */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: "5deg" }}
              animate={{ opacity: 1, scale: 1, rotate: "-2deg" }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, rotate: "-4deg", y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "20px",
                zIndex: 4,
                background: "linear-gradient(135deg,#FF6B35,#FF8C42)",
                borderRadius: "18px",
                padding: "12px 18px",
                boxShadow: "0 12px 35px rgba(255,107,53,0.35)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {/* Chamas animadas */}
              <motion.div
                animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ position: "absolute", top: "-8px", left: "20px", fontSize: "16px" }}
              >
                🔥
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                style={{ position: "absolute", top: "-8px", right: "20px", fontSize: "16px" }}
              >
                🔥
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Flame size={20} color="white" fill="white" />
              </motion.div>
              
              <div style={{ fontSize: "15px", fontWeight: 900, color: "white", display: "flex", alignItems: "center", gap: "6px" }}>
                5 days streak!
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🎯
                </motion.span>
              </div>
            </motion.div>

            {/* Word card com MAIS ANIMAÇÕES */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              whileHover={{ scale: 1.03, rotate: "-0.5deg", y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="premium-shadow"
              style={{
                background: "linear-gradient(135deg, var(--accent-teal), var(--accent-green), #1a5c4a)",
                borderRadius: "28px",
                padding: "24px 28px",
                color: "white",
                marginTop: "32px",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 12px 35px rgba(27,58,75,0.3)",
                border: "2px solid rgba(255,255,255,0.15)",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Partículas brilhantes flutuantes */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 10, 0], opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                style={{ position: "absolute", top: "15px", right: "20px", fontSize: "20px" }}
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, -8, 0], opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                style={{ position: "absolute", bottom: "20px", left: "25px", fontSize: "18px" }}
              >
                💫
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", top: "50%", right: "15px", fontSize: "24px", opacity: 0.15 }}
              >
                📖
              </motion.div>
              
              {/* Badge "Word of the Day" */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  opacity: 0.85,
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "99px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  ⭐
                </motion.span>
                Word of the day
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: 900,
                  marginBottom: "6px",
                  textShadow: "0 2px 12px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                Serendipity
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ fontSize: "22px" }}
                >
                  🍀
                </motion.span>
              </motion.div>
              
              <div style={{ fontSize: "15.5px", opacity: 0.95, fontWeight: 500, lineHeight: 1.5 }}>
                Finding something good without looking
              </div>
              
              {/* Barra de progresso decorativa */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                style={{
                  marginTop: "16px",
                  height: "4px",
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "99px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    height: "100%",
                    width: "50%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== MARKETING SECTION ===== */}
        <Suspense fallback={
          <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div className="skeleton-loader" style={{ height: "32px", width: "200px", margin: "0 auto 20px", borderRadius: "16px" }} />
              <div className="skeleton-loader" style={{ height: "48px", width: "400px", margin: "0 auto 14px", borderRadius: "12px" }} />
              <div className="skeleton-loader" style={{ height: "24px", width: "520px", margin: "0 auto", borderRadius: "8px" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-loader" style={{ height: "280px", borderRadius: "24px" }} />
              ))}
            </div>
          </div>
        }>
          <MarketingSection />
        </Suspense>

        {/* ===== VISUAL ILLUSTRATIONS GRID (Inline SVG - Carregamento Instantâneo) ===== */}
        <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "60px 24px", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 18px",
                borderRadius: "99px",
                background: "linear-gradient(135deg, rgba(108,92,231,0.12), rgba(255,107,107,0.08))",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent-terra)",
                marginBottom: "16px",
                border: "1.5px solid rgba(108,92,231,0.15)",
              }}
            >
              ✨ {currentLang === "pt" ? "Aprenda com Lume" : "Learn with Lume"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: "12px",
              }}
              className="gradient-text-rainbow"
            >
              {currentLang === "pt"
                ? "Uma jornada divertida e leve"
                : currentLang === "es"
                  ? "Un viaje divertido y ligero"
                  : "A fun and light journey"}
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto", fontWeight: 500 }}>
              {currentLang === "pt"
                ? "Personagens, conquistas e momentos calmos para aprender no seu ritmo."
                : currentLang === "es"
                  ? "Personajes, logros y momentos tranquilos para aprender a tu ritmo."
                  : "Characters, achievements and calm moments to learn at your pace."}
            </p>
          </div>
          
          {/* Grid com ilustrações inline SVG + ÍCONES ANIMADOS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1 - ABC com ícone animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.03, rotate: "1deg" }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)",
                borderRadius: "28px",
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(9, 132, 227, 0.25)",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Partículas flutuantes */}
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                style={{ position: "absolute", top: "20px", left: "20px", fontSize: "24px" }}
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{ position: "absolute", top: "30px", right: "30px", fontSize: "20px" }}
              >
                📚
              </motion.div>
              
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <InlineIllustration type="abc" size={110} />
              </motion.div>
              
              <div style={{ textAlign: "center", color: "white", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 900, marginBottom: "6px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {currentLang === "pt" ? "Sem Pressão" : "No Pressure"}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.95, fontWeight: 600, lineHeight: 1.4 }}>
                  {currentLang === "pt" ? "Aprenda no seu ritmo" : "Learn at your pace"}
                </div>
              </div>
              
              {/* Brilho decorativo */}
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-50%",
                width: "200%",
                height: "200%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
            </motion.div>

            {/* Card 2 - Heart com ícone animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.03, rotate: "-1deg" }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)",
                borderRadius: "28px",
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(108, 92, 231, 0.25)",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Corações flutuantes */}
              <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
                style={{ position: "absolute", top: "25px", left: "25px", fontSize: "22px" }}
              >
                💜
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                style={{ position: "absolute", bottom: "30px", right: "25px", fontSize: "18px" }}
              >
                💝
              </motion.div>
              
              <InlineIllustration type="heart" size={110} />
              
              <div style={{ textAlign: "center", color: "white", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 900, marginBottom: "6px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {currentLang === "pt" ? "IA Empática" : "Empathetic AI"}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.95, fontWeight: 600, lineHeight: 1.4 }}>
                  {currentLang === "pt" ? "Conversas calorosas" : "Warm conversations"}
                </div>
              </div>
              
              <div style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
            </motion.div>

            {/* Card 3 - Globe com ícone animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.03, rotate: "1deg" }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #55EFC4 0%, #00B894 100%)",
                borderRadius: "28px",
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(0, 184, 148, 0.25)",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Ícones de cultura flutuantes */}
              <motion.div
                animate={{ rotate: [0, 360], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", top: "20px", right: "20px", fontSize: "24px" }}
              >
                🌍
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                style={{ position: "absolute", bottom: "25px", left: "25px", fontSize: "20px" }}
              >
                🗺️
              </motion.div>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <InlineIllustration type="globe" size={110} />
              </motion.div>
              
              <div style={{ textAlign: "center", color: "white", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 900, marginBottom: "6px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {currentLang === "pt" ? "Cultura Real" : "Real Culture"}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.95, fontWeight: 600, lineHeight: 1.4 }}>
                  {currentLang === "pt" ? "Histórias e gírias" : "Stories and slang"}
                </div>
              </div>
              
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-50%",
                width: "200%",
                height: "200%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
            </motion.div>

            {/* Card 4 - Trophy com ícone animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.03, rotate: "-1deg" }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #FF7675 0%, #D63031 100%)",
                borderRadius: "28px",
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(214, 48, 49, 0.25)",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Estrelas e troféus flutuantes */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                style={{ position: "absolute", top: "20px", left: "20px", fontSize: "24px" }}
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                style={{ position: "absolute", top: "30px", right: "25px", fontSize: "22px" }}
              >
                🎉
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                style={{ position: "absolute", bottom: "30px", left: "30px", fontSize: "20px" }}
              >
                🏆
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <InlineIllustration type="trophy" size={110} />
              </motion.div>
              
              <div style={{ textAlign: "center", color: "white", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 900, marginBottom: "6px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {currentLang === "pt" ? "Celebre Cada Vitória" : "Celebrate Every Win"}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.95, fontWeight: 600, lineHeight: 1.4 }}>
                  {currentLang === "pt" ? "Você consegue!" : "You can do it!"}
                </div>
              </div>
              
              <div style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
            </motion.div>
          </div>
        </section>

        {/* Features list com ÍCONES ANIMADOS */}
        <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "40px 24px 120px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {/* Feature 1 - IA Premium com ícones */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="lume-card crossover-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "32px",
                padding: "48px 40px",
                border: "2px solid var(--border)",
                borderTop: "6px solid var(--accent-green)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ícones flutuantes de fundo */}
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: "absolute", top: "20px", right: "20px", fontSize: "48px", opacity: 0.1 }}
              >
                🤖
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "40px", opacity: 0.08 }}
              >
                ⚙️
              </motion.div>
              
              <div
                className="icon-bounce"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(45,74,62,0.15), rgba(45,74,62,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  marginBottom: "32px",
                  color: "var(--accent-green)",
                  boxShadow: "0 6px 20px rgba(45,74,62,0.12)",
                  position: "relative",
                }}
              >
                <Brain size={34} color="currentColor" />
                {/* Pulso de energia */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "24px",
                    border: "2px solid var(--accent-green)",
                  }}
                />
              </div>
              
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {t("featureAITitle")}
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ fontSize: "20px" }}
                >
                  ✨
                </motion.span>
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {t("featureAIDesc")}
              </p>
              
              {/* Badge "Premium" */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  marginTop: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, var(--accent-green), var(--accent-teal))",
                  borderRadius: "99px",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(45,74,62,0.25)",
                }}
              >
                <span>🚀</span> Experimentar agora
              </motion.div>
            </motion.div>

            {/* Feature 2 - Imersão Cultural com ícones */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="lume-card crossover-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "32px",
                padding: "48px 40px",
                border: "2px solid var(--border)",
                borderTop: "6px solid var(--accent-terra)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ícones de cultura flutuantes */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", top: "20px", right: "20px", fontSize: "44px", opacity: 0.1 }}
              >
                🌎
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ position: "absolute", bottom: "25px", left: "25px", fontSize: "36px", opacity: 0.08 }}
              >
                🎭
              </motion.div>
              
              <div
                className="icon-bounce"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(196,109,75,0.15), rgba(196,109,75,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  marginBottom: "32px",
                  color: "var(--accent-terra)",
                  boxShadow: "0 6px 20px rgba(196,109,75,0.12)",
                  position: "relative",
                }}
              >
                <Compass size={34} color="currentColor" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "24px",
                    border: "2px solid var(--accent-terra)",
                  }}
                />
              </div>
              
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {t("featureCultureTitle")}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  style={{ fontSize: "20px" }}
                >
                  🗺️
                </motion.span>
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {t("featureCultureDesc")}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  marginTop: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, var(--accent-terra), #E67E22)",
                  borderRadius: "99px",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(196,109,75,0.25)",
                }}
              >
                <span>🌍</span> Explorar culturas
              </motion.div>
            </motion.div>

            {/* Feature 3 - Desafios Diários com ícones */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="lume-card crossover-card"
              style={{
                background: "var(--surface-raised)",
                borderRadius: "32px",
                padding: "48px 40px",
                border: "2px solid var(--border)",
                borderTop: "6px solid var(--accent-gold)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ícones de conquista flutuantes */}
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: "absolute", top: "20px", right: "20px", fontSize: "42px", opacity: 0.12 }}
              >
                🏆
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0], opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "38px" }}
              >
                🎯
              </motion.div>
              
              <div
                className="icon-bounce"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(212,162,59,0.15), rgba(212,162,59,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  marginBottom: "32px",
                  color: "var(--accent-gold)",
                  boxShadow: "0 6px 20px rgba(212,162,59,0.12)",
                  position: "relative",
                }}
              >
                <MessageCircle size={34} color="currentColor" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "24px",
                    border: "2px solid var(--accent-gold)",
                  }}
                />
              </div>
              
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {t("featureCalmTitle")}
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                  style={{ fontSize: "20px" }}
                >
                  🎊
                </motion.span>
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {t("featureCalmDesc")}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  marginTop: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, var(--accent-gold), #E5B84B)",
                  borderRadius: "99px",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(212,162,59,0.25)",
                }}
              >
                <span>⚡</span> Ver desafios
              </motion.div>
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
                to="/login"
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
