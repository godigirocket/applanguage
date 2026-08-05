import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { Award, Brain, CheckCircle, Sparkles, Star, Target } from "@/components/lume/CustomIcons";

const LEVELS = [
  {
    id: "A1",
    label: "A1 - Iniciante",
    Icon: Sparkles,
    description: "Mal comecei. Conheco poucas palavras e frases basicas.",
    color: "#0f6bff",
    bg: "rgba(15,107,255,0.08)",
  },
  {
    id: "A2",
    label: "A2 - Basico",
    Icon: Star,
    description: "Consigo me apresentar e entender frases simples do dia a dia.",
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.08)",
  },
  {
    id: "B1",
    label: "B1 - Intermediario",
    Icon: Brain,
    description: "Me viro em situacoes comuns, mas ainda erro bastante.",
    color: "#f5a524",
    bg: "rgba(245,165,36,0.1)",
  },
  {
    id: "B2",
    label: "B2 - Intermediario Alto",
    Icon: Target,
    description: "Consigo conversar com fluencia na maioria das situacoes.",
    color: "#ff6b5a",
    bg: "rgba(255,107,90,0.1)",
  },
  {
    id: "C1",
    label: "C1 - Avancado",
    Icon: Award,
    description: "Falo com naturalidade e entendo expressoes idiomaticas.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    id: "C2",
    label: "C2 - Proficiente",
    Icon: CheckCircle,
    description: "Dominio nativo. Quero desafios complexos de vocabulario e cultura.",
    color: "#07101f",
    bg: "rgba(7,16,31,0.08)",
  },
];

interface LevelPickerProps {
  onClose?: () => void;
  forced?: boolean;
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
    setTimeout(() => onClose?.(), 1200);
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
        background: "rgba(7,16,31,0.45)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={forced ? undefined : onClose}
    >
      <motion.div
        className="lume-modal-shell"
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {confirmed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: "center", padding: "32px 0" }}
          >
            <div className="lume-icon-orb" style={{ margin: "0 auto 16px" }}>
              <CheckCircle size={34} />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "8px" }}>
              Nivel {selected} definido
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Seu conteudo foi personalizado. Vamos comecar.
            </p>
          </motion.div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div className="lume-icon-orb" style={{ margin: "0 auto 12px" }}>
                <Sparkles size={30} />
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "8px" }}>
                Qual e o seu nivel atual?
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Isso personaliza seu conteudo. Voce pode alterar a qualquer momento no perfil.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {LEVELS.map((level) => {
                const Icon = level.Icon;
                const isSelected = selected === level.id;
                return (
                  <motion.button
                    key={level.id}
                    className="animated-container"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelected(level.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 16px",
                      borderRadius: "16px",
                      border: isSelected ? `2px solid ${level.color}` : "2px solid var(--border)",
                      background: isSelected ? level.bg : "rgba(255,255,255,0.7)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span className="lume-level-icon" style={{ color: level.color }}>
                      <Icon size={24} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: "14px",
                          color: isSelected ? level.color : "var(--text-primary)",
                        }}
                      >
                        {level.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {level.description}
                      </div>
                    </div>
                    {isSelected && <CheckCircle size={22} color={level.color} />}
                  </motion.button>
                );
              })}
            </div>

            <button onClick={handleConfirm} disabled={!selected} className="btn-gold" style={{ width: "100%" }}>
              {selected ? `Confirmar nivel ${selected}` : "Selecione seu nivel para continuar"}
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
                  fontWeight: 700,
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

interface DifficultyFeedbackProps {
  onAdjust: (direction: "easier" | "harder" | "ok") => void;
}

export function DifficultyFeedback({ onAdjust }: DifficultyFeedbackProps) {
  return (
    <motion.div
      className="lume-feedback-pop"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", textAlign: "center" }}>
        Como foi essa atividade?
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => onAdjust("easier")} className="btn-outline-premium" style={{ flex: 1, padding: "10px 6px", fontSize: 12 }}>
          Muito dificil
        </button>
        <button onClick={() => onAdjust("ok")} className="btn-outline-premium" style={{ flex: 1, padding: "10px 6px", fontSize: 12 }}>
          Perfeito
        </button>
        <button onClick={() => onAdjust("harder")} className="btn-outline-premium" style={{ flex: 1, padding: "10px 6px", fontSize: 12 }}>
          Muito facil
        </button>
      </div>
    </motion.div>
  );
}
