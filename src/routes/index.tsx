import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { MessageCircle, Brain, Compass, Star, Flame, Sparkles, Book, BookOpen, Zap, Gamepad2, Globe } from "@/components/lume/CustomIcons";
import { MarketingSection } from "@/components/lume/MarketingSection";

// Structured Data for SEO (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LumeLearn",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description: "Plataforma de idiomas com 700+ lições interativas, prática de conversação com IA e gamificação.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Plano gratuito com lições limitadas",
  },
  featureList: "700+ lições interativas, 3 idiomas (EN/ES/PT), 6 níveis CEFR, 5 modos de jogo, IA conversacional, Gamificação com XP",
  inLanguage: ["pt-BR", "en", "es"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumeLearn — Aprenda Inglês, Espanhol e Português com IA Conversacional" },
      {
        name: "description",
        content:
          "Plataforma de idiomas com 700+ lições interativas, prática de conversação com IA e gamificação. 3 idiomas, 6 níveis CEFR, 5 modos de jogo. Comece grátis.",
      },
      { property: "og:title", content: "LumeLearn — Aprenda Idiomas de Forma Inteligente" },
      {
        property: "og:description",
        content:
          "700+ lições, conversação com IA, 5 modos de jogo. Aprenda inglês, espanhol e português com gamificação. Comece grátis.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://langlume.vercel.app" },
      { property: "og:image", content: "https://langlume.vercel.app/og-image.svg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://langlume.vercel.app/og-image.svg" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t, i18n } = useTranslation(["landing", "common"]);

  const currentLang = i18n.language || "pt";
  const isPT = currentLang === "pt";
  const mascotGreeting =
    {
      pt: "Olá! Sou o Lume. Que tal praticar um pouco hoje? Sem pressões!",
      en: "Hi! I'm Lume. How about practicing a bit today! No pressure!",
      es: "¡Hola! Soy Lume. ¿Qué tal practicar un poco hoy? ¡Sin presiones!",
    }[currentLang as "pt" | "en" | "es"] ||
    "Olá! Sou o Lume. Que tal praticar um pouco hoje? Sem pressões!";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 20%, rgba(255,122,69,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(196,113,74,0.06) 0%, transparent 60%), var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <AppHeader />
      <main style={{ animation: "pageEnter 0.5s ease forwards" }} id="main-content" role="main">
        {/* Editorial Hero Layout (2 Columns) */}
        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "clamp(32px, 6vw, 80px) clamp(16px, 3vw, 24px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(32px, 5vw, 60px)",
            alignItems: "center",
          }}
        >
          {/* LEFT — text */}
          <div style={{ paddingRight: "0", maxWidth: "100%" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(255,122,69,0.08)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "24px",
                border: "1px solid rgba(255,122,69,0.1)",
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
              Pratique idiomas todos os dias com lições curtas e jogos
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
              Inglês, Espanhol e Português com prática guiada por IA, progresso salvo automaticamente e gamificação inteligente.
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
                  width: "auto",
                  textAlign: "center",
                }}
              >
                Começar agora
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
              "Finalmente aprendo sem travar"
            </p>
          </div>

          {/* RIGHT — live conversation preview card */}
          <div
            style={{ 
              position: "relative", 
              display: "flex", 
              flexDirection: "column", 
              gap: "16px",
              marginTop: "0",
            }}
          >
            {/* Title above chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  borderRadius: "99px",
                  background: "var(--card-bg)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,122,69,0.15)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#4CAF50",
                    boxShadow: "0 0 12px #4CAF50AA",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <MessageCircle size={16} color="var(--brand)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>
                    {isPT ? "Conversa ao Vivo" : "Live Conversation"}
                  </span>
                </span>
              </div>
            </motion.div>

            {/* Main card */}
            <div
              className="glass premium-shadow"
              style={{
                borderRadius: "32px",
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.3)",
                position: "relative",
                zIndex: 2,
                background: "var(--card-bg)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5) inset",
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
                    boxShadow: "0 4px 12px rgba(255,122,69,0.2)",
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
                    boxShadow: "0 4px 12px rgba(255,122,69,0.15)",
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
                  Digite sua mensagem...
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
                top: "auto",
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
                boxShadow: "0 16px 48px rgba(27,58,75,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset",
                border: "2px solid rgba(255,255,255,0.15)",
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

        {/* ===== STATS STRIP ===== */}
        <section style={{ maxWidth: "1120px", margin: "clamp(48px, 10vw, 80px) auto 0", padding: "0 clamp(16px, 3vw, 24px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "clamp(16px, 3vw, 20px)" }}>
            {[
              { value: "700+", label: isPT ? "Lições estruturadas" : "Structured lessons", color: "#ff7a45", Icon: BookOpen },
              { value: "6", label: isPT ? "Níveis CEFR" : "CEFR Levels", color: "#2f80ed", Icon: Zap },
              { value: "5", label: isPT ? "Modos de jogo" : "Game modes", color: "#C4714A", Icon: Gamepad2 },
              { value: "3", label: isPT ? "Idiomas disponíveis" : "Available languages", color: "#9B59B6", Icon: Globe },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "var(--card-bg)",
                  borderRadius: "20px",
                  padding: "28px 24px",
                  border: "2px solid var(--border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <stat.Icon size={40} color={stat.color} />
                </div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: stat.color, fontFamily: "var(--font-display)", marginBottom: "6px" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 700 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== COMO FUNCIONA ===== */}
        <section style={{ 
          maxWidth: "1120px", 
          margin: "clamp(64px, 12vw, 120px) auto clamp(48px, 10vw, 80px)", 
          padding: "0 clamp(16px, 3vw, 24px)"
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 64px)" }}>
            <h2 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, marginBottom: "16px", color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {isPT ? "Como o Lume funciona" : "How Lume works"}
            </h2>
            <p style={{ fontSize: "clamp(16px, 3vw, 18px)", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              {isPT ? "Três etapas simples para começar a evoluir hoje" : "Three simple steps to start improving today"}
            </p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(20px, 3vw, 24px)" }}>
            {[
              {
                step: "01",
                color: "#ff7a45",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ),
                title: isPT ? "Escolha seu idioma e nível" : "Choose your language & level",
                desc: isPT ? "Inglês, Espanhol ou Português. Do iniciante ao avançado, o Lume se adapta ao seu ritmo." : "English, Spanish or Portuguese. From beginner to advanced, Lume adapts to your pace.",
              },
              {
                step: "02",
                color: "#2f80ed",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                ),
                title: isPT ? "Complete lições estruturadas" : "Complete structured lessons",
                desc: isPT ? "Gramática, vocabulário, pronúncia e mais. Cada lição desbloqueia a próxima, construindo o conhecimento de forma progressiva." : "Grammar, vocabulary, pronunciation and more. Each lesson unlocks the next, building knowledge progressively.",
              },
              {
                step: "03",
                color: "#C4714A",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
                title: isPT ? "Pratique com IA e jogos" : "Practice with AI & games",
                desc: isPT ? "Converse com a IA sem pressão, jogue quizzes e ganhe XP. Aprendizado que parece um jogo, não uma tarefa." : "Chat with AI without pressure, play quizzes and earn XP. Learning that feels like a game, not a chore.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                style={{
                  background: "var(--card-bg)",
                  borderRadius: "28px",
                  padding: "36px 32px",
                  border: "2px solid var(--border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "24px", right: "24px", fontSize: "48px", fontWeight: 900, opacity: 0.06, color: item.color, fontFamily: "var(--font-display)" }}>{item.step}</div>
                <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, marginBottom: "24px" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 500 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== MARKETING SECTION ===== */}
        <MarketingSection />

        {/* STATS BANNER */}
        <section style={{ maxWidth: "1120px", margin: "clamp(48px, 10vw, 80px) auto", padding: "0 clamp(16px, 3vw, 24px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "linear-gradient(135deg, #2f80ed 0%, #ff7a45 100%)",
              borderRadius: "clamp(20px, 4vw, 32px)",
              padding: "clamp(32px, 6vw, 60px) clamp(20px, 4vw, 48px)",
              color: "white",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Sparkles size={32} color="#FFD700" style={{ marginBottom: "16px" }} />
              <h2 style={{ fontSize: "clamp(24px, 6vw, 56px)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {isPT ? "Tudo que você precisa para aprender" : "Everything you need to learn"}
              </h2>
              <p style={{ fontSize: "clamp(16px, 3vw, 20px)", opacity: 0.95, marginBottom: "clamp(32px, 5vw, 40px)", maxWidth: "700px", margin: "0 auto clamp(32px, 5vw, 40px)" }}>
                {isPT ? "Lições estruturadas, conversação com IA, jogos interativos e muito mais" : "Structured lessons, AI conversation, interactive games and much more"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "clamp(16px, 3vw, 20px)", maxWidth: "900px", margin: "0 auto" }}>
                {[
                  { label: isPT ? "Lições" : "Lessons", value: "700+", icon: Book },
                  { label: isPT ? "Níveis" : "Levels", value: "6", icon: Brain },
                  { label: isPT ? "Jogos" : "Games", value: "5", icon: Star },
                  { label: isPT ? "Idiomas" : "Languages", value: "3", icon: Compass },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ background: "rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <stat.icon size={24} color="white" style={{ marginBottom: "8px" }} />
                    <div style={{ fontSize: "28px", fontWeight: 900, marginBottom: "4px" }}>{stat.value}</div>
                    <div style={{ fontSize: "12px", opacity: 0.9, fontWeight: 600 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features list */}
        <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "clamp(32px, 5vw, 40px) clamp(16px, 3vw, 24px) clamp(64px, 10vw, 80px)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "clamp(20px, 4vw, 28px)",
            }}
          >
            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-green)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Overlay for readability */}
              <div style={{ position: "absolute", inset: 0, background: "var(--overlay-bg)", zIndex: 0 }} />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "22px",
                    background: "rgba(255,122,69,0.12)",
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
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-terra)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Overlay for readability */}
              <div style={{ position: "absolute", inset: 0, background: "var(--overlay-bg)", zIndex: 0 }} />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "22px",
                    background: "rgba(196,109,75,0.12)",
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
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="lume-card"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "28px",
                padding: "44px 36px",
                border: "1.5px solid var(--border)",
                borderTop: "5px solid var(--accent-gold)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Overlay for readability */}
              <div style={{ position: "absolute", inset: 0, background: "var(--overlay-bg)", zIndex: 0 }} />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "22px",
                    background: "rgba(212,162,59,0.12)",
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== PARA QUEM É O LUMELEARN ===== */}
        <section
          style={{
            background: "var(--surface)",
            backdropFilter: "blur(10px)",
            padding: "clamp(60px,8vw,100px) 24px",
            margin: "80px 0 0 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: "64px" }}
            >
              <h2
                style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: 900,
                  marginBottom: "16px",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.02em",
                }}
              >
                {isPT ? "Para quem é o LumeLearn" : "Who is LumeLearn for"}
              </h2>
              <p style={{
                fontSize: "18px",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
              }}>
                {isPT 
                  ? "Ideal para quem quer praticar idiomas de forma estruturada e consistente" 
                  : "Ideal for those who want to practice languages in a structured and consistent way"}
              </p>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "28px",
              }}
            >
              {[
                {
                  icon: "🎯",
                  title: isPT ? "Quer praticar todos os dias" : "Want to practice every day",
                  desc: isPT 
                    ? "Lições curtas de 5-10 minutos que cabem na sua rotina. Pratique no ônibus, no intervalo ou antes de dormir." 
                    : "Short 5-10 minute lessons that fit your routine. Practice on the bus, during breaks or before bed.",
                },
                {
                  icon: "💬",
                  title: isPT ? "Trava na hora de falar" : "Freeze when speaking",
                  desc: isPT 
                    ? "Converse com IA sem medo de julgamento. Pratique até ganhar confiança para falar com pessoas reais." 
                    : "Chat with AI without fear of judgment. Practice until you gain confidence to speak with real people.",
                },
                {
                  icon: "📚",
                  title: isPT ? "Quer estudar do básico ao avançado" : "Want to study from beginner to advanced",
                  desc: isPT 
                    ? "700+ lições estruturadas em 6 níveis CEFR. Do A1 ao C2, com progresso salvo automaticamente." 
                    : "700+ structured lessons across 6 CEFR levels. From A1 to C2, with progress saved automatically.",
                },
                {
                  icon: "🎮",
                  title: isPT ? "Aprende melhor jogando" : "Learn better through games",
                  desc: isPT 
                    ? "Quizzes interativos, jogos de memória e desafios diários. Aprendizado que parece diversão." 
                    : "Interactive quizzes, memory games and daily challenges. Learning that feels like fun.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: "var(--card-bg)",
                    borderRadius: "24px",
                    padding: "32px 28px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                    border: "2px solid var(--border)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "19px",
                      fontWeight: 800,
                      marginBottom: "12px",
                      color: "var(--text-primary)",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            backdropFilter: "blur(10px)",
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
                Guia
              </Link>
              <Link
                to="/lessons"
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 700 }}
                className="hover:text-primary"
              >
                Lições
              </Link>
              <Link
                to="/lessons"
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 700 }}
                className="hover:text-primary"
              >
                Praticar
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

