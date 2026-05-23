import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore, UserLevel } from "@/store/userStore";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const LEVEL_ORDER: UserLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function DifficultyPopup() {
  const {
    userLevel,
    setUserLevel,
    consecutiveCorrect,
    consecutiveIncorrect,
    resetConsecutiveCorrect,
    resetConsecutiveIncorrect,
  } = useUserStore();

  const { setLearningLevel } = useStore();

  const [promptType, setPromptType] = useState<"upgrade" | "downgrade" | null>(null);
  const [targetLevel, setTargetLevel] = useState<UserLevel | null>(null);

  useEffect(() => {
    if (!userLevel) return;
    const currentIndex = LEVEL_ORDER.indexOf(userLevel);

    // 10 correct answers in a row triggers upgrade recommendation
    if (consecutiveCorrect >= 10 && currentIndex < LEVEL_ORDER.length - 1) {
      setTargetLevel(LEVEL_ORDER[currentIndex + 1]);
      setPromptType("upgrade");
      // Toast notification for instant feedback
      toast.success("Desempenho incrível! 🎉 Você acertou 10 seguidas.");
    }

    // 5 errors in a row triggers downgrade recommendation
    if (consecutiveIncorrect >= 5 && currentIndex > 0) {
      setTargetLevel(LEVEL_ORDER[currentIndex - 1]);
      setPromptType("downgrade");
      toast.warning("Esta seção parece desafiadora. 🌿 Vamos dar uma pausa?");
    }
  }, [consecutiveCorrect, consecutiveIncorrect, userLevel]);

  if (!promptType || !targetLevel) return null;

  const handleAccept = () => {
    setUserLevel(targetLevel);
    localStorage.setItem("lume_user_level", targetLevel);
    localStorage.setItem("lume_level", targetLevel);
    // Sync with useStore as well
    setLearningLevel(targetLevel);
    toast.success(`Nível atualizado para ${targetLevel}! 🚀`);
    handleDismiss();
  };

  const handleDismiss = () => {
    setPromptType(null);
    setTargetLevel(null);
    resetConsecutiveCorrect();
    resetConsecutiveIncorrect();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          bottom: "86px",
          right: "24px",
          zIndex: 9999,
          maxWidth: "380px",
          width: "calc(100% - 48px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            background: "var(--surface-raised)",
            border: "1.5px solid var(--border)",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "24px" }}>{promptType === "upgrade" ? "🚀" : "🌱"}</div>
            <div>
              <h4
                style={{
                  fontSize: "14.5px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {promptType === "upgrade" ? "Está achando fácil?" : "Gostaria de simplificar?"}
              </h4>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                  marginTop: "4px",
                }}
              >
                {promptType === "upgrade"
                  ? `Seu progresso tem sido espetacular. Sugerimos subir para o nível ${targetLevel} para manter seu aprendizado desafiador.`
                  : `Detectamos algumas dificuldades seguidas. Que tal treinar com o nível ${targetLevel} para consolidar suas bases?`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <button
              onClick={handleDismiss}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                background: "transparent",
                border: "1.5px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Agora não
            </button>
            <button
              onClick={handleAccept}
              style={{
                flex: 1.3,
                padding: "10px 14px",
                borderRadius: "12px",
                background: promptType === "upgrade" ? "var(--brand)" : "var(--accent)",
                color: "white",
                border: "none",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {promptType === "upgrade" ? `Subir para ${targetLevel}` : `Mudar para ${targetLevel}`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
