import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  Book,
  Mic,
  Volume2,
  BookOpen,
  Sparkles,
  Target,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Check,
  Trophy,
  Award,
  Lock,
  Bookmark,
} from "@/components/lume/CustomIcons";
import {
  completeLesson as completeLessonDB,
  upsertLessonProgress,
  getLessonProgress,
} from "@/lib/lesson-progress";
import { getMasterLessonById, getAllMasterLessons } from "@/data/contentEngine";
import { toast } from "sonner";
import { PremiumGate } from "@/components/PremiumGate";
import { PronunciationChallenge } from "@/components/PronunciationChallenge";
import { supabase } from "@/integrations/supabase/client";
import { isTTSSupported, speak } from "@/lib/language-apis/webSpeech";
import { saveWord, isWordSaved } from "@/lib/language-content/saved-words";
import type { VocabularyItem } from "@/lib/language-content/types";

export const Route = createFileRoute("/lesson/$id")({
  component: LessonPage,
});

const CATEGORY_ICONS: Record<string, any> = {
  grammar: Book,
  vocabulary: Sparkles,
  pronunciation: Mic,
  listening: Volume2,
  speaking: Mic,
  idioms: BookOpen,
  reading: BookOpen,
  writing: Target,
};

const LEVEL_TO_DIFFICULTY: Record<string, string> = {
  A1: "Beginner",
  A2: "Beginner",
  B1: "Intermediate",
  B2: "Intermediate",
  C1: "Advanced",
  C2: "Advanced",
};

interface QuizItem {
  q: string;
  options: string[];
  correct: string;
  explanation: string;
  audioText?: string;
}

function LessonPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { interfaceLanguage, targetLanguage, completedLessons, completeLesson, addXP } = useStore();
  const isPT = interfaceLanguage === "pt";

  // Real lesson content, loaded from the same masterContent source that
  // generates the /home and /lessons cards — previously this route read from
  // an entirely different, disconnected legacy catalog (lessonCatalog.ts),
  // so clicking a card like "At the Airport" could open a completely
  // unrelated generic lesson ("Vocabulary: Business English").
  const [lesson, setLesson] = useState<any | null | undefined>(null); // null = loading, undefined = not found
  const [allLessons, setAllLessons] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLesson(null);
    Promise.all([
      getMasterLessonById(id, targetLanguage),
      getAllMasterLessons(targetLanguage),
    ]).then(([found, all]) => {
      if (cancelled) return;
      setLesson(found);
      setAllLessons(all);
    });
    return () => {
      cancelled = true;
    };
  }, [id, targetLanguage]);

  const lessonType = lesson?.category
    ? lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)
    : "Vocabulary";
  const topic = lesson?.title || "";
  const difficulty = LEVEL_TO_DIFFICULTY[lesson?.level] || "Beginner";
  const xpReward = lesson?.xp || 20;
  const duration = parseInt(lesson?.duration) || 6;
  const color = lesson?.color || "#2D4A3E";
  const TypeIcon = CATEGORY_ICONS[lesson?.category] || Book;

  const steps: any[] = lesson?.steps || [];
  const vocabStep = steps.find((s) => s.type === "vocab");
  const translationQuizStep = steps.find((s) => s.type === "quiz");
  const listeningStep = steps.find((s) => s.type === "listening");
  const grammarQuizStep = steps.filter((s) => s.type === "quiz")[1];
  const speakingStep = steps.find((s) => s.type === "speaking");

  const vocab: Array<{ word: string; meaning: string; example: string }> = vocabStep?.words || [];

  const quiz: QuizItem[] = [];
  if (translationQuizStep?.options?.length) {
    const correct = translationQuizStep.options[translationQuizStep.correct ?? 0];
    quiz.push({
      q: translationQuizStep.question || "",
      options: translationQuizStep.options,
      correct,
      explanation: isPT
        ? `A resposta correta é "${correct}".`
        : `The correct answer is "${correct}".`,
    });
  }
  if (listeningStep?.options?.length) {
    const correct = listeningStep.options[listeningStep.correct ?? 0];
    quiz.push({
      q:
        listeningStep.question ||
        (isPT ? "Ouça e escolha a palavra correta:" : "Listen and choose the correct word:"),
      options: listeningStep.options,
      correct,
      explanation: isPT ? `A palavra correta é "${correct}".` : `The correct word is "${correct}".`,
      audioText: listeningStep.audioText,
    });
  }
  if (grammarQuizStep?.options?.length) {
    const correct = grammarQuizStep.options[grammarQuizStep.correct ?? 0];
    quiz.push({
      q: grammarQuizStep.question || "",
      options: grammarQuizStep.options,
      correct,
      explanation: isPT
        ? `A resposta correta é "${correct}".`
        : `The correct answer is "${correct}".`,
    });
  }

  const isCompleted = completedLessons.includes(id);

  const [step, setStep] = useState<"intro" | "vocab" | "speaking" | "quiz" | "done">("intro");
  const [vocabIdx, setVocabIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [speakingResolved, setSpeakingResolved] = useState<boolean | null>(null);

  // Only offer the speaking step when there's an actual phrase to practice —
  // it must be fully skippable, never a blocker for lessons without one.
  const speakingPhrase = speakingStep?.targetPhrase || vocab[0]?.example;
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [saving, setSaving] = useState(false);

  // Track completion - only once
  const [hasCompletedThisSession, setHasCompletedThisSession] = useState(false);

  // Saved-word bookmarks for the vocab step (spaced-repetition review pool)
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());

  function vocabAsVocabularyItem(
    v: { word: string; meaning: string; example: string },
    idx: number,
  ): VocabularyItem {
    return {
      id: `${id}-vocab-${idx}`,
      term: v.word,
      translation: v.meaning,
      example: v.example,
      difficulty: "beginner",
      topic: "daily",
      targetLanguage: (lesson?.language as VocabularyItem["targetLanguage"]) || "en",
      source: "manual",
    };
  }

  function handleToggleSaveWord(idx: number) {
    const item = vocabAsVocabularyItem(vocab[idx], idx);
    if (isWordSaved(item.id)) return; // saveWord/unsave isn't reversible here yet — keep it simple
    saveWord(item);
    setSavedWordIds((prev) => new Set(prev).add(item.id));
  }

  function handleSpeakWord(text: string) {
    if (!isTTSSupported()) return;
    speak(text, (lesson?.language as "en" | "es" | "pt") || "en");
  }

  // Premium gate state
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [userPlan, setUserPlan] = useState<"free" | "premium" | "loading">("loading");

  // Check if user has premium (for lessons 11+)
  useEffect(() => {
    if (!user) {
      setUserPlan("free");
      return;
    }

    async function checkPremium() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user!.id)
          .single();

        if (error) {
          console.error("[Lesson] Failed to check premium:", error);
          setUserPlan("free");
          return;
        }

        setUserPlan(data?.plan === "premium" ? "premium" : "free");
      } catch (err) {
        console.error("[Lesson] Premium check error:", err);
        setUserPlan("free");
      }
    }

    checkPremium();
  }, [user]);

  // Block premium lessons for free users
  const lessonNumber = parseInt(id.replace(/\D/g, "")) || 1;
  const isPremiumLesson = lessonNumber > 10;

  useEffect(() => {
    // If premium lesson and user is free, show gate
    if (isPremiumLesson && userPlan === "free") {
      setShowPremiumGate(true);
    }
  }, [isPremiumLesson, userPlan]);

  // Reflect words already saved in a previous session (localStorage) on load.
  useEffect(() => {
    const saved = new Set<string>();
    vocab.forEach((_, idx) => {
      const wordId = `${id}-vocab-${idx}`;
      if (isWordSaved(wordId)) saved.add(wordId);
    });
    setSavedWordIds(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load progress on mount
  useEffect(() => {
    if (user) {
      getLessonProgress(user.id, id)
        .then((progress) => {
          if (progress && progress.status === "in_progress") {
            // current_step is shared between the vocab and quiz phases (see the save
            // effect below), so use the saved `progress` percentage to tell which
            // phase it belongs to and resume into that phase, instead of always
            // restoring it as vocabIdx and reopening the lesson on the intro screen.
            const savedStep = progress.current_step;
            if (savedStep !== undefined && savedStep !== null) {
              if (progress.progress >= 60) {
                setStep("quiz");
                setQuizIdx(Math.min(savedStep, Math.max(quiz.length - 1, 0)));
              } else if (progress.progress >= 30) {
                setStep("vocab");
                setVocabIdx(Math.min(savedStep, Math.max(vocab.length - 1, 0)));
              }
            }
          }
        })
        .catch((err) => console.warn("Could not load progress:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  // Update progress when step changes
  useEffect(() => {
    if (user && step !== "intro" && step !== "done") {
      const progress = step === "quiz" ? 60 : step === "vocab" ? 30 : 0;
      upsertLessonProgress(user.id, id, {
        status: "in_progress",
        progress,
        current_step: step === "vocab" ? vocabIdx : quizIdx,
        total_steps: step === "vocab" ? vocab.length : quiz.length,
      }).catch((err) => console.warn("Progress save failed:", err));
    }
  }, [step, vocabIdx, quizIdx, user, id]);

  // Auto-play the audio once when a listening question first appears.
  useEffect(() => {
    const current = quiz[quizIdx];
    if (step === "quiz" && current?.audioText && isTTSSupported()) {
      speak(current.audioText, (lesson?.language as "en" | "es" | "pt") || "en");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, quizIdx]);

  async function handleLessonComplete() {
    if (hasCompletedThisSession || saving) return;

    setSaving(true);
    setHasCompletedThisSession(true);

    // A lesson can be replayed after it was already completed (e.g. from the
    // catalog's "Completed" card); XP must only ever be awarded for the first
    // completion, not every time this handler runs.
    const alreadyCompletedLocally = completedLessons.includes(id);
    completeLesson(id);

    if (user) {
      try {
        const result = await completeLessonDB(user.id, id, xpReward, duration * 60);
        if (!result.alreadyCompleted && !alreadyCompletedLocally) {
          addXP(xpReward);
          toast.success(isPT ? `+${xpReward} XP ganhos!` : `+${xpReward} XP earned!`);
        } else {
          toast.info(isPT ? "Lição já concluída anteriormente" : "Lesson already completed");
        }
      } catch (error) {
        console.error("Failed to save lesson completion:", error);
        if (!alreadyCompletedLocally) addXP(xpReward);
        toast.warning(isPT ? "Progresso salvo localmente" : "Progress saved locally");
      }
    } else if (!alreadyCompletedLocally) {
      addXP(xpReward);
      toast.success(isPT ? `+${xpReward} XP ganhos!` : `+${xpReward} XP earned!`);
    } else {
      toast.info(isPT ? "Lição já concluída anteriormente" : "Lesson already completed");
    }

    setSaving(false);
  }

  function handleAnswer(opt: string) {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === quiz[quizIdx].correct) setQuizScore((s) => s + 1);
  }

  async function nextQuiz() {
    if (quizIdx + 1 < quiz.length) {
      setQuizIdx((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setStep("done");
      await handleLessonComplete();
    }
  }

  function handleNextLesson() {
    const currentIndex = allLessons.findIndex((l) => l.id === id);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      nav({ to: `/lesson/${nextLesson.id}` as any });
    } else {
      toast.info(
        isPT
          ? "Você completou todas as lições disponíveis!"
          : "You've completed all available lessons!",
      );
      nav({ to: "/lessons" });
    }
  }

  // Protect against locked lessons
  if (lesson === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid var(--border)",
            borderTopColor: "var(--brand)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (lesson === undefined) {
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
          <Lock size={64} color="var(--text-secondary)" style={{ marginBottom: "16px" }} />
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            {isPT ? "Lição não encontrada" : "Lesson not found"}
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            {isPT
              ? "Esta lição não está disponível no idioma atual."
              : "This lesson isn't available in the current language."}
          </p>
          <button
            onClick={() => nav({ to: "/lessons" })}
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
            {isPT ? "← Voltar ao Catálogo" : "← Back to Catalog"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      {/* Premium Gate Modal */}
      <PremiumGate
        isOpen={showPremiumGate}
        onClose={() => {
          setShowPremiumGate(false);
          nav({ to: "/lessons" });
        }}
        onContinueFree={() => {
          setShowPremiumGate(false);
          nav({ to: "/lessons" });
        }}
      />

      {/* ── INTRO ── */}
      {step === "intro" && (
        <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
          <button
            onClick={() => nav({ to: "/lessons" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "28px",
              padding: 0,
            }}
          >
            <ArrowLeft size={16} /> {isPT ? "Voltar" : "Back"}
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                border: `2px solid ${color}44`,
                borderRadius: "24px",
                padding: "36px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: `${color}22`,
                    border: `2px solid ${color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <TypeIcon size={28} color={color} />
                </div>
                <div>
                  <div
                    style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        padding: "3px 10px",
                        background: `${color}20`,
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 800,
                        color,
                      }}
                    >
                      {lessonType}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: "var(--border)",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {difficulty}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: "rgba(76,175,80,0.1)",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#4CAF50",
                      }}
                    >
                      +{xpReward} XP
                    </span>
                    {isCompleted && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 10px",
                          background: "rgba(76,175,80,0.15)",
                          borderRadius: "99px",
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "#4CAF50",
                        }}
                      >
                        <CheckCircle size={12} /> {isPT ? "Completo" : "Done"}
                      </span>
                    )}
                  </div>
                  <h1
                    style={{
                      fontSize: "clamp(20px, 4vw, 28px)",
                      fontWeight: 900,
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {lessonType}: {topic}
                  </h1>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={16} color="var(--text-secondary)" />
                  <span>{duration} min</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <BookOpen size={16} color="var(--text-secondary)" />
                  <span>
                    {vocab.length} {isPT ? "conceitos" : "concepts"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Brain size={16} color="var(--text-secondary)" />
                  <span>
                    {quiz.length} {isPT ? "questões" : "questions"}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--card-bg)",
                border: "2px solid var(--border)",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                }}
              >
                {isPT ? "O que você vai aprender" : "What you will learn"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {vocab.map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: `${color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "12px",
                        fontWeight: 900,
                        color,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <span
                        style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "14px" }}
                      >
                        {v.word}
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        {" "}
                        — {v.meaning}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("vocab")}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                color: "white",
                border: "none",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: `0 6px 20px ${color}44`,
              }}
            >
              {isPT ? "Iniciar Lição →" : "Start Lesson →"}
            </button>
          </motion.div>
        </main>
      )}

      {/* ── VOCAB FLASHCARDS ── */}
      {step === "vocab" && (
        <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <button
              onClick={() => setStep("intro")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} color="var(--text-secondary)" />
            </button>
            <div
              style={{
                flex: 1,
                height: "8px",
                background: "var(--border)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: color,
                  width: `${((vocabIdx + 1) / vocab.length) * 100}%`,
                  transition: "width 0.3s",
                  borderRadius: "99px",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              {vocabIdx + 1}/{vocab.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={vocabIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  background: "var(--card-bg)",
                  border: `2px solid ${color}33`,
                  borderRadius: "24px",
                  padding: "40px 32px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <TypeIcon size={24} color={color} />
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "10px",
                  }}
                >
                  {isPT ? "Conceito" : "Concept"} {vocabIdx + 1}
                </div>
                <h2
                  style={{
                    fontSize: "clamp(24px, 5vw, 36px)",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {vocab[vocabIdx].word}
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {isTTSSupported() && (
                    <button
                      onClick={() => handleSpeakWord(vocab[vocabIdx].word)}
                      aria-label={isPT ? "Ouvir" : "Listen"}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: `1px solid ${color}44`,
                        background: `${color}10`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Volume2 size={16} color={color} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleSaveWord(vocabIdx)}
                    aria-label={isPT ? "Salvar palavra" : "Save word"}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `1px solid ${color}44`,
                      background: savedWordIds.has(`${id}-vocab-${vocabIdx}`)
                        ? color
                        : `${color}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Bookmark
                      size={16}
                      color={savedWordIds.has(`${id}-vocab-${vocabIdx}`) ? "white" : color}
                    />
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    marginBottom: "24px",
                    lineHeight: 1.6,
                  }}
                >
                  {vocab[vocabIdx].meaning}
                </p>
                <div
                  style={{
                    background: "var(--bg)",
                    border: `1px solid ${color}33`,
                    borderLeft: `4px solid ${color}`,
                    borderRadius: "10px",
                    padding: "14px 18px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "4px",
                    }}
                  >
                    {isPT ? "Exemplo" : "Example"}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {vocab[vocabIdx].example}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                if (vocabIdx > 0) setVocabIdx((i) => i - 1);
              }}
              disabled={vocabIdx === 0}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid var(--border)",
                background: "var(--card-bg)",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: vocabIdx === 0 ? "not-allowed" : "pointer",
                opacity: vocabIdx === 0 ? 0.4 : 1,
              }}
            >
              ← {isPT ? "Anterior" : "Back"}
            </button>
            {vocabIdx < vocab.length - 1 ? (
              <button
                onClick={() => setVocabIdx((i) => i + 1)}
                style={{
                  flex: 2,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: color,
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isPT ? "Próximo →" : "Next →"}
              </button>
            ) : (
              <button
                onClick={() => setStep(speakingPhrase ? "speaking" : "quiz")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Brain size={18} aria-hidden="true" />
                {speakingPhrase
                  ? isPT
                    ? "Praticar Pronúncia →"
                    : "Practice Speaking →"
                  : isPT
                    ? "Fazer Quiz →"
                    : "Take Quiz →"}
              </button>
            )}
          </div>
        </main>
      )}

      {/* ── SPEAKING ── */}
      {step === "speaking" && speakingPhrase && (
        <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <button
              onClick={() => setStep("vocab")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} color="var(--text-secondary)" />
            </button>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
              {isPT ? "Praticar Pronúncia" : "Practice Speaking"}
            </h2>
          </div>

          <PronunciationChallenge
            targetPhrase={speakingPhrase}
            targetLanguage={(lesson?.language as "en" | "es" | "pt") || "en"}
            onSuccess={() => setSpeakingResolved(true)}
            onFailure={() => setSpeakingResolved(false)}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setStep("quiz")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid var(--border)",
                background: "var(--card-bg)",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isPT ? "Pular" : "Skip"}
            </button>
            {speakingResolved !== null && (
              <button
                onClick={() => setStep("quiz")}
                style={{
                  flex: 2,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: color,
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isPT ? "Continuar →" : "Continue →"}
              </button>
            )}
          </div>
        </main>
      )}

      {/* ── QUIZ ── */}
      {step === "quiz" && (
        <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <button
              onClick={() => setStep(speakingPhrase ? "speaking" : "vocab")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} color="var(--text-secondary)" />
            </button>
            <div
              style={{
                flex: 1,
                height: "8px",
                background: "var(--border)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#F39C12",
                  width: `${((quizIdx + 1) / quiz.length) * 100}%`,
                  transition: "width 0.3s",
                  borderRadius: "99px",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              {quizIdx + 1}/{quiz.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={quizIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                {isPT ? "Questão" : "Question"} {quizIdx + 1}
              </div>
              <h2
                style={{
                  fontSize: "clamp(17px, 3vw, 24px)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: quiz[quizIdx].audioText ? "14px" : "28px",
                  lineHeight: 1.4,
                }}
              >
                {quiz[quizIdx].q}
              </h2>

              {quiz[quizIdx].audioText && isTTSSupported() && (
                <button
                  onClick={() => handleSpeakWord(quiz[quizIdx].audioText!)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    background: "var(--card-bg)",
                    border: `2px solid ${color}44`,
                    color,
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    marginBottom: "24px",
                  }}
                >
                  <Volume2 size={18} />
                  {isPT ? "Ouvir novamente" : "Play audio"}
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {quiz[quizIdx].options.map((opt, i) => {
                  const state = answered
                    ? opt === quiz[quizIdx].correct
                      ? "correct"
                      : opt === selected
                        ? "wrong"
                        : "neutral"
                    : "default";
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "12px",
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: answered ? "default" : "pointer",
                        border:
                          state === "correct"
                            ? "2px solid #4CAF50"
                            : state === "wrong"
                              ? "2px solid #E74C3C"
                              : "2px solid var(--border)",
                        background:
                          state === "correct"
                            ? "rgba(76,175,80,0.1)"
                            : state === "wrong"
                              ? "rgba(231,76,60,0.1)"
                              : "var(--card-bg)",
                        color:
                          state === "correct"
                            ? "#4CAF50"
                            : state === "wrong"
                              ? "#E74C3C"
                              : "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.15s",
                      }}
                    >
                      <span>{opt}</span>
                      {state === "correct" && (
                        <CheckCircle
                          size={18}
                          color="#4CAF50"
                          aria-label={isPT ? "Correto" : "Correct"}
                        />
                      )}
                      {state === "wrong" && (
                        <span style={{ fontSize: "18px", color: "#E74C3C" }}>✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    background:
                      selected === quiz[quizIdx].correct
                        ? "rgba(76,175,80,0.08)"
                        : "rgba(231,76,60,0.08)",
                    border: `1px solid ${selected === quiz[quizIdx].correct ? "rgba(76,175,80,0.3)" : "rgba(231,76,60,0.3)"}`,
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: selected === quiz[quizIdx].correct ? "#4CAF50" : "#E74C3C",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {selected === quiz[quizIdx].correct ? (
                      <>
                        <CheckCircle size={16} /> {isPT ? "Correto!" : "Correct!"}
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: "16px" }}>✕</span>{" "}
                        {isPT ? "Incorreto" : "Incorrect"}
                      </>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {quiz[quizIdx].explanation}
                  </p>
                </motion.div>
              )}

              {answered && (
                <button
                  onClick={nextQuiz}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #2D4A3E, #1B3A4B)",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(45,74,62,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {quizIdx + 1 < quiz.length ? (
                    <>{isPT ? "Próxima →" : "Next →"}</>
                  ) : (
                    <>
                      <Trophy size={18} aria-hidden="true" />{" "}
                      {isPT ? "Ver Resultado →" : "See Results →"}
                    </>
                  )}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* ── DONE ── */}
      {step === "done" && (
        <main
          style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.45 }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              {quizScore === quiz.length ? (
                <Trophy
                  size={80}
                  color="#FFD700"
                  strokeWidth={1.5}
                  aria-label={isPT ? "Troféu" : "Trophy"}
                />
              ) : quizScore >= 2 ? (
                <Award
                  size={80}
                  color="#FFD700"
                  strokeWidth={1.5}
                  aria-label={isPT ? "Medalha de ouro" : "Gold medal"}
                />
              ) : (
                <Award
                  size={80}
                  color="#C0C0C0"
                  strokeWidth={1.5}
                  aria-label={isPT ? "Medalha de prata" : "Silver medal"}
                />
              )}
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              {quizScore === quiz.length
                ? isPT
                  ? "Perfeito!"
                  : "Perfect!"
                : quizScore >= 2
                  ? isPT
                    ? "Muito bem!"
                    : "Well done!"
                  : isPT
                    ? "Continue praticando!"
                    : "Keep practicing!"}
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "36px" }}>
              {quizScore}/{quiz.length} {isPT ? "questões corretas" : "correct answers"}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginBottom: "36px",
              }}
            >
              {[
                { label: "XP", value: `+${xpReward}`, color: "#F39C12", Icon: Zap },
                {
                  label: isPT ? "Precisão" : "Accuracy",
                  value: `${Math.round((quizScore / quiz.length) * 100)}%`,
                  color: "#4CAF50",
                  Icon: Target,
                },
                {
                  label: isPT ? "Completo" : "Complete",
                  value: "✓",
                  color: "#2D4A3E",
                  Icon: Check,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--card-bg)",
                    border: "2px solid var(--border)",
                    borderRadius: "14px",
                    padding: "16px 8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginBottom: "6px", display: "flex", justifyContent: "center" }}>
                    <s.Icon size={20} color={s.color} />
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: s.color,
                      marginBottom: "2px",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 700 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleNextLesson}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #2D4A3E, #1B3A4B)",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(45,74,62,0.3)",
                }}
              >
                {isPT ? "Próxima Lição →" : "Next Lesson →"}
              </button>
              <button
                onClick={() => nav({ to: "/lessons" })}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "2px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isPT ? "← Catálogo de Lições" : "← Lesson Catalog"}
              </button>
            </div>
          </motion.div>
        </main>
      )}
    </div>
  );
}
