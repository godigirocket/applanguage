import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { TopicScenario } from "@/components/lume/TopicScenario";
import { pickRotatingTopic } from "@/lib/language-content/game-questions";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Star,
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap,
  Book,
  Video,
  Users,
  Globe,
  Clock,
  CheckCircle,
  Settings,
  LogOut,
  Crown,
  Shield,
  Heart,
  Lock,
} from "@/components/lume/CustomIcons";
import {
  getLeague,
  getDivision,
  getXPToNextLeague,
  getNextLeague,
  ACHIEVEMENTS,
} from "@/data/gamification";
import { getQuizStats } from "@/lib/language-content";

// Checks real, trackable progress against each achievement's id (e.g. "streak_7", "xp_1000",
// "lessons_10", "perfect_10"). Achievement types with no real tracking yet (friends, cities
// explored, time-of-day study, videos) are left locked rather than faked as unlocked.
function isAchievementUnlocked(
  id: string,
  progress: { xp: number; streak: number; lessonsCompleted: number; perfectScores: number },
): boolean {
  const [type, thresholdStr] = id.split("_");
  const threshold = Number(thresholdStr);
  if (Number.isNaN(threshold)) return false;
  switch (type) {
    case "streak":
      return progress.streak >= threshold;
    case "xp":
      return progress.xp >= threshold;
    case "lessons":
      return progress.lessonsCompleted >= threshold;
    case "perfect":
      return progress.perfectScores >= threshold;
    default:
      return false;
  }
}

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, xp, streak, targetLanguage } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "stats" | "settings">(
    "overview",
  );

  const isPT = interfaceLanguage === "pt";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
        </div>
      </div>
    );
  }

  if (!user) {
    nav({ to: "/login" });
    return null;
  }

  // Calculate gamification data
  const currentLeague = getLeague(xp);
  const division = getDivision(xp, currentLeague);
  const nextLeague = getNextLeague(currentLeague);
  const xpToNext = getXPToNextLeague(xp, currentLeague);
  const level = Math.floor(xp / 100) + 1;

  // Real stats from store + local quiz history
  const { completedLessons } = useStore.getState();
  const quizStats = getQuizStats();
  const stats = {
    lessonsCompleted: completedLessons.length,
    quizzesTaken: quizStats.quizzesCompleted,
    videosWatched: 0,
    citiesExplored: 0,
    perfectScores: quizStats.perfectScores,
    studyDays: Math.max(streak, 1),
    totalMinutes: completedLessons.length * 6,
    averageScore:
      quizStats.quizzesCompleted > 0
        ? Math.round((quizStats.perfectScores / quizStats.quizzesCompleted) * 100)
        : 0,
    longestStreak: streak,
    currentStreak: streak,
  };

  const achievementProgress = {
    xp,
    streak,
    lessonsCompleted: completedLessons.length,
    perfectScores: quizStats.perfectScores,
  };
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    isAchievementUnlocked(a.id, achievementProgress),
  );
  const totalAchievements = ACHIEVEMENTS.length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
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
      <TopicScenario topic={pickRotatingTopic("profile")} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HERO PROFILE CARD */}
        <section
          style={{
            background: currentLeague.gradient,
            padding: "60px 24px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-80px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "start", gap: "32px", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "64px",
                    border: "6px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                >
                  👤
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-8px",
                    right: "-8px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    border: "4px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {currentLeague.icon}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <h1 style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-0.02em" }}>
                    {user.email?.split("@")[0] || "Student"}
                  </h1>
                  <div
                    style={{
                      padding: "6px 14px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 800,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Lvl {level}
                  </div>
                </div>

                <div
                  style={{ fontSize: "20px", marginBottom: "24px", opacity: 0.95, fontWeight: 600 }}
                >
                  {currentLeague.name[isPT ? "pt" : "en"]} • {isPT ? "Divisão" : "Division"}{" "}
                  {division}
                </div>

                {/* Quick stats */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  {[
                    { icon: Star, label: "XP Total", value: xp.toLocaleString() },
                    {
                      icon: Flame,
                      label: isPT ? "Ofensiva" : "Streak",
                      value: `${streak} ${isPT ? "dias" : "days"}`,
                    },
                    {
                      icon: Trophy,
                      label: isPT ? "Liga" : "League",
                      value: currentLeague.name[isPT ? "pt" : "en"],
                    },
                    {
                      icon: Award,
                      label: isPT ? "Conquistas" : "Achievements",
                      value: `${unlockedAchievements.length}/${totalAchievements}`,
                    },
                  ].map((stat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <stat.icon size={20} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize: "20px", fontWeight: 900 }}>{stat.value}</div>
                        <div style={{ fontSize: "12px", opacity: 0.9, fontWeight: 600 }}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress to next league */}
                <div style={{ marginTop: "32px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, opacity: 0.9 }}>
                      {isPT ? "Próxima Liga:" : "Next League:"}{" "}
                      {nextLeague.name[isPT ? "pt" : "en"]} {nextLeague.icon}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 800 }}>
                      {xpToNext.toLocaleString()} XP
                    </span>
                  </div>
                  <div
                    style={{
                      height: "12px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "99px",
                      overflow: "hidden",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "white",
                        width: `${Math.min(100, ((currentLeague.maxXP - xpToNext) / (currentLeague.maxXP - currentLeague.minXP)) * 100)}%`,
                        borderRadius: "99px",
                        transition: "width 0.5s ease",
                        boxShadow: "0 0 20px rgba(255,255,255,0.5)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  onClick={() => setActiveTab("settings")}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "2px solid white",
                    background: "transparent",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Settings size={18} />
                  {isPT ? "Configurações" : "Settings"}
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <LogOut size={18} />
                  {isPT ? "Sair" : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div
          style={{
            background: "var(--surface-raised)",
            borderBottom: "2px solid var(--border)",
            position: "sticky",
            top: "64px",
            zIndex: 10,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: "32px" }}>
              {[
                { id: "overview", label: isPT ? "Visão Geral" : "Overview", icon: TrendingUp },
                { id: "achievements", label: isPT ? "Conquistas" : "Achievements", icon: Trophy },
                { id: "stats", label: isPT ? "Estatísticas" : "Statistics", icon: BarChart2 },
                { id: "settings", label: isPT ? "Ajustes" : "Settings", icon: Settings },
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "20px 0",
                    border: "none",
                    background: "transparent",
                    color: activeTab === tab.id ? "var(--brand)" : "var(--text-secondary)",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: "pointer",
                    borderBottom:
                      activeTab === tab.id ? "3px solid var(--brand)" : "3px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                  marginBottom: "40px",
                }}
              >
                {[
                  {
                    icon: Book,
                    label: isPT ? "Lições Completas" : "Lessons Completed",
                    value: stats.lessonsCompleted,
                    color: "#4CAF50",
                  },
                  {
                    icon: Zap,
                    label: isPT ? "Quizzes" : "Quizzes",
                    value: stats.quizzesTaken,
                    color: "#F39C12",
                  },
                  {
                    icon: Video,
                    label: isPT ? "Vídeos" : "Videos",
                    value: stats.videosWatched,
                    color: "#E74C3C",
                  },
                  {
                    icon: Globe,
                    label: isPT ? "Cidades" : "Cities",
                    value: stats.citiesExplored,
                    color: "#3498DB",
                  },
                  {
                    icon: Target,
                    label: isPT ? "Notas Perfeitas" : "Perfect Scores",
                    value: stats.perfectScores,
                    color: "#9B59B6",
                  },
                  {
                    icon: Calendar,
                    label: isPT ? "Dias de Estudo" : "Study Days",
                    value: stats.studyDays,
                    color: "#1ABC9C",
                  },
                  {
                    icon: Clock,
                    label: isPT ? "Minutos Totais" : "Total Minutes",
                    value: stats.totalMinutes,
                    color: "#E67E22",
                  },
                  {
                    icon: CheckCircle,
                    label: isPT ? "Média" : "Average",
                    value: `${stats.averageScore}%`,
                    color: "#27AE60",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: "var(--surface-raised)",
                      borderRadius: "20px",
                      padding: "24px",
                      border: "2px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: `${stat.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <stat.icon size={28} color={stat.color} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: 900,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Activity Heatmap placeholder */}
              <div
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "20px",
                  padding: "32px",
                  border: "2px solid var(--border)",
                  marginBottom: "40px",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Calendar size={24} color="var(--brand)" />
                  {isPT ? "Atividade nos Últimos 12 Meses" : "Activity Last 12 Months"}
                </h2>
                <div
                  style={{
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg)",
                    borderRadius: "12px",
                    gap: "16px",
                  }}
                >
                  <TrendingUp size={48} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                      }}
                    >
                      {isPT
                        ? `${stats.currentStreak} dias de sequência!`
                        : `${stats.currentStreak}-day streak!`}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      {isPT
                        ? "Continue praticando para manter sua sequência"
                        : "Keep practicing to maintain your streak"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "achievements" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {isPT ? "Conquistas Desbloqueadas" : "Unlocked Achievements"}
                </h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                  {unlockedAchievements.length} {isPT ? "de" : "of"} {totalAchievements}{" "}
                  {isPT ? "conquistas" : "achievements"}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {[...ACHIEVEMENTS]
                  .sort(
                    (a, b) =>
                      Number(isAchievementUnlocked(b.id, achievementProgress)) -
                      Number(isAchievementUnlocked(a.id, achievementProgress)),
                  )
                  .map((achievement, i) => {
                    const unlocked = isAchievementUnlocked(achievement.id, achievementProgress);
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={unlocked ? { scale: 1.03, y: -4 } : undefined}
                        style={{
                          background: "var(--surface-raised)",
                          borderRadius: "20px",
                          padding: "24px",
                          border: "2px solid var(--border)",
                          cursor: unlocked ? "pointer" : "default",
                          transition: "all 0.3s ease",
                          opacity: unlocked ? 1 : 0.5,
                          filter: unlocked ? "none" : "grayscale(1)",
                          position: "relative",
                        }}
                      >
                        {!unlocked && (
                          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                            <Lock size={18} color="var(--text-secondary)" />
                          </div>
                        )}
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          {achievement.icon}
                        </div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            marginBottom: "8px",
                          }}
                        >
                          {achievement.name[isPT ? "pt" : "en"]}
                        </h3>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            marginBottom: "16px",
                          }}
                        >
                          {achievement.requirement}
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div
                            style={{
                              padding: "6px 12px",
                              background: "rgba(76,175,80,0.1)",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 800,
                              color: "#4CAF50",
                            }}
                          >
                            +{achievement.xp} XP
                          </div>
                          <div
                            style={{
                              padding: "6px 12px",
                              background: "rgba(241,196,15,0.1)",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 800,
                              color: "#F1C40F",
                            }}
                          >
                            +{achievement.coins} 🪙
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Fix BarChart2 import
function BarChart2({ size, color }: { size: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
