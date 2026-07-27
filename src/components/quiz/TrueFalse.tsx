import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "../lume/CustomIcons";

interface TrueFalseProps {
  question: string;
  correctAnswer: string;
  options?: string[];
  explanationLabel?: string;
  explanation?: string;
  onAnswer: (isCorrect: boolean) => void;
  accentColor?: string;
}

export function TrueFalse({
  question,
  correctAnswer,
  options: optionsProp,
  explanationLabel = "Explicação:",
  explanation,
  onAnswer,
  accentColor = "var(--brand)",
}: TrueFalseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
    setIsAnswered(true);

    setTimeout(() => {
      onAnswer(opt === correctAnswer);
    }, 2000); // give time to read explanation
  };

  const options = optionsProp && optionsProp.length === 2 ? optionsProp : ["Verdadeiro", "Falso"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        background: "var(--card-bg)",
        borderRadius: "24px",
        padding: "clamp(20px, 4vw, 32px)",
        border: `1.5px solid color-mix(in srgb, ${accentColor} 25%, var(--border))`,
        borderTop: `5px solid ${accentColor}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 800,
          textAlign: "center",
          color: "var(--text-primary)",
          lineHeight: 1.5,
        }}
      >
        {question}
      </h3>

      <div style={{ display: "flex", gap: "16px" }}>
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          const isCorrect = isAnswered && opt === correctAnswer;
          const isWrong = isAnswered && isSelected && opt !== correctAnswer;

          let bgColor = "var(--card-bg)";
          let borderColor = `color-mix(in srgb, ${accentColor} 25%, var(--border))`;
          let color = "var(--text-primary)";

          if (isCorrect) {
            bgColor = "rgba(76,175,80,0.1)";
            borderColor = "var(--accent-green)";
            color = "var(--accent-green)";
          } else if (isWrong) {
            bgColor = "rgba(239,83,80,0.1)";
            borderColor = "var(--accent-terra)";
            color = "var(--accent-terra)";
          }

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + idx * 0.08 }}
              whileHover={!isAnswered ? { scale: 1.05 } : {}}
              whileTap={!isAnswered ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              style={{
                flex: 1,
                padding: "24px",
                borderRadius: "20px",
                background: bgColor,
                border: `2px solid ${borderColor}`,
                color: color,
                fontSize: "18px",
                fontWeight: 800,
                cursor: isAnswered ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease-out",
              }}
            >
              <span>{opt}</span>
              {isCorrect && <CheckCircle size={24} />}
              {isWrong && <AlertTriangle size={24} />}
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
    </motion.div>
  );
}
