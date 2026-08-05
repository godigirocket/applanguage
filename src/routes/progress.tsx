import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeQuery, supabase } from "@/lib/supabase";
import { getUserStats, checkBadges } from "@/lib/db";
import { checkTables } from "@/lib/supabase-safe";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { BadgeGrid } from "@/components/lume/BadgeGrid";
import { useStore } from "@/hooks/useStore";
import { getQuizStats } from "@/lib/language-content";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TOPIC_BY_SLUG } from "@/lib/topics";
import { AlertTriangle } from "@/components/lume/CustomIcons";
import { DynamicIcon } from "@/components/lume/DynamicIcon";
import {
  MessageSquare,
  Clock,
  BookOpen,
  Flame,
  Star,
  Trophy,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Lume — Your Evolution" }] }),
  component: ProgressPage,
});

interface Snap {
  date: string;
  speaking_confidence: number;
  conversational_flow: number;
  cultural_fluency: number;
  pronunciation_clarity: number;
}
interface Expr {
  id: string;
  expression: string;
  context: string | null;
  topic_slug?: string;
  created_at: string;
}
interface Sess {
  id: string;
  title: string;
  topic_slug: string;
  topic_title?: string;
  duration_seconds: number;
  xp_earned?: number;
  created_at: string;
}

function ProgressPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, xp, streak, level, targetLanguage } = useStore();

  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [exprs, setExprs] = useState<Expr[]>([]);
  const [sess, setSess] = useState<Sess[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(false);

  const isPT = interfaceLanguage === "pt";

  const speakExpression = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (targetLanguage === "en") utter.lang = "en-US";
    else if (targetLanguage === "es") utter.lang = "es-ES";
    else utter.lang = "pt-BR";
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    async function verifyDatabase() {
      const exists = await checkTables();
      setShowSetupBanner(!exists);
    }
    verifyDatabase();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
      return;
    }
    if (!user || loaded) return;
    (async () => {
      const result = await getUserStats(user.id);
      if (result.profile) {
        setProfile(result.profile);
      }
      const convList = (result.conversations ?? []) as any[];
      setSess(convList as Sess[]);
      setExprs((result.expressions ?? []) as Expr[]);

      const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      const snapsRes = (await safeQuery(
        () =>
          supabase
            .from("progress_snapshots")
            .select("*")
            .eq("student_id", user.id)
            .gte("date", since)
            .order("date") as any,
      )) as any;
      setSnaps((snapsRes ?? []) as Snap[]);

      // Compute badges
      const completedTopics = convList.map((c) => c.topic_slug);
      const badgeStatus = checkBadges({
        conversationCount: result.stats.conversationCount,
        expressionCount: result.stats.expressionCount,
        totalMinutes: result.stats.totalMinutes,
        streak: result.stats.streak,
        completedTopics,
        ...getQuizStats(),
      });
      setBadges(badgeStatus);
      setLoaded(true);
    })();
  }, [user, loading, nav, loaded]);

  const unlockedIds: string[] = [];
  if (badges.firstSpark) unlockedIds.push("first-spark");
  if (badges.chatterbox) unlockedIds.push("chatterbox");
  if (badges.cultureLover) unlockedIds.push("culture-lover");
  if (badges.worldTraveler) unlockedIds.push("world-traveler");
  if (badges.professional) unlockedIds.push("professional");
  if (badges.confidenceBuilder) unlockedIds.push("confidence-builder");
  if (badges.expressionCollector) unlockedIds.push("expression-collector");
  if (badges.dedicated) unlockedIds.push("dedicated");
  if (badges.onFire) unlockedIds.push("on-fire");

  const totalMin = Math.round(sess.reduce((a, b) => a + (b.duration_seconds || 0), 0) / 60);
  const confidencePercent = snaps.length > 0 ? snaps[snaps.length - 1].speaking_confidence : 0;

  const getTopicIcon = (slug: string) => TOPIC_BY_SLUG[slug]?.icon || "MessageSquare";
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(isPT ? "pt-BR" : "en-US", { month: "short", day: "numeric" });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
      }}
    >
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />
        <main
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "48px 24px 40px",
            animation: "pageEnter 0.4s ease forwards",
          }}
        >
          {/* Setup Banner if tables don't exist */}
          {showSetupBanner && (
            <div
              style={{
                background: "linear-gradient(135deg,#C4714A,#D4824A)",
                borderRadius: "16px",
                padding: "16px 20px",
                marginBottom: "24px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                boxShadow: "0 4px 14px rgba(196,113,74,0.25)",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "15px",
                    marginBottom: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertTriangle size={18} aria-hidden="true" />
                  Base de dados não configurada
                </div>
                <div style={{ opacity: 0.85, fontSize: "13px" }}>
                  Execute o SQL no Supabase para ativar o progresso e histórico.
                </div>
              </div>
              <Link
                to="/setup"
                style={{
                  padding: "8px 18px",
                  borderRadius: "99px",
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                Ver instruções →
              </Link>
            </div>
          )}

          {/* Back Button */}
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "24px" }}>
            <Link
              to="/home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "12px",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                transition: "all 0.2s",
              }}
              className="hover:scale-95"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {isPT ? "Voltar ao Início" : "Back to Home"}
            </Link>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "var(--text-primary)",
                marginBottom: "12px",
                fontWeight: 800,
              }}
            >
              {isPT ? "Sua Evolução" : "Your Evolution"}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "18px",
                fontStyle: "italic",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {isPT
                ? "Cada palavra falada é um passo em direção à maestria."
                : "Every word spoken is a step toward mastery."}
            </p>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: "20px",
              marginBottom: "48px",
            }}
          >
            {[
              {
                icon: "MessageSquare",
                label: isPT ? "Conversas" : "Conversations",
                value: sess.length,
                color: "var(--accent-green)",
              },
              {
                icon: "Clock",
                label: isPT ? "Minutos Praticados" : "Minutes Practiced",
                value: totalMin,
                color: "#2f80ed",
              },
              {
                icon: "BookOpen",
                label: isPT ? "Expressões Salvas" : "Expressions Saved",
                value: exprs.length,
                color: "var(--accent-terra)",
              },
              {
                icon: "Flame",
                label: "Streak",
                value: `${streak} ${isPT ? "dias" : "days"}`,
                color: streak >= 3 ? "#FF6B35" : "var(--text-secondary)",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass premium-shadow"
                style={{
                  borderRadius: "28px",
                  padding: "32px",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: stat.color,
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: `${stat.color}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DynamicIcon name={stat.icon} size={28} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Confidence Chart */}
          <div
            className="glass premium-shadow"
            style={{
              borderRadius: "32px",
              padding: "40px",
              marginBottom: "48px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "var(--accent-green)",
                    marginBottom: "8px",
                  }}
                >
                  <TrendingUp size={20} />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {isPT ? "Metas de Fluência" : "Fluency Tracking"}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {isPT ? "Confiança ao Falar" : "Speaking Confidence"}
                </h2>
              </div>
              {confidencePercent > 0 && (
                <div
                  style={{
                    padding: "10px 20px",
                    borderRadius: "16px",
                    background: "rgba(255,122,69,0.1)",
                    color: "var(--accent-green)",
                    fontSize: "14px",
                    fontWeight: 800,
                    border: "1px solid rgba(255,122,69,0.1)",
                  }}
                >
                  {confidencePercent}% {isPT ? "fluente" : "fluent"}
                </div>
              )}
            </div>

            {snaps.length > 1 ? (
              <div style={{ height: "320px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={snaps}>
                    <defs>
                      <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--text-secondary)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatDate}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="var(--text-secondary)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--surface-raised)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "var(--accent-green)", fontWeight: 700 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="speaking_confidence"
                      name="Confidence"
                      stroke="var(--accent-green)"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorConf)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon="BarChart2"
                title={isPT ? "Seu gráfico começa aqui" : "Your chart begins here"}
                sub={
                  isPT
                    ? "Complete conversas para ver seu progresso."
                    : "Complete conversations to see your progress."
                }
              />
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: "32px",
            }}
          >
            {/* Recent Sessions */}
            <section
              className="glass premium-shadow"
              style={{ borderRadius: "32px", padding: "32px", border: "1px solid var(--border)" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "#2f80ed10",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2f80ed",
                  }}
                >
                  <Calendar size={20} />
                </div>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 800 }}>
                  {isPT ? "Sessões Recentes" : "Recent Sessions"}
                </h2>
              </div>

              {sess.length === 0 ? (
                <EmptyState
                  icon="MessageSquare"
                  title={isPT ? "Nenhuma sessão" : "No sessions yet"}
                  sub={isPT ? "Comece sua jornada." : "Start your journey."}
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {sess.slice(0, 5).map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ x: 5 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        borderRadius: "18px",
                        background: "var(--surface-raised)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "#ff7a4510",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-green)",
                          }}
                        >
                          <DynamicIcon name={getTopicIcon(session.topic_slug)} size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                            {session.topic_title || session.title || session.topic_slug}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            {formatDate(session.created_at)} ·{" "}
                            {Math.max(1, Math.round((session.duration_seconds || 0) / 60))} min
                          </div>
                        </div>
                      </div>
                      {session.xp_earned != null && (
                        <div
                          style={{
                            padding: "4px 12px",
                            borderRadius: "99px",
                            background: "#C9A84C20",
                            color: "#C9A84C",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          +{session.xp_earned} XP
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Badges */}
            <section
              className="glass premium-shadow"
              style={{ borderRadius: "32px", padding: "32px", border: "1px solid var(--border)" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "#C9A84C10",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C9A84C",
                  }}
                >
                  <Trophy size={20} />
                </div>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 800 }}>
                  {isPT ? "Conquistas" : "Milestones"}
                </h2>
              </div>
              <BadgeGrid unlockedIds={unlockedIds} />
            </section>
          </div>

          {/* Saved Expressions */}
          <section
            className="glass premium-shadow"
            style={{
              borderRadius: "32px",
              padding: "40px",
              marginTop: "32px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  background: "#C4714A10",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-terra)",
                }}
              >
                <BookOpen size={24} />
              </div>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "28px", fontWeight: 800 }}>
                {isPT ? "Expressões Salvas" : "Saved Expressions"}
              </h2>
            </div>

            {exprs.length === 0 ? (
              <EmptyState
                icon="Lightbulb"
                title={isPT ? "Nada salvo" : "Nothing saved"}
                sub={isPT ? "Toque na IA para salvar." : "Tap AI to save."}
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                  gap: "16px",
                }}
              >
                {exprs.slice(0, 12).map((exp) => (
                  <motion.div
                    key={exp.id}
                    whileHover={{ y: -4 }}
                    style={{
                      padding: "24px",
                      borderRadius: "24px",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "12px",
                        color: "var(--accent-terra)",
                        opacity: 0.2,
                      }}
                    >
                      <DynamicIcon name={getTopicIcon(exp.topic_slug || "")} size={40} />
                    </div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                        paddingRight: "40px",
                      }}
                    >
                      {exp.expression}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        marginBottom: 0,
                      }}
                    >
                      "{exp.context}"
                    </p>
                    {exp.topic_slug && (
                      <div
                        style={{
                          marginTop: "16px",
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--accent-terra)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {exp.topic_slug.replace(/-/g, " ")}
                      </div>
                    )}
                    {/* TTS TRIGGER BUTTON */}
                    <button
                      onClick={() => speakExpression(exp.expression)}
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "var(--accent-terra)15",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-terra)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "transform 0.2s",
                      }}
                      className="hover:scale-110 active:scale-95"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 32px",
        background: "var(--surface)",
        borderRadius: "24px",
        border: "2px dashed rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          color: "#D4C5A9",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DynamicIcon name={icon} size={48} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "20px",
          marginBottom: "8px",
          fontWeight: 800,
        }}
      >
        {title}
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>{sub}</p>
    </div>
  );
}
