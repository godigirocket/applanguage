import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, CheckCircle, AlertTriangle, RefreshCw } from "@/components/lume/CustomIcons";
import { toast } from "sonner";
import { isSTTSupported } from "@/lib/language-apis/webSpeech";
import { useStore } from "@/hooks/useStore";

const SPEECH_LOCALE: Record<"en" | "es" | "pt", string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

interface PronunciationChallengeProps {
  targetPhrase: string;
  targetLanguage?: "en" | "es" | "pt";
  onSuccess?: (score: number) => void;
  onFailure?: () => void;
}

export function PronunciationChallenge({
  targetPhrase,
  targetLanguage = "en",
  onSuccess,
  onFailure,
}: PronunciationChallengeProps) {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";
  const t = (pt: string, en: string, es: string) => (isPT ? pt : isES ? es : en);

  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSTTSupported()) {
      // Not just a Chrome-vs-Safari thing — iOS (all browsers, WebKit
      // engine-wide) has no speech recognition API at all, so "try Chrome"
      // is actively wrong advice there. Point at a device switch instead of
      // a specific browser, and don't frame it as scary/broken — this step
      // already has a Skip button.
      setError(
        t(
          "Reconhecimento de voz não disponível neste navegador/dispositivo. Você pode pular esta etapa.",
          "Speech recognition isn't available on this browser/device. You can skip this step.",
          "El reconocimiento de voz no está disponible en este navegador/dispositivo. Puedes saltar este paso.",
        ),
      );
      return;
    }
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = SPEECH_LOCALE[targetLanguage];

    rec.onstart = () => {
      setIsRecording(true);
      setSpokenText("");
      setScore(null);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
      if (e.error === "no-speech") {
        toast.error(
          t(
            "Nenhuma fala detectada. Fale mais perto do microfone.",
            "No speech detected. Speak closer to the microphone.",
            "No se detectó voz. Habla más cerca del micrófono.",
          ),
        );
      } else if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        toast.error(
          t(
            "Permissão de microfone negada. Ative o microfone nas configurações do navegador.",
            "Microphone permission denied. Enable microphone access in your browser settings.",
            "Permiso de micrófono denegado. Habilita el micrófono en la configuración del navegador.",
          ),
        );
      } else {
        toast.error(t("Erro no reconhecimento de voz.", "Speech recognition error.", "Error de reconocimiento de voz."));
      }
    };

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setSpokenText(resultText);
      calculateScore(resultText);
    };

    recognitionRef.current = rec;
  }, [targetLanguage]);

  const calculateScore = (spoken: string) => {
    const cleanTarget = targetPhrase
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .trim();
    const cleanSpoken = spoken
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .trim();

    const targetWords = cleanTarget.split(/\s+/);
    const spokenWords = cleanSpoken.split(/\s+/);

    let matchCount = 0;
    targetWords.forEach((w) => {
      if (spokenWords.includes(w)) {
        matchCount++;
      }
    });

    const calculatedScore = Math.round((matchCount / targetWords.length) * 100);
    setScore(calculatedScore);

    if (calculatedScore >= 70) {
      toast.success(
        t(
          `Excelente pronúncia! Nota: ${calculatedScore}% 🎉`,
          `Excellent pronunciation! Score: ${calculatedScore}% 🎉`,
          `¡Excelente pronunciación! Nota: ${calculatedScore}% 🎉`,
        ),
      );
      if (onSuccess) onSuccess(calculatedScore);
    } else {
      toast.warning(
        t(
          `Sua pronúncia teve ${calculatedScore}% de precisão. Tente novamente!`,
          `Your pronunciation was ${calculatedScore}% accurate. Try again!`,
          `Tu pronunciación tuvo ${calculatedScore}% de precisión. ¡Inténtalo de nuevo!`,
        ),
      );
      if (onFailure) onFailure();
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const speakTarget = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(targetPhrase);
    utter.lang = SPEECH_LOCALE[targetLanguage];
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
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
            fontSize: "11px",
            fontWeight: 800,
            color: "var(--brand)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {t("Desafio de Voz", "Voice Challenge", "Desafío de Voz")}
        </span>
        <button
          onClick={speakTarget}
          style={{
            background: "none",
            border: "none",
            color: "var(--brand)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Volume2 size={16} />
          {t("Ouvir Pronúncia", "Hear Pronunciation", "Escuchar Pronunciación")}
        </button>
      </div>

      <div style={{ textAlign: "center", margin: "8px 0" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.4,
          }}
        >
          "{targetPhrase}"
        </h3>
      </div>

      {error ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--accent)",
            fontSize: "13px",
            background: "rgba(196,109,75,0.08)",
            padding: "10px 16px",
            borderRadius: "12px",
          }}
        >
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* Pulsing Mic Button */}
          <div style={{ position: "relative" }}>
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    zIndex: 0,
                  }}
                />
              )}
            </AnimatePresence>

            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: isRecording ? "var(--accent)" : "var(--brand)",
                color: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: 1,
                transition: "background 0.2s",
              }}
            >
              <Mic size={24} />
            </button>
          </div>

          <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
            {isRecording
              ? t("Gravando... Solte para finalizar", "Recording... Release to finish", "Grabando... Suelta para terminar")
              : t("Segure para falar", "Hold to speak", "Mantén presionado para hablar")}
          </span>

          {spokenText && (
            <div
              style={{
                width: "100%",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "14px",
                marginTop: "8px",
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>
                {t("Você falou:", "You said:", "Dijiste:")}
              </span>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginTop: "4px",
                }}
              >
                "{spokenText}"
              </p>
            </div>
          )}

          {score !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: score >= 70 ? "rgba(74,122,91,0.08)" : "rgba(196,109,75,0.08)",
                border:
                  score >= 70 ? "1px solid rgba(74,122,91,0.2)" : "1px solid rgba(196,109,75,0.2)",
                padding: "12px 20px",
                borderRadius: "14px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {score >= 70 ? (
                <CheckCircle size={20} style={{ color: "#4A7A5B" }} />
              ) : (
                <AlertTriangle size={20} style={{ color: "var(--accent)" }} />
              )}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: score >= 70 ? "#4A7A5B" : "var(--accent)",
                }}
              >
                {t("Precisão", "Accuracy", "Precisión")}: {score}%
              </span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
