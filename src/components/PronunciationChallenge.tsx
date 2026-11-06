import { matchTranscriptDetailed, type WordResult } from "@/lib/speech-match";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, CheckCircle, AlertTriangle, RefreshCw } from "@/components/lume/CustomIcons";
import { toast } from "sonner";
import { isSTTSupported, speak, stopSpeaking } from "@/lib/language-apis/webSpeech";
import { useStore } from "@/hooks/useStore";
import { sounds } from "@/lib/soundEffects";

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

const WORD_COLORS = {
  correct: "#326b18",
  incorrect: "#884800",
  missing: "#9e3131",
};

export function PronunciationChallenge({
  targetPhrase,
  targetLanguage = "en",
  onSuccess,
  onFailure,
}: PronunciationChallengeProps) {
  const interfaceLanguage = useStore((state) => state.interfaceLanguage);
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";
  const t = (pt: string, en: string, es: string) => (isPT ? pt : isES ? es : en);

  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [wordResults, setWordResults] = useState<WordResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);
  const scoreRef = useRef<(spoken: string) => void>(() => {});
  const handledRef = useRef(false);
  const busyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbacksRef = useRef({ onSuccess, onFailure });
  callbacksRef.current = { onSuccess, onFailure };

  useEffect(() => {
    if (!isSTTSupported()) {
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
      busyRef.current = true;
      handledRef.current = false;
      timeoutRef.current = setTimeout(() => {
        rec.abort();
        setIsRecording(false);
        busyRef.current = false;
      }, 15000);
      setIsRecording(true);
      setSpokenText("");
      setScore(null);
      setWordResults([]);
    };

    rec.onend = () => {
      clearTimeout(timeoutRef.current);
      busyRef.current = false;
      setIsRecording(false);
    };

    rec.onerror = (e: any) => {
      clearTimeout(timeoutRef.current);
      busyRef.current = false;
      if (e.error === "aborted") return;
      console.error("[PronunciationChallenge] Speech recognition error:", e.error || e);
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
        toast.error(
          t(
            "Erro no reconhecimento de voz.",
            "Speech recognition error.",
            "Error de reconocimiento de voz.",
          ),
        );
      }
    };

    rec.onresult = (event: any) => {
      const resultText = event.results?.[0]?.[0]?.transcript;
      if (handledRef.current || typeof resultText !== "string" || !resultText.trim()) return;
      handledRef.current = true;
      setSpokenText(resultText);
      scoreRef.current(resultText);
    };

    recognitionRef.current = rec;
    return () => {
      clearTimeout(timeoutRef.current);
      busyRef.current = false;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
      rec.abort();
      recognitionRef.current = null;
      stopSpeaking();
    };
  }, [targetLanguage, targetPhrase, interfaceLanguage]);

  const calculateScore = (spoken: string) => {
    const result = matchTranscriptDetailed(targetPhrase, spoken);
    setScore(result.score);
    setWordResults(result.wordResults);
    setAttempts((a) => a + 1);

    if (result.score >= 70) {
      sounds.playQuizCorrect();
      toast.success(
        t(
          `Frase reconhecida: ${result.score}% de correspondência.`,
          `Phrase recognized: ${result.score}% match.`,
          `Frase reconocida: ${result.score}% de coincidencia.`,
        ),
      );
      callbacksRef.current.onSuccess?.(result.score);
    } else {
      sounds.playQuizWrong();
      toast.warning(
        t(
          `${result.score}% de correspondência. Ouça a frase e tente novamente.`,
          `${result.score}% match. Listen to the phrase and try again.`,
          `${result.score}% de coincidencia. Escucha la frase e inténtalo de nuevo.`,
        ),
      );
      callbacksRef.current.onFailure?.();
    }
  };
  scoreRef.current = calculateScore;

  const startRecording = () => {
    if (!recognitionRef.current || busyRef.current) return;
    stopSpeaking();
    busyRef.current = true;
    sounds.playSpeakingStart();
    try {
      recognitionRef.current.start();
    } catch (e) {
      busyRef.current = false;
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const speakTarget = () => {
    sounds.playVocabFlip();
    speak(targetPhrase, targetLanguage);
  };

  const retry = () => {
    sounds.playClick();
    setScore(null);
    setWordResults([]);
    setSpokenText("");
  };

  // Keyboard shortcuts: Space to toggle mic, L to listen, R to retry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || (e.target instanceof Element && e.target.closest("button,a,input,textarea,select,[contenteditable]"))) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        speakTarget();
      } else if (e.key.toLowerCase() === "r" && score !== null && score < 70) {
        e.preventDefault();
        retry();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, score, targetPhrase, targetLanguage]);

  const getScoreEmoji = (s: number) => {
    if (s >= 90) return "🌟";
    if (s >= 70) return "✅";
    if (s >= 50) return "💪";
    return "🔄";
  };

  const getScoreMessage = (s: number) => {
    if (s >= 90)
      return t("Muito bem! O texto reconhecido bate com a frase.", "Nice work! The recognized text matches the phrase.", "¡Muy bien! El texto reconocido coincide con la frase.");
    if (s >= 70)
      return t("Muito bem! Frase reconhecida.", "Well done! Phrase recognized.", "¡Muy bien! Frase reconocida.");
    if (s >= 50)
      return t("Quase lá! Tente novamente.", "Almost there! Try again.", "¡Casi! Inténtalo de nuevo.");
    return t("Continue praticando!", "Keep practicing!", "¡Sigue practicando!");
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "2px solid var(--border)",
        borderRadius: "20px",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          background: "linear-gradient(135deg, #1CB0F6 0%, #0095E8 100%)",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Mic size={18} style={{ color: "#fff" }} />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {t("Desafio de Pronúncia", "Pronunciation Challenge", "Desafío de Pronunciación")}
          </span>
        </div>
        {attempts > 0 && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.2)",
              padding: "3px 10px",
              borderRadius: "99px",
            }}
          >
            {t(`Tentativa ${attempts}`, `Attempt ${attempts}`, `Intento ${attempts}`)}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
        {/* Target Phrase */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            {t("Repita esta frase:", "Repeat this phrase:", "Repite esta frase:")}
          </p>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            "{targetPhrase}"
          </h3>
        </div>

        {/* Listen Button */}
        <button
          onClick={speakTarget}
          style={{
            background: "rgba(28, 176, 246, 0.1)",
            border: "2px solid rgba(28, 176, 246, 0.25)",
            borderRadius: "14px",
            padding: "10px 20px",
            color: "#1CB0F6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 800,
            transition: "all 0.2s",
          }}
        >
          <Volume2 size={18} />
          <span>{t("Ouvir Pronúncia", "Listen", "Escuchar")}</span>
          <kbd
            style={{
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "5px",
              background: "rgba(28, 176, 246, 0.18)",
              color: "#1CB0F6",
              fontWeight: 800,
              marginLeft: "2px",
            }}
          >
            L
          </kbd>
        </button>

        {error ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#FF4B4B",
              fontSize: "13px",
              background: "rgba(255,75,75,0.08)",
              padding: "14px 18px",
              borderRadius: "14px",
              width: "100%",
            }}
          >
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Mic Button */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <AnimatePresence>
                {isRecording && (
                  <>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "#FF4B4B",
                        top: 0,
                        zIndex: 0,
                      }}
                    />
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0.4 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      style={{
                        position: "absolute",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "#FF4B4B",
                        top: 0,
                        zIndex: 0,
                      }}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                whileTap={{ scale: 0.9 }}
                aria-label={
                  isRecording
                    ? t("Parar gravação", "Stop recording", "Detener grabación")
                    : t("Iniciar gravação", "Start recording", "Iniciar grabación")
                }
                aria-pressed={isRecording}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: isRecording
                    ? "#FF4B4B"
                    : "linear-gradient(135deg, #58CC02 0%, #46A302 100%)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isRecording
                    ? "0 4px 0 #CC3C3C, 0 6px 20px rgba(255,75,75,0.3)"
                    : "0 4px 0 #3D8C02, 0 6px 20px rgba(88,204,2,0.3)",
                  position: "relative",
                  zIndex: 1,
                  transition: "background 0.2s",
                }}
              >
                <Mic size={28} />
              </motion.button>

              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <span>
                  {isRecording
                    ? t("Gravando… Toque para parar", "Recording… Tap to stop", "Grabando… Toca para detener")
                    : t("Toque para falar", "Tap to speak", "Toca para hablar")}
                </span>
                <kbd
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "5px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontWeight: 800,
                  }}
                >
                  {isPT ? "Espaço" : isES ? "Espacio" : "Space"}
                </kbd>
              </span>
            </div>

            {/* Word-by-word Results — Duolingo style */}
            {wordResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Score Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "16px",
                    background: score! >= 70
                      ? "rgba(88, 204, 2, 0.08)"
                      : score! >= 50
                        ? "rgba(255, 150, 0, 0.08)"
                        : "rgba(255, 75, 75, 0.08)",
                    border: score! >= 70
                      ? "2px solid rgba(88, 204, 2, 0.2)"
                      : score! >= 50
                        ? "2px solid rgba(255, 150, 0, 0.2)"
                        : "2px solid rgba(255, 75, 75, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "32px" }}>{getScoreEmoji(score!)}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t(`Correspondência da frase: ${score}%`, `Phrase match: ${score}%`, `Coincidencia de la frase: ${score}%`)}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {getScoreMessage(score!)}
                    </div>
                  </div>
                </div>

                {/* Word Pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    justifyContent: "center",
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                  }}
                >
                  {wordResults.map((wr, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#fff",
                        background: WORD_COLORS[wr.status],
                        boxShadow: `0 2px 0 ${wr.status === "correct" ? "#3D8C02" : wr.status === "incorrect" ? "#CC7A00" : "#CC3C3C"}`,
                        textTransform: "capitalize",
                      }}
                    >
                      {wr.word}
                      {wr.status === "correct" && <CheckCircle size={12} />}
                      {wr.status === "incorrect" && <AlertTriangle size={12} />}
                    </motion.span>
                  ))}
                </div>

                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { color: WORD_COLORS.correct, label: t("Correto", "Correct", "Correcto") },
                    { color: WORD_COLORS.incorrect, label: t("Diferente", "Different", "Distinta") },
                    { color: WORD_COLORS.missing, label: t("Faltou", "Missing", "Faltó") },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}
                    >
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "3px",
                          background: item.color,
                        }}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* You said */}
                {spokenText && (
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      padding: "12px 16px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {t("Texto reconhecido:", "Recognized text:", "Texto reconocido:")}
                    </span>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px", margin: "4px 0 0 0" }}>
                      "{spokenText}"
                    </p>
                  </div>
                )}

                {/* Retry button */}
                {score! < 70 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={retry}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "14px 24px",
                      borderRadius: "14px",
                      border: "none",
                      background: "linear-gradient(135deg, #1CB0F6 0%, #0095E8 100%)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 4px 0 #0077CC, 0 6px 16px rgba(28,176,246,0.3)",
                      width: "100%",
                      transition: "transform 0.1s",
                    }}
                  >
                    <RefreshCw size={16} />
                    <span>{t("Tentar Novamente", "Try Again", "Intentar de Nuevo")}</span>
                    <kbd
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "5px",
                        background: "rgba(255, 255, 255, 0.25)",
                        color: "#fff",
                        fontWeight: 800,
                        marginLeft: "4px",
                      }}
                    >
                      R
                    </kbd>
                  </motion.button>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <p
          style={{
            fontSize: "11px",
            lineHeight: 1.5,
            color: "var(--text-soft)",
            textAlign: "center",
            margin: 0,
          }}
        >
          {t(
            "Comparamos o texto reconhecido com a frase esperada. Este resultado não avalia sotaque ou qualidade da pronúncia.",
            "We compare the recognized text with the expected phrase. This does not assess accent or pronunciation quality.",
            "Comparamos el texto reconocido con la frase esperada. El resultado no evalúa el acento ni la calidad de pronunciación.",
          )}
        </p>
      </div>
    </div>
  );
}
