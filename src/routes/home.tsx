import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { getUserStats } from "@/lib/db";
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
} from "@/components/lume/CustomIcons";
import { generateLessons, generateQuizzes, CITIES } from "@/data/contentEngine";
import { SIMULATED_USERS } from "@/data/communityUsers";
import { DailyQuest } from "@/components/lume/DailyQuest";
import { Leaderboard } from "@/components/lume/Leaderboard";
import { TopicScenario } from "@/components/lume/TopicScenario";
import { pickRotatingTopic } from "@/lib/language-content/game-questions";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

// NO MORE STATIC GENERATION - Will use targetLanguage dynamically
const TRENDING_CITIES = CITIES.slice(0, 8);
const ACTIVE_FRIENDS = SIMULATED_USERS.slice(0, 6);

function HomePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, xp, streak, targetLanguage, completedLessons } = useStore();
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isPT = interfaceLanguage === "pt";

  // Generate content dynamically based on targetLanguage. generateLessons/
  // generateQuizzes are async because they dynamically import() only the
  // target language's lesson file instead of one bundle with all 3 languages.
  const [continueLearning, setContinueLearning] = useState<any[]>([]);
  const [dailyQuizzes, setDailyQuizzes] = useState<any[]>([]);
  const CONTINUE_LEARNING = continueLearning;
  const DAILY_QUIZZES = dailyQuizzes;

  useEffect(() => {
    let cancelled = false;
    generateLessons(targetLanguage, 8, completedLessons).then((lessons) => {
      if (!cancelled) setContinueLearning(lessons);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, completedLessons]);

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

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
      return;
    }

    async function loadHomeData() {
      if (!user) return;
      const result = await getUserStats(user.id);
      const p = result.profile as any;
      if (p) {
        setProfile(p);
      }
      setLoadingData(false);
    }

    if (user) {
      loadHomeData();
    }
  }, [user, loading, nav]);

  if (loading || (!profile && loadingData)) {
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
          <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || (isPT ? "Estudante" : "Learner");
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpToNextLevel = currentLevel * 100 - xp;
  const levelProgress = ((xp % 100) / 100) * 100;
  const isNewUser = xp === 0;

  const getGreeting = () => {
    const hr = currentTime.getHours();
    if (hr < 12) return isPT ? `Bom dia, ${firstName}!` : `Good morning, ${firstName}!`;
    if (hr < 18) return isPT ? `Boa tarde, ${firstName}!` : `Good afternoon, ${firstName}!`;
    return isPT ? `Boa noite, ${firstName}!` : `Good evening, ${firstName}!`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: "80px",
        position: "relative",
      }}
    >
      <TopicScenario topic={pickRotatingTopic("home")} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HERO GREETING */}
        <section
          style={{
            background: "linear-gradient(135deg, #1B3A4B 0%, #2D4A3E 100%)",
            padding: "48px 24px",
            color: "white",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 900,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                {getGreeting()}
              </h1>
              <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px" }}>
                {isNewUser
                  ? isPT
                    ? "Bem-vindo ao Lume! Comece sua jornada de aprendizado agora."
                    : "Welcome to Lume! Start your learning journey now."
                  : isPT
                    ? "Continue sua jornada de aprendizado"
                    : "Continue your learning journey"}
              </p>

              {/* Quick Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  maxWidth: "800px",
                }}
              >
                {[
                  { icon: Star, label: "XP", value: xp.toLocaleString(), color: "#FFD700" },
                  {
                    icon: Flame,
                    label: isPT ? "Ofensiva" : "Streak",
                    value: `${streak} ${isPT ? "dias" : "days"}`,
                    color: "#FF6B35",
                  },
                  {
                    icon: Trophy,
                    label: isPT ? "Nível" : "Level",
                    value: currentLevel,
                    color: "#4CAF50",
                  },
                  {
                    icon: Target,
                    label: isPT ? "Próximo" : "Next",
                    value: xp === 0 ? "100 XP" : `${xpToNextLevel} XP`,
                    color: "#3498DB",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      padding: "20px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <stat.icon size={24} color={stat.color} />
                    <div style={{ fontSize: "24px", fontWeight: 900 }}>{stat.value}</div>
                    <div style={{ fontSize: "12px", opacity: 0.8, fontWeight: 600 }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

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
                  <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>
                    {isPT ? "🎯 Comece em 3 passos simples" : "🎯 Get started in 3 simple steps"}
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
                        : "Choose a lesson below to practice"}
                    </li>
                    <li>
                      {isPT ? "Complete exercícios e ganhe XP" : "Complete exercises and earn XP"}
                    </li>
                    <li>
                      {isPT
                        ? "Explore jogos e cidades para aprender mais"
                        : "Explore games and cities to learn more"}
                    </li>
                  </ol>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

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
                {isPT ? "Continue Aprendendo" : "Continue Learning"}
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
                {isPT ? "Ver tudo" : "See all"}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {CONTINUE_LEARNING.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => nav({ to: `/lesson/${lesson.id}` as any })}
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
                          {isPT ? "Completo" : "Completed"}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* DAILY CHALLENGES GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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
                <Globe size={28} color="#3498DB" />
                {isPT ? "Explore Cidades" : "Explore Cities"}
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
                {isPT ? "Ver todas" : "See all"}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "16px",
              }}
            >
              {TRENDING_CITIES.map((city, i) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => nav({ to: "/culture" })}
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
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>{city.flag}</div>
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
                    {city.content.toLocaleString()} {isPT ? "itens" : "items"}
                  </div>
                </motion.div>
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
                <Zap size={28} color="#F39C12" />
                {isPT ? "Quiz Rápido" : "Quick Quizzes"}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
                    background: "linear-gradient(135deg, #F39C12 0%, #E67E22 100%)",
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
                      {quiz.questions} {isPT ? "questões" : "questions"}
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
                        {isPT ? "Melhor:" : "Best:"} {quiz.bestScore}%
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ACTIVE FRIENDS - Social */}
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
                <Users size={28} color="#9B59B6" />
                {isPT ? "Amigos Ativos" : "Active Friends"}
              </h2>
              <Link
                to="/community"
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
                {isPT ? "Ver comunidade" : "See community"}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {ACTIVE_FRIENDS.map((friend, i) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "var(--surface-raised)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "2px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ fontSize: "40px" }}>{friend.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {friend.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {friend.country} • Lvl {friend.level}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Flame size={14} color="#FF6B35" />
                      {friend.streak}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--brand)" }}>
                      {friend.xp.toLocaleString()} XP
                    </div>
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
