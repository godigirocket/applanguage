import { uiFallback } from "@/i18n/ui-fallback";
import { accountKey } from "@/lib/account-storage";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { safeQuery, supabase } from "@/lib/supabase";
import {
  saveConversation,
  awardXP,
  updateStreak,
  saveProgressSnapshot,
  addLocalXP,
  getLocalStreak,
} from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { useStore } from "@/hooks/useStore";
import { TOPIC_BY_SLUG, MOODS } from "@/lib/topics";
import { guidedTurn } from "@/lib/guided-conversation";
import { speak, stopSpeaking } from "@/lib/language-apis/webSpeech";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Volume2,
  VolumeX,
  Save,
  Play,
  Clock,
  Sparkles,
  Trophy,
  Mic,
  Send,
  MessageSquare,
  Star,
  BookOpen,
  Award,
} from "@/components/lume/CustomIcons";
import { toast } from "sonner";
import { TypingIndicator, MicPulseRing, StarBurst } from "@/components/lume/Animations";
import { DynamicIcon } from "@/components/lume/DynamicIcon";
// @ts-ignore
import confetti from "canvas-confetti";
import { getVocabularyForTopic } from "@/lib/language-content/vocabulary-engine";
import type { LessonTopic } from "@/lib/language-content/types";

export const Route = createFileRoute("/conversation/$topic")({
  head: ({ params }) => ({
    meta: [{ title: `${TOPIC_BY_SLUG[params.topic]?.title || "Conversation"} — Lume` }],
  }),
  component: ConversationRoute,
});

const ENCOURAGEMENTS = [
  "You're doing great!",
  "Every sentence counts.",
  "Mistakes are how we learn.",
  "Keep going.",
  "You're braver than you think.",
];

function ConversationRoute() {
  const { topic } = Route.useParams();
  const language = useStore((s) => s.targetLanguage);
  const { user } = useAuth();
  return <ConversationPage key={`${topic}:${language}:${user?.id || "guest"}`} />;
}

function ConversationPage() {
  const { topic: topicSlug } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const t = TOPIC_BY_SLUG[topicSlug];

  const {
    messages,
    addMessage,
    clearMessages,
    addXP,
    targetLanguage: language,
    interfaceLanguage,
  } = useStore();
  const isPT = interfaceLanguage === "pt";
  const uiCopy = (pt: string, en: string, es: string) =>
    interfaceLanguage === "pt" ? pt : interfaceLanguage === "es" ? es : en;

  const { data: remoteProfile } = useProfile(user?.id);
  const profile = useMemo<{
    full_name?: string | null;
    level?: string | null;
    preferred_mood?: string | null;
    language?: string | null;
    xp?: number | null;
    last_session_date?: string | null;
  } | null>(
    () =>
      user
        ? remoteProfile || {
            full_name: user.email?.split("@")[0] || "Friend",
            level: "beginner",
            preferred_mood: "calm",
          }
        : null,
    [remoteProfile, user?.id],
  );
  const [activeMood, setActiveMood] = useState<any>("calm");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const sessionStartTime = useRef(Date.now());
  const sessionEnded = useRef(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionExpressions, setSessionExpressions] = useState(0);
  const [sessionSavedList, setSessionSavedList] = useState<string[]>([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [chatError, setChatError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const rewardedAnswers = useRef(new Set<string>());
  const savedExpressions = useRef(new Set<string>());
  const greetingStarted = useRef(false);
  const requestInFlight = useRef(false);
  const recognitionRef = useRef<any>(null);
  const activeRef = useRef(true);
  const [starBurstPos, setStarBurstPos] = useState<{ x: number; y: number } | null>(null);

  const [vocabulary, setVocabulary] = useState<{ word: string; translation: string }[]>([]);
  const [culturalTip, setCulturalTip] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
      recognitionRef.current?.abort();
      stopSpeaking();
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav({ to: "/login", search: { redirect: `/conversation/${topicSlug}` }, replace: true });
      return;
    }
    clearMessages();
    greetingStarted.current = false;
    setChatError(false);

    // Curated topic resources are ready immediately and need no AI request.
    if (t) {
      const topicMap: Record<string, LessonTopic> = {
        "daily-life": "daily",
        "art-culture": "culture",
        professional: "business",
        "free-talk": "daily",
        "speaking-confidence": "pronunciation",
        "music-expression": "culture",
        travel: "travel",
        relationships: "family",
      };
      setVocabulary(
        getVocabularyForTopic(topicMap[topicSlug] || "daily", language, {
          count: 5,
          interfaceLanguage,
        }).map((word) => ({ word: word.term, translation: word.translation })),
      );
      setCulturalTip(language === "es" ? "" : t.culturalTip?.[language] || "");
    }

    timerRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [user?.id, authLoading, nav, topicSlug, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 1. AUTO-GENERATED FIRST MESSAGE on mount
  useEffect(() => {
    if (profile && messages.length === 0 && !greetingStarted.current) {
      greetingStarted.current = true;
      generateFirstMessage();
    }
  }, [profile, topicSlug, language, messages.length]);

  function playTTS(text: string) {
    if (!activeRef.current || isMuted) return;
    if (
      !speak(text, language, {
        rate: 0.9,
        onError: () => {
          if (activeRef.current)
            setVoiceStatus(
              isPT
                ? "Não foi possível reproduzir a voz. Confira as vozes instaladas no aparelho e toque em Áudio novamente."
                : uiFallback(
                    "Voice playback is unavailable. Check your device voices and tap Audio again.",
                  ),
            );
        },
      })
    ) {
      setVoiceStatus(
        isPT
          ? "Este navegador não oferece leitura em voz alta. A prática por texto continua disponível."
          : uiFallback(
              "This browser does not support speech playback. You can still practice by typing.",
            ),
      );
    }
  }

  function getCleanChatData(customMessages: any[]) {
    // 1. Normalize studentName
    const studentName = (profile?.full_name || "Friend").slice(0, 80).trim() || "Friend";

    // 2. Normalize topic
    const topic = topicSlug;

    // 3. Normalize language
    const cleanLang = ["pt", "en", "es"].includes(language) ? language : "en";

    // 4. Normalize mood
    const cleanMood = ["calm", "intensive", "cultural", "confidence"].includes(activeMood)
      ? activeMood
      : "calm";

    // 5. Normalize level (map "Beginner" -> "beginner", "Conversationalist"/"Explorer" -> "intermediate", etc.)
    const rawLevel = String(profile?.level || "beginner").toLowerCase();
    let cleanLevel: "beginner" | "intermediate" | "advanced" = "beginner";
    if (
      rawLevel.includes("intermediate") ||
      rawLevel.includes("explorer") ||
      rawLevel.includes("conversationalist")
    ) {
      cleanLevel = "intermediate";
    } else if (
      rawLevel.includes("advanced") ||
      rawLevel.includes("fluent") ||
      rawLevel.includes("native")
    ) {
      cleanLevel = "advanced";
    }

    // Local progression needs the complete session, including steps before help.
    const cleanMessages = customMessages
      .filter((m) => m && m.content && String(m.content).trim())
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content).slice(0, 4000),
      }));

    // Ensure at least one message is present
    if (cleanMessages.length === 0) {
      cleanMessages.push({ role: "user", content: "Hi" });
    }

    return {
      topic,
      language: cleanLang as any,
      mood: cleanMood as any,
      level: cleanLevel,
      studentName,
      messages: cleanMessages,
    };
  }

  async function generateFirstMessage() {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setChatError(false);
    setIsTyping(true);
    try {
      const lessonPrompt = new URLSearchParams(window.location.search).get("prompt") || undefined;
      const res = guidedTurn({ ...getCleanChatData([]), messages: [], prompt: lessonPrompt });
      setSuggestions(res.suggestions);
      if (!activeRef.current) return;
      setIsTyping(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);
    } catch (e) {
      setIsTyping(false);
      if (!activeRef.current) return;
      console.warn("Conversation is temporarily unavailable.");
      setChatError(true);
    } finally {
      requestInFlight.current = false;
    }
  }

  // 2. SEND MESSAGE function
  async function sendMessage(content: string) {
    if (!content.trim() || requestInFlight.current || isTyping) return;
    requestInFlight.current = true;
    setChatError(false);

    const userMsg = { role: "user" as const, content };
    addMessage(userMsg);
    setInput("");
    setIsLoading(true);

    try {
      const requestData = getCleanChatData([...messages, userMsg]);

      const res = guidedTurn(requestData);
      setSuggestions(res.suggestions);
      if (!activeRef.current) return;
      setIsLoading(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);

      // Award XP
      const normalized = content.trim().toLocaleLowerCase();
      if (res.earnsXP && !rewardedAnswers.current.has(normalized)) {
        rewardedAnswers.current.add(normalized);
        const earned = 2;
        setSessionXP((prev) => prev + earned);
        addXP(earned);
      }
    } catch (e) {
      setIsLoading(false);
      if (!activeRef.current) return;
      console.warn("Conversation is temporarily unavailable.");
      setChatError(true);
    } finally {
      requestInFlight.current = false;
    }
  }

  // 3. WEB SPEECH API for voice input
  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const message = uiCopy(
        "Reconhecimento de voz indisponível neste aparelho. Use o campo de texto.",
        "Speech recognition is unavailable on this device. Use the text field.",
        "El reconocimiento de voz no está disponible en este dispositivo. Usa el campo de texto.",
      );
      setVoiceStatus(message);
      toast.error(message);
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceStatus(null);
      setIsListening(true);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errorType = event?.error;
      const message =
        errorType === "not-allowed" || errorType === "service-not-allowed"
          ? uiCopy(
              "Microfone bloqueado. Libere a permissão no navegador.",
              "Microphone blocked. Allow access in your browser settings.",
              "Micrófono bloqueado. Permite el acceso en los ajustes del navegador.",
            )
          : errorType === "no-speech"
            ? uiCopy(
                "Não ouvi sua resposta. Fale mais perto do microfone.",
                "I did not hear your reply. Speak closer to the microphone.",
                "No he oído tu respuesta. Habla más cerca del micrófono.",
              )
            : uiCopy(
                "Não foi possível iniciar a voz. Você pode digitar sua resposta.",
                "Could not start speech recognition. You can type your reply.",
                "No se pudo iniciar el reconocimiento. Puedes escribir tu respuesta.",
              );
      setVoiceStatus(message);
      toast.error(message);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
      setVoiceStatus(null);
      if (event.results[0].isFinal) {
        sendMessage(transcript);
      }
    };
    try {
      recognition.start();
    } catch {
      const message = uiCopy(
        "Aguarde um instante antes de tentar novamente.",
        "Wait a moment before trying again.",
        "Espera un momento antes de volver a intentarlo.",
      );
      setVoiceStatus(message);
      toast.message(message);
    }
  }

  // 4. SAVE EXPRESSION on long press / button click
  async function saveExpression(messageContent: string, x?: number, y?: number) {
    if (x !== undefined && y !== undefined) {
      setStarBurstPos({ x, y });
    }
    const trimmed = messageContent.slice(0, 200);
    if (savedExpressions.current.has(trimmed)) return;
    savedExpressions.current.add(trimmed);
    const earned = 2;
    setSessionXP((prev) => prev + earned);
    addXP(earned);
    setSessionExpressions((prev) => prev + 1);
    setSessionSavedList((prev) => [...prev, messageContent]);

    if (user) {
      const { error } = await supabase.from("saved_expressions").insert({
        student_id: user.id,
        expression: trimmed,
        context: t?.title || "Free Talk",
        topic_slug: topicSlug,
      } as any);

      if (error) {
        // Local storage backup
        const stored =
          typeof localStorage !== "undefined"
            ? JSON.parse(localStorage.getItem(accountKey("lume_saved_expressions")) || "[]")
            : [];
        stored.push({
          expression: trimmed,
          context: t?.title || "Free Talk",
          topic_slug: topicSlug,
          created_at: new Date().toISOString(),
        });
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(accountKey("lume_saved_expressions"), JSON.stringify(stored));
        }
        toast.success("Salvo localmente! +2 XP");
      } else {
        toast.success("Expression saved! +2 XP");
      }
    } else {
      const stored =
        typeof localStorage !== "undefined"
          ? JSON.parse(localStorage.getItem(accountKey("lume_saved_expressions")) || "[]")
          : [];
      stored.push({
        expression: trimmed,
        context: t?.title || "Free Talk",
        topic_slug: topicSlug,
        created_at: new Date().toISOString(),
      });
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(accountKey("lume_saved_expressions"), JSON.stringify(stored));
      }
      toast.success("Salvo localmente! +2 XP");
    }
  }

  // 5. END SESSION — saves to DB, awards XP, shows modal
  async function endSession() {
    if (sessionEnded.current) return;
    sessionEnded.current = true;
    const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    const xpEarned = sessionXP;

    setSessionSummary({
      duration,
      messages: messages.length,
      xp: xpEarned,
      expressions: sessionExpressions,
    });
    setShowEndModal(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    // Replies and saved expressions already updated the visible wallet once.
    addLocalXP(xpEarned);
    getLocalStreak();

    if (!user) return;

    // Save to DB in background
    try {
      // Save conversation
      await saveConversation(user.id, {
        topic_slug: topicSlug,
        topic_title: topicTitle,
        language,
        mood: activeMood,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        duration_seconds: duration,
        xp_earned: xpEarned,
      });

      // Award XP
      const latest = await supabase.from("profiles").select("xp").eq("id", user.id).maybeSingle();
      const newXP = await awardXP(user.id, xpEarned, latest.data?.xp ?? profile?.xp ?? 0);

      // Update streak
      await updateStreak(user.id, profile?.last_session_date || null);

      // Save progress snapshot
      await saveProgressSnapshot(user.id, newXP);
    } catch (e) {
      console.error("End session save failed:", e);
      // Don't crash — session still happened
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, "0")}`;
  };

  // An unknown/stale :topic slug (bad link, old bookmark) used to render a
  // silent blank white page — this was the only guard standing between a
  // typo'd URL and an empty <body>, so give it a real "not found" screen
  // instead of `return null`.
  if (!t && topicSlug !== "free-talk") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <MessageSquare size={64} color="var(--text-secondary)" style={{ marginBottom: "16px" }} />
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            {isPT ? "Conversa não encontrada" : uiFallback("Conversation not found")}
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            {isPT
              ? "Este tópico de conversa não existe ou foi removido."
              : uiFallback("This conversation topic doesn't exist or was removed.")}
          </p>
          <button
            onClick={() => nav({ to: "/conversation/free-talk" as any })}
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              background: "var(--brand)",
              color: "white",
              border: "none",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isPT ? "← Ver tópicos de conversa" : uiFallback("← See conversation topics")}
          </button>
        </div>
      </div>
    );
  }

  const topicEmoji = t?.icon || "🗣️";
  const topicTitle = t?.title || "Free Talk";
  const topicDescription = t?.description || "A relaxed space to talk about anything.";

  return (
    <div className="lume-conversation-page">
      {starBurstPos && (
        <StarBurst x={starBurstPos.x} y={starBurstPos.y} onComplete={() => setStarBurstPos(null)} />
      )}
      {chatError && (
        <div
          role="alert"
          style={{
            padding: "16px 24px",
            background: "var(--surface-raised)",
            color: "var(--text-primary)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p>
            {isPT
              ? "A conversa está indisponível no momento. Tente novamente em instantes."
              : uiFallback("Conversation is unavailable right now. Please try again shortly.")}
          </p>
          {messages.length === 0 && (
            <button
              type="button"
              className="btn-gold"
              disabled={isTyping}
              onClick={generateFirstMessage}
            >
              {isPT ? "Tentar novamente" : uiFallback("Try again")}
            </button>
          )}
        </div>
      )}
      <div
        className="lume-conversation-layout"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "260px 1fr 220px",
          flex: 1,
          minHeight: 0,
          gap: "0",
          overflow: "hidden",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            padding: "24px 20px",
            overflowY: "auto",
            background: "var(--surface-raised)",
            display: isMobile ? "none" : "block",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "8px", color: "var(--brand)" }}>
              <MessageSquare size={32} />
            </div>
            <h2
              style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "4px" }}
            >
              {topicTitle}
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {topicDescription}
            </p>
          </div>

          {/* Mood selector */}
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              {uiCopy("Estilo de prática", "Practice style", "Estilo de práctica")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {MOODS.map((mood) => (
                <button
                  key={mood.slug}
                  onClick={() => setActiveMood(mood.slug)}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "12px",
                    background:
                      activeMood === mood.slug
                        ? (mood as any).color || "var(--accent-green)"
                        : "var(--surface-raised)",
                    color: activeMood === mood.slug ? "white" : "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow:
                      activeMood === mood.slug
                        ? `0 4px 16px ${(mood as any).color || "var(--accent-green)"}40`
                        : "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.2s",
                    border:
                      activeMood === mood.slug
                        ? `2px solid ${(mood as any).color || "var(--accent-green)"}`
                        : "2px solid var(--border)",
                  }}
                >
                  {/* mood.icon is a Lucide icon *name* (e.g. "Leaf"), not a glyph —
                      rendering it directly as text showed the literal word "Leaf"
                      instead of a leaf icon on every mood button. */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "3px" }}>
                    <DynamicIcon
                      name={mood.icon}
                      size={18}
                      color={activeMood === mood.slug ? "white" : "var(--text-primary)"}
                    />
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700 }}>{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary */}
          {vocabulary.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: "10px",
                }}
              >
                Key Vocabulary
              </p>
              {vocabulary.map((v, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "8px",
                    padding: "10px 12px",
                    background: "var(--surface-raised)",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                    {v.word}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontStyle: "italic",
                    }}
                  >
                    {v.translation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cultural tip */}
          {culturalTip && (
            <div
              style={{
                padding: "12px",
                background: "rgba(196,113,74,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(196,113,74,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent-terra)",
                  marginBottom: "4px",
                }}
              >
                Dica Cultural
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.5 }}>
                {culturalTip}
              </div>
            </div>
          )}
        </div>

        {/* CENTER — CHAT */}
        <div
          className="lume-conversation-center"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "var(--surface-raised)",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--surface-raised)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                to="/home"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontSize: "16px",
                }}
              >
                <ChevronLeft size={20} />
              </Link>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MessageSquare size={16} color="var(--brand)" /> {topicTitle}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {formatTime(sessionDuration)} · {messages.filter((m) => m.role === "user").length}{" "}
                  messages
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "99px",
                  background: isVoiceMode ? "var(--accent-terra)" : "var(--surface)",
                  color: isVoiceMode ? "white" : "var(--accent-terra)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: isVoiceMode ? "0 4px 12px rgba(196,113,74,0.25)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {isVoiceMode
                  ? uiCopy("Modo texto", "Text mode", "Modo texto")
                  : uiCopy("Modo de voz", "Voice mode", "Modo de voz")}
              </button>
              <button
                onClick={() => {
                  if (!isMuted) stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              {messages.length >= 6 && (
                <button
                  onClick={endSession}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "99px",
                    background: "var(--accent-green)",
                    color: "var(--surface-raised)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {uiCopy("Encerrar sessão", "End session", "Terminar sesión")}
                </button>
              )}
            </div>
          </div>

          {/* Messages or Immersive Voice UI */}
          {isVoiceMode ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(circle at center, #2f80ed 0%, #0F202B 100%)",
                color: "var(--surface-raised)",
                padding: "40px 24px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Grid Background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  maxWidth: "480px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#C9A84C",
                    textTransform: "uppercase",
                    letterSpacing: "0.25em",
                    marginBottom: "8px",
                  }}
                >
                  {isListening
                    ? uiCopy("● Escutando", "● Listening", "● Escuchando")
                    : isLoading
                      ? uiCopy("● Preparando", "● Preparing", "● Preparando")
                      : uiCopy("Prática por voz", "Voice practice", "Práctica por voz")}
                </span>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "32px",
                    marginBottom: "16px",
                    fontWeight: 700,
                  }}
                >
                  {isListening
                    ? "Fale naturalmente"
                    : isLoading
                      ? "Preparando o próximo passo..."
                      : "Pronto para Conversar"}
                </h2>

                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    marginBottom: "48px",
                  }}
                >
                  {language === "pt"
                    ? "Feche os olhos e fale. O Lume vai te escutar e responder por voz automaticamente, como um telefonema real!"
                    : "Close your eyes and speak. Lume will listen and talk back to you automatically, just like a real phone call!"}
                </p>

                {/* breathing Glowing Orb */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: "48px",
                    width: "220px",
                    height: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: "rgba(196,113,74,0.3)",
                            border: "1.5px solid #C4714A",
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 2.3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: 0.7,
                            ease: "easeOut",
                          }}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: "rgba(196,113,74,0.15)",
                            border: "1px solid #C4714A",
                          }}
                        />
                      </>
                    )}
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        style={{
                          position: "absolute",
                          width: "110%",
                          height: "110%",
                          borderRadius: "50%",
                          border: "2.5px dashed rgba(201, 168, 76, 0.4)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={
                      isListening
                        ? { scale: [1, 1.1, 1] }
                        : isLoading
                          ? { scale: [1, 1.04, 1] }
                          : { scale: 1 }
                    }
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    onClick={isListening ? () => {} : startListening}
                    style={{
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      background: isListening
                        ? "radial-gradient(circle, #D4834A 0%, #C4714A 100%)"
                        : isLoading
                          ? "radial-gradient(circle, #E5C365 0%, #C9A84C 100%)"
                          : "radial-gradient(circle, #4A7A5A 0%, #ff7a45 100%)",
                      boxShadow: isListening
                        ? "0 12px 48px rgba(196,113,74,0.45)"
                        : isLoading
                          ? "0 12px 48px rgba(201,168,76,0.35)"
                          : "0 12px 48px rgba(255,122,69,0.35)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 12,
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Mic size={40} color="white" />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        marginTop: "10px",
                        color: "var(--surface-raised)",
                      }}
                    >
                      {isListening
                        ? "Escutando..."
                        : isLoading
                          ? "Processando..."
                          : "Toque p/ Falar"}
                    </span>
                  </motion.div>
                  {voiceStatus && (
                    <p
                      style={{
                        maxWidth: "260px",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: 1.45,
                        textAlign: "center",
                        marginTop: "12px",
                      }}
                    >
                      {voiceStatus}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setIsVoiceMode(false)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "99px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      color: "var(--surface-raised)",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.25s",
                    }}
                    className="hover:bg-white/20 active:scale-95"
                  >
                    Ver Transcrição / Escrever
                  </button>

                  {messages.length > 0 && (
                    <button
                      onClick={() => {
                        const lastMsg = messages[messages.length - 1];
                        if (lastMsg) playTTS(lastMsg.content);
                      }}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "99px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        color: "var(--surface-raised)",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.25s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      className="hover:bg-white/20 active:scale-95"
                    >
                      <Volume2 size={16} /> Repetir Áudio
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "10px",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: "linear-gradient(135deg,var(--brand),var(--brand-2))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div
                      data-testid={msg.role === "assistant" ? "practice-reply" : "practice-user"}
                      style={{ maxWidth: "85%", minWidth: 0, overflowWrap: "anywhere" }}
                    >
                      <div
                        style={{
                          padding: "14px 18px",
                          background:
                            msg.role === "user"
                              ? "linear-gradient(135deg,var(--brand),var(--brand-2))"
                              : "var(--bg)",
                          color: msg.role === "user" ? "white" : "var(--text-primary)",
                          borderRadius:
                            msg.role === "user" ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
                          boxShadow:
                            msg.role === "user"
                              ? "0 4px 16px rgba(255,122,69,0.25)"
                              : "0 2px 12px rgba(0,0,0,0.07)",
                          border:
                            msg.role === "assistant" ? "1px solid rgba(224,221,214,0.5)" : "none",
                          fontSize: "15px",
                          lineHeight: 1.7,
                        }}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "assistant" && (
                        <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                          <button
                            onClick={() => playTTS(msg.content)}
                            style={{
                              padding: "3px 10px",
                              borderRadius: "99px",
                              background: "rgba(255,122,69,0.08)",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--accent-green)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Volume2 size={12} /> Áudio
                          </button>
                          <button
                            onClick={(e) => saveExpression(msg.content, e.clientX, e.clientY)}
                            style={{
                              padding: "3px 10px",
                              borderRadius: "99px",
                              background: "rgba(201,168,76,0.1)",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#B8962A",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Save size={12} /> {uiCopy("Salvar", "Save", "Guardar")}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,var(--brand),var(--brand-2))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Sparkles size={14} />
                    </div>
                    <div
                      style={{
                        background: "var(--bg)",
                        borderRadius: "4px 20px 20px 20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                        border: "1px solid rgba(224,221,214,0.5)",
                      }}
                    >
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                className="lume-conversation-suggestions"
                style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}
              >
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
                  {isPT
                    ? "Prática guiada · cenários de conversa"
                    : uiFallback("Guided practice · conversation scenarios")}
                </p>
                <div
                  aria-label={isPT ? "Sugestões de resposta" : uiFallback("Suggested replies")}
                  style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={isLoading}
                      style={{
                        padding: "8px 12px",
                        maxWidth: "100%",
                        textAlign: "left",
                        overflowWrap: "anywhere",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        background: "var(--bg)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div
                className="lume-conversation-composer"
                style={{
                  padding: "16px 20px",
                  background: "var(--surface-raised)",
                  borderTop: "1px solid var(--border)",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {/* Mic button */}
                  <button
                    type="button"
                    aria-label={isPT ? "Falar resposta" : uiFallback("Speak your reply")}
                    disabled={isLoading}
                    onClick={startListening}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <MicPulseRing recording={isListening} size={72} />
                  </button>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {isListening
                      ? uiCopy("● Gravando", "● Recording", "● Grabando")
                      : isLoading
                        ? uiCopy(
                            "Preparando resposta…",
                            "Preparing a reply…",
                            "Preparando respuesta…",
                          )
                        : uiCopy("Toque para falar", "Tap to speak", "Toca para hablar")}
                  </span>
                  {voiceStatus && (
                    <p
                      style={{
                        margin: "-4px 0 0",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: 1.45,
                        textAlign: "center",
                      }}
                    >
                      {voiceStatus}
                    </p>
                  )}

                  {/* Text input */}
                  <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                      placeholder={uiCopy("Ou digite aqui…", "Or type here…", "O escribe aquí…")}
                      aria-label={isPT ? "Sua resposta" : uiFallback("Your reply")}
                      maxLength={4000}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        padding: "12px 18px",
                        borderRadius: "99px",
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        fontSize: "15px",
                        outline: "none",
                        fontFamily: '"DM Sans", sans-serif',
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent-green)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: input.trim() ? "var(--accent-green)" : "var(--border)",
                        color: "var(--surface-raised)",
                        border: "none",
                        cursor: input.trim() ? "pointer" : "not-allowed",
                        fontSize: "18px",
                        flexShrink: 0,
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            borderLeft: "1px solid var(--border)",
            padding: "24px 16px",
            background: "var(--surface-raised)",
            overflowY: "auto",
            display: isMobile ? "none" : "block",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            This session
          </p>

          {/* Session timer */}
          <div
            style={{
              padding: "14px",
              background: "var(--surface-raised)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--accent-green)",
              }}
            >
              {formatTime(sessionDuration)}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Practice time
            </div>
          </div>

          {/* XP this session */}
          <div
            style={{
              padding: "14px",
              background: "rgba(201,168,76,0.08)",
              borderRadius: "14px",
              border: "1px solid rgba(201,168,76,0.2)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "#C9A84C",
              }}
            >
              +{sessionXP} XP
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {uiCopy("Você ganhou", "Earned so far", "Has ganado")}
            </div>
          </div>

          {/* Saved expressions this session */}
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Save size={12} /> {uiCopy("Salvos", "Saved", "Guardados")} ({sessionExpressions})
            </p>
            {sessionSavedList.length === 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  padding: "8px",
                }}
              >
                {uiCopy(
                  "Toque em Salvar abaixo de uma frase.",
                  "Tap Save below a phrase.",
                  "Pulsa Guardar debajo de una frase.",
                )}
              </p>
            ) : (
              sessionSavedList.slice(-3).map((exp, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 10px",
                    background: "var(--surface-raised)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    marginBottom: "6px",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                  }}
                >
                  {exp.slice(0, 60)}...
                </div>
              ))
            )}
          </div>

          {/* Encouragement */}
          <div
            style={{
              padding: "12px",
              background: "rgba(255,122,69,0.06)",
              borderRadius: "14px",
              border: "1px solid rgba(255,122,69,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "var(--accent-green)",
                fontStyle: "italic",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              {ENCOURAGEMENTS[Math.floor(sessionDuration / 60) % ENCOURAGEMENTS.length]}
            </p>
          </div>
        </div>
      </div>

      {/* END SESSION MODAL */}
      <AnimatePresence>
        {showEndModal && sessionSummary && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{
                background: "var(--surface-raised)",
                borderRadius: "28px",
                padding: "40px 36px",
                textAlign: "center",
                maxWidth: "400px",
                width: "100%",
                boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid rgba(201,168,76,0.25)",
                    boxShadow: "0 8px 24px rgba(201,168,76,0.15)",
                  }}
                >
                  {sessionSummary.xp >= 30 ? (
                    <Trophy size={40} color="#D4A23B" />
                  ) : sessionSummary.xp >= 15 ? (
                    <Award size={40} color="#D4A23B" />
                  ) : (
                    <Sparkles size={40} color="#D4A23B" />
                  )}
                </div>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  marginBottom: "8px",
                  fontWeight: 800,
                }}
              >
                Great session!
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "15px",
                  marginBottom: "28px",
                  fontStyle: "italic",
                }}
              >
                Every conversation makes you better.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {[
                  {
                    icon: <Clock size={20} color="#FF6B35" />,
                    value: formatTime(sessionSummary.duration),
                    label: "Duration",
                  },
                  {
                    icon: <MessageSquare size={20} color="#ff7a45" />,
                    value: sessionSummary.messages,
                    label: "Messages",
                  },
                  {
                    icon: <Star size={20} fill="#C9A84C" color="#C9A84C" />,
                    value: `+${sessionSummary.xp}`,
                    label: "XP Earned",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 8px",
                      background: "rgba(247,244,239,0.5)",
                      borderRadius: "14px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--text-secondary)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {sessionSummary.expressions > 0 && (
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(201,168,76,0.1)",
                    borderRadius: "12px",
                    border: "1px solid rgba(201,168,76,0.2)",
                    marginBottom: "20px",
                    fontSize: "14px",
                    color: "#8B6914",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <BookOpen size={16} color="#8B6914" />
                  <span>
                    You saved {sessionSummary.expressions} expression
                    {sessionSummary.expressions > 1 ? "s" : ""}!
                  </span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => {
                    setShowEndModal(false);
                    nav({ to: "/home" });
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg,var(--brand),var(--brand-2))",
                    color: "var(--surface-raised)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 20px rgba(255,122,69,0.35)",
                  }}
                >
                  <ChevronLeft size={20} /> Voltar ao Início
                </button>
                <button
                  onClick={() => {
                    setShowEndModal(false);
                    clearMessages();
                    sessionEnded.current = false;
                    sessionStartTime.current = Date.now();
                    setSessionDuration(0);
                    setSessionXP(0);
                    setSessionExpressions(0);
                    setSessionSavedList([]);
                    rewardedAnswers.current.clear();
                    savedExpressions.current.clear();
                    generateFirstMessage();
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "16px",
                    background: "var(--surface-raised)",
                    color: "var(--text-primary)",
                    border: "2px solid var(--border)",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Continuar Praticando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
