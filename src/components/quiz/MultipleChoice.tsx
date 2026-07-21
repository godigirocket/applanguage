import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "../lume/CustomIcons";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  explanationLabel?: string;
  onAnswer: (isCorrect: boolean) => void;
}

export function MultipleChoice({
  question,
  options,
  correctAnswer,
  explanation,
  explanationLabel = "Explicação:",
  onAnswer,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
    setIsAnswered(true);

    setTimeout(
      () => {
        onAnswer(opt === correctAnswer);
      },
      explanation ? 2200 : 1200,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: 800,
          textAlign: "center",
          color: "var(--text-primary)",
        }}
      >
        {question}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          const isCorrect = isAnswered && opt === correctAnswer;
          const isWrong = isAnswered && isSelected && opt !== correctAnswer;

          let bgColor = "var(--surface)";
          let borderColor = "var(--border)";
          let color = "var(--text-primary)";

          if (isCorrect) {
            bgColor = "rgba(76,175,80,0.1)";
            borderColor = "var(--accent-green)";
            color = "var(--accent-green)";
          } else if (isWrong) {
            bgColor = "rgba(239,83,80,0.1)";
            borderColor = "var(--accent-terra)";
            color = "var(--accent-terra)";
          } else if (isSelected) {
            bgColor = "rgba(0,0,0,0.05)";
            borderColor = "var(--text-secondary)";
          }

          return (
            <motion.button
              key={idx}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              style={{
                padding: "16px 24px",
                borderRadius: "16px",
                background: bgColor,
                border: `2px solid ${borderColor}`,
                color: color,
                fontSize: "16px",
                fontWeight: 700,
                cursor: isAnswered ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease-out",
              }}
            >
              <span>{opt}</span>
              {isCorrect && <CheckCircle size={20} />}
              {isWrong && <AlertTriangle size={20} />}
            </motion.button>
          );
        })}
      </div>

      {isAnswered && explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            marginTop: "8px",
          }}
        >
          <p
            style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}
          >
            <strong style={{ color: "var(--text-primary)" }}>{explanationLabel} </strong>
            {explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
