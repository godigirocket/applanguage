import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { getAllMasterLessons, getMasterLessonById } from "@/data/contentEngine";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import {
  completeLesson as completeLessonDB,
  getLessonProgress,
  upsertLessonProgress,
} from "@/lib/lesson-progress";
import {
  advanceSession,
  buildActivities,
  freshSession,
  normalizeAnswer,
  restoreSession,
  sessionAccuracy,
  type LessonActivity,
  type LessonSession,
} from "@/lib/lesson-session";
import { isTTSSupported, speak, stopSpeaking } from "@/lib/language-apis/webSpeech";
import { isWordSaved, saveWord } from "@/lib/language-content/saved-words";
import { resolveGlossLanguage } from "@/lib/language-content/vocabulary-engine";
import { PronunciationChallenge } from "@/components/PronunciationChallenge";
import { Mascot } from "@/components/lume/Mascot";
import { PremiumGate } from "@/components/PremiumGate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isTrialActive } from "@/lib/trial";
import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/lib/promise-timeout";
import { sounds } from "@/lib/soundEffects";
import { toast } from "sonner";

export const Route = createFileRoute("/lesson/$id")({
  loader: async ({ params }) => {
    const language = params.id.match(/^lesson-(en|es|pt)-/)?.[1] as Language | undefined;
    if (!language) return { lesson: null, all: [] as CourseEntry[] };
    const [lesson, metadata] = await Promise.all([
      getMasterLessonById(params.id, language),
      getAllMasterLessons(language),
    ]);
    return {
      lesson: (lesson || null) as Lesson | null,
      all: metadata.map((l) => ({
        id: l.id,
        category: l.category,
        level: l.level,
      })) as CourseEntry[],
    };
  },
  component: LessonPage,
});
type CourseEntry = { id: string; level: string; category?: string };
type Language = "pt" | "en" | "es";
type Lesson = {
  id: string;
  title: string;
  level: string;
  language: Language;
  xp: number;
  duration: string;
  steps: any[];
  topic?: string;
  category?: string;
};

function LessonPage() {
  const { lesson, all } = Route.useLoaderData();
  const { user } = useAuth();
  const nav = useNavigate();
  if (!lesson)
    return (
      <div className="lesson-loading">
        <Mascot state="thinking" size={100} />
        <h1>Não foi possível abrir esta lição</h1>
        <button className="lesson-secondary" onClick={() => nav({ to: "/lessons" })}>
          Voltar às lições
        </button>
      </div>
    );
  return (
    <LessonPlayer key={`${lesson.id}:${user?.id || "guest"}`} lesson={lesson} allLessons={all} />
  );
}

function LessonPlayer({ lesson, allLessons }: { lesson: Lesson; allLessons: CourseEntry[] }) {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const ui = useStore((s) => s.interfaceLanguage);
  const completed = useStore((s) => s.completedLessons.includes(lesson.id));
  const isKid = useStore((s) => s.isKidAccount);
  const t = (pt: string, en: string, es: string) => (ui === "pt" ? pt : ui === "es" ? es : en);
  const activities = useMemo(
    () => buildActivities(lesson.steps).filter((a) => !isKid || a.type !== "speaking"),
    [lesson.steps, isKid],
  );
  const [session, setSession] = useState<LessonSession>(freshSession);
  const [resume, setResume] = useState<LessonSession | null>(null);
  const [screen, setScreen] = useState<"intro" | "play" | "done">("intro");
  const [ready, setReady] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [plan, setPlan] = useState<"loading" | "free" | "premium">("loading");
  const [gateOpen, setGateOpen] = useState(false);
  const [earned, setEarned] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);
  const finished = useRef(false);
  const advancing = useRef(false);
  const reduceMotion = useReducedMotion();
  const storageKey = `lume-session-v1:${user?.id || "guest"}:${lesson.id}`;
  const courseIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const premium = courseIndex >= 10 && !isTrialActive();
  const activity = activities[session.cursor];
  const progress =
    screen === "done" ? 100 : Math.round((session.cursor / Math.max(1, activities.length)) * 100);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    let local: LessonSession | null = null;
    try {
      local = restoreSession(
        JSON.parse(localStorage.getItem(storageKey) || "null"),
        activities.length,
      );
    } catch {
      /* unavailable storage */
    }
    setResume(local && local.cursor < activities.length ? local : null);
    setReady(true);
    if (user)
      getLessonProgress(user.id, lesson.id).then((saved) => {
        if (!active || !saved) return;
        if (saved.status === "completed") {
          useStore.getState().completeLesson(lesson.id);
          return;
        }
        // Old players stored only 3 vocab/quiz items per phase. Only resume
        // checkpoints that match the full sequence to avoid a wrong stage.
        if (
          !local &&
          activities.length > 3 &&
          saved.total_steps === activities.length &&
          saved.current_step &&
          saved.current_step < activities.length
        )
          setResume({
            ...freshSession(),
            cursor: saved.current_step,
            results: Array(saved.current_step).fill(null),
          });
      });
    return () => {
      active = false;
    };
  }, [authLoading, storageKey, activities.length, user?.id, lesson.id]);

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) {
      setPlan("free");
      return;
    }
    withTimeout(
      supabase.from("profiles").select("plan, premium_until").eq("id", user.id).maybeSingle(),
      6000,
    )
      .then(({ data }) => {
        if (active)
          setPlan(
            data?.plan === "premium" &&
              (!data.premium_until || new Date(data.premium_until) > new Date())
              ? "premium"
              : "free",
          );
      })
      .catch(() => {
        if (active) setPlan("free");
      });
    return () => {
      active = false;
    };
  }, [authLoading, user?.id]);

  useEffect(() => {
    advancing.current = false;
    if (screen === "play") window.scrollTo({ top: 0, behavior: "instant" });
    return () => stopSpeaking();
  }, [session.cursor, screen]);

  function persist(next: LessonSession) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* memory still works */
    }
    if (user && next.cursor < activities.length && !completed)
      void upsertLessonProgress(user.id, lesson.id, {
        status: "in_progress",
        progress: Math.round((next.cursor / activities.length) * 100),
        current_step: next.cursor,
        total_steps: activities.length,
        score: sessionAccuracy(next),
      });
  }

  async function finish(next: LessonSession) {
    if (finished.current) return;
    finished.current = true;
    setScreen("done");
    const state = useStore.getState();
    const first = !state.completedLessons.includes(lesson.id);
    state.completeLesson(lesson.id);
    let reward = 0;
    state.recordStudy();
    if (first) {
      const before = state.xp;
      state.addXP(lesson.xp);
      reward = useStore.getState().xp - before;
      setEarned(reward);
    }
    sounds.playLessonComplete();
    if (!reduceMotion)
      void import("canvas-confetti").then(({ default: confetti }) =>
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#2fbb52", "#1cb0f6", "#ffc200"],
          disableForReducedMotion: true,
        }),
      );
    if (user) {
      setSyncing(true);
      try {
        const result = await completeLessonDB(
          user.id,
          lesson.id,
          first ? reward : lesson.xp,
          Math.round((Date.now() - next.startedAt) / 1000),
        );
        setPendingSync(result.pending);
      } catch {
        toast.info(
          t(
            "Progresso salvo neste dispositivo",
            "Progress saved on this device",
            "Progreso guardado en este dispositivo",
          ),
        );
      } finally {
        setSyncing(false);
      }
    }
  }

  function advance(result: boolean | null = null) {
    if (advancing.current || finished.current) return;
    advancing.current = true;
    const next = advanceSession(session, activities.length, result);
    persist(next);
    setSession(next);
    if (next.cursor >= activities.length) void finish(next);
  }

  function start(restart = false) {
    if (authLoading || !ready) return;
    if (premium && plan !== "premium") {
      setGateOpen(true);
      return;
    }
    const next = !restart && resume ? resume : freshSession();
    finished.current = false;
    setEarned(0);
    setSession(next);
    setScreen("play");
    persist(next);
  }

  const nextLesson = allLessons
    .slice(courseIndex + 1)
    .find(
      (l) =>
        !useStore.getState().completedLessons.includes(l.id) &&
        (!isKid ||
          (["vocabulary", "listening"].includes(l.category || "") && l.level.startsWith("A"))),
    );
  return (
    <div className="lesson-player">
      <header className="lesson-topbar">
        <button
          className="lesson-icon"
          aria-label={t("Sair da lição", "Exit lesson", "Salir de la lección")}
          onClick={() => (screen === "play" ? setExitOpen(true) : nav({ to: "/lessons" }))}
        >
          <X size={22} />
        </button>
        <div className="lesson-topbar-center">
          <span className="lesson-course-title">{lesson.title}</span>
          <div
            className="lesson-track"
            role="progressbar"
            aria-label={t("Progresso da lição", "Lesson progress", "Progreso de la lección")}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 240, damping: 30 }}
            />
          </div>
        </div>
        <span className="lesson-counter">
          {screen === "intro"
            ? lesson.level
            : `${Math.min(session.cursor, activities.length)}/${activities.length}`}
        </span>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        {screen === "intro" && (
          <motion.div
            key="intro"
            className="lesson-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="lesson-welcome-art">
              <Mascot state="happy" size={140} />
              <span className="lesson-level">{lesson.level}</span>
            </div>
            <span className="lesson-eyebrow">
              {completed
                ? t("Hora de revisar", "Time to practice", "Hora de repasar")
                : t(
                    "Um passo para falar com confiança",
                    "One step closer to speaking confidently",
                    "Un paso para hablar con confianza",
                  )}
            </span>
            <h1>{lesson.title}</h1>
            <p>
              {t(
                "Aprenda palavras, ouça, fale e construa frases. Um desafio de cada vez.",
                "Learn words, listen, speak and build sentences. One challenge at a time.",
                "Aprende palabras, escucha, habla y construye frases. Un reto a la vez.",
              )}
            </p>
            <div className="lesson-facts">
              <span>
                <Clock size={18} />
                {lesson.duration}
              </span>
              <span>
                <Zap size={18} />
                {completed ? t("Revisão", "Practice", "Repaso") : `+${lesson.xp} XP`}
              </span>
              <span>
                <Sparkles size={18} />
                {activities.length} {t("etapas", "activities", "actividades")}
              </span>
            </div>
            {resume && (
              <div className="lesson-resume">
                <CheckCircle2 size={19} />
                <span>
                  {t(
                    `Seu progresso está salvo: etapa ${resume.cursor + 1} de ${activities.length}.`,
                    `Progress saved: activity ${resume.cursor + 1} of ${activities.length}.`,
                    `Progreso guardado: actividad ${resume.cursor + 1} de ${activities.length}.`,
                  )}
                </span>
              </div>
            )}
            <button
              className="lesson-primary"
              disabled={
                authLoading || !ready || !activities.length || (premium && plan === "loading")
              }
              onClick={() => start()}
            >
              {resume
                ? t("Continuar de onde parei", "Resume lesson", "Continuar donde lo dejé")
                : completed
                  ? t("Revisar lição", "Practice lesson", "Repasar lección")
                  : t("Vamos começar", "Let's begin", "Empezar")}
              <ArrowRight size={20} />
            </button>
            {resume && (
              <button className="lesson-secondary" onClick={() => start(true)}>
                <RotateCcw size={16} />
                {t("Recomeçar esta lição", "Restart this lesson", "Reiniciar esta lección")}
              </button>
            )}
            {!activities.length && (
              <p role="alert">
                {t(
                  "Esta lição ainda não tem exercícios. Escolha outra no catálogo.",
                  "This lesson has no exercises yet. Choose another from the catalog.",
                  "Esta lección aún no tiene ejercicios. Elige otra del catálogo.",
                )}
              </p>
            )}
          </motion.div>
        )}
        {screen === "play" && activity && (
          <motion.div
            key={`activity-${session.cursor}`}
            className="lesson-exercise"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Exercise
              key={session.cursor}
              activity={activity}
              lesson={lesson}
              index={session.cursor}
              ui={ui}
              onContinue={advance}
            />
          </motion.div>
        )}
        {screen === "done" && (
          <motion.div
            key="done"
            className="lesson-welcome lesson-results"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Mascot state="celebrating" size={150} />
            <span className="lesson-eyebrow">
              {t("Você chegou lá!", "You made it!", "¡Lo lograste!")}
            </span>
            <h1>{t("Lição concluída", "Lesson complete", "Lección completada")}</h1>
            <p>
              {t(
                "Cada prática deixa o próximo passo mais fácil.",
                "Every practice makes the next step easier.",
                "Cada práctica hace más fácil el siguiente paso.",
              )}
            </p>
            <div className="lesson-result-grid">
              <div>
                <Zap />
                <strong>+{earned}</strong>
                <span>XP</span>
              </div>
              <div>
                <Trophy />
                <strong>{sessionAccuracy(session)}%</strong>
                <span>{t("acertos", "accuracy", "aciertos")}</span>
              </div>
              <div>
                <CheckCircle2 />
                <strong>{session.cursor}</strong>
                <span>{t("etapas", "activities", "actividades")}</span>
              </div>
            </div>
            <p className="lesson-sync" role="status">
              {syncing
                ? t("Sincronizando progresso…", "Syncing progress…", "Sincronizando progreso…")
                : pendingSync
                  ? t(
                      "Salvo neste dispositivo · sincronização pendente",
                      "Saved on this device · sync pending",
                      "Guardado en este dispositivo · sincronización pendiente",
                    )
                  : t("Progresso salvo", "Progress saved", "Progreso guardado")}
            </p>
            <button
              className="lesson-primary"
              onClick={() =>
                nextLesson
                  ? nav({ to: "/lesson/$id", params: { id: nextLesson.id } })
                  : nav({ to: "/lessons" })
              }
            >
              {nextLesson
                ? t("Próxima lição", "Next lesson", "Siguiente lección")
                : t("Voltar às lições", "Back to lessons", "Volver a las lecciones")}
              <ArrowRight size={20} />
            </button>
            <button className="lesson-secondary" onClick={() => nav({ to: "/lessons" })}>
              {t("Ver meu caminho", "See my learning path", "Ver mi camino")}
            </button>
            {lesson.topic && !isKid && (
              <button
                className="lesson-secondary"
                onClick={() =>
                  nav({ to: "/conversation/$topic", params: { topic: lesson.topic! } })
                }
              >
                {t("Praticar conversação", "Practice conversation", "Practicar conversación")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AlertDialog open={exitOpen} onOpenChange={setExitOpen}>
        <AlertDialogContent className="lesson-exit-dialog">
          <AlertDialogTitle>
            {t("Continuar depois?", "Continue later?", "¿Continuar después?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "As etapas concluídas estão salvas. Você pode retomar esta lição de onde parou.",
              "Completed activities are saved. You can resume this lesson where you left off.",
              "Las actividades completadas están guardadas. Puedes retomar esta lección donde la dejaste.",
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("Ficar na lição", "Keep learning", "Seguir aprendiendo")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => nav({ to: "/lessons" })}>
              {t("Salvar e sair", "Save and exit", "Guardar y salir")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PremiumGate
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onContinueFree={() => nav({ to: "/lessons" })}
      />
    </div>
  );
}

function Exercise({
  activity: a,
  lesson,
  index,
  ui,
  onContinue,
}: {
  activity: LessonActivity;
  lesson: Lesson;
  index: number;
  ui: Language;
  onContinue: (result?: boolean | null) => void;
}) {
  const t = (pt: string, en: string, es: string) => (ui === "pt" ? pt : ui === "es" ? es : en);
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const [speakingOK, setSpeakingOK] = useState(false);
  const wordId = `${lesson.id}-word-${normalizeAnswer(a.word || "")}`;
  const [saved, setSaved] = useState(() => isWordSaved(wordId));
  const heading = useRef<HTMLHeadingElement>(null);
  const checked = useRef(false);
  const continued = useRef(false);
  function continueOnce(value: boolean | null = null) {
    if (continued.current) return;
    continued.current = true;
    onContinue(value);
  }
  const isQuestion = ["quiz", "listening", "translation", "dragdrop"].includes(a.type);
  const gloss = resolveGlossLanguage(lesson.language, ui);
  const meaning =
    typeof a.meaning === "string"
      ? a.meaning
      : a.meaning?.[gloss] || a.meaning?.pt || a.meaning?.en || a.meaning?.es || "";
  const answer =
    a.type === "dragdrop"
      ? a.answerTokens?.join(" ") || ""
      : a.type === "translation"
        ? a.correctTranslation || ""
        : a.options?.[a.correct ?? 0] || "";
  const canCheck =
    a.type === "translation"
      ? !!text.trim()
      : a.type === "dragdrop"
        ? tokens.length > 0
        : selected !== null;
  const title =
    a.type === "vocab"
      ? t(
          "Uma palavra para levar com você",
          "A word to take with you",
          "Una palabra para llevar contigo",
        )
      : a.type === "speaking"
        ? t("Sua vez de falar", "Your turn to speak", "Tu turno de hablar")
        : a.type === "translation"
          ? t("Escreva a tradução", "Write the translation", "Escribe la traducción")
          : a.type === "dragdrop"
            ? t("Construa a frase", "Build the sentence", "Construye la frase")
            : a.type === "listening"
              ? t("Ouça com atenção", "Listen carefully", "Escucha con atención")
              : t("Escolha a resposta", "Choose the answer", "Elige la respuesta");
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  function check() {
    if (checked.current || !canCheck) return;
    checked.current = true;
    const correct =
      a.type === "translation"
        ? normalizeAnswer(text) === normalizeAnswer(answer)
        : a.type === "dragdrop"
          ? normalizeAnswer(tokens.map((i) => a.tokens![i]).join(" ")) === normalizeAnswer(answer)
          : selected === a.correct;
    setResult(correct);
    if (correct) sounds.playQuizCorrect();
    else sounds.playQuizWrong();
  }
  return (
    <>
      <div className="lesson-question-area">
        <span className="lesson-eyebrow">
          {t("Prática", "Practice", "Práctica")} · {String(index + 1).padStart(2, "0")}
        </span>
        <h1 ref={heading} tabIndex={-1}>
          {title}
        </h1>
        {a.type !== "vocab" && a.type !== "speaking" && (
          <p className="lesson-prompt">{a.question}</p>
        )}
        {a.type === "vocab" && (
          <div className="lesson-word-card">
            <div className="lesson-word-actions">
              <button
                className="lesson-icon"
                aria-label={t("Salvar palavra", "Save word", "Guardar palabra")}
                aria-pressed={saved}
                onClick={() => {
                  if (saved) return;
                  saveWord({
                    id: wordId,
                    term: a.word!,
                    translation: meaning,
                    example: a.example || "",
                    difficulty: "beginner",
                    topic: "daily",
                    targetLanguage: lesson.language,
                    source: "manual",
                  });
                  setSaved(true);
                }}
              >
                <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
            <Mascot state="thinking" size={85} />
            <h2>{a.word}</h2>
            <p className="lesson-meaning">{meaning}</p>
            {a.example && <blockquote>{a.example}</blockquote>}
            {isTTSSupported() && (
              <button className="lesson-audio" onClick={() => speak(a.word!, lesson.language)}>
                <Volume2 size={22} />
                {t("Ouvir pronúncia", "Hear pronunciation", "Escuchar pronunciación")}
              </button>
            )}
          </div>
        )}
        {a.type === "listening" &&
          (isTTSSupported() ? (
            <button
              className="lesson-audio lesson-listen"
              onClick={() => speak(a.audioText || "", lesson.language)}
            >
              <Volume2 size={30} />
              {t("Ouvir frase", "Listen to the sentence", "Escuchar frase")}
            </button>
          ) : (
            <blockquote className="lesson-audio-fallback">
              {a.audioText}
              <small>
                {t(
                  "Áudio indisponível: leia a frase para continuar.",
                  "Audio unavailable: read the sentence to continue.",
                  "Audio no disponible: lee la frase para continuar.",
                )}
              </small>
            </blockquote>
          ))}
        {(a.type === "quiz" || a.type === "listening") && (
          <div
            className="lesson-options"
            role="group"
            aria-label={t("Alternativas", "Answers", "Respuestas")}
          >
            {a.options!.map((option, i) => (
              <button
                key={i}
                className={`lesson-option ${selected === i ? "is-selected" : ""} ${result !== null && i === a.correct ? "is-correct" : result === false && selected === i ? "is-wrong" : ""}`}
                aria-pressed={selected === i}
                disabled={result !== null}
                onClick={() => setSelected(i)}
              >
                <span className="lesson-option-number">{i + 1}</span>
                <span>{option}</span>
                {result !== null && i === a.correct && <Check size={20} />}
              </button>
            ))}
          </div>
        )}
        {a.type === "translation" && (
          <>
            <blockquote className="lesson-source">{a.targetPhrase}</blockquote>
            <label className="lesson-input-label" htmlFor="lesson-translation">
              {t("Sua tradução", "Your translation", "Tu traducción")}
            </label>
            <textarea
              id="lesson-translation"
              className="lesson-textarea"
              rows={3}
              value={text}
              readOnly={result !== null}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("Escreva aqui…", "Write here…", "Escribe aquí…")}
              autoComplete="off"
            />
          </>
        )}
        {a.type === "dragdrop" && (
          <>
            <div
              className="lesson-sentence"
              aria-label={t("Sua frase", "Your sentence", "Tu frase")}
              aria-live="polite"
            >
              {tokens.length === 0 && (
                <span>
                  {t(
                    "Toque nas palavras abaixo para ordenar",
                    "Tap the words below to arrange them",
                    "Toca las palabras para ordenarlas",
                  )}
                </span>
              )}
              {tokens.map((token, pos) => (
                <button
                  key={token}
                  className="lesson-token"
                  disabled={result !== null}
                  onClick={() => setTokens((prev) => prev.filter((_, j) => j !== pos))}
                >
                  {a.tokens![token]}
                  <X size={13} />
                </button>
              ))}
            </div>
            <div className="lesson-token-bank">
              {a.tokens!.map((token, i) => (
                <button
                  key={i}
                  className="lesson-token"
                  aria-pressed={tokens.includes(i)}
                  disabled={result !== null || tokens.includes(i)}
                  onClick={() => setTokens((prev) => [...prev, i])}
                >
                  {token}
                </button>
              ))}
            </div>
            <button
              className="lesson-secondary"
              disabled={result !== null || !tokens.length}
              onClick={() => setTokens([])}
            >
              <RotateCcw size={16} />
              {t("Limpar frase", "Clear sentence", "Borrar frase")}
            </button>
          </>
        )}
        {a.type === "speaking" && (
          <PronunciationChallenge
            targetPhrase={a.targetPhrase!}
            targetLanguage={lesson.language}
            onSuccess={() => setSpeakingOK(true)}
          />
        )}
      </div>
      <footer
        className={`lesson-footer ${result === true ? "is-correct" : result === false ? "is-wrong" : ""}`}
      >
        <div className="lesson-footer-inner">
          <div className="lesson-feedback" role="status" aria-live="polite">
            {result !== null ? (
              <>
                <Mascot state={result ? "correct" : "wrong"} size={50} />
                <div>
                  <strong>
                    {result
                      ? t("Muito bem!", "Well done!", "¡Muy bien!")
                      : t("Vamos aprender com essa", "Let's learn from this", "Aprendamos de esta")}
                  </strong>
                  {!result && (
                    <p>
                      {t("Resposta", "Answer", "Respuesta")}: {answer}
                    </p>
                  )}
                  {a.explanation && <small>{a.explanation}</small>}
                </div>
              </>
            ) : (
              <span>
                {a.type === "speaking"
                  ? t(
                      "Sem microfone? Você pode pular.",
                      "No microphone? You can skip this.",
                      "¿Sin micrófono? Puedes saltar este paso.",
                    )
                  : t(
                      "No seu ritmo. Um passo de cada vez.",
                      "At your pace. One step at a time.",
                      "A tu ritmo. Un paso a la vez.",
                    )}
              </span>
            )}
          </div>
          {isQuestion ? (
            <button
              className="lesson-primary"
              disabled={result === null && !canCheck}
              onClick={() => (result === null ? check() : continueOnce(result))}
            >
              {result === null
                ? t("Verificar", "Check", "Comprobar")
                : t("Continuar", "Continue", "Continuar")}
              <ArrowRight size={19} />
            </button>
          ) : (
            <button className="lesson-primary" onClick={() => continueOnce(null)}>
              {a.type === "speaking" && !speakingOK
                ? t("Pular por enquanto", "Skip for now", "Saltar por ahora")
                : t("Continuar", "Continue", "Continuar")}
              <ArrowRight size={19} />
            </button>
          )}
        </div>
      </footer>
    </>
  );
}
