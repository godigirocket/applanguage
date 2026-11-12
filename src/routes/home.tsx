import { uiFallback } from "@/i18n/ui-fallback";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { useProfile } from "@/hooks/useProfile";
import {
  Play,
  Star,
  Flame,
  Trophy,
  Clock,
  Bookmark,
  TrendingUp,
  Users,
  MessageCircle,
  Book,
  Globe,
  Zap,
  Target,
  Calendar,
  Award,
  ChevronRight,
  Heart,
  CheckCircle,
  Gamepad2,
  BarChart2,
  Coffee,
  Sun,
  Moon,
  Briefcase,
  Plane,
  Sparkles,
} from "@/components/lume/CustomIcons";
import { generateLessons, generateQuizzes, CITIES } from "@/data/contentEngine";
import { DailyQuest } from "@/components/lume/DailyQuest";
import { Leaderboard } from "@/components/lume/Leaderboard";
import { Mascot } from "@/components/lume/Mascot";
import { sounds } from "@/lib/soundEffects";
import { getReviewCount } from "@/lib/spaced-repetition";
import { isTrialActive, getTrialRemainingFormatted } from "@/lib/trial";
import { FlagByEmoji } from "@/components/lume/Flags";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

// NO MORE STATIC GENERATION - Will use targetLanguage dynamically
const TRENDING_CITIES = CITIES.slice(0, 4);

function HomePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, xp, streak, targetLanguage, completedLessons, isKidAccount } =
    useStore();
  const { data: profile } = useProfile(user?.id);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const [mascotMood, setMascotMood] = useState<"happy" | "celebrating" | "speaking" | "thinking">("happy");
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    isPT
      ? "Dica: Praticar 5 minutos todo dia consolida muito mais o aprendizado!"
      : isES
        ? "¡Consejo: Practicar 5 minutos cada día consolida mucho mejor el aprendizaje!"
        : "Tip: Practicing 5 minutes every day builds much stronger fluency!",
    isPT
      ? "Ouça uma frase e repita em voz alta no seu ritmo."
      : isES
        ? "Escucha una frase y repítela en voz alta a tu ritmo."
        : "Listen to a phrase and repeat it out loud at your own pace.",
    isPT
      ? "Sua ofensiva é seu superpoder. Mantenha a chama acesa hoje!"
      : isES
        ? "Tu racha es tu superpoder. ¡Mantén la llama encendida hoy!"
        : "Your streak is your superpower. Keep the flame burning today!",
    isPT
      ? "Você já acumulou XP incrível! Rumo ao próximo nível!"
      : isES
        ? "¡Has acumulado XP increíble! ¡Rumbo al siguiente nivel!"
        : "You've earned incredible XP! Onward to the next level!",
  ];

  const handleMascotClick = () => {
    sounds.playVocabFlip();
    setMascotMood((m) =>
      m === "happy" ? "celebrating" : m === "celebrating" ? "speaking" : m === "speaking" ? "thinking" : "happy",
    );
    setTipIndex((i) => (i + 1) % tips.length);
  };

  // Generate content dynamically based on targetLanguage. generateLessons/
  // generateQuizzes are async because they dynamically import() only the
  // target language's lesson file instead of one bundle with all 3 languages.
  const [continueLearning, setContinueLearning] = useState<any[]>([]);
  const [dailyQuizzes, setDailyQuizzes] = useState<any[]>([]);
  const CONTINUE_LEARNING = continueLearning.slice(0, 3);
  const DAILY_QUIZZES = dailyQuizzes.slice(0, 2);

  useEffect(() => {
    let cancelled = false;
    generateLessons(targetLanguage, Infinity, completedLessons, { kidMode: isKidAccount }).then(
      (lessons) => {
        if (!cancelled)
          setContinueLearning(lessons.filter((lesson) => !lesson.completed).slice(0, 8));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, completedLessons, isKidAccount]);

  useEffect(() => {
    let cancelled = false;
    generateQuizzes(targetLanguage, 4).then((quizzes) => {
      if (!cancelled) setDailyQuizzes(quizzes);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid var(--border)",
              borderTopColor: "var(--brand)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>
            {isPT ? "Carregando..." : uiFallback("Loading...")}
          </p>
        </div>
      </div>
    );
  }

  const firstName =
    profile?.full_name?.split(" ")[0] || (isPT ? "Estudante" : uiFallback("Learner"));
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpToNextLevel = currentLevel * 100 - xp;
  const levelProgress = ((xp % 100) / 100) * 100;
  const isNewUser = xp === 0;
  const hasPracticedToday = completedLessons.length > 0;
  const routeTitle = hasPracticedToday
    ? isPT ? "Rota em movimento" : isES ? "Ruta en marcha" : "Your route is moving"
    : isPT ? "Sua primeira parada" : isES ? "Tu primera parada" : "Your first stop";

  const getGreeting = () => {
    const hr = currentTime.getHours();
    if (hr < 12)
      return isPT
        ? `Bom dia, ${firstName}!`
        : isES
          ? `¡Buenos días, ${firstName}!`
          : `Good morning, ${firstName}!`;
    if (hr < 18)
      return isPT
        ? `Boa tarde, ${firstName}!`
        : isES
          ? `¡Buenas tardes, ${firstName}!`
          : `Good afternoon, ${firstName}!`;
    return isPT
      ? `Boa noite, ${firstName}!`
      : isES
        ? `¡Buenas noches, ${firstName}!`
        : `Good evening, ${firstName}!`;
  };

  const GreetingIcon = (() => {
    const hr = currentTime.getHours();
    if (hr < 12) return Coffee;
    if (hr < 18) return Sun;
    return Moon;
  })();

  return (
    <div
      className="lume-home-page"
      style={{
        minHeight: "100vh",
        background: "transparent",
        paddingBottom: "80px",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HERO GREETING */}
        <section
          className="home-hero-premium"
          style={{
            // Fixed dark band regardless of light/dark theme — the badges and
            // overlays inside assume a dark backdrop (white text, translucent
            // white pills), which went invisible when this tracked the light
            // theme's near-white background.
            padding: "48px 24px",
            color: "var(--text-primary)",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div className="home-hero-layout" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div
                className="home-greeting-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleMascotClick}
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    border: 0,
                    background: "transparent",
                  }}
                  aria-label={isPT ? "Mostrar próxima dica" : isES ? "Mostrar el siguiente consejo" : "Show next tip"}
                >
                  <Mascot state={mascotMood} size={96} />
                  <span className="home-greeting-orb" aria-hidden="true">
                    <GreetingIcon size={18} />
                  </span>
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "clamp(24px, 4vw, 36px)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      margin: 0,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {getGreeting()}
                  </h1>
                  {streak > 0 && !isNewUser && (
                    <p style={{ fontSize: "15px", opacity: 0.9, marginTop: "4px", margin: 0 }}>
                      {isPT
                        ? "Continue assim! Você está arrasando."
                        : uiFallback("Keep it up! You're doing great.")}
                    </p>
                  )}
                  {/* Interactive Mascot Speech Bubble */}
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    aria-live="polite"
                    className="duo-speech-bubble"
                    style={{
                      marginTop: "12px",
                      maxWidth: "480px",
                      fontSize: "13px",
                      padding: "10px 16px",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {tips[tipIndex]}
                    </p>
                  </motion.div>
                </div>
              </div>
              <p
                className="home-greeting-description"
                style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }}
              >
                {isNewUser
                  ? isPT
                    ? "Bem-vindo ao Lume! Comece sua jornada de aprendizado agora."
                    : uiFallback("Welcome to Lume! Start your learning journey now.")
                  : isPT
                    ? "Continue sua jornada de aprendizado"
                    : uiFallback("Continue your learning journey")}
              </p>

              <Link
                to={CONTINUE_LEARNING[0] ? "/lesson/$id" : "/lessons"}
                params={{ id: CONTINUE_LEARNING[0]?.id ?? "" }}
                className="btn-premium home-resume-action"
              >
                <Play size={18} />
                {isPT ? "Continuar aprendendo" : uiFallback("Continue learning")}
              </Link>

              <aside className="home-journey-card" aria-label={isPT ? "Sua rota de aprendizagem" : isES ? "Tu ruta de aprendizaje" : "Your learning route"}>
                <div className="home-journey-heading">
                  <span><Globe size={15} /> {isPT ? "PASSAPORTE DE HOJE" : isES ? "PASAPORTE DE HOY" : "TODAY'S PASSPORT"}</span>
                  <span className={hasPracticedToday ? "is-complete" : ""}>{hasPracticedToday ? "✓" : "01"}</span>
                </div>
                <div className="home-journey-main">
                  <div className="home-journey-seal" aria-hidden="true"><Plane size={26} /></div>
                  <div>
                    <strong>{routeTitle}</strong>
                    <p>{hasPracticedToday
                      ? (isPT ? "Você já abriu caminho hoje. Faça mais uma atividade quando quiser." : isES ? "Ya abriste camino hoy. Haz otra actividad cuando quieras." : "You opened your route today. Take another activity whenever you want.")
                      : (isPT ? "Uma lição curta já deixa sua rota marcada." : isES ? "Una lección breve ya deja marcada tu ruta." : "One short lesson puts a stamp on your route.")}</p>
                  </div>
                </div>
                <div className="home-route-line" aria-hidden="true">
                  <span className="is-start"><Book size={13} /></span><i className={hasPracticedToday ? "is-complete" : ""} /><span className={hasPracticedToday ? "is-complete" : ""}><Star size={13} /></span><i /><span><Plane size={13} /></span>
                </div>
                <div className="home-summary-stats">
                {[
                  { icon: Star, label: "XP", value: xp.toLocaleString(), color: "#FFC200" },
                  {
                    icon: Flame,
                    label: isPT ? "Ofensiva" : uiFallback("Streak"),
                    value: `${streak}`,
                    color: "#FF6B35",
                  },
                  {
                    icon: Trophy,
                    label: isPT ? "Nível" : uiFallback("Level"),
                    value: currentLevel,
                    color: "#58CC02",
                  },
                  {
                    icon: Target,
                    label: isPT ? "Lições" : uiFallback("Lessons"),
                    value: `${completedLessons.length}`,
                    color: "#1CB0F6",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}
                    className="stat-pill"
                    style={{ borderColor: `${stat.color}33`, borderBottomColor: `${stat.color}55` }}
                  >
                    <stat.icon size={22} color={stat.color} />
                    <div className="stat-pill-value" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="stat-pill-label">{stat.label}</div>
                  </motion.div>
                ))}
                </div>
                <div className="home-journey-progress" aria-label={isPT ? `${xpToNextLevel} XP até o próximo nível` : `${xpToNextLevel} XP to the next level`}>
                  <span>{isPT ? `Faltam ${xpToNextLevel} XP para o nível ${currentLevel + 1}` : isES ? `Faltan ${xpToNextLevel} XP para el nivel ${currentLevel + 1}` : `${xpToNextLevel} XP to level ${currentLevel + 1}`}</span>
                  <div><i style={{ width: `${Math.max(7, levelProgress)}%` }} /></div>
                </div>
              </aside>

              {/* Streak badge — prominent when streak > 0 */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  style={{ marginTop: "20px" }}
                >
                  <div className="streak-badge">
                    <Flame size={18} />
                    {streak} {isPT ? "dias seguidos!" : uiFallback("day streak!")}
                  </div>
                </motion.div>
              )}

              {/* Welcome message for new users */}
              {isNewUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: "32px",
                    padding: "24px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Target size={20} />
                    {isPT
                      ? "Comece em 3 passos simples"
                      : uiFallback("Get started in 3 simple steps")}
                  </h3>
                  <ol
                    style={{
                      paddingLeft: "20px",
                      fontSize: "15px",
                      lineHeight: 1.8,
                      opacity: 0.95,
                    }}
                  >
                    <li>
                      {isPT
                        ? "Escolha uma lição abaixo para praticar"
                        : uiFallback("Choose a lesson below to practice")}
                    </li>
                    <li>
                      {isPT
                        ? "Complete exercícios e ganhe XP"
                        : uiFallback("Complete exercises and earn XP")}
                    </li>
                    <li>
                      {isPT
                        ? "Explore jogos e cidades para aprender mais"
                        : uiFallback("Explore games and cities to learn more")}
                    </li>
                  </ol>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* TRIAL BANNER — show remaining time for users on 24h trial */}
        {isTrialActive() && (
          <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 24px 0" }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(10,132,255,0.12), rgba(90,200,250,0.08))",
                border: "1.5px solid rgba(10,132,255,0.3)",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="lume-icon-orb" style={{ width: 44, height: 44 }}>
                  <Clock size={20} />
                </span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {isPT ? "Trial Premium Ativo" : uiFallback("Premium Trial Active")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {isPT
                      ? `Restam ${getTrialRemainingFormatted()} - acesso total!`
                      : `${getTrialRemainingFormatted()} remaining - full access!`}
                  </div>
                </div>
              </div>
              <Link
                to="/pricing"
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "var(--brand)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {isPT ? "Ver Planos" : uiFallback("See Plans")}
              </Link>
            </div>
          </section>
        )}

        {/* QUICK ACTIONS */}
        <section
          className="home-quick-actions"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 0" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                to: "/games",
                label: isPT ? "Jogar" : uiFallback("Play"),
                Icon: Gamepad2,
                color: "#58CC02",
              },
              {
                to: "/culture",
                label: isPT ? "Cultura" : isES ? "Cultura" : "Culture",
                Icon: Globe,
                color: "#1CB0F6",
              },
              {
                to: "/quiz-play/review",
                label: isPT ? "Revisar" : uiFallback("Review"),
                Icon: Bookmark,
                color: "#FFC200",
              },
              {
                to: "/progress",
                label: isPT ? "Progresso" : uiFallback("Progress"),
                Icon: BarChart2,
                color: "#AC5CF6",
              },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to as any}
                className="card-duo"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "18px 12px",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderColor: `${action.color}33`,
                  borderBottomColor: `${action.color}55`,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: `${action.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <action.Icon size={22} color={action.color} />
                </div>
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        {/* STARTER TRACKS — a new user facing 710 lessons has no idea where
            to start; offer 4 approachable, low-commitment entry points that
            teach through play (quiz-play) instead of a raw lesson list. */}
        {isNewUser && (
          <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 0" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              {isPT ? "Por onde você quer começar?" : uiFallback("Where do you want to start?")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  to: "/quiz-play/daily",
                  Icon: Coffee,
                  color: "var(--brand-yellow)",
                  title: isPT ? "Palavras do dia a dia" : uiFallback("Everyday words"),
                  desc: isPT
                    ? "Objetos e rotina, no seu ritmo."
                    : uiFallback("Objects and routine, at your pace."),
                },
                {
                  to: "/quiz/slang",
                  Icon: Sparkles,
                  color: "var(--brand-purple)",
                  title: isPT ? "Gírias e expressões" : uiFallback("Slang & expressions"),
                  desc: isPT
                    ? "Como as pessoas falam de verdade."
                    : uiFallback("How people actually talk."),
                },
                {
                  to: "/quiz-play/business",
                  Icon: Briefcase,
                  color: "var(--brand-blue)",
                  title: isPT ? "Conversação formal" : uiFallback("Formal conversation"),
                  desc: isPT
                    ? "Trabalho, reuniões, e-mails."
                    : uiFallback("Work, meetings, emails."),
                },
                {
                  to: "/quiz-play/travel",
                  Icon: Plane,
                  color: "var(--brand-green)",
                  title: isPT ? "Viagem e cultura" : uiFallback("Travel & culture"),
                  desc: isPT
                    ? "O essencial para se virar por aí."
                    : uiFallback("The essentials to get around."),
                },
              ].map((track) => (
                <Link
                  key={track.to}
                  to={track.to as any}
                  style={{
                    display: "block",
                    padding: "20px",
                    borderRadius: "18px",
                    background: "var(--surface-raised)",
                    border: "1.5px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `color-mix(in srgb, ${track.color} 16%, transparent)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <track.Icon size={22} color={track.color} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "15px", marginBottom: "4px" }}>
                    {track.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {track.desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* MAIN FEED */}
        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px" }}>
          {/* CONTINUE LEARNING - Netflix Style */}
          <section style={{ marginBottom: "64px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Play size={28} color="var(--brand)" fill="var(--brand)" />
                {isPT ? "Continue Aprendendo" : uiFallback("Continue Learning")}
              </h2>
              <Link
                to="/lessons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--brand)",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                {isPT ? "Ver tudo" : uiFallback("See all")}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div
              className="home-lesson-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
                gap: "20px",
              }}
            >
              {CONTINUE_LEARNING.map((lesson, i) => (
                <motion.a
                  href={`/lesson/${lesson.id}`}
                  className="home-lesson-preview"
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}

                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "2px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Progress bar */}
                  {lesson.progress > 0 && (
                    <div style={{ height: "4px", background: "var(--border)" }}>
                      <div
                        style={{
                          height: "100%",
                          background: "var(--brand)",
                          width: `${lesson.progress}%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "var(--border)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {lesson.difficulty}
                      </span>
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "rgba(76,175,80,0.1)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "#4CAF50",
                        }}
                      >
                        +{lesson.xp} XP
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                        lineHeight: 1.3,
                      }}
                    >
                      {lesson.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        marginBottom: "16px",
                        lineHeight: 1.5,
                      }}
                    >
                      {lesson.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={14} />
                          {lesson.duration}min
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Book size={14} />
                          {lesson.type}
                        </div>
                      </div>

                      {lesson.completed && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#4CAF50",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle size={16} color="#4CAF50" />
                          {isPT ? "Completo" : uiFallback("Completed")}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

          {/* DAILY CHALLENGES GRID */}
          <div
            style={{
              display: "grid",
              // minmax(min(400px, 100%), 1fr) forced a 400px-minimum column even on
              // viewports narrower than that (e.g. any phone <430px wide),
              // guaranteeing horizontal overflow. min(400px, 100%) caps the
              // minimum at whatever width is actually available.
              gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
              gap: "24px",
              marginBottom: "64px",
            }}
          >
            <DailyQuest />
            <Leaderboard />
          </div>

          {/* RECOMMENDED VIDEOS REMOVIDO — thumbnails externos não carregam de forma confiável */}

          {/* EXPLORE CITIES - Airbnb Style */}
          <section style={{ marginBottom: "64px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Globe size={28} color="var(--brand-blue)" />
                {isPT ? "Explore Cidades" : uiFallback("Explore Cities")}
              </h2>
              <Link
                to="/culture"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--brand)",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                {isPT ? "Ver todas" : uiFallback("See all")}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div
              className="home-city-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                gap: "16px",
              }}
            >
              {TRENDING_CITIES.map((city, i) => (
                <motion.a
                  href={`/culture/${city.id}`}
                  className="home-city-preview"
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}

                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "2px solid var(--border)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="city-flag-orb" style={{ marginBottom: "12px" }}>
                    <FlagByEmoji emoji={city.flag} size={42} />
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {city.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                    }}
                  >
                    {city.country}
                  </p>
                  <div style={{ fontSize: "14px", fontWeight: 900, color: "var(--brand)" }}>
                    {city.content.toLocaleString()} {isPT ? "itens" : uiFallback("items")}
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

          {/* QUICK QUIZZES - Duolingo Style */}
          <section style={{ marginBottom: "64px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Zap size={28} color="var(--brand-yellow)" />
                {isPT ? "Quiz Rápido" : uiFallback("Quick Quizzes")}
              </h2>
            </div>

            <div
              className="home-quiz-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
                gap: "20px",
              }}
            >
              {DAILY_QUIZZES.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => nav({ to: "/quiz/quick" as any })}
                  style={{
                    background: "linear-gradient(135deg, var(--brand-yellow) 0%, #E68A00 100%)",
                    borderRadius: "20px",
                    padding: "24px",
                    color: "white",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Zap size={20} color="white" fill="white" />
                      <span style={{ fontSize: "12px", fontWeight: 800, opacity: 0.9 }}>
                        +{quiz.xp} XP
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 900,
                        marginBottom: "8px",
                        lineHeight: 1.3,
                      }}
                    >
                      {quiz.title}
                    </h3>

                    <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
                      {quiz.questions} {isPT ? "questões" : uiFallback("questions")}
                    </p>

                    {quiz.bestScore && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        <Trophy size={14} />
                        {isPT ? "Melhor:" : uiFallback("Best:")} {quiz.bestScore}%
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .video-play-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
