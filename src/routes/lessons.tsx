import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { getLessonCatalogue, Lesson } from "@/data/lessonEngine";
import { ALL_LESSONS } from "@/lib/lessons-data";
import masterContent from "@/data/masterContent.json";

import { useStore } from "@/hooks/useStore";
import { useUserStore } from "@/store/userStore";
import { sounds } from "@/lib/soundEffects";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { MASSIVE_VOCABULARY, SENTENCE_BANK } from "@/data/massiveContent";
import {
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  BookOpen,
  Music,
  Film,
  User,
  Trophy,
  Search,
  RefreshCw,
  MessageCircle,
  Mic,
  Star,
  Sliders,
  Library,
  Brain,
  Book,
} from "@/components/lume/CustomIcons";
import { StaggerList } from "@/components/lume/Animations";
import {
  CategoryIllustration,
  IlluBook,
  IlluMic,
  IlluGlobe,
  IlluMusic,
  IlluMapPin,
  IlluChat,
  IlluStar,
  IlluTrophy,
  IlluFlame,
  IlluPuzzle,
  IlluSparkles,
  IlluPen,
  IlluHeadphones,
  IlluBadge,
  IlluABC,
  IlluZap,
  IlluRocket,
  IlluCrown,
  IlluWave,
  IlluCompass,
  IlluDiamond,
  CATEGORY_ILLUSTRATIONS,
} from "@/components/lume/Illustrations";

// Keyword-based illustration resolver for lesson steps
function getIllustrationForStep(
  step: any,
  lessonCategory?: string,
): React.FC<{ size?: number; primary?: string; secondary?: string; style?: React.CSSProperties }> {
  const text = (
    (step?.title || "") +
    " " +
    (step?.text || "") +
    " " +
    (step?.content || "") +
    " " +
    (step?.question || "") +
    " " +
    (step?.targetPhrase || "")
  ).toLowerCase();

  if (
    text.includes("music") ||
    text.includes("música") ||
    text.includes("song") ||
    text.includes("canção")
  )
    return IlluMusic;
  if (
    text.includes("travel") ||
    text.includes("viagem") ||
    text.includes("airport") ||
    text.includes("aeroporto") ||
    text.includes("mapa")
  )
    return IlluMapPin;
  if (
    text.includes("speak") ||
    text.includes("fal") ||
    text.includes("pronun") ||
    text.includes("voice") ||
    text.includes("voz")
  )
    return IlluMic;
  if (
    text.includes("listen") ||
    text.includes("ouv") ||
    text.includes("audio") ||
    text.includes("áudio")
  )
    return IlluHeadphones;
  if (
    text.includes("write") ||
    text.includes("escrev") ||
    text.includes("grammar") ||
    text.includes("gramática") ||
    text.includes("verb")
  )
    return IlluPen;
  if (text.includes("chat") || text.includes("convers") || text.includes("dialog")) return IlluChat;
  if (text.includes("quiz") || text.includes("desafio") || text.includes("test")) return IlluZap;
  if (
    text.includes("culture") ||
    text.includes("cultura") ||
    text.includes("world") ||
    text.includes("mundo")
  )
    return IlluGlobe;
  if (
    text.includes("trophy") ||
    text.includes("troféu") ||
    text.includes("achievement") ||
    text.includes("conqu")
  )
    return IlluTrophy;
  if (text.includes("star") || text.includes("estrela") || text.includes("rank")) return IlluStar;
  if (text.includes("fire") || text.includes("streak") || text.includes("fogo")) return IlluFlame;
  if (text.includes("puzzle") || text.includes("jogo")) return IlluPuzzle;
  if (
    text.includes("rocket") ||
    text.includes("foguete") ||
    text.includes("fast") ||
    text.includes("rápid")
  )
    return IlluRocket;
  if (
    text.includes("crown") ||
    text.includes("coroa") ||
    text.includes("king") ||
    text.includes("rei")
  )
    return IlluCrown;
  if (text.includes("diamond") || text.includes("diamante") || text.includes("premium"))
    return IlluDiamond;
  if (
    text.includes("compass") ||
    text.includes("bússola") ||
    text.includes("direction") ||
    text.includes("direção")
  )
    return IlluCompass;
  if (
    text.includes("wave") ||
    text.includes("onda") ||
    text.includes("sound") ||
    text.includes("som")
  )
    return IlluWave;
  if (text.includes("badge") || text.includes("certif") || text.includes("diploma"))
    return IlluBadge;
  if (text.includes("sparkle") || text.includes("magic") || text.includes("brilh"))
    return IlluSparkles;

  // Fallback to category
  if (lessonCategory) {
    const catIllu = CATEGORY_ILLUSTRATIONS[lessonCategory.toLowerCase()];
    if (catIllu) return catIllu;
  }

  // Step type fallback
  if (step?.type === "intro") return IlluBook;
  if (step?.type === "vocabulary" || step?.type === "vocab") return IlluABC;
  if (step?.type === "quiz" || step?.type === "listening") return IlluZap;
  if (step?.type === "speaking") return IlluMic;
  if (step?.type === "practice") return IlluSparkles;

  return IlluBook;
}

export const Route = createFileRoute("/lessons")({
  component: LessonsPage,
});

// Lume mascot vector component — Glowing firefly (Vaga-lume Lume)
function LumiMascot({
  mood = "happy",
  phrase = "",
  isMobile = false,
}: {
  mood?: "happy" | "thinking" | "correct" | "wrong" | "speaking";
  phrase?: string;
  isMobile?: boolean;
}) {
  const defaultPhrase = {
    happy: "Olá! Sou o Lumi, sua luz de estudos. Vamos aprender com calma?",
    thinking: "Hum... Respire fundo, pense com tranquilidade...",
    correct: "Brilhante! Você iluminou este desafio!",
    wrong: "Sem pressa. O aprendizado é uma jornada calma, tente de novo!",
    speaking: "Estou ouvindo sua voz... Fale com paz e clareza!",
  }[mood];

  // Dynamic light values for the firefly tail
  const tailGlowColor = {
    happy: "#F4B34A",
    thinking: "#D4A23B",
    correct: "#4CAF50",
    wrong: "#C46D4B",
    speaking: "#1B3644",
  }[mood];

  const mascotSize = isMobile ? 90 : 140;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: isMobile ? "12px 0 16px" : "20px 0 28px",
      }}
    >
      <motion.svg
        width={mascotSize}
        height={mascotSize}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.05))" }}
      >
        <defs>
          {/* Glowing gradient for firefly belly */}
          <radialGradient id="fireflyTail" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={tailGlowColor} stopOpacity="1" />
            <stop offset="60%" stopColor={tailGlowColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={tailGlowColor} stopOpacity="0" />
          </radialGradient>

          <radialGradient id="wingGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#E2D4B7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Dynamic tail pulsing light glow (Vaga-lume light aura) */}
        <motion.circle
          cx="70"
          cy="92"
          r="26"
          fill="url(#fireflyTail)"
          animate={{
            scale: mood === "correct" ? [1, 1.4, 1] : mood === "wrong" ? [1, 1.1, 1] : [1, 1.25, 1],
            opacity: [0.6, 0.95, 0.6],
          }}
          transition={{
            duration: mood === "correct" ? 1.2 : mood === "speaking" ? 0.8 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Translucent Delicate Wings (Glassmorphic Firefly Wings) */}
        {/* Left Wing */}
        <motion.path
          d="M58 64 C28 50 18 20 48 24 C58 26 62 38 60 52"
          fill="url(#wingGradient)"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: mood === "speaking" ? [-10, 20, -10] : [-5, 8, -5] }}
          transition={{
            duration: mood === "speaking" ? 0.25 : 3.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{ transformOrigin: "60px 52px" }}
        />

        {/* Right Wing */}
        <motion.path
          d="M82 64 C112 50 122 20 92 24 C82 26 78 38 80 52"
          fill="url(#wingGradient)"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: mood === "speaking" ? [10, -20, 10] : [5, -8, 5] }}
          transition={{
            duration: mood === "speaking" ? 0.25 : 3.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{ transformOrigin: "80px 52px" }}
        />

        {/* Firefly Soft Body (Warm Cream-Sand tones) */}
        <circle cx="70" cy="72" r="28" fill="#F4F1EA" stroke="#E1DBD0" strokeWidth="2.5" />

        {/* Bottom glowing segment container */}
        <path d="M52 88 C55 98 85 98 88 88 Z" fill="#E2D4B7" opacity="0.6" />

        {/* Tender stylized eyes (Large and emotional, boutique art) */}
        {/* Left Eye */}
        <circle cx="58" cy="65" r="7.5" fill="#1C1C1A" />
        <motion.circle
          cx="60"
          cy="63"
          r="2.5"
          fill="white"
          animate={mood === "thinking" ? { x: [-1, 1, -1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Right Eye */}
        <circle cx="82" cy="65" r="7.5" fill="#1C1C1A" />
        <motion.circle
          cx="84"
          cy="63"
          r="2.5"
          fill="white"
          animate={mood === "thinking" ? { x: [-1, 1, -1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Expressive eyebrows/lids */}
        {mood === "correct" && (
          <>
            <path d="M50 56 Q58 50 66 56" stroke="#2D4A3E" strokeWidth="2" fill="none" />
            <path d="M74 56 Q82 50 90 56" stroke="#2D4A3E" strokeWidth="2" fill="none" />
          </>
        )}

        {mood === "wrong" && (
          <>
            <path d="M50 54 Q58 60 66 57" stroke="#C46D4B" strokeWidth="2" fill="none" />
            <path d="M74 57 Q82 60 90 54" stroke="#C46D4B" strokeWidth="2" fill="none" />
          </>
        )}

        {/* Subtle, beautiful golden smile */}
        <path
          d="M66 74 Q70 78 74 74"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Elegant Glowing Antennae */}
        <path
          d="M62 46 C58 36 50 34 52 24"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M78 46 C82 36 90 34 88 24"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Glowing Tips */}
        <motion.circle
          cx="52"
          cy="22"
          r="3"
          fill={tailGlowColor}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="88"
          cy="22"
          r="3"
          fill={tailGlowColor}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          marginTop: "16px",
          background: "var(--surface-raised)",
          padding: "12px 22px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text-primary)",
          border: "1.5px solid var(--border)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
          textAlign: "center",
          maxWidth: "320px",
          lineHeight: 1.5,
        }}
      >
        {phrase || defaultPhrase}
      </motion.div>
    </div>
  );
}

// ==========================================
// INTERACTIVE VISUAL AID WIDGETS (PHASE 2)
// ==========================================

function ThermometerWidget() {
  const [temp, setTemp] = useState(50); // 0 to 100

  const getTempDetails = (val: number) => {
    if (val < 20)
      return {
        term: "Brick / Freezing",
        translation: "Frio extremo / Congelando",
        color: "#3A86C8",
        label: "Muito Frio",
      };
    if (val < 45)
      return {
        term: "Chilly / Nippy",
        translation: "Frio / Friozinho agradável",
        color: "#65A6D1",
        label: "Frio",
      };
    if (val < 70)
      return {
        term: "Mild / Lukewarm",
        translation: "Morno / Agradável",
        color: "#E4A24A",
        label: "Agradável",
      };
    if (val < 88)
      return {
        term: "Roasting / Warm",
        translation: "Quente / Caloroso",
        color: "#D4724A",
        label: "Quente",
      };
    return {
      term: "Sweltering / Boiling",
      translation: "Abafado / Fervendo de calor",
      color: "#C43D43",
      label: "Extremamente Quente",
    };
  };

  const details = getTempDetails(temp);

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "24px",
        background: "var(--surface-raised)",
        border: "1.5px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05 + temp / 300, 1],
          opacity: [0.03, 0.08 + temp / 500, 0.03],
        }}
        transition={{
          duration: Math.max(0.5, 3 - temp / 40),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle, ${details.color}35, transparent 75%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          fontSize: "13px",
          fontWeight: 900,
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.08em",
          zIndex: 1,
        }}
      >
        Termômetro Interativo (Ajustável)
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          flexDirection: "row",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "40px",
            height: "180px",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: "16px",
              width: "12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.08)",
              border: "2.2px solid var(--border)",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <motion.div
              animate={{ height: `${temp}%` }}
              style={{
                width: "100%",
                background: details.color,
                borderRadius: "6px",
                boxShadow: `0 0 10px ${details.color}90`,
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: details.color,
              border: "2.5px solid var(--border)",
              boxShadow: `0 0 12px ${details.color}aa`,
              transition: "background 0.2s ease",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 850,
              color: details.color,
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            <span>{temp}°C</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              ({details.label})
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: details.color,
              cursor: "pointer",
            }}
          />

          <div
            style={{
              padding: "12px",
              borderRadius: "16px",
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                letterSpacing: "0.04em",
              }}
            >
              Expressão / Significado
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>
              {details.term}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--text-secondary)" }}>
              {details.translation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceGraphWidget() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = [
    {
      x: 30,
      y: 130,
      term: "Bear Market",
      translation: "Mercado em Baixa (pessimismo)",
      detail: "Mercado em queda prolongada. Investidores vendem.",
    },
    {
      x: 100,
      y: 100,
      term: "Broker",
      translation: "Corretora / Intermediário",
      detail: "Profissional ou instituição que executa transações.",
    },
    {
      x: 180,
      y: 110,
      term: "Shares / Equities",
      translation: "Ações de Empresas",
      detail: "Pequenas frações de propriedade em empresas listadas.",
    },
    {
      x: 260,
      y: 60,
      term: "Yield",
      translation: "Rendimento / Dividendo",
      detail: "O retorno financeiro percentual sobre o capital investido.",
    },
    {
      x: 330,
      y: 30,
      term: "Bull Market",
      translation: "Mercado em Alta (otimismo)",
      detail: "Mercado em forte crescimento de preços e euforia.",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "24px",
        background: "var(--surface-raised)",
        border: "1.5px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 900,
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        Gráfico Financeiro (Toque nos pontos)
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "150px",
          background: "var(--bg)",
          borderRadius: "16px",
          border: "1.5px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 360 150" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="financeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4714A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C4714A" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="30"
            x2="360"
            y2="30"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="75"
            x2="360"
            y2="75"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="120"
            x2="360"
            y2="120"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          <path
            d="M 30 150 L 30 130 L 100 100 L 180 110 L 260 60 L 330 30 L 330 150 Z"
            fill="url(#financeGradient)"
          />

          <motion.path
            d="M 30 130 L 100 100 L 180 110 L 260 60 L 330 30"
            fill="none"
            stroke="#C4714A"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {nodes.map((node, idx) => (
            <g key={idx}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={hoveredNode === idx ? 8 : 5}
                fill="#C4714A"
                stroke="var(--bg)"
                strokeWidth="2.5"
                style={{ cursor: "pointer", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                onMouseEnter={() => setHoveredNode(idx)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setHoveredNode(idx)}
                whileHover={{ scale: 1.35 }}
              />
            </g>
          ))}
        </svg>

        {hoveredNode === null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.01)",
              color: "var(--text-secondary)",
              fontSize: "11px",
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            Toque nos pontos para revelar o vocabulário financeiro
          </div>
        )}
      </div>

      <div
        style={{
          minHeight: "65px",
          padding: "10px 14px",
          borderRadius: "16px",
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {hoveredNode !== null ? (
          <div>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span style={{ fontSize: "14.5px", fontWeight: 800, color: "#C4714A" }}>
                {nodes[hoveredNode].term}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                }}
              >
                Finanças
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {nodes[hoveredNode].translation}
            </div>
            <div
              style={{
                fontSize: "11.5px",
                color: "var(--text-secondary)",
                marginTop: "2px",
                lineHeight: 1.35,
              }}
            >
              {nodes[hoveredNode].detail}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 550,
            }}
          >
            Selecione uma fase do gráfico de ações.
          </div>
        )}
      </div>
    </div>
  );
}

function CoinRainWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const gravity = 0.35;
    const bounce = 0.62;
    const friction = 0.985;

    interface Coin {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      rotation: number;
      rotSpeed: number;
    }

    const coins: Coin[] = [];

    // Drop 12 starting coins
    for (let i = 0; i < 12; i++) {
      coins.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * -100 - 15,
        vx: (Math.random() - 0.5) * 3.5,
        vy: Math.random() * 2 + 1,
        r: 10 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
      });
    }

    const playCoinSound = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800 + Math.random() * 500, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < coins.length; i++) {
        const c = coins[i];

        c.vy += gravity;
        c.vx *= friction;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotSpeed;

        if (c.y + c.r > canvas.height) {
          c.y = canvas.height - c.r;
          c.vy = -c.vy * bounce;
          c.vx *= 0.85;
          if (Math.abs(c.vy) > 1.2) playCoinSound();
        }

        if (c.x - c.r < 0) {
          c.x = c.r;
          c.vx = -c.vx * bounce;
          if (Math.abs(c.vx) > 1.2) playCoinSound();
        } else if (c.x + c.r > canvas.width) {
          c.x = canvas.width - c.r;
          c.vx = -c.vx * bounce;
          if (Math.abs(c.vx) > 1.2) playCoinSound();
        }

        for (let j = i + 1; j < coins.length; j++) {
          const c2 = coins[j];
          const dx = c2.x - c.x;
          const dy = c2.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = c.r + c2.r;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const tx = dx / dist;
            const ty = dy / dist;
            c.x -= tx * overlap * 0.5;
            c.y -= ty * overlap * 0.5;
            c2.x += tx * overlap * 0.5;
            c2.y += ty * overlap * 0.5;

            const kx = c.vx - c2.vx;
            const ky = c.vy - c2.vy;
            c.vx -= kx * bounce;
            c.vy -= ky * bounce;
            c2.vx += kx * bounce;
            c2.vy += ky * bounce;
          }
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, c.r);
        grad.addColorStop(0, "#FFE082");
        grad.addColorStop(0.7, "#FFB300");
        grad.addColorStop(1, "#FF8F00");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#FFEAA7";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, c.r - 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#FFF8E1";
        ctx.font = `bold ${c.r * 1.0}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("L", 0, 0.5);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let clickedCoin = false;
      for (const c of coins) {
        const dx = c.x - x;
        const dy = c.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < c.r + 8) {
          c.vy = -4.5 - Math.random() * 3.5;
          c.vx = (Math.random() - 0.5) * 6;
          clickedCoin = true;
        }
      }

      if (!clickedCoin) {
        coins.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 5,
          vy: -2.5 - Math.random() * 2.5,
          r: 9 + Math.random() * 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
        });
        if (coins.length > 40) coins.shift();
      }

      playCoinSound();
    };

    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "24px",
        background: "var(--surface-raised)",
        border: "1.5px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            letterSpacing: "0.08em",
          }}
        >
          Simulador de Moedas (Money Slang)
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#E4A24A",
            background: "rgba(228,162,74,0.1)",
            padding: "2px 8px",
            borderRadius: "8px",
          }}
        >
          Interativo
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "130px",
          borderRadius: "16px",
          border: "1.5px solid var(--border)",
          background: "var(--bg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={130}
          style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            color: "var(--text-secondary)",
            fontSize: "9px",
            fontWeight: 700,
            pointerEvents: "none",
            background: "var(--surface-raised)",
            padding: "2px 5px",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            opacity: 0.8,
          }}
        >
          Clique para chover moedas Lume!
        </div>
      </div>
    </div>
  );
}

function LessonsPage() {
  const { targetLanguage, setTargetLanguage } = useStore();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Safely load client-only values from localStorage to prevent hydration mismatch
    try {
      const savedRate = localStorage.getItem("lume_speech_rate");
      if (savedRate) setSpeechRate(parseFloat(savedRate));

      const savedCompleted = localStorage.getItem("lume_completed_lessons");
      if (savedCompleted) setCompleted(JSON.parse(savedCompleted));

      const savedProgress = localStorage.getItem("lume_lessons_progress");
      if (savedProgress) setProgress(JSON.parse(savedProgress));
    } catch (e) {
      console.warn("Could not load stored lesson details:", e);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set default lesson level filter based on persisted user level
  const { userLevel } = useUserStore();
  useEffect(() => {
    if (userLevel && filterLevel === "Todos") {
      setFilterLevel(userLevel);
    }
  }, [userLevel]);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [translationInput, setTranslationInput] = useState("");
  const [dragSelectedTokens, setDragSelectedTokens] = useState<string[]>([]);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);

  // Lume Library States
  const [searchQuery, setSearchQuery] = useState("");
  const [libTab, setLibTab] = useState<"vocab" | "sentences">("vocab");
  const [activeLibCat, setActiveLibCat] = useState<"all" | "slang" | "idiom" | "phrasal">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [selectedSentenceCat, setSelectedSentenceCat] = useState<
    "airport" | "restaurant" | "hotel" | "job_interview"
  >("airport");

  // Advanced Filter States
  const [filterCategory, setFilterCategory] = useState<string>("Tudo");
  const [filterLevel, setFilterLevel] = useState<string>("Todos");
  const [filterDuration, setFilterDuration] = useState<string>("Qualquer");
  const [sortMethod, setSortMethod] = useState<string>("Relevância");
  const [showHelp, setShowHelp] = useState(false);

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  const { addXP, addLumes } = useStore();
  const recognitionRef = useRef<any>(null);

  const lessons = useMemo(() => {
    const staticList = ALL_LESSONS.filter((l: any) => l.language === targetLanguage);
    const generatedList = (masterContent as any[]).filter((l: any) => l.language === targetLanguage);
    return [...staticList, ...generatedList];
  }, [targetLanguage]);

  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [targetLanguage]);

  const filteredLessons = useMemo(() => {
    let list = lessons;

    // Category Filter
    if (filterCategory !== "Tudo") {
      list = list.filter((l) => {
        const cat = l.category?.toLowerCase() || "";
        const f = filterCategory.toLowerCase();
        if (f === "gramática" || f === "grammar")
          return cat.includes("gram") || cat.includes("verb");
        if (f === "vocabulário" || f === "vocabulary") return cat.includes("vocab");
        if (f === "culture" || f === "cultura") return cat.includes("cult");
        if (f === "idioms" || f === "expressões" || f === "expresiones")
          return cat.includes("idiom") || cat.includes("expr");
        return cat.includes(f);
      });
    }

    // Level Filter
    if (filterLevel !== "Todos") {
      list = list.filter((l) => {
        const lvl = l.level?.toLowerCase() || "";
        const fl = filterLevel.toLowerCase();
        if (fl === "a1" || fl === "a2") return lvl.includes("begin") || lvl.includes("iniciante");
        if (fl === "b1" || fl === "b2") return lvl.includes("intermed");
        if (fl === "c1" || fl === "c2") return lvl.includes("advanc") || lvl.includes("avançad");
        return true;
      });
    }

    // Duration Filter
    if (filterDuration !== "Qualquer") {
      list = list.filter((l) => {
        const mins = parseInt(l.duration) || 5;
        if (filterDuration === "0-5 min") return mins <= 5;
        if (filterDuration === "5-10 min") return mins > 5 && mins <= 10;
        if (filterDuration === "10+ min") return mins > 10;
        return true;
      });
    }

    // Sorting
    if (sortMethod === "Mais XP") {
      list = [...list].sort((a, b) => b.xp - a.xp);
    } else if (sortMethod === "Mais novos") {
      list = [...list].reverse();
    } else if (sortMethod === "Mais populares") {
      list = [...list].sort((a, b) => (b.title.charCodeAt(0) % 10) - (a.title.charCodeAt(0) % 10));
    }

    return list;
  }, [lessons, filterCategory, filterLevel, filterDuration, sortMethod]);

  const paginatedLessons = useMemo(() => {
    const start = (currentPage - 1) * lessonsPerPage;
    return filteredLessons.slice(start, start + lessonsPerPage);
  }, [filteredLessons, currentPage]);

  const continueLearningLessons = useMemo(() => {
    return lessons
      .filter((l) => progress[l.id] !== undefined && !completed.includes(l.id))
      .slice(0, 3);
  }, [lessons, progress, completed]);

  const recommendedLessons = useMemo(() => {
    return lessons
      .filter((l) => !completed.includes(l.id) && progress[l.id] === undefined)
      .slice(0, 3);
  }, [lessons, completed, progress]);

  const filteredVocab = useMemo(() => {
    return MASSIVE_VOCABULARY.filter((item) => {
      const matchesSearch =
        item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning_pt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeLibCat === "all" || item.category === activeLibCat;
      const matchesDiff = activeDifficulty === "all" || item.difficulty === activeDifficulty;
      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [searchQuery, activeLibCat, activeDifficulty]);

  const startLesson = (lessonId: string) => {
    setActiveLesson(lessonId);
    setStep(progress[lessonId] || 0);
  };

  const totalPages = Math.ceil(lessons.length / lessonsPerPage);

  const handlePlayAudio = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR";
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Seu navegador não suporta síntese de voz.");
    }
  };

  const toggleRecording = (targetPhrase: string, lang: string) => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setSpokenText("");
      setSpeechScore(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);

      const targetClean = targetPhrase.toLowerCase().replace(/[^\w\s]|_/g, "");
      const spokenClean = transcript.toLowerCase().replace(/[^\w\s]|_/g, "");

      let finalScore = 0;
      if (targetClean === spokenClean) {
        finalScore = 100;
      } else if (targetClean.includes(spokenClean) || spokenClean.includes(targetClean)) {
        finalScore = 85;
      } else {
        const targetWords = targetClean.split(" ");
        const spokenWords = spokenClean.split(" ");
        let matches = 0;
        spokenWords.forEach((w: string) => {
          if (targetWords.includes(w)) matches++;
        });
        finalScore = Math.max(15, Math.min(100, Math.round((matches / targetWords.length) * 100)));
      }

      setSpeechScore(finalScore);
      if (finalScore >= 70) {
        sounds.playSuccess();
        toast.success("Excelente pronúncia!");
      } else {
        sounds.playError();
        toast.error("Vamos tentar novamente?");
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Erro ao gravar. Verifique as permissões de microfone.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (activeLesson) {
    const lesson = lessons.find((l) => l.id === activeLesson)!;
    const currentStep = lesson.steps[step] as any;
    const isLast = step === lesson.steps.length - 1;

    let canContinue = true;
    if (
      currentStep.type === "quiz" ||
      currentStep.type === "listening" ||
      currentStep.type === "translation" ||
      currentStep.type === "dragdrop"
    ) {
      canContinue = answered;
    } else if (currentStep.type === "speaking") {
      canContinue = speechScore !== null;
    }

    // Determine Lumi mood dynamically
    let lumiMood: "happy" | "thinking" | "correct" | "wrong" | "speaking" = "happy";
    let lumiPhrase = "";
    if (currentStep.type === "quiz" || currentStep.type === "listening") {
      if (answered) {
        const isCorrect = selectedAnswer === currentStep.correct;
        lumiMood = isCorrect ? "correct" : "wrong";
      } else {
        lumiMood = "thinking";
        lumiPhrase = "Qual das opções abaixo está correta?";
      }
    } else if (currentStep.type === "translation" || currentStep.type === "dragdrop") {
      if (answered) {
        lumiMood = isCorrectFeedback ? "correct" : "wrong";
      } else {
        lumiMood = "thinking";
        lumiPhrase =
          currentStep.type === "translation"
            ? "Escreva a tradução correta da frase!"
            : "Ordene as palavras para montar a frase!";
      }
    } else if (currentStep.type === "speaking") {
      if (isRecording) {
        lumiMood = "speaking";
      } else if (speechScore !== null) {
        lumiMood = speechScore >= 70 ? "correct" : "wrong";
      }
    }

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at top right, rgba(45,74,62,0.05), transparent), var(--bg)",
          overflow: "hidden",
        }}
      >
        <AppHeader hideMobileTabs={true} />

        <div
          style={{
            maxWidth: "680px",
            width: "100%",
            margin: "0 auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: isMobile ? "16px 12px 12px" : "24px 24px 24px",
            height: "calc(100vh - 58px)",
            overflow: "hidden",
          }}
        >
          {/* Progress header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setActiveLesson(null);
                  setStep(0);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSpeechScore(null);
                  setTranslationInput("");
                  setDragSelectedTokens([]);
                  setIsCorrectFeedback(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "16px",
                  background: "var(--surface-raised)",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
                className="hover:scale-102 active:scale-98 transition-transform"
              >
                <ChevronLeft size={16} strokeWidth={2.8} />
                <span>{(targetLanguage as any) === "pt" ? "Voltar" : "Exit"}</span>
              </button>

              {/* Speed rate selector button pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--surface-raised)",
                  border: "1.5px solid var(--border)",
                  padding: "6px 14px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <Sliders size={13} style={{ color: "var(--text-secondary)" }} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Voz:
                </span>
                <select
                  value={speechRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSpeechRate(val);
                    localStorage.setItem("lume_speech_rate", val.toString());
                    toast.success(`Velocidade ajustada para ${val}x!`);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "0 2px",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    outline: "none",
                    width: "auto",
                    boxShadow: "none",
                  }}
                >
                  <option value="0.6">0.6x (Lento)</option>
                  <option value="0.8">0.8x</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.2">1.2x</option>
                  <option value="1.5">1.5x (Rápido)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: "8px",
                    background: "var(--border)",
                    borderRadius: "99px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "99px",
                      background: `linear-gradient(90deg, ${lesson.color}, ${lesson.color}EE)`,
                      width: `${((step + 1) / lesson.steps.length) * 100}%`,
                      transition: "width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  />
                </div>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-secondary)" }}>
                {step + 1} / {lesson.steps.length}
              </span>
            </div>
          </div>

          {/* Scrollable middle container (mascot + step content) */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              paddingRight: "6px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            className="lume-scrollbar"
          >
            {/* Lumi Mascot Greeting */}
            <LumiMascot mood={lumiMood} phrase={lumiPhrase} isMobile={isMobile} />

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="glass premium-shadow"
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "32px",
                  padding: isMobile ? "20px 16px" : "36px",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {currentStep.type === "intro" &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div>
                        {/* Glowing illustration circle */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}20, ${lesson.color}08)`,
                            border: `2px solid ${lesson.color}25`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            boxShadow: `0 0 32px ${lesson.color}15, 0 8px 24px rgba(0,0,0,0.04)`,
                          }}
                        >
                          <StepIllu
                            size={44}
                            primary={lesson.color}
                            secondary={lesson.color + "AA"}
                          />
                        </motion.div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: lesson.color,
                            marginBottom: "14px",
                            justifyContent: "center",
                          }}
                        >
                          <BookOpen size={18} />
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 900,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Introdução
                          </span>
                        </div>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "28px",
                            marginBottom: "16px",
                            color: "var(--text-primary)",
                            fontWeight: 850,
                            textAlign: "center",
                          }}
                        >
                          {currentStep.title}
                        </h2>
                        <p
                          style={{
                            fontSize: "17px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.75,
                            fontWeight: 500,
                          }}
                        >
                          {currentStep.text || (currentStep as any).content}
                        </p>
                      </div>
                    );
                  })()}

                {(currentStep.type === "vocabulary" || currentStep.type === "vocab") &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div>
                        {/* Vocab illustration */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                          style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}18, ${lesson.color}06)`,
                            border: `2px solid ${lesson.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            boxShadow: `0 0 24px ${lesson.color}10`,
                          }}
                        >
                          <StepIllu
                            size={40}
                            primary={lesson.color}
                            secondary={lesson.color + "AA"}
                          />
                        </motion.div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: lesson.color,
                            marginBottom: "16px",
                            justifyContent: "center",
                          }}
                        >
                          <Brain size={20} />
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 900,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Apresentação Vocabulário
                          </span>
                        </div>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "24px",
                            marginBottom: "22px",
                            color: "var(--text-primary)",
                            fontWeight: 850,
                            textAlign: "center",
                          }}
                        >
                          Foque nestas expressões chaves:
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {/* Handcrafted single word vocabulary structure */}
                          {(currentStep.word || (currentStep as any).word) && (
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              style={{
                                padding: "20px",
                                borderRadius: "20px",
                                border: "1.5px solid var(--border)",
                                background: "var(--bg)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.01)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "6px",
                                }}
                              >
                                <span
                                  style={{ fontWeight: 850, fontSize: "19px", color: lesson.color }}
                                >
                                  {currentStep.word || (currentStep as any).word}
                                </span>
                                <button
                                  onClick={() =>
                                    handlePlayAudio(
                                      currentStep.word || (currentStep as any).word,
                                      lesson.language,
                                    )
                                  }
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: `${lesson.color}15`,
                                    color: lesson.color,
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  className="hover:scale-110 active:scale-95 transition-transform"
                                >
                                  <Volume2 size={16} />
                                </button>
                              </div>
                              <div
                                style={{
                                  fontSize: "14.5px",
                                  color: "var(--text-secondary)",
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                }}
                              >
                                {currentStep.translation ||
                                  (currentStep as any).translation ||
                                  (currentStep as any).meaning}
                              </div>
                              {(currentStep.example || (currentStep as any).example) && (
                                <div
                                  style={{
                                    fontSize: "13.5px",
                                    fontStyle: "italic",
                                    fontWeight: 500,
                                    padding: "10px 14px",
                                    background: "var(--surface-raised)",
                                    borderRadius: "12px",
                                    borderLeft: `4.5px solid ${lesson.color}`,
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  "{currentStep.example || (currentStep as any).example}"
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* Dynamic catalogue vocabulary array structure */}
                          {(currentStep as any).words?.map((w: any, idxVal: number) => (
                            <motion.div
                              key={idxVal}
                              whileHover={{ scale: 1.01 }}
                              style={{
                                padding: "20px",
                                borderRadius: "20px",
                                border: "1.5px solid var(--border)",
                                background: "var(--bg)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.01)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "6px",
                                }}
                              >
                                <span
                                  style={{ fontWeight: 850, fontSize: "19px", color: lesson.color }}
                                >
                                  {w.word}
                                </span>
                                <button
                                  onClick={() => handlePlayAudio(w.word, lesson.language)}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: `${lesson.color}15`,
                                    color: lesson.color,
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  className="hover:scale-110 active:scale-95 transition-transform"
                                >
                                  <Volume2 size={16} />
                                </button>
                              </div>
                              <div
                                style={{
                                  fontSize: "14.5px",
                                  color: "var(--text-secondary)",
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                }}
                              >
                                {w.meaning}
                              </div>
                              <div
                                style={{
                                  fontSize: "13.5px",
                                  fontStyle: "italic",
                                  fontWeight: 500,
                                  padding: "10px 14px",
                                  background: "var(--surface-raised)",
                                  borderRadius: "12px",
                                  borderLeft: `4.5px solid ${lesson.color}`,
                                  color: "var(--text-secondary)",
                                }}
                              >
                                "{w.example}"
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                {(currentStep.type === "quiz" || currentStep.type === "listening") &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div>
                        {/* Quiz illustration */}
                        <motion.div
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}18, ${lesson.color}06)`,
                            border: `2px solid ${lesson.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            boxShadow: `0 0 20px ${lesson.color}10`,
                          }}
                        >
                          <StepIllu
                            size={36}
                            primary={lesson.color}
                            secondary={lesson.color + "99"}
                          />
                        </motion.div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "22px",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              padding: "5px 14px",
                              borderRadius: "99px",
                              background: `${lesson.color}12`,
                              color: lesson.color,
                              fontSize: "11px",
                              fontWeight: 900,
                              textTransform: "uppercase",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              border: `1.5px solid ${lesson.color}18`,
                            }}
                          >
                            {currentStep.type === "listening" ? (
                              <Volume2 size={14} />
                            ) : (
                              <Sparkles size={14} />
                            )}
                            {currentStep.type === "listening"
                              ? "Compreensão Auditiva"
                              : "Desafio Lume"}
                          </span>
                        </div>

                        {currentStep.type === "listening" && currentStep.audioText && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePlayAudio(currentStep.audioText!, lesson.language)}
                            style={{
                              marginBottom: "28px",
                              padding: "16px 28px",
                              borderRadius: "20px",
                              border: "none",
                              background: lesson.color,
                              color: "white",
                              fontWeight: 800,
                              fontSize: "16px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "12px",
                              cursor: "pointer",
                              boxShadow: `0 8px 24px ${lesson.color}40`,
                            }}
                          >
                            <Volume2 size={20} />
                            Ouvir áudio com atenção
                          </motion.button>
                        )}

                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "23px",
                            marginBottom: "26px",
                            color: "var(--text-primary)",
                            fontWeight: 850,
                            lineHeight: 1.35,
                          }}
                        >
                          {currentStep.question}
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          {currentStep.options?.map((opt: any, i: number) => {
                            const isCorrect = i === currentStep.correct;
                            const isSelected = selectedAnswer === i;
                            const state = answered
                              ? isCorrect
                                ? "correct"
                                : isSelected
                                  ? "wrong"
                                  : "neutral"
                              : "default";

                            let btnBorder = "1.5px solid var(--border)";
                            let btnBg = "var(--surface-raised)";
                            let btnColor = "var(--text-primary)";

                            if (state === "correct") {
                              btnBorder = "2px solid var(--accent-green)";
                              btnBg = "rgba(76,175,80,0.06)";
                              btnColor = "var(--accent-green)";
                            } else if (state === "wrong") {
                              btnBorder = "2px solid var(--accent-terra)";
                              btnBg = "rgba(244,67,54,0.06)";
                              btnColor = "var(--accent-terra)";
                            } else if (!answered) {
                              // Hover/default
                            }

                            return (
                              <motion.button
                                key={i}
                                whileHover={!answered ? { scale: 1.01, y: -1 } : {}}
                                onClick={() => {
                                  if (!answered) {
                                    setSelectedAnswer(i);
                                    setAnswered(true);
                                    if (i === currentStep.correct) {
                                      sounds.playSuccess();
                                    } else {
                                      sounds.playError();
                                    }
                                  }
                                }}
                                style={{
                                  padding: "18px 24px",
                                  borderRadius: "18px",
                                  textAlign: "left",
                                  cursor: answered ? "default" : "pointer",
                                  fontSize: "15.5px",
                                  fontWeight: 700,
                                  border: btnBorder,
                                  background: btnBg,
                                  color: btnColor,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                }}
                                className={state === "wrong" ? "shake-element" : ""}
                              >
                                <span>{opt}</span>
                                {state === "correct" && (
                                  <CheckCircle size={20} color="var(--accent-green)" />
                                )}
                                {state === "wrong" && (
                                  <AlertTriangle size={20} color="var(--accent-terra)" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                {currentStep.type === "speaking" &&
                  currentStep.targetPhrase &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div style={{ textAlign: "center" }}>
                        {/* Speaking illustration */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                          style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}18, ${lesson.color}06)`,
                            border: `2px solid ${lesson.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            boxShadow: `0 0 28px ${lesson.color}12`,
                          }}
                        >
                          <StepIllu
                            size={40}
                            primary={lesson.color}
                            secondary={lesson.color + "AA"}
                          />
                        </motion.div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 14px",
                            borderRadius: "99px",
                            background: `${lesson.color}12`,
                            color: lesson.color,
                            fontSize: "11px",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            marginBottom: "24px",
                            border: `1.5px solid ${lesson.color}18`,
                          }}
                        >
                          <Mic size={14} /> Treino de Pronúncia
                        </div>

                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "24px",
                            marginBottom: "18px",
                            color: "var(--text-primary)",
                            fontWeight: 850,
                          }}
                        >
                          Pronuncie a frase abaixo:
                        </h2>

                        <div
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            justifyContent: "center",
                            width: "100%",
                            marginBottom: "24px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "22px",
                              color: lesson.color,
                              fontWeight: 800,
                              padding: "24px 36px",
                              background: "var(--bg)",
                              borderRadius: "20px",
                              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.01)",
                              width: "100%",
                              border: "1.5px solid var(--border)",
                            }}
                          >
                            "{currentStep.targetPhrase}"
                          </div>
                          <button
                            onClick={() =>
                              handlePlayAudio(currentStep.targetPhrase!, lesson.language)
                            }
                            style={{
                              position: "absolute",
                              right: "14px",
                              top: "14px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "var(--surface-raised)",
                              border: "1.5px solid var(--border)",
                              color: lesson.color,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="hover:scale-105 active:scale-95 transition-transform"
                          >
                            <Volume2 size={18} />
                          </button>
                        </div>

                        {/* Pulsing micro indicator */}
                        <div
                          style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            margin: "0 auto 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isRecording && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                              style={{
                                position: "absolute",
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "var(--accent-terra)",
                              }}
                            />
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              toggleRecording(currentStep.targetPhrase!, lesson.language)
                            }
                            style={{
                              width: "76px",
                              height: "76px",
                              borderRadius: "50%",
                              border: "none",
                              background: isRecording ? "var(--accent-terra)" : lesson.color,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: `0 8px 24px ${isRecording ? "rgba(196,109,75,0.4)" : lesson.color + "40"}`,
                              zIndex: 2,
                              position: "relative",
                            }}
                          >
                            <Mic size={30} />
                          </motion.button>
                        </div>

                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            fontWeight: 700,
                          }}
                        >
                          {isRecording
                            ? "Ouvindo... Fale agora!"
                            : "Toque no microfone para gravar sua voz"}
                        </p>

                        {spokenText && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              marginTop: "32px",
                              padding: "20px",
                              borderRadius: "20px",
                              border: "1.5px solid var(--border)",
                              textAlign: "left",
                              background: "var(--bg)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 900,
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: "8px",
                              }}
                            >
                              Sua Fala
                            </span>
                            <p
                              style={{
                                fontSize: "16.5px",
                                color: "var(--text-primary)",
                                fontStyle: "italic",
                                fontWeight: 600,
                                marginBottom: "16px",
                              }}
                            >
                              "{spokenText}"
                            </p>

                            {speechScore !== null && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "12px 18px",
                                  background:
                                    speechScore >= 70
                                      ? "rgba(76,175,80,0.08)"
                                      : "rgba(244,67,54,0.08)",
                                  borderRadius: "14px",
                                  border:
                                    speechScore >= 70
                                      ? "1px solid rgba(76,175,80,0.15)"
                                      : "1px solid rgba(244,67,54,0.15)",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 800,
                                    color:
                                      speechScore >= 70
                                        ? "var(--accent-green)"
                                        : "var(--accent-terra)",
                                    fontSize: "14px",
                                  }}
                                >
                                  Precisão de pronúncia
                                </span>
                                <span
                                  style={{
                                    fontSize: "22px",
                                    fontWeight: 900,
                                    color:
                                      speechScore >= 70
                                        ? "var(--accent-green)"
                                        : "var(--accent-terra)",
                                  }}
                                >
                                  {speechScore}%
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    );
                  })()}

                {currentStep.type === "translation" &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div style={{ textAlign: "center" }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}18, ${lesson.color}06)`,
                            border: `2px solid ${lesson.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                          }}
                        >
                          <StepIllu size={36} primary={lesson.color} secondary={lesson.color + "99"} />
                        </motion.div>
                        <h2 style={{ fontSize: "22px", marginBottom: "18px", color: "var(--text-primary)", fontWeight: 800 }}>
                          Traduzir Frase
                        </h2>
                        <div
                          style={{
                            fontSize: "20px",
                            color: lesson.color,
                            fontWeight: 700,
                            padding: "16px",
                            background: "var(--bg)",
                            borderRadius: "16px",
                            border: "1.5px solid var(--border)",
                            marginBottom: "20px",
                          }}
                        >
                          "{currentStep.targetPhrase}"
                        </div>
                        <input
                          type="text"
                          disabled={answered}
                          value={translationInput}
                          onChange={(e) => setTranslationInput(e.target.value)}
                          placeholder="Digite a tradução aqui..."
                          style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "14px",
                            border: answered 
                              ? isCorrectFeedback 
                                ? "2.5px solid var(--accent-green)" 
                                : "2.5px solid var(--accent-terra)"
                              : "1.5px solid var(--border)",
                            background: "var(--surface)",
                            color: "var(--text-primary)",
                            fontSize: "16px",
                            fontWeight: 600,
                            marginBottom: "20px",
                          }}
                        />
                        {!answered && (
                          <button
                            disabled={!translationInput.trim()}
                            onClick={() => {
                              const userAns = translationInput.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
                              const correctAns = currentStep.correctTranslation.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
                              const isMatch = userAns === correctAns;
                              setIsCorrectFeedback(isMatch);
                              setAnswered(true);
                              if (isMatch) {
                                sounds.playSuccess();
                              } else {
                                sounds.playError();
                              }
                            }}
                            style={{
                              padding: "12px 24px",
                              borderRadius: "12px",
                              background: lesson.color,
                              color: "white",
                              border: "none",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Verificar
                          </button>
                        )}
                        {answered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              padding: "16px",
                              borderRadius: "14px",
                              background: isCorrectFeedback ? "rgba(76,175,80,0.08)" : "rgba(244,67,54,0.08)",
                              border: isCorrectFeedback ? "1px solid var(--accent-green)" : "1px solid var(--accent-terra)",
                              color: isCorrectFeedback ? "var(--accent-green)" : "var(--accent-terra)",
                              fontWeight: 700,
                              textAlign: "left",
                            }}
                          >
                            <div>{isCorrectFeedback ? "🎉 Excelente! Tradução perfeita." : "❌ Ops, quase lá!"}</div>
                            <div style={{ fontSize: "14px", marginTop: "4px", color: "var(--text-secondary)" }}>
                              {currentStep.explanation || `Tradução correta: "${currentStep.correctTranslation}"`}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })()}

                {currentStep.type === "dragdrop" &&
                  (() => {
                    const StepIllu = getIllustrationForStep(currentStep, lesson.category);
                    return (
                      <div style={{ textAlign: "center" }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${lesson.color}18, ${lesson.color}06)`,
                            border: `2px solid ${lesson.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                          }}
                        >
                          <StepIllu size={36} primary={lesson.color} secondary={lesson.color + "99"} />
                        </motion.div>
                        <h2 style={{ fontSize: "22px", marginBottom: "18px", color: "var(--text-primary)", fontWeight: 800 }}>
                          Organize as Palavras
                        </h2>
                        <div style={{ color: "var(--text-secondary)", marginBottom: "12px", fontWeight: 600 }}>
                          Traduza a frase: "{currentStep.sentence}"
                        </div>

                        {/* Selected tokens container */}
                        <div
                          style={{
                            minHeight: "60px",
                            padding: "12px",
                            borderRadius: "14px",
                            border: answered
                              ? isCorrectFeedback
                                ? "2.5px solid var(--accent-green)"
                                : "2.5px solid var(--accent-terra)"
                              : "1.5px solid var(--border)",
                            background: "var(--surface)",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "20px",
                          }}
                        >
                          {dragSelectedTokens.length === 0 && (
                            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                              Clique nas palavras abaixo para construir a frase
                            </span>
                          )}
                          {dragSelectedTokens.map((tok, idx) => (
                            <motion.button
                              key={idx}
                              disabled={answered}
                              onClick={() => {
                                setDragSelectedTokens(dragSelectedTokens.filter((_, tIdx) => tIdx !== idx));
                              }}
                              style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                background: "var(--surface-raised)",
                                border: "1.5px solid var(--border)",
                                color: "var(--text-primary)",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {tok}
                            </motion.button>
                          ))}
                        </div>

                        {/* Word Pool */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            justifyContent: "center",
                            marginBottom: "24px",
                          }}
                        >
                          {currentStep.tokens?.map((tok: string, idx: number) => {
                            const totalInPool = currentStep.tokens.filter((t: string) => t === tok).length;
                            const totalSelected = dragSelectedTokens.filter(t => t === tok).length;
                            const isUsed = totalSelected >= totalInPool;

                            return (
                              <motion.button
                                key={idx}
                                disabled={isUsed || answered}
                                onClick={() => {
                                  setDragSelectedTokens([...dragSelectedTokens, tok]);
                                }}
                                style={{
                                  padding: "8px 14px",
                                  borderRadius: "8px",
                                  background: isUsed ? "var(--border)" : "var(--surface-raised)",
                                  border: "1.5px solid var(--border)",
                                  color: isUsed ? "var(--text-muted)" : "var(--text-primary)",
                                  fontWeight: 700,
                                  cursor: isUsed ? "default" : "pointer",
                                  opacity: isUsed ? 0.4 : 1,
                                }}
                                whileHover={!isUsed && !answered ? { scale: 1.05 } : {}}
                                whileTap={!isUsed && !answered ? { scale: 0.95 } : {}}
                              >
                                {tok}
                              </motion.button>
                            );
                          })}
                        </div>

                        {!answered && (
                          <button
                            disabled={dragSelectedTokens.length === 0}
                            onClick={() => {
                              const isMatch =
                                JSON.stringify(dragSelectedTokens) ===
                                JSON.stringify(currentStep.answerTokens);
                              setIsCorrectFeedback(isMatch);
                              setAnswered(true);
                              if (isMatch) {
                                sounds.playSuccess();
                              } else {
                                sounds.playError();
                              }
                            }}
                            style={{
                              padding: "12px 24px",
                              borderRadius: "12px",
                              background: lesson.color,
                              color: "white",
                              border: "none",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Verificar
                          </button>
                        )}

                        {answered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              padding: "16px",
                              borderRadius: "14px",
                              background: isCorrectFeedback ? "rgba(76,175,80,0.08)" : "rgba(244,67,54,0.08)",
                              border: isCorrectFeedback ? "1px solid var(--accent-green)" : "1px solid var(--accent-terra)",
                              color: isCorrectFeedback ? "var(--accent-green)" : "var(--accent-terra)",
                              fontWeight: 700,
                              textAlign: "left",
                            }}
                          >
                            <div>{isCorrectFeedback ? "🎉 Incrível! Você ordenou perfeitamente." : "❌ Ops, ordem incorreta."}</div>
                            <div style={{ fontSize: "14px", marginTop: "4px", color: "var(--text-secondary)" }}>
                              Ordem correta: <strong style={{ color: "var(--text-primary)" }}>{currentStep.answerTokens.join(" ")}</strong>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })()}

                {currentStep.type === "practice" && (
                  <div style={{ textAlign: "center" }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(74,122,90,0.15), rgba(74,122,90,0.04))`,
                        border: "2px solid rgba(74,122,90,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 0 32px rgba(74,122,90,0.1), 0 8px 24px rgba(0,0,0,0.04)",
                      }}
                    >
                      <IlluSparkles
                        size={44}
                        primary="var(--accent-green)"
                        secondary="var(--accent-gold)"
                      />
                    </motion.div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "26px",
                        marginBottom: "8px",
                        color: "var(--text-primary)",
                        fontWeight: 850,
                      }}
                    >
                      Sua prática está pronta!
                    </h2>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "32px",
                        fontSize: "15.5px",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      Agora consolide tudo conversando livremente com a inteligência artificial
                      paciente Lume.
                    </p>
                    <Link
                      to={
                        `/conversation/free-talk?prompt=${encodeURIComponent(currentStep.chatPrompt || (currentStep as any).prompt || "")}` as any
                      }
                      style={{
                        display: "block",
                        padding: "20px",
                        borderRadius: "20px",
                        background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}DD)`,
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "16px",
                        boxShadow: `0 8px 24px ${lesson.color}35`,
                      }}
                      className="hover:scale-[1.01] active:scale-95 transition-transform"
                    >
                      Iniciar Chat de Conversação Lume →
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Continue button */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "12px",
              flexShrink: 0,
              borderTop: "1px solid var(--border)",
            }}
          >
            <motion.button
              whileTap={canContinue ? { scale: 0.98 } : {}}
              onClick={() => {
                if (isLast) {
                  addXP(lesson.xp);
                  addLumes(10);

                  const newCompleted = [...completed];
                  if (!newCompleted.includes(lesson.id)) {
                    newCompleted.push(lesson.id);
                  }
                  setCompleted(newCompleted);
                  localStorage.setItem("lume_completed_lessons", JSON.stringify(newCompleted));

                  const newProgress = { ...progress };
                  delete newProgress[lesson.id];
                  setProgress(newProgress);
                  localStorage.setItem("lume_lessons_progress", JSON.stringify(newProgress));

                  setActiveLesson(null);
                  setStep(0);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSpeechScore(null);
                  setSpokenText("");
                  setTranslationInput("");
                  setDragSelectedTokens([]);
                  setIsCorrectFeedback(null);

                  // Spark confetti
                  confetti({
                    particleCount: 150,
                    spread: 85,
                    origin: { y: 0.6 },
                  });
                  sounds.playUnlock();

                  toast.success(
                    `Parabéns! Você concluiu a lição e ganhou ${lesson.xp} XP e 10 Lumes!`,
                    { duration: 6000 },
                  );
                } else {
                  const nextS = step + 1;
                  setStep(nextS);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSpeechScore(null);
                  setSpokenText("");
                  setTranslationInput("");
                  setDragSelectedTokens([]);
                  setIsCorrectFeedback(null);

                  const newProgress = { ...progress, [lesson.id]: nextS };
                  setProgress(newProgress);
                  localStorage.setItem("lume_lessons_progress", JSON.stringify(newProgress));
                }
              }}
              disabled={!canContinue}
              style={{
                width: "100%",
                padding: isMobile ? "14px" : "18px",
                borderRadius: "20px",
                background: !canContinue
                  ? "var(--border)"
                  : `linear-gradient(135deg, ${lesson.color}, ${lesson.color}CC)`,
                color: !canContinue ? "#A8A8A0" : "white",
                border: "none",
                cursor: !canContinue ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: 800,
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isLast ? (
                  <>
                    <Sparkles size={18} /> Concluir e pontuar
                  </>
                ) : (
                  "Continuar jornada →"
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  function FlagSvg({ lang, size = 20 }: { lang: string; size?: number }) {
    if (lang === "en") {
      return (
        <svg width={size} height={size} viewBox="0 0 640 480" style={{ borderRadius: "4px" }}>
          <rect width="640" height="480" fill="#012169" />
          <path d="M0 0l640 480M640 0L0 480" stroke="#fff" strokeWidth="80" />
          <path d="M0 0l640 480M640 0L0 480" stroke="#C8102E" strokeWidth="48" />
          <path d="M320 0v480M0 240h640" stroke="#fff" strokeWidth="120" />
          <path d="M320 0v480M0 240h640" stroke="#C8102E" strokeWidth="80" />
        </svg>
      );
    }
    if (lang === "es") {
      return (
        <svg width={size} height={size} viewBox="0 0 640 480" style={{ borderRadius: "4px" }}>
          <rect width="640" height="480" fill="#c60b1e" />
          <rect y="120" width="640" height="240" fill="#ffc400" />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 640 480" style={{ borderRadius: "4px" }}>
        <rect width="640" height="480" fill="#009c3b" />
        <path d="M320 80L560 240L320 400L80 240Z" fill="#fedf00" />
        <circle cx="320" cy="240" r="85" fill="#002776" />
      </svg>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
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
                  Guia Prático de Estudos
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
                  <strong>1. Trilhas Temáticas:</strong> Filtre as lições por tipo de habilidade
                  (Gramática, Escrita, Vocabulário) dependendo da sua necessidade imediata.
                </p>
                <p>
                  <strong>2. Interatividade IA:</strong> Cada lição possui etapas exclusivas de
                  quiz, reconhecimento de fala por microfone e diálogos com nosso tutor Lume IA.
                </p>
                <p>
                  <strong>3. Biblioteca:</strong> Role até a base da página para acessar mais de 200
                  gírias reais com áudio gravado nos sotaques corretos.
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
                Entendi!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "40px 24px 40px",
          animation: "pageEnter 0.6s ease-out both",
        }}
      >
        {/* Top Header & Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Back Button */}
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
            {targetLanguage === "pt" ? "Voltar ao Início" : "Back to Home"}
          </Link>

          {/* Quick Target Language Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--surface-raised)",
              padding: "8px 16px",
              borderRadius: "16px",
              border: "1.5px solid var(--border)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "4px",
              }}
            >
              <FlagSvg lang={targetLanguage} size={22} />
            </span>
            <select
              value={targetLanguage}
              onChange={(e) => {
                const val = e.target.value as any;
                setTargetLanguage(val);
                toast.success(
                  `Idioma de estudos alterado para ${val === "en" ? "Inglês" : val === "es" ? "Espanhol" : "Português"}`,
                );
              }}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontWeight: 800,
                fontSize: "13.5px",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="pt">🇧🇷 Português</option>
            </select>
          </div>
        </div>

        {/* PAGE HEADING */}
        <div style={{ marginBottom: "40px", textAlign: "center", position: "relative" }}>
          {/* Floating decorative illustrations */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "-10px",
              left: "5%",
              opacity: 0.12,
              pointerEvents: "none",
            }}
          >
            <IlluGlobe size={80} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: "absolute",
              top: "0px",
              right: "5%",
              opacity: 0.1,
              pointerEvents: "none",
            }}
          >
            <IlluBook size={72} />
          </motion.div>

          <div
            style={{
              display: "inline-flex",
              gap: "6px",
              alignItems: "center",
              color: "var(--accent-green)",
              fontWeight: 800,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={12} />
            Catálogo de Imersões
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px,4vw,40px)",
              marginBottom: "8px",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.025em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            Lições de{" "}
            {targetLanguage === "en"
              ? "Inglês"
              : targetLanguage === "es"
                ? "Espanhol"
                : "Português"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              fontWeight: 500,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Sessões imersivas geradas sob demanda com foco em pronúncia, audição e conversação.
          </p>
        </div>

        {/* ── SECTION: CONTINUE LEARNING ────────────────────────── */}
        {continueLearningLessons.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "var(--accent-terra)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={14} /> Continue Aprendendo
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {continueLearningLessons.map((lesson) => {
                const currentStepIdx = progress[lesson.id] || 0;
                const totalStepsCount = lesson.steps?.length || 5;
                const progressPercent = Math.round((currentStepIdx / totalStepsCount) * 100);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => startLesson(lesson.id)}
                    style={{
                      background: "var(--surface-raised)",
                      borderRadius: "20px",
                      padding: "20px",
                      border: "1.5px solid var(--border)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className="hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: lesson.color,
                          textTransform: "uppercase",
                        }}
                      >
                        {lesson.level} • {lesson.category}
                      </span>
                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "16px",
                          fontWeight: 800,
                          margin: "6px 0",
                          color: "var(--text-primary)",
                        }}
                      >
                        {lesson.title}
                      </h4>
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          marginBottom: "4px",
                        }}
                      >
                        <span>Progresso</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div
                        style={{
                          height: "5px",
                          background: "var(--bg)",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: "100%",
                            background: lesson.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION: RECOMMENDED FOR YOU ─────────────────────── */}
        {recommendedLessons.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "var(--accent-green)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Star size={14} /> Recomendado Para Você
            </h3>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                paddingBottom: "16px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="scroll-hint"
            >
              {recommendedLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  onClick={() => startLesson(lesson.id)}
                  whileHover={{ y: -4, boxShadow: `0 12px 36px ${lesson.color}20` }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: "20px",
                    padding: "20px",
                    border: `1.5px solid ${lesson.color}30`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minWidth: "260px",
                    flexShrink: 0,
                  }}
                  className="hover:scale-[1.01] active:scale-[0.99] transition-transform card-modern"
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: `${lesson.color}12`,
                          border: `1px solid ${lesson.color}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: lesson.color,
                          flexShrink: 0,
                        }}
                      >
                        <CategoryIllustration category={lesson.category || "default"} size={22} />
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: lesson.color,
                          textTransform: "uppercase",
                        }}
                      >
                        {lesson.level} • {lesson.category}
                      </span>
                    </div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        fontWeight: 800,
                        margin: "6px 0",
                        color: "var(--text-primary)",
                      }}
                    >
                      {lesson.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        margin: 0,
                        opacity: 0.8,
                      }}
                    >
                      {lesson.description}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#C9A84C" }}>
                      +{lesson.xp} XP
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      {lesson.duration}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADVANCED FILTERS BAR ────────────────────────────── */}
        <div
          className="glass"
          style={{
            padding: "20px 24px",
            borderRadius: "24px",
            border: "1.5px solid var(--border)",
            marginBottom: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              <option value="Tudo">Tudo</option>
              <option value="Gramática">Gramática</option>
              <option value="Vocabulário">Vocabulário</option>
              <option value="Listening">Listening</option>
              <option value="Speaking">Speaking</option>
              <option value="Cultura">Cultura</option>
              <option value="Idioms">Expressões</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Nível
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              <option value="Todos">Todos</option>
              <option value="A1">A1 / A2 (Iniciante)</option>
              <option value="B1">B1 / B2 (Intermediário)</option>
              <option value="C1">C1 / C2 (Avançado)</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Duração
            </label>
            <select
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              <option value="Qualquer">Qualquer</option>
              <option value="0-5 min">0 - 5 min</option>
              <option value="5-10 min">5 - 10 min</option>
              <option value="10+ min">10+ min</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Ordenar Por
            </label>
            <select
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              <option value="Relevância">Relevância</option>
              <option value="Mais novos">Mais Novos</option>
              <option value="Mais XP">Mais XP</option>
              <option value="Mais populares">Mais Populares</option>
            </select>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────── */}
        {/* CURVED DUOLINGO-STYLE SVG LEARNING PATH             */}
        {/* ──────────────────────────────────────────────────── */}
        {(() => {
          // Layout constants
          const NODE_R   = 45;        // node radius px
          const ROW_H    = 140;       // vertical gap between nodes
          const CX       = 200;       // SVG center-x
          const AMPLITUDE = 110;      // how far nodes snake left/right
          const totalNodes = paginatedLessons.length;
          const SVG_W    = CX * 2;
          const SVG_H    = totalNodes * ROW_H + 60;

          // Compute node centres using the same sin-wave offset
          const nodes = paginatedLessons.map((lesson: any, i: number) => {
            const x = CX + Math.sin(i * 0.8) * AMPLITUDE;
            const y = 60 + i * ROW_H;
            return { lesson, i, x, y };
          });

          // Build smooth cubic bezier path through node centres
          const buildPath = () => {
            if (nodes.length === 0) return "";
            let d = `M ${nodes[0].x} ${nodes[0].y}`;
            for (let k = 1; k < nodes.length; k++) {
              const prev = nodes[k - 1];
              const curr = nodes[k];
              const midY = (prev.y + curr.y) / 2;
              d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
            }
            return d;
          };

          // Approximate path length for dash animation
          const pathLen = nodes.length * ROW_H * 1.1;

          // Count completed lessons for progress fill
          const completedCount = nodes.filter(n => completed.includes(n.lesson.id)).length;
          const progressFraction = totalNodes > 0 ? completedCount / totalNodes : 0;
          const filledLen = progressFraction * pathLen;

          return (
            <div style={{ position: "relative", width: "100%", overflowX: "hidden" }}>
              {/* ── SVG path canvas ── */}
              <svg
                width="100%"
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                style={{ display: "block", pointerEvents: "none" }}
                aria-hidden="true"
              >
                {/* Background track */}
                <path
                  d={buildPath()}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Animated progress fill */}
                <path
                  d={buildPath()}
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${filledLen} ${pathLen}`}
                  strokeDashoffset={0}
                  style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                />
              </svg>

              {/* ── Absolute-positioned lesson nodes ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  // SVG uses a viewBox of SVG_W × SVG_H, nodes are in those coords
                  // We scale via percentage positioning
                }}
              >
                {nodes.map(({ lesson, i, x, y }) => {
                  const hasStarted     = progress[lesson.id] !== undefined;
                  const completedStatus = completed.includes(lesson.id);
                  const currentStepIdx  = progress[lesson.id] || 0;
                  const totalStepsCount = lesson.steps?.length || 5;

                  // Convert SVG coords → percentage of rendered SVG
                  const xPct = (x / SVG_W) * 100;
                  const yPct = (y / SVG_H) * 100;

                  return (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => startLesson(lesson.id)}
                      style={{
                        position:  "absolute",
                        left:      `calc(${xPct}% - ${NODE_R}px)`,
                        top:       `calc(${yPct}% - ${NODE_R}px)`,
                        width:     NODE_R * 2,
                        height:    NODE_R * 2,
                        cursor:    "pointer",
                        zIndex:    2,
                      }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: i * 0.06,
                        type: "spring",
                        stiffness: 320,
                        damping: 24,
                      }}
                    >
                      {/* Outer glow ring for in-progress */}
                      {hasStarted && !completedStatus && (
                        <div
                          style={{
                            position:    "absolute",
                            inset:       -8,
                            borderRadius: "50%",
                            border:      `3px solid ${lesson.color}60`,
                            animation:   "streakRingPulse 2.5s ease-in-out infinite",
                          }}
                        />
                      )}

                      {/* Node circle */}
                      <div
                        style={{
                          width:        "100%",
                          height:       "100%",
                          borderRadius: "50%",
                          background:   completedStatus
                            ? lesson.color
                            : hasStarted
                              ? "var(--bg)"
                              : "var(--surface-raised)",
                          border: `5px solid ${
                            completedStatus
                              ? lesson.color
                              : hasStarted
                                ? lesson.color
                                : "var(--border)"
                          }`,
                          display:       "flex",
                          alignItems:    "center",
                          justifyContent:"center",
                          boxShadow:     completedStatus
                            ? `0 8px 24px ${lesson.color}50`
                            : "0 4px 12px rgba(0,0,0,0.06)",
                          position:      "relative",
                        }}
                      >
                        <CategoryIllustration category={lesson.category || "default"} size={36} />

                        {/* Completed star badge */}
                        {completedStatus && (
                          <div style={{ position: "absolute", top: -14, right: -14 }}>
                            <IlluStar size={30} primary="#FFD700" secondary="#FFB300" />
                          </div>
                        )}

                        {/* In-progress mini bar */}
                        {hasStarted && !completedStatus && (
                          <div
                            style={{
                              position:     "absolute",
                              bottom:       -8,
                              left:         "50%",
                              transform:    "translateX(-50%)",
                              width:        "60px",
                              height:       "5px",
                              background:   "var(--border)",
                              borderRadius: "99px",
                              overflow:     "hidden",
                            }}
                          >
                            <div
                              style={{
                                height:       "100%",
                                width:        `${Math.round((currentStepIdx / totalStepsCount) * 100)}%`,
                                background:   lesson.color,
                                borderRadius: "99px",
                                transition:   "width 0.5s ease",
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Title label */}
                      <div
                        style={{
                          position:   "absolute",
                          top:        "calc(100% + 12px)",
                          left:       "50%",
                          transform:  "translateX(-50%)",
                          background: "var(--card-bg)",
                          padding:    "7px 13px",
                          borderRadius:"14px",
                          boxShadow:  "0 6px 20px rgba(0,0,0,0.1)",
                          whiteSpace: "nowrap",
                          fontWeight: 800,
                          fontSize:   "13px",
                          color:      "var(--text-primary)",
                          border:     "1.5px solid var(--border)",
                          pointerEvents:"none",
                          maxWidth:   "160px",
                          overflow:   "hidden",
                          textOverflow:"ellipsis",
                        }}
                      >
                        {lesson.title}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })()}


        {/* Pagination Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "48px",
            flexWrap: "wrap",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              padding: "10px",
              borderRadius: "14px",
              border: "1.5px solid",
              borderColor: currentPage === 1 ? "var(--border)" : "var(--brand)",
              background: currentPage === 1 ? "var(--bg-secondary)" : "var(--card-bg)",
              color: currentPage === 1 ? "var(--text-secondary)" : "var(--brand)",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface-raised)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  1
                </button>
                {currentPage > 3 && (
                  <span style={{ color: "var(--text-secondary)", padding: "0 4px" }}>...</span>
                )}
              </>
            )}

            {Array.from({ length: 3 }, (_, i) => {
              const pageNum = currentPage - 1 + i;
              if (pageNum <= 0 || pageNum > totalPages) return null;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    border: isActive
                      ? "1.5px solid var(--accent-green)"
                      : "1.5px solid var(--border)",
                    background: isActive ? "var(--accent-green)" : "var(--surface-raised)",
                    color: isActive ? "white" : "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span style={{ color: "var(--text-secondary)", padding: "0 4px" }}>...</span>
                )}
                <button
                  onClick={() => {
                    setCurrentPage(totalPages);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface-raised)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              padding: "10px",
              borderRadius: "14px",
              border: "1.5px solid",
              borderColor: currentPage === totalPages ? "var(--border)" : "var(--brand)",
              background: currentPage === totalPages ? "var(--bg-secondary)" : "var(--card-bg)",
              color: currentPage === totalPages ? "var(--text-secondary)" : "var(--brand)",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* LUME LIBRARY HUB — MASSIVE INTERACTIVE DICTIONARY */}
        <div
          style={{ marginTop: "84px", borderTop: "1px solid var(--border)", paddingTop: "64px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div
              style={{
                display: "inline-flex",
                gap: "6px",
                alignItems: "center",
                color: "var(--accent-green)",
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "12px",
                padding: "6px 14px",
                borderRadius: "99px",
                background: "rgba(38,70,58,0.06)",
              }}
            >
              <Library size={13} />
              Central de Expansão Cultural
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}
            >
              Biblioteca & Dicionário Lume
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
                maxWidth: "560px",
                margin: "0 auto",
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              Navegue por expressões nativas, gírias e diálogos práticos para enriquecer seu
              repertório cultural com a pronúncia ideal.
            </p>
          </div>

          {/* Hub Main Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "36px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setLibTab("vocab")}
              style={{
                padding: "12px 24px",
                borderRadius: "16px",
                background: libTab === "vocab" ? "var(--accent-green)" : "var(--surface-raised)",
                color: libTab === "vocab" ? "white" : "var(--text-primary)",
                border:
                  libTab === "vocab"
                    ? "1.5px solid var(--accent-green)"
                    : "1.5px solid var(--border)",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: libTab === "vocab" ? "0 4px 12px rgba(38,70,58,0.2)" : "none",
                transition: "all 0.25s",
              }}
              className="hover:scale-[1.01] active:scale-[0.98]"
            >
              <Star size={16} />
              Dicionário de Expressões (+200)
            </button>
            <button
              onClick={() => setLibTab("sentences")}
              style={{
                padding: "12px 24px",
                borderRadius: "16px",
                background:
                  libTab === "sentences" ? "var(--accent-green)" : "var(--surface-raised)",
                color: libTab === "sentences" ? "white" : "var(--text-primary)",
                border:
                  libTab === "sentences"
                    ? "1.5px solid var(--accent-green)"
                    : "1.5px solid var(--border)",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: libTab === "sentences" ? "0 4px 12px rgba(38,70,58,0.2)" : "none",
                transition: "all 0.25s",
              }}
              className="hover:scale-[1.01] active:scale-[0.98]"
            >
              <BookOpen size={16} />
              Banco de Frases Situacionais
            </button>
          </div>

          {/* TAB 1: VOCABULARY DICTIONARY */}
          {libTab === "vocab" && (
            <div>
              {/* Search and filter header */}
              <div
                className="glass"
                style={{
                  padding: "24px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  marginBottom: "32px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Search box */}
                  <div style={{ position: "relative", width: "100%" }}>
                    <Search
                      size={18}
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Pesquisar expressões, gírias ou traduções..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: "48px", fontSize: "15px" }}
                    />
                  </div>

                  {/* Filter pills */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          marginRight: "6px",
                        }}
                      >
                        Categoria:
                      </span>
                      {[
                        { id: "all", label: "Tudo" },
                        { id: "slang", label: "Gírias" },
                        { id: "idiom", label: "Expressões" },
                        { id: "phrasal", label: "Phrasals" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveLibCat(cat.id as any)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "10px",
                            background:
                              activeLibCat === cat.id ? "var(--accent-green)15" : "transparent",
                            color:
                              activeLibCat === cat.id
                                ? "var(--accent-green)"
                                : "var(--text-secondary)",
                            border:
                              activeLibCat === cat.id
                                ? "1.5px solid var(--accent-green)"
                                : "1.5px solid var(--border)",
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          marginRight: "6px",
                        }}
                      >
                        Dificuldade:
                      </span>
                      {[
                        { id: "all", label: "Todas" },
                        { id: "beginner", label: "Iniciante" },
                        { id: "intermediate", label: "Intermediário" },
                        { id: "advanced", label: "Avançado" },
                      ].map((diff) => (
                        <button
                          key={diff.id}
                          onClick={() => setActiveDifficulty(diff.id as any)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "10px",
                            background:
                              activeDifficulty === diff.id
                                ? "var(--accent-terra)15"
                                : "transparent",
                            color:
                              activeDifficulty === diff.id
                                ? "var(--accent-terra)"
                                : "var(--text-secondary)",
                            border:
                              activeDifficulty === diff.id
                                ? "1.5px solid var(--accent-terra)"
                                : "1.5px solid var(--border)",
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vocab Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredVocab.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.03)" }}
                    style={{
                      background: "var(--surface-raised)",
                      borderRadius: "20px",
                      border: "1.5px solid var(--border)",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.25s",
                    }}
                  >
                    <div>
                      {/* Top tags */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "14px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color:
                              entry.category === "slang"
                                ? "var(--accent-terra)"
                                : entry.category === "idiom"
                                  ? "var(--accent-gold)"
                                  : "var(--accent-teal)",
                            background:
                              entry.category === "slang"
                                ? "rgba(196,113,74,0.08)"
                                : entry.category === "idiom"
                                  ? "rgba(212,162,59,0.08)"
                                  : "rgba(27,54,68,0.08)",
                            padding: "3px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          {entry.category} {entry.region ? `• ${entry.region}` : ""}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            color:
                              entry.difficulty === "beginner"
                                ? "var(--accent-green)"
                                : entry.difficulty === "intermediate"
                                  ? "var(--accent-gold)"
                                  : "var(--accent-terra)",
                          }}
                        >
                          {entry.difficulty === "beginner"
                            ? "INICIANTE"
                            : entry.difficulty === "intermediate"
                              ? "INTERMEDIÁRIO"
                              : "AVANÇADO"}
                        </span>
                      </div>

                      {/* Phrase and audio */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "10px",
                          marginBottom: "8px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            fontWeight: 850,
                            color: "var(--text-primary)",
                          }}
                        >
                          {entry.phrase}
                        </h4>
                        <button
                          onClick={() => handlePlayAudio(entry.phrase, "en")}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "rgba(38,70,58,0.06)",
                            border: "none",
                            color: "var(--accent-green)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>

                      {/* Meanings */}
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 650,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {entry.meaning}
                      </p>
                      <p
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          marginBottom: "14px",
                        }}
                      >
                        {entry.meaning_pt}
                      </p>
                    </div>

                    {/* Example bubble */}
                    <div
                      style={{
                        padding: "10px 14px",
                        background: "var(--bg)",
                        borderRadius: "14px",
                        borderLeft: "3.5px solid var(--accent-green)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Exemplo:
                        </span>
                        <button
                          onClick={() => handlePlayAudio(entry.example, "en")}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontStyle: "italic",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "2px",
                        }}
                      >
                        "{entry.example}"
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        {entry.example_pt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredVocab.length === 0 && (
                <div
                  style={{ textAlign: "center", padding: "48px", color: "var(--text-secondary)" }}
                >
                  <p style={{ fontWeight: 600 }}>
                    Nenhuma expressão encontrada para os termos buscados.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SITUATIONAL PHRASE BANK */}
          {libTab === "sentences" && (
            <div>
              {/* Situation Category Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "32px",
                }}
              >
                {[
                  { id: "airport", label: "Aeroporto" },
                  { id: "restaurant", label: "Restaurante" },
                  { id: "hotel", label: "Hotel" },
                  { id: "job_interview", label: "Entrevista de Emprego" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSentenceCat(tab.id as any)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "14px",
                      background:
                        selectedSentenceCat === tab.id
                          ? "var(--accent-green)"
                          : "var(--surface-raised)",
                      color: selectedSentenceCat === tab.id ? "white" : "var(--text-primary)",
                      border:
                        selectedSentenceCat === tab.id
                          ? "1.5px solid var(--accent-green)"
                          : "1.5px solid var(--border)",
                      fontSize: "13.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow:
                        selectedSentenceCat === tab.id ? "0 2px 8px rgba(38,70,58,0.1)" : "none",
                    }}
                    className="hover:scale-[1.02]"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Phrase Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {SENTENCE_BANK[selectedSentenceCat].map((sentence, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.005 }}
                    style={{
                      background: "var(--surface-raised)",
                      borderRadius: "16px",
                      border: "1.5px solid var(--border)",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            color: "var(--accent-green)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          EN:
                        </span>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 750,
                            color: "var(--text-primary)",
                            margin: 0,
                          }}
                        >
                          {sentence.en}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            color: "var(--accent-terra)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          PT:
                        </span>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 550,
                            color: "var(--text-secondary)",
                            margin: 0,
                          }}
                        >
                          {sentence.pt}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(sentence.en, "en")}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "var(--bg)",
                        border: "1.5px solid var(--border)",
                        color: "var(--accent-green)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      className="hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Volume2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
