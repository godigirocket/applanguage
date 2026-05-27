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
  const { interfaceLanguage } = useStore();
  const { t } = useTranslation(["play"]);
  const [showHelp, setShowHelp] = useState(false);

  const isPT = interfaceLanguage === "pt";

  const stats = {
    quizzesCompleted: 12,
    accuracy: 84,
    bestStreak: 7,
    xpFromQuizzes: 450,
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
      color: "var(--accent-green)",
      tag: null,
    },
    {
      slug: "race",
      icon: "Zap",
      title: isPT ? "Contra o Tempo" : "Speed Round",
      desc: isPT
        ? "Responda rápido! Os pontos diminuem com o tempo."
        : "Answer fast! Points decay as timer runs down.",
      xp: isPT ? "Até 150 XP" : "Up to 150 XP",
      color: "#C9A84C",
      tag: null,
    },
    {
      slug: "daily",
      icon: "Target",
      title: isPT ? "Desafio Diário" : "Daily Challenge",
      desc: isPT
        ? "Um desafio temático especial disponível apenas hoje."
        : "One special themed challenge available today.",
      xp: isPT ? "Bônus 200 XP" : "200 XP Bonus",
      color: "#1B3A4B",
      tag: isPT ? "HOJE" : "TODAY",
    },
    {
      slug: "survival",
      icon: "Flame",
      title: isPT ? "Sobrevivência" : "Streak Master",
      desc: isPT
        ? "Responda as perguntas consecutivamente até errar."
        : "Answer consecutive questions until you miss one.",
      xp: isPT ? "10 XP por acerto" : "10 XP per correct",
      color: "var(--accent-terra)",
      tag: null,
    },
    {
      slug: "grammar",
      icon: "BookOpen",
      title: isPT ? "Construtor Gramatical" : "Grammar Builder",
      desc: isPT
        ? "Aprenda regras de estrutura gramatical profunda."
        : "Master structural rules and grammar layouts.",
      xp: isPT ? "Até 120 XP" : "Up to 120 XP",
      color: "#9B59B6",
      tag: isPT ? "NOVO" : "NEW",
    },
    {
      slug: "speak",
      icon: "Mic",
      title: isPT ? "Imitador de Sotaque" : "Accent Mimic",
      desc: isPT
        ? "Grave sua pronúncia e compare com modelos nativos."
        : "Record your speech and match phonetic audio models.",
      xp: isPT ? "Até 180 XP" : "Up to 180 XP",
      color: "#E67E22",
      tag: null,
    },
    {
      slug: "verbs",
      icon: "Sliders",
      title: isPT ? "Conjugador de Verbos" : "Verb Conjugator",
      desc: isPT
        ? "Treine tempos verbais regulares e irregulares."
        : "Speed-train regular & irregular verb tenses.",
      xp: isPT ? "Até 80 XP" : "Up to 80 XP",
      color: "#1ABC9C",
      tag: null,
    },
    {
      slug: "slang",
      icon: "MessageCircle",
      title: isPT ? "Decifrador de Gírias" : "Slang Decrypter",
      desc: isPT
        ? "Entenda expressões informais e jargões urbanos."
        : "Master street idioms and colloquial phrases.",
      xp: isPT ? "Até 90 XP" : "Up to 90 XP",
      color: "#8B5A2B",
      tag: null,
    },
    {
      slug: "listening",
      icon: "Volume2",
      title: isPT ? "Bússola de Audição" : "Listening Compass",
      desc: isPT
        ? "Aprimore sua escuta com sotaques realistas."
        : "Refine audio comprehension in dynamic settings.",
      xp: isPT ? "Até 130 XP" : "Up to 130 XP",
      color: "#34495E",
      tag: null,
    },
    {
      slug: "prepositions",
      icon: "Compass",
      title: isPT ? "Caça-Preposições" : "Preposition Hunt",
      desc: isPT
        ? "Preencha lacunas com a preposição gramatical correta."
        : "Find and fill gaps with correct prepositions.",
      xp: isPT ? "Até 70 XP" : "Up to 70 XP",
      color: "#E74C3C",
      tag: null,
    },
    {
      slug: "idioms",
      icon: "Palette",
      title: isPT ? "Explorador de Idiomas" : "Idiom Explorer",
      desc: isPT
        ? "Mergulhe em figuras de linguagem e expressões regionais."
        : "Discover local figures of speech and curious lines.",
      xp: isPT ? "Até 110 XP" : "Up to 110 XP",
      color: "#8E44AD",
      tag: null,
    },
    {
      slug: "flashcards",
      icon: "Library",
      title: isPT ? "Flash de Vocabulário" : "Vocab Blast",
      desc: isPT
        ? "Associe termos a significados em alta velocidade."
        : "High-speed matching of vocabulary words.",
      xp: isPT ? "Até 100 XP" : "Up to 100 XP",
      color: "#27AE60",
      tag: null,
    },
    {
      slug: "synonyms",
      icon: "Layers",
      title: isPT ? "Par de Sinônimos" : "Synonym Matcher",
      desc: isPT
        ? "Conecte termos com significados equivalentes."
        : "Match synonyms to expand vocabulary breadth.",
      xp: isPT ? "Até 80 XP" : "Up to 80 XP",
      color: "#2980B9",
      tag: null,
    },
    {
      slug: "errors",
      icon: "AlertTriangle",
      title: isPT ? "Caçador de Erros" : "Error Buster",
      desc: isPT
        ? "Identifique e corrija erros gramaticais em frases."
        : "Identify and repair errors in complex sentences.",
      xp: isPT ? "Até 110 XP" : "Up to 110 XP",
      color: "#D35400",
      tag: null,
    },
    {
      slug: "culture",
      icon: "Map",
      title: isPT ? "Sabedoria Cultural" : "Cultural Wisdom",
      desc: isPT
        ? "Responda quiz sobre culinária, história e geografia."
        : "Test your trivia on cuisine, history and geography.",
      xp: isPT ? "Até 150 XP" : "Up to 150 XP",
      color: "#16A085",
      tag: null,
    },
    {
      slug: "dialogue",
      icon: "Send",
      title: isPT ? "Organizador de Diálogos" : "Dialogue Builder",
      desc: isPT
        ? "Ordene falas para criar conversações naturais."
        : "Order dialogues for conversational natural flow.",
      xp: isPT ? "Até 120 XP" : "Up to 120 XP",
      color: "#2C3E50",
      tag: null,
    },
    {
      slug: "words",
      icon: "Leaf",
      title: isPT ? "Formador de Palavras" : "Word Builder",
      desc: isPT
        ? "Junte blocos de sílabas para soletrar termos."
        : "Join syllable blocks to form complete words.",
      xp: isPT ? "Até 90 XP" : "Up to 90 XP",
      color: "#27AE60",
      tag: null,
    },
    {
      slug: "pronunciation",
      icon: "Dumbbell",
      title: isPT ? "Laboratório de Voz" : "Pronunciation Lab",
      desc: isPT
        ? "Supere fonemas difíceis e consoantes complexas."
        : "Conquer complex consonants and hard phonemes.",
      xp: isPT ? "Até 160 XP" : "Up to 160 XP",
      color: "#C0392B",
      tag: null,
    },
    {
      slug: "lumematch",
      icon: "Layers",
      title: isPT ? "Lume Match" : "Lume Match",
      desc: isPT
        ? "Associe palavras às imagens correspondentes."
        : "Match words to their corresponding images.",
      xp: isPT ? "Até 120 XP" : "Up to 120 XP",
      color: "#F39C12",
      tag: isPT ? "NOVO" : "NEW",
    },
    {
      slug: "speedtranslator",
      icon: "Zap",
      title: isPT ? "Speed Translator" : "Speed Translator",
      desc: isPT
        ? "Tradução super rápida contra o relógio!"
        : "Super fast translation against the clock!",
      xp: isPT ? "Até 150 XP" : "Up to 150 XP",
      color: "#E74C3C",
      tag: isPT ? "NOVO" : "NEW",
    },
    {
      slug: "culturaltrivia",
      icon: "Globe",
      title: isPT ? "Trivia Cultural" : "Cultural Trivia",
      desc: isPT
        ? "Teste seus conhecimentos com fatos do Atlas Cultural."
        : "Test your knowledge with Cultural Atlas facts.",
      xp: isPT ? "Até 200 XP" : "Up to 200 XP",
      color: "#2980B9",
      tag: isPT ? "NOVO" : "NEW",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
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

        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--accent-green)",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={14} />
            <span>{isPT ? "ARENA DE JOGOS" : "GAME ARENA"}</span>
          </div>
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
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
              color: "#C9A84C",
              icon: <Star size={18} />,
            },
            {
              label: "Streak",
              value: stats.bestStreak,
              color: "var(--accent-terra)",
              icon: <Flame size={18} />,
            },
            { label: "XP", value: stats.xpFromQuizzes, color: "#1B3A4B", icon: <Zap size={18} /> },
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
                  opacity: 0.6,
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
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {MODES_18.map((mode, i) => (
            <GameModeCard key={mode.slug} mode={mode} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}

function GameModeCard({ mode, index }: { mode: any; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/quiz/${mode.slug}` as any} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="glass premium-shadow"
        style={{
          borderRadius: "32px",
          padding: "32px",
          cursor: "pointer",
          border: `1px solid ${hovered ? mode.color : "var(--border)"}`,
          position: "relative",
          overflow: "hidden",
          minHeight: "260px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {mode.tag && (
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              padding: "4px 12px",
              borderRadius: "99px",
              background: mode.color,
              color: "var(--surface-raised)",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {mode.tag}
          </div>
        )}

        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: `${mode.color}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mode.color,
            marginBottom: "24px",
            transition: "all 0.4s",
          }}
        >
          <DynamicIcon name={mode.icon} size={32} />
        </div>

        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {mode.title}
            <ChevronRight
              size={20}
              style={{
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.3s",
                color: mode.color,
              }}
            />
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              marginBottom: "20px",
              opacity: 0.8,
            }}
          >
            {mode.desc}
          </p>
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: "99px",
              background: "var(--surface-raised)",
              color: mode.color,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              border: `1px solid ${mode.color}20`,
            }}
          >
            {mode.xp}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
