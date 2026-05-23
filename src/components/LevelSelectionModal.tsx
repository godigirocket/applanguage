import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore, UserLevel } from "@/store/userStore";
import { useStore } from "@/hooks/useStore";

interface LevelOption {
  id: UserLevel;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

const levels: LevelOption[] = [
  {
    id: "A1",
    title: "A1 - Iniciante",
    desc: "Mal comecei! Conheço poucas palavras ou frases básicas.",
    color: "#4A7A5B",
    bg: "rgba(74, 122, 91, 0.08)",
  },
  {
    id: "A2",
    title: "A2 - Básico",
    desc: "Consigo me apresentar e entender frases simples do dia a dia.",
    color: "#3B7A8C",
    bg: "rgba(59, 122, 140, 0.08)",
  },
  {
    id: "B1",
    title: "B1 - Intermediário",
    desc: "Me viro em situações comuns, mas cometo erros frequentes.",
    color: "#D49E3B",
    bg: "rgba(212, 158, 59, 0.08)",
  },
  {
    id: "B2",
    title: "B2 - Intermediário Alto",
    desc: "Consigo conversar com fluência sobre diversos assuntos.",
    color: "#C46D4B",
    bg: "rgba(196, 109, 75, 0.08)",
  },
  {
    id: "C1",
    title: "C1 - Avançado",
    desc: "Falo com bastante naturalidade e compreendo nuances idiomáticas.",
    color: "#B34A4A",
    bg: "rgba(179, 74, 74, 0.08)",
  },
  {
    id: "C2",
    title: "C2 - Proficiente",
    desc: "Domínio quase nativo. Busco refinamento de vocabulário e cultura.",
    color: "#2A4D69",
    bg: "rgba(42, 77, 105, 0.08)",
  },
];

function getLevelIcon(id: UserLevel, color: string) {
  switch (id) {
    case "A1":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 20h10" />
          <path d="M10 20c0-3.5 1-6 2-10" />
          <path d="M12 10a4 4 0 0 1 8-2c0 2-2 3.5-8 2Z" />
          <path d="M12 10c-6-1.5-8-3.5-8-5.5 0 2 2 4.5 8 5.5Z" />
        </svg>
      );
    case "A2":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 8.5C17 15 15 18 11 20Z" />
          <path d="M19 2c-2.26 4.33-5.27 7.14-8 8" />
          <path d="M5 22c.96-3.85 2.89-7.7 5.77-10" />
        </svg>
      );
    case "B1":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 16v4" />
          <path d="M14 16v4" />
          <path d="M17 16H7a2 2 0 0 0-2 2v2h14v-2a2 2 0 0 0-2-2Z" />
          <path d="M12 16V4" />
          <path d="M12 8 a3 3 0 0 1 3 -3 a3 3 0 0 0 -3 -3 a3 3 0 0 0 -3 3 a3 3 0 0 1 3 3 Z" />
        </svg>
      );
    case "B2":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22v-5" />
          <path d="M17 12h.01" />
          <path d="M12 2a5 5 0 0 0-4.96 4.46 4.5 4.5 0 0 0-.04 8.97c.43.05.86-.06 1.25-.3a6 6 0 0 0 7.5 0 4.5 4.5 0 0 0 1.21-8.67A5 5 0 0 0 12 2Z" />
        </svg>
      );
    case "C1":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "C2":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

export function LevelSelectionModal() {
  const { userLevel, setUserLevel } = useUserStore();
  const { setLearningLevel } = useStore();
  const [selected, setSelected] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show if userLevel is empty and component is mounted on client
  if (!mounted || userLevel) return null;

  const handleConfirm = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setUserLevel(selected);
      setLearningLevel(selected);
      localStorage.setItem("lume_user_level", selected);
      localStorage.setItem("lume_level", selected);
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(26, 26, 26, 0.75)",
        backdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "var(--surface-raised)",
          borderRadius: "24px",
          padding: "36px",
          maxWidth: "550px",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          border: "1.5px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(45, 74, 62, 0.1)",
              color: "var(--brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Escolha seu nível de partida
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", lineHeight: 1.5 }}>
            Isso irá configurar suas lições, quizzes e desafios diários de acordo com seu ritmo de
            aprendizado.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
            paddingRight: "4px",
            marginBottom: "24px",
            flex: 1,
          }}
          className="lume-scrollbar"
        >
          {levels.map((level) => {
            const isSelected = selected === level.id;
            return (
              <div
                key={level.id}
                onClick={() => setSelected(level.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 18px",
                  borderRadius: "16px",
                  border: "2px solid",
                  borderColor: isSelected ? level.color : "var(--border)",
                  background: isSelected ? level.bg : "var(--bg-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: isSelected ? "rgba(255,255,255,0.7)" : "var(--bg-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)",
                    flexShrink: 0,
                  }}
                >
                  {getLevelIcon(level.id, isSelected ? level.color : "var(--text-secondary)")}
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: isSelected ? level.color : "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {level.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                      lineHeight: 1.4,
                    }}
                  >
                    {level.desc}
                  </p>
                </div>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: isSelected ? level.color : "var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: level.color,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          style={{
            width: "100%",
            padding: "15px 24px",
            borderRadius: "16px",
            background: selected ? "var(--brand)" : "var(--border)",
            color: selected ? "white" : "var(--text-secondary)",
            border: "none",
            fontWeight: 800,
            fontSize: "15px",
            cursor: selected && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: selected ? "0 8px 24px rgba(45, 74, 62, 0.2)" : "none",
          }}
        >
          {loading ? (
            <span>Processando...</span>
          ) : (
            <>
              <span>Iniciar Jornada em Lume</span>
              {selected && <span>({selected})</span>}
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
