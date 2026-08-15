import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Brain,
  Zap,
  Target,
  Flame,
  Trophy,
  Star,
  Sparkles,
  Book,
  Library,
  Palette,
  Briefcase,
} from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { useState } from "react";
import { DynamicIcon } from "@/components/lume/CustomIcons";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/games")({
  component: PlayPage,
});

function PlayPage() {
  const { interfaceLanguage, xp, streak, completedLessons } = useStore();
  const { t } = useTranslation(["play"]);
  const [showHelp, setShowHelp] = useState(false);

  const isPT = interfaceLanguage === "pt";

  const stats = {
    quizzesCompleted: completedLessons.length,
    accuracy: completedLessons.length > 0 ? Math.min(95, 60 + completedLessons.length * 3) : 0,
    bestStreak: Math.max(streak, 1),
    xpFromQuizzes: xp,
  };

  const MODES_18 = [
    {
      slug: "quick",
      icon: "Brain",
      title: isPT ? "Quiz Rápido" : "Quick Quiz",
      desc: isPT
        ? "10 perguntas dinâmicas sobre temas variados."
        : "10 dynamic general knowledge questions.",
      xp: isPT ? "Até 100 XP" : "Up to 100 XP",
      color: "#58CC02",
      tag: null,
    },
    {
      slug: "race",
      icon: "Zap",
      title: isPT ? "Contra o Tempo" : "Speed Round",
      desc: isPT
        ? "Responda rápido! Pontos diminuem com o tempo."
        : "Answer fast! Points decay as timer runs.",
      xp: isPT ? "Até 150 XP" : "Up to 150 XP",
      color: "#FF9600",
      tag: null,
    },
    {
      slug: "daily",
      icon: "Target",
      title: isPT ? "Desafio Diário" : "Daily Challenge",
      desc: isPT
        ? "Desafio especial disponível apenas hoje."
        : "Special challenge available only today.",
      xp: isPT ? "Bônus 200 XP" : "200 XP Bonus",
      color: "#1CB0F6",
      tag: isPT ? "HOJE" : "TODAY",
    },
    {
      slug: "survival",
      icon: "Flame",
      title: isPT ? "Sobrevivência" : "Streak Master",
      desc: isPT
        ? "Responda até errar. Quanto mais longe, mais XP."
        : "Answer until you miss. The further, the more XP.",
      xp: isPT ? "10 XP por acerto" : "10 XP per correct",
      color: "#FF4B4B",
      tag: null,
    },
    {
      slug: "flashcards",
      icon: "Library",
      title: isPT ? "Flashcards" : "Vocab Blast",
      desc: isPT
        ? "Associe termos a significados em alta velocidade."
        : "Match words to meanings at high speed.",
      xp: isPT ? "Até 100 XP" : "Up to 100 XP",
      color: "#2FBB52",
      tag: null,
    },
    {
      slug: "listening",
      icon: "Volume2",
      title: isPT ? "Escuta Ativa" : "Listening",
      desc: isPT
        ? "Ouça e identifique palavras e frases."
        : "Listen and identify words and phrases.",
      xp: isPT ? "Até 130 XP" : "Up to 130 XP",
      color: "#AC5CF6",
      tag: null,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
      }}
      className="lume-games-page"
    >
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* ℹ️ FLOATING HELP BUTTON */}
        <button
          onClick={() => setShowHelp(true)}
          style={{
            position: "fixed",
            right: "24px",
            bottom: "80px",
            zIndex: 99,
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "var(--accent-terra)",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(196,109,75,0.3)",
            transition: "transform 0.2s",
          }}
          className="hover:scale-110 active:scale-95"
        >
          <span style={{ fontSize: "20px", fontWeight: 800 }}>?</span>
        </button>

        {/* HELP MODAL */}
        <AnimatePresence>
          {showHelp && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass"
                style={{
                  maxWidth: "480px",
                  width: "100%",
                  borderRadius: "28px",
                  padding: "32px",
                  background: "var(--surface-raised)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                      fontWeight: 800,
                      margin: 0,
                      color: "var(--text-primary)",
                    }}
                  >
                    {isPT ? "Arena de Jogos Lume" : "Lume Game Arena"}
                  </h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div
                  style={{
                    fontSize: "14.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <p>
                    <strong>1. {isPT ? "18 Modos de Jogo:" : "18 Game Modes:"}</strong>{" "}
                    {isPT
                      ? "Pratique desde a conjugação de verbos até a escuta imersiva e sotaques regionais."
                      : "Practice everything from verb conjugation to immersive regional listening."}
                  </p>
                  <p>
                    <strong>2. {isPT ? "Grave sua voz:" : "Speak to earn:"}</strong>{" "}
                    {isPT
                      ? "Use modos de pronúncia como 'Accent Mimic' para receber análises phonéticas em tempo real."
                      : "Use voice modes like 'Accent Mimic' to receive real-time phonetic analysis."}
                  </p>
                  <p>
                    <strong>3. {isPT ? "Ganhe XP instantâneo:" : "Earn instant XP:"}</strong>{" "}
                    {isPT
                      ? "Acumule XP em alta velocidade para subir no ranking de poliglotas Lume."
                      : "Stack XP at high speeds to climb the Lume polyglot leaderboard."}
                  </p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  style={{
                    marginTop: "24px",
                    width: "100%",
                    padding: "12px",
                    background: "var(--brand)",
                    color: "white",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {isPT ? "Entendi!" : "Got it!"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "32px 16px 40px",
            animation: "pageEnter 0.4s ease forwards",
          }}
        >
          {/* Back Button */}
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
            <Link
              to="/home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "12px",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                transition: "all 0.2s",
              }}
              className="hover:scale-95"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {isPT ? "Voltar ao Início" : "Back to Home"}
            </Link>
          </div>

          <header style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 5vw, 48px)",
                color: "var(--text-primary)",
                marginBottom: "10px",
                fontWeight: 700,
              }}
            >
              {isPT ? "Pratique e Brilhe" : "Practice and Glow"}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                fontStyle: "italic",
                maxWidth: "500px",
                margin: "0 auto",
                opacity: 0.8,
              }}
            >
              {isPT
                ? "Reforce seu conhecimento com jogos interativos e ganhe muito XP."
                : "Reinforce your knowledge with interactive games and collect tons of XP."}
            </p>
          </header>

          {/* Stats Grid ── 4 cols on desktop, 2x2 on mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "48px",
            }}
            className="play-stats-grid"
          >
            {[
              {
                label: isPT ? "quizzes" : "quizzes",
                value: stats.quizzesCompleted,
                color: "var(--accent-green)",
                icon: <Trophy size={18} />,
              },
              {
                label: isPT ? "precisão" : "accuracy",
                value: `${stats.accuracy}%`,
                color: "var(--brand-yellow)",
                icon: <Star size={18} />,
              },
              {
                label: "Streak",
                value: stats.bestStreak,
                color: "var(--accent-terra)",
                icon: <Flame size={18} />,
              },
              {
                label: "XP",
                value: stats.xpFromQuizzes,
                color: "var(--brand-blue)",
                icon: <Zap size={18} />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass premium-shadow"
                style={{
                  padding: "20px 16px",
                  borderRadius: "20px",
                  textAlign: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: stat.color,
                    marginBottom: "8px",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 800,
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Category Pick */}
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "var(--text-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {isPT ? "Escolha sua Especialidade" : "Choose your Specialty"}
            </h2>
            <div
              style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
            >
              {[
                { cat: isPT ? "Gramática" : "Grammar", icon: "Book", prog: 0.8 },
                { cat: isPT ? "Vocabulário" : "Vocabulary", icon: "Library", prog: 0.6 },
                { cat: isPT ? "Expressões" : "Idioms", icon: "MessageCircle", prog: 0.3 },
                { cat: isPT ? "Cultura" : "Culture", icon: "Palette", prog: 0.1 },
                { cat: isPT ? "Corporativo" : "Professional", icon: "Briefcase", prog: 0.9 },
              ].map((c, i) => (
                <motion.div
                  key={c.cat}
                  whileHover={{ scale: 1.05 }}
                  className="glass premium-shadow"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ color: "var(--accent-green)" }}>
                    <DynamicIcon name={c.icon} size={16} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {c.cat}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Mode Cards ── 3 cols on desktop, 1 col on mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {MODES_18.map((mode, i) => (
              <GameModeCard key={mode.slug} mode={mode} index={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function GameModeCard({ mode, index }: { mode: any; index: number }) {
  return (
    <Link to={`/quiz/${mode.slug}` as any} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        style={{
          borderRadius: "16px",
          padding: "16px",
          cursor: "pointer",
          border: "2px solid var(--border)",
          borderBottomWidth: "4px",
          background: "var(--card-bg)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {mode.tag && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              padding: "2px 8px",
              borderRadius: "99px",
              background: mode.color,
              color: "#fff",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            {mode.tag}
          </div>
        )}

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: `${mode.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mode.color,
          }}
        >
          <DynamicIcon name={mode.icon} size={20} />
        </div>

        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
          {mode.title}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
          {mode.desc}
        </p>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "99px",
            background: `${mode.color}12`,
            color: mode.color,
            fontSize: "11px",
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          {mode.xp}
        </div>
      </motion.div>
    </Link>
  );
}
