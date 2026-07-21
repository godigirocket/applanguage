import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/useStore";

const LEVELS = [
  {
    id: "A1",
    label: "A1 — Iniciante",
    emoji: "🌱",
    description: "Mal comecei! Conheço poucas palavras e frases básicas.",
    color: "#4A7A5A",
    bg: "rgba(74,122,90,0.08)",
  },
  {
    id: "A2",
    label: "A2 — Básico",
    emoji: "🌿",
    description: "Consigo me apresentar e entender frases simples do dia a dia.",
    color: "#5A8A6A",
    bg: "rgba(90,138,106,0.08)",
  },
  {
    id: "B1",
    label: "B1 — Intermediário",
    emoji: "🪴",
    description: "Me viro em situações comuns, mas ainda erro bastante.",
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
  },
  {
    id: "B2",
    label: "B2 — Intermediário Alto",
    emoji: "🌳",
    description: "Consigo conversar com fluência na maioria das situações.",
    color: "#E67E22",
    bg: "rgba(230,126,34,0.08)",
  },
  {
    id: "C1",
    label: "C1 — Avançado",
    emoji: "🔥",
    description: "Falo com naturalidade e entendo expressões idiomáticas.",
    color: "#C4714A",
    bg: "rgba(196,113,74,0.08)",
  },
  {
    id: "C2",
    label: "C2 — Proficiente",
    emoji: "⚡",
    description: "Domínio nativo. Quero desafios complexos de vocabulário e cultura.",
    color: "#2f80ed",
    bg: "rgba(27,58,75,0.08)",
  },
];

interface LevelPickerProps {
  onClose?: () => void;
  forced?: boolean; // if true, cannot be dismissed
}

export function LevelPicker({ onClose, forced = false }: LevelPickerProps) {
  const { setLearningLevel } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setLearningLevel(selected as any);
    localStorage.setItem("lume_level", selected);
    setConfirmed(true);
    setTimeout(() => {
      onClose?.();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={forced ? undefined : onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-raised)",
          borderRadius: "28px",
          padding: "36px 32px",
          maxWidth: "560px",
          width: "100%",
          border: "1.5px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {confirmed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: "center", padding: "32px 0" }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎯</div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Nível {selected} definido!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Seu conteúdo foi personalizado. Vamos começar!
            </p>
          </motion.div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌟</div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                Qual é o seu nível atual?
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Isso personaliza seu conteúdo. Você pode alterar a qualquer momento no perfil.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {LEVELS.map((level) => (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(level.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "14px 18px",
                    borderRadius: "16px",
                    border:
                      selected === level.id
                        ? `2px solid ${level.color}`
                        : "2px solid var(--border)",
                    background: selected === level.id ? level.bg : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "26px", flexShrink: 0 }}>{level.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "14px",
                        color: selected === level.id ? level.color : "var(--text-primary)",
                      }}
                    >
                      {level.label}
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}
                    >
                      {level.description}
                    </div>
                  </div>
                  {selected === level.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: level.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "12px",
                        color: "white",
                      }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selected}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                background: selected
                  ? "linear-gradient(135deg, var(--accent-green), #ff7a45)"
                  : "var(--border)",
                color: selected ? "white" : "var(--text-secondary)",
                border: "none",
                cursor: selected ? "pointer" : "not-allowed",
                fontSize: "16px",
                fontWeight: 800,
                transition: "all 0.3s ease",
                boxShadow: selected ? "0 8px 24px rgba(255,122,69,0.3)" : "none",
              }}
            >
              {selected ? `✓ Confirmar nível ${selected}` : "Selecione seu nível para continuar"}
            </button>

            {!forced && (
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Mais tarde
              </button>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// Adaptive difficulty popup — shown after completing activities
interface DifficultyFeedbackProps {
  onAdjust: (direction: "easier" | "harder" | "ok") => void;
}

export function DifficultyFeedback({ onAdjust }: DifficultyFeedbackProps) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        position: "fixed",
        bottom: "90px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        background: "var(--surface-raised)",
        borderRadius: "20px",
        padding: "16px 20px",
        border: "1.5px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "280px",
        maxWidth: "340px",
        width: "90%",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text-primary)",
          textAlign: "center",
        }}
      >
        Como foi essa atividade?
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => onAdjust("easier")}
          style={{
            flex: 1,
            padding: "10px 6px",
            borderRadius: "12px",
            background: "rgba(74,122,90,0.08)",
            border: "1.5px solid rgba(74,122,90,0.2)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            color: "#4A7A5A",
          }}
        >
          😅 Muito difícil
        </button>
        <button
          onClick={() => onAdjust("ok")}
          style={{
            flex: 1,
            padding: "10px 6px",
            borderRadius: "12px",
            background: "rgba(201,168,76,0.08)",
            border: "1.5px solid rgba(201,168,76,0.2)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            color: "#C9A84C",
          }}
        >
          👌 Perfeito
        </button>
        <button
          onClick={() => onAdjust("harder")}
          style={{
            flex: 1,
            padding: "10px 6px",
            borderRadius: "12px",
            background: "rgba(196,113,74,0.08)",
            border: "1.5px solid rgba(196,113,74,0.2)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            color: "#C4714A",
          }}
        >
          🚀 Muito fácil
        </button>
      </div>
    </motion.div>
  );
}
