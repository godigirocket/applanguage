import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { safeQuery, supabase } from "@/lib/supabase";
import {
  saveConversation,
  awardXP,
  updateStreak,
  saveProgressSnapshot,
  addLocalXP,
  getLocalStreak,
  safeGetProfile,
} from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/hooks/useStore";
import { TOPIC_BY_SLUG, MOODS } from "@/lib/topics";
import { lumeChat } from "@/lib/lume-ai.functions";
import { getGoogleTTS } from "@/lib/tts.functions";
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
import { checkTables } from "@/lib/supabase-safe";

export const Route = createFileRoute("/conversation/$topic")({
  head: ({ params }) => ({
    meta: [{ title: `${TOPIC_BY_SLUG[params.topic]?.title || "Conversation"} — Lume` }],
  }),
  component: ConversationPage,
});

const ENCOURAGEMENTS = [
  "You're doing great!",
  "Every sentence counts.",
  "Mistakes are how we learn.",
  "Keep going.",
  "You're braver than you think.",
];

function ConversationPage() {
  const { topic: topicSlug } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const t = TOPIC_BY_SLUG[topicSlug];

  const chatFn = useServerFn(lumeChat);
  const ttsFn = useServerFn(getGoogleTTS);

  const { messages, addMessage, clearMessages, addXP, language, interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const [profile, setProfile] = useState<any>(null);
  const [activeMood, setActiveMood] = useState<any>("calm");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionExpressions, setSessionExpressions] = useState(0);
  const [sessionSavedList, setSessionSavedList] = useState<string[]>([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [showSetupBanner, setShowSetupBanner] = useState(false);
  const [starBurstPos, setStarBurstPos] = useState<{ x: number; y: number } | null>(null);

  const [vocabulary, setVocabulary] = useState<{ word: string; translation: string }[]>([]);
  const [culturalTip, setCulturalTip] = useState("");

  useEffect(() => {
    async function verifyDatabase() {
      const exists = await checkTables();
      setShowSetupBanner(!exists);
    }
    verifyDatabase();
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!authLoading && !user) {
      nav({ to: "/login" });
      return;
    }
    if (user) {
      safeGetProfile(user.id).then((profileData) => {
        const fallbackProfile = profileData || {
          full_name: user.email?.split("@")[0] || "Friend",
          level: "beginner",
          preferred_mood: "calm",
        };
        setProfile(fallbackProfile);
        if (fallbackProfile.preferred_mood) setActiveMood(fallbackProfile.preferred_mood);
      });
    }
    clearMessages();

    // Fetch initial vocabulary and tip
    if (t) {
      chatFn({
        data: {
          topic: t.title,
          language: language as any,
          level: "beginner",
          studentName: "Student",
          mood: "cultural",
          messages: [
            {
              role: "user",
              content: `(System: Generate 5 key vocabulary words with translations and 1 cultural tip for "${t.title}". Format JSON: { "vocab": [{"word": "word", "translation": "trad"}], "tip": "one sentence" })`,
            },
          ],
        },
      }).then((res) => {
        try {
          const match = res.reply.match(/\{[\s\S]*\}/);
          const parsed = JSON.parse(match ? match[0] : res.reply);
          setVocabulary(parsed.vocab || []);
          setCulturalTip(parsed.tip || "");
        } catch (e: any) {
          console.warn("AI vocabulary parsing fell back to curated static list (non-fatal):", e.message || e);
          const langKey = language === "pt" ? "pt" : "en";
          const defaultVocab = (t.vocab?.[langKey as "pt" | "en"] || []).map((w, idx) => ({
            word: w,
            translation: langKey === "pt" ? (t.vocab?.en?.[idx] || "") : (t.vocab?.pt?.[idx] || ""),
          }));
          const defaultTip = t.culturalTip?.[langKey as "pt" | "en"] || "";
          setVocabulary(defaultVocab);
          setCulturalTip(defaultTip);
        }
      }).catch((err: any) => {
        console.warn("AI vocabulary fetching fell back to curated static list (non-fatal):", err.message || err);
        const langKey = language === "pt" ? "pt" : "en";
        const defaultVocab = (t.vocab?.[langKey as "pt" | "en"] || []).map((w, idx) => ({
          word: w,
          translation: langKey === "pt" ? (t.vocab?.en?.[idx] || "") : (t.vocab?.pt?.[idx] || ""),
        }));
        const defaultTip = t.culturalTip?.[langKey as "pt" | "en"] || "";
        setVocabulary(defaultVocab);
        setCulturalTip(defaultTip);
      });
    }

    timerRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [user, authLoading, nav, topicSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 1. AUTO-GENERATED FIRST MESSAGE on mount
  useEffect(() => {
    if (profile && messages.length === 0 && !isTyping) {
      generateFirstMessage();
    }
  }, [profile]);

  async function playTTS(text: string) {
    if (typeof window === "undefined" || isMuted) return;
    const code = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US";
    try {
      const { audioContent } = await ttsFn({ data: { text, languageCode: code as any } });
      if (audioContent) {
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audioRef.current = audio;
        await audio.play();
      } else {
        // Fallback to browser SpeechSynthesis
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = code;
        utter.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      console.warn("Google TTS failed, falling back to native SpeechSynthesis:", e);
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = code;
        utter.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.error("Browser speech synthesis also failed:", err);
      }
    }
  }

  function getCleanChatData(customMessages: any[]) {
    // 1. Normalize studentName
    const studentName = (profile?.full_name || "Friend").slice(0, 80).trim() || "Friend";

    // 2. Normalize topic
    const topic = (t?.title || "Free Talk").slice(0, 80).trim() || "Free Talk";

    // 3. Normalize language
    const cleanLang = ["pt", "en", "es"].includes(language) ? language : "en";

    // 4. Normalize mood
    const cleanMood = ["calm", "intensive", "cultural", "confidence"].includes(activeMood)
      ? activeMood
      : "calm";

    // 5. Normalize level (map "Beginner" -> "beginner", "Conversationalist"/"Explorer" -> "intermediate", etc.)
    const rawLevel = String(profile?.level || "beginner").toLowerCase();
    let cleanLevel: "beginner" | "intermediate" | "advanced" = "beginner";
    if (rawLevel.includes("intermediate") || rawLevel.includes("explorer") || rawLevel.includes("conversationalist")) {
      cleanLevel = "intermediate";
    } else if (rawLevel.includes("advanced") || rawLevel.includes("fluent") || rawLevel.includes("native")) {
      cleanLevel = "advanced";
    }

    // 6. Normalize messages: filter out empty messages, limit roles, slice to last 30, and truncate content
    const cleanMessages = customMessages
      .filter((m) => m && m.content && String(m.content).trim())
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content).slice(0, 4000),
      }))
      .slice(-30);

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
    setIsTyping(true);
    try {
      const searchParams =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const lessonPrompt = searchParams ? searchParams.get("prompt") : null;

      const systemPrompt = lessonPrompt
        ? `(System: This is a lesson practice session. Greet the user warmly and invite them to practice using the prompt: "${lessonPrompt}")`
        : `(Greeting: Invite student to talk about ${t?.title || "anything"})`;

      const requestData = getCleanChatData([{ role: "user", content: systemPrompt }]);

      const res = await chatFn({ data: requestData });
      setIsTyping(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);
    } catch (e) {
      setIsTyping(false);
      console.error("generateFirstMessage failed:", e);
      toast.error("Failed to start conversation.");
    }
  }

  // 2. SEND MESSAGE function
  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMsg = { role: "user" as const, content };
    addMessage(userMsg);
    setInput("");
    setIsLoading(true);

    try {
      const requestData = getCleanChatData([...messages, userMsg]);

      const res = await chatFn({ data: requestData });
      setIsLoading(false);
      addMessage({ role: "assistant", content: res.reply });
      if (!isMuted) playTTS(res.reply);

      // Award XP
      const earned = 2;
      setSessionXP((prev) => prev + earned);
      addXP(earned);
    } catch (e) {
      setIsLoading(false);
      console.error("sendMessage failed:", e);
      toast.error("Failed to get response.");
    }
  }

  // 3. WEB SPEECH API for voice input
  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const message =
        "Reconhecimento de voz nao disponivel neste navegador. Use o campo de texto ou teste em um navegador com suporte.";
      setVoiceStatus(message);
      toast.error(message);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceStatus(null);
      setIsListening(true);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errorType = event?.error;
      const message =
        errorType === "not-allowed" || errorType === "service-not-allowed"
          ? "Permissao de microfone bloqueada. Ative o microfone no navegador e tente de novo."
          : errorType === "no-speech"
            ? "Nao ouvi nada ainda. Tente falar mais perto do microfone."
            : "Nao consegui iniciar a voz agora. Voce ainda pode digitar sua resposta.";
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
      const message = "A voz ja esta iniciando. Aguarde um instante e tente novamente.";
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
    const earned = 2;
    setSessionXP((prev) => prev + earned);
    addXP(earned);
    addLocalXP(earned);
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
            ? JSON.parse(localStorage.getItem("lume_saved_expressions") || "[]")
            : [];
        stored.push({
          expression: trimmed,
          context: t?.title || "Free Talk",
          topic_slug: topicSlug,
          created_at: new Date().toISOString(),
        });
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("lume_saved_expressions", JSON.stringify(stored));
        }
        toast.success("Salvo localmente! +2 XP");
      } else {
        toast.success("Expression saved! +2 XP");
      }
    } else {
      const stored =
        typeof localStorage !== "undefined"
          ? JSON.parse(localStorage.getItem("lume_saved_expressions") || "[]")
          : [];
      stored.push({
        expression: trimmed,
        context: t?.title || "Free Talk",
        topic_slug: topicSlug,
        created_at: new Date().toISOString(),
      });
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("lume_saved_expressions", JSON.stringify(stored));
      }
      toast.success("Salvo localmente! +2 XP");
    }
  }

  // 5. END SESSION — saves to DB, awards XP, shows modal
  async function endSession() {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const userMessages = messages.filter((m) => m.role === "user").length;
    const xpEarned = Math.max(5, userMessages * 3 + sessionExpressions * 2);

    setSessionSummary({
      duration,
      messages: messages.length,
      xp: xpEarned,
      expressions: sessionExpressions,
    });
    setShowEndModal(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    // Always update local XP and streak
    addXP(xpEarned);
    addLocalXP(xpEarned);
    getLocalStreak();

    if (!user) return;

    // Save to DB in background
    try {
      // Save conversation
      await saveConversation(user.id, {
        topic_slug: topicSlug,
        topic_title: topicTitle,
        language: profile?.language || language || "en",
        mood: activeMood,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        duration_seconds: duration,
        xp_earned: xpEarned,
      });

      // Award XP
      const newXP = await awardXP(user.id, xpEarned, profile?.xp || 0);

      // Update streak
      await updateStreak(user.id, profile?.last_session_date);

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
            {isPT ? "Conversa não encontrada" : "Conversation not found"}
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            {isPT
              ? "Este tópico de conversa não existe ou foi removido."
              : "This conversation topic doesn't exist or was removed."}
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
            {isPT ? "← Ver tópicos de conversa" : "← See conversation topics"}
          </button>
        </div>
      </div>
    );
  }

  const topicEmoji = t?.icon || "🗣️";
  const topicTitle = t?.title || "Free Talk";
  const topicDescription = t?.description || "A relaxed space to talk about anything.";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative" }}>
      {starBurstPos && (
        <StarBurst x={starBurstPos.x} y={starBurstPos.y} onComplete={() => setStarBurstPos(null)} />
      )}
      {showSetupBanner && (
        <div
          style={{
            background: "linear-gradient(135deg,#C4714A,#D4824A)",
            padding: "12px 24px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            boxShadow: "0 4px 14px rgba(196,113,74,0.25)",
            position: "relative",
            zIndex: 100,
          }}
        >
          <div>
            <span style={{ fontWeight: 800, fontSize: "14px", marginRight: "8px" }}>
              Base de dados não configurada:
            </span>
            <span style={{ opacity: 0.85, fontSize: "13px" }}>
              Execute o SQL no Supabase para ativar o salvamento automático das conversas.
            </span>
          </div>
          <Link
            to="/setup"
            style={{
              padding: "6px 14px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            Configurar →
          </Link>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "260px 1fr 220px",
          height: "calc(100vh - 64px)",
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
              Mood
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
                {isVoiceMode ? "Modo Chat" : "Voz Imersiva"}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
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
                  End session
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
                  {isListening ? "● Listening" : isLoading ? "● Thinking" : "Hands-Free Call"}
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
                      ? "Lume está elaborando..."
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
                    <div style={{ maxWidth: "72%" }}>
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
                            <Save size={12} /> Salvar
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

              {/* Input area */}
              <div
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
                  <div
                    onClick={isListening || isLoading ? () => {} : startListening}
                    style={{
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <MicPulseRing recording={isListening} size={72} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {isListening ? "● Recording" : isLoading ? "Thinking..." : "Tap to speak"}
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
                      placeholder="Or type here..."
                      disabled={isLoading}
                      style={{
                        flex: 1,
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
              Earned so far
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
              <Save size={12} /> Salvos ({sessionExpressions})
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
                Tap "Save" on any AI message
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
