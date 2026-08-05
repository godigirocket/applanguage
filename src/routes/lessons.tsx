import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import {
  Play,
  Search,
  Sliders,
  Clock,
  Star,
  Trophy,
  CheckCircle,
  Book,
  Mic,
  Volume2,
  BookOpen,
  Sparkles,
  Target,
  Globe,
  ChevronRight,
  Lock,
} from "@/components/lume/CustomIcons";
import { generateLessons, normalizeStartLevel, cefrToTier } from "@/data/contentEngine";
import { TopicScenario } from "@/components/lume/TopicScenario";
import { pickRotatingTopic } from "@/lib/language-content/game-questions";
import { useUserStore } from "@/store/userStore";
import { FlagBR, FlagUS, FlagES } from "@/components/lume/Flags";
import { LessonPath } from "@/components/lume/LessonPath";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lições de Idiomas — 700+ Lições Interativas | LumeLearn" },
      {
        name: "description",
        content:
          "Explore 700+ lições de inglês, espanhol e português. Vocabulário, gramática, listening, speaking e reading. Do A1 ao C2.",
      },
    ],
  }),
  component: LessonsPage,
});

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const CATEGORIES = [
  { id: "all", label: "All", icon: Globe },
  { id: "vocabulary", label: "Vocabulary", icon: Sparkles },
  { id: "grammar", label: "Grammar", icon: Book },
  { id: "listening", label: "Listening", icon: Volume2 },
  { id: "speaking", label: "Speaking", icon: Mic },
  { id: "idioms", label: "Idioms", icon: BookOpen },
];
// Kid accounts (4-10) only get simple word/listening practice — no slang,
// business idioms, or free-form speaking content.
const KID_SAFE_CATEGORIES = ["vocabulary", "listening"];

// One deliberate color + icon per category, so the catalog reads as a set of
// distinct subjects (Duolingo-style) instead of an undifferentiated list.
const CATEGORY_STYLE: Record<string, { color: string; icon: typeof Sparkles }> = {
  vocabulary: { color: "var(--brand-purple)", icon: Sparkles },
  grammar: { color: "var(--brand-blue)", icon: Book },
  listening: { color: "var(--brand-teal)", icon: Volume2 },
  speaking: { color: "var(--brand-red)", icon: Mic },
  idioms: { color: "var(--brand-green)", icon: BookOpen },
};
const DEFAULT_CATEGORY_STYLE = { color: "var(--brand)", icon: Book };

function LessonsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const {
    interfaceLanguage,
    targetLanguage,
    completedLessons,
    learningLevel,
    isKidAccount,
  } = useStore();
  const { userLevel } = useUserStore();
  const [initialFilters] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem("lesson_filters");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || "");
  const [selectedLevel, setSelectedLevel] = useState(initialFilters?.selectedLevel || "All");
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [levelFilterExplicit, setLevelFilterExplicit] = useState(Boolean(initialFilters?.selectedLevel));
  const PAGE_SIZE = 30;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isPT = interfaceLanguage === "pt";
  // Whichever level system set a value (onboarding's 3-tier word or the
  // in-app A1-C2 modal) — normalized to a CEFR anchor for the curriculum.
  const startLevel = normalizeStartLevel(userLevel || learningLevel);

  // Debounce the search text so filtering ~700 lessons doesn't run on every
  // keystroke — only 250ms after the user stops typing.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Rendering all ~700 lesson cards at once (each its own animated motion.div)
  // was the main source of lag on this page — page results instead, and reset
  // back to the first page whenever a filter changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedQuery, selectedLevel, selectedCategory, targetLanguage]);

  // Persist filters to localStorage
  useEffect(() => {
    try {
      const filters = { searchQuery, selectedLevel, selectedCategory };
      localStorage.setItem("lesson_filters", JSON.stringify(filters));
    } catch (e) {
      console.warn("Could not save filters", e);
    }
  }, [searchQuery, selectedLevel, selectedCategory]);

  // Once the user's chosen level (onboarding or the A1-C2 modal) is known,
  // default the level filter to it — unless they've already picked one
  // explicitly (from localStorage or by clicking a pill this session).
  useEffect(() => {
    if (!levelFilterExplicit && startLevel) {
      setSelectedLevel(cefrToTier(startLevel));
    }
  }, [startLevel, levelFilterExplicit]);

  // Real lessons for the current target language, loaded from the same
  // masterContent source /home uses — previously this page (and the lesson
  // viewer it links to) used a separate, disconnected legacy catalog.
  const [lessonsInTargetLanguage, setLessonsInTargetLanguage] = useState<any[]>([]);
  useEffect(() => {
    let cancelled = false;
    generateLessons(targetLanguage, Infinity, completedLessons, {
      progressiveLock: true,
      startLevel,
    }).then((lessons) => {
      if (!cancelled) setLessonsInTargetLanguage(lessons);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, completedLessons, startLevel]);

  const contentCounts = {
    lessons: lessonsInTargetLanguage.length,
    languages: 3,
    levels: 6,
    categories: 5,
  };

  // Then apply user filters
  const filteredLessons = lessonsInTargetLanguage.filter((lesson) => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query);
    const matchesLevel = selectedLevel === "All" || lesson.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    // Kid Mode floor: regardless of whatever filter is selected in the UI,
    // never surface non-kid-safe categories or anything past Beginner.
    const matchesKidSafety =
      !isKidAccount ||
      (KID_SAFE_CATEGORIES.includes(lesson.category) && lesson.difficulty === "Beginner");

    return matchesSearch && matchesLevel && matchesCategory && matchesKidSafety;
  });

  const handleLessonClick = (lesson: any) => {
    if (lesson.locked) {
      toast.info(
        isPT
          ? "Complete a lição anterior para desbloquear esta."
          : "Finish the previous lesson to unlock this one.",
      );
      return;
    }
    nav({ to: `/lesson/${lesson.id}` as any });
  };

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
    }
  }, [loading, user, nav]);

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
          <p style={{ color: "var(--text-secondary)" }}>{isPT ? "Carregando..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(255,122,69,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(196,113,74,0.06) 0%, transparent 60%), var(--bg)",
        paddingBottom: "80px",
        position: "relative",
      }}
      className="lume-lessons-page"
    >
      <TopicScenario topic={pickRotatingTopic("lessons")} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader />

        {/* HERO */}
        <section
          className="lume-lessons-hero"
          style={{
            // Fixed dark band regardless of light/dark theme — see home.tsx for why.
            background: "linear-gradient(135deg, #111827 0%, #0b1020 100%)",
            padding: "clamp(40px, 10vw, 80px) clamp(16px, 3vw, 24px)",
            color: "#fff",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Language Selector */}
              <div style={{ marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    opacity: 0.8,
                    marginRight: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isPT ? "Estudando:" : "Studying:"}
                </div>
                {[
                  { code: "en" as const, label: isPT ? "Inglês" : "English", Flag: FlagUS },
                  { code: "es" as const, label: isPT ? "Espanhol" : "Spanish", Flag: FlagES },
                  { code: "pt" as const, label: isPT ? "Português" : "Portuguese", Flag: FlagBR },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      useStore.getState().setTargetLanguage(lang.code);
                      // Clear filters when changing language
                      setSearchQuery("");
                      setSelectedLevel("All");
                      setSelectedCategory("all");
                      setLevelFilterExplicit(false);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      border:
                        targetLanguage === lang.code
                          ? "2px solid var(--brand)"
                          : "2px solid rgba(255,255,255,0.35)",
                      background:
                        targetLanguage === lang.code ? "var(--brand)" : "rgba(255,255,255,0.14)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <lang.Flag size={20} />
                    {lang.label}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "99px",
                  marginBottom: "20px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Book size={20} />
                <span
                  style={{
                    fontSize: "clamp(11px, 2.5vw, 13px)",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                  }}
                >
                  {isPT ? "CATÁLOGO COMPLETO" : "FULL CATALOG"}
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(28px, 7vw, 56px)",
                  fontWeight: 900,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {isPT
                  ? `${lessonsInTargetLanguage.length} Lições de ${targetLanguage === "en" ? "Inglês" : targetLanguage === "es" ? "Espanhol" : "Português"}`
                  : `${lessonsInTargetLanguage.length} ${targetLanguage === "en" ? "English" : targetLanguage === "es" ? "Spanish" : "Portuguese"} Lessons`}
              </h1>
              <p
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  opacity: 0.95,
                  marginBottom: "32px",
                  maxWidth: "700px",
                  lineHeight: 1.5,
                }}
              >
                {isPT
                  ? "Do iniciante ao avançado. Vocabulário, gramática, listening e speaking."
                  : "From beginner to advanced. Vocabulary, grammar, listening and speaking."}
              </p>

              {/* Quick Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
                  gap: "clamp(12px, 2vw, 16px)",
                  maxWidth: "800px",
                }}
              >
                {[
                  {
                    icon: Book,
                    label: isPT ? "Lições" : "Lessons",
                    value: contentCounts.lessons.toLocaleString(),
                    color: "#FFC200",
                  },
                  {
                    icon: Globe,
                    label: isPT ? "Idiomas" : "Languages",
                    value: contentCounts.languages,
                    color: "#1CB0F6",
                  },
                  {
                    icon: Star,
                    label: isPT ? "Níveis" : "Levels",
                    value: contentCounts.levels,
                    color: "#2FBB52",
                  },
                  {
                    icon: Target,
                    label: isPT ? "Categorias" : "Categories",
                    value: contentCounts.categories,
                    color: "#AC5CF6",
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
                      padding: "clamp(16px, 3vw, 20px)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <stat.icon size={24} color={stat.color} style={{ marginBottom: "8px" }} />
                    <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900 }}>
                      {stat.value}
                    </div>
                    <div
                      style={{ fontSize: "clamp(10px, 2vw, 12px)", opacity: 0.9, fontWeight: 600 }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FILTERS — flows normally with the page; must not stay pinned while scrolling */}
        <div
          className="lume-lessons-filters"
          style={{
            background: "var(--card-bg)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px" }}>
            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: showFilters ? "16px" : "0",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "0", width: "100%", position: "relative" }}>
                <Search
                  size={18}
                  color="var(--text-secondary)"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder={isPT ? "Buscar lições..." : "Search lessons..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 48px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    fontSize: "16px" /* Minimum 16px to prevent iOS zoom */,
                    outline: "none",
                    transition: "border-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1.5px solid var(--border)",
                  background: showFilters ? "var(--brand)" : "var(--bg)",
                  color: showFilters ? "white" : "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Sliders size={18} />
                <span className="lesson-filter-label">
                  {isPT ? "Filtros" : "Filters"}
                </span>
              </button>
            </div>

            {/* Filter Pills */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      paddingTop: "4px",
                    }}
                  >
                    {/* Level Filter */}
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "8px",
                        }}
                      >
                        {isPT ? "Nível" : "Level"}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {LEVELS.filter(
                          (level) => !isKidAccount || level === "All" || level === "Beginner",
                        ).map((level) => (
                          <button
                            key={level}
                            onClick={() => {
                              setSelectedLevel(level);
                              setLevelFilterExplicit(true);
                            }}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "99px",
                              border: "1.5px solid var(--border)",
                              background: selectedLevel === level ? "var(--brand)" : "var(--bg)",
                              color: selectedLevel === level ? "white" : "var(--text-primary)",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "8px",
                        }}
                      >
                        {isPT ? "Categoria" : "Category"}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {CATEGORIES.filter(
                          (cat) =>
                            !isKidAccount || cat.id === "all" || KID_SAFE_CATEGORIES.includes(cat.id),
                        ).map((cat) => {
                          const catColor = CATEGORY_STYLE[cat.id]?.color || "var(--brand)";
                          const isActive = selectedCategory === cat.id;
                          return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 14px",
                              borderRadius: "99px",
                              border: `1.5px solid ${isActive ? catColor : "var(--border)"}`,
                              background: isActive
                                ? catColor
                                : "var(--bg)",
                              color: isActive ? "white" : "var(--text-primary)",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <cat.icon size={14} />
                            {cat.label}
                          </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Count */}
            <div
              style={{
                marginTop: showFilters ? "16px" : "12px",
                paddingTop: showFilters ? "16px" : "12px",
                borderTop: "1px solid var(--border)",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}
            >
              {filteredLessons.length} {isPT ? "lições encontradas" : "lessons found"}
            </div>
          </div>
        </div>

        {/* LESSONS GRID */}
        <main
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "clamp(24px, 5vw, 40px) clamp(16px, 3vw, 24px)",
          }}
        >
          {/* PROGRESS PATH — Duolingo-style vertical lesson tree (shows when no filters active) */}
          {selectedCategory === "all" && selectedLevel !== "All" && !debouncedQuery && (
            <section style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px" }}>
                {isPT ? "Seu Caminho" : "Your Path"}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", textAlign: "center", marginBottom: "16px" }}>
                {isPT ? "Complete as lições em ordem para desbloquear a próxima" : "Complete lessons in order to unlock the next one"}
              </p>
              <LessonPath lessons={filteredLessons} maxVisible={15} />
            </section>
          )}

          {/* GRID VIEW — full catalog */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: "clamp(16px, 3vw, 24px)",
            }}
          >
            {filteredLessons.slice(0, visibleCount).map((lesson, i) => {
              const categoryStyle = CATEGORY_STYLE[lesson.category] || DEFAULT_CATEGORY_STYLE;
              const CategoryIcon = categoryStyle.icon;
              return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 20) * 0.02 }}
                whileHover={lesson.locked ? {} : { y: -6 }}
                onClick={() => handleLessonClick(lesson)}
                className="card-duo lume-lesson-card"
                style={{
                  overflow: "hidden",
                  borderTop: `4px solid ${lesson.locked ? "var(--border)" : categoryStyle.color}`,
                  cursor: lesson.locked ? "not-allowed" : "pointer",
                  opacity: lesson.locked ? 0.75 : 1,
                  position: "relative",
                  padding: 0,
                }}
              >
                {/* Lock overlay */}
                {lesson.locked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "var(--overlay-bg)",
                      backdropFilter: "blur(1px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Lock size={32} color="var(--text-muted)" style={{ marginBottom: "8px" }} />
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                          margin: 0,
                        }}
                      >
                        {isPT ? "Complete a lição anterior" : "Complete previous lesson"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {lesson.progress > 0 && !lesson.locked && (
                  <div style={{ height: "4px", background: "var(--border)" }}>
                    <div
                      style={{
                        height: "100%",
                        background: lesson.completed ? "#2FBB52" : categoryStyle.color,
                        width: `${lesson.progress}%`,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `color-mix(in srgb, ${categoryStyle.color} 16%, transparent)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <CategoryIcon size={22} color={categoryStyle.color} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {lesson.isPremium && (
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "linear-gradient(135deg, #FFD700, #FFA500)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Star size={12} />
                        {isPT ? "PREMIUM" : "EDITORIAL"}
                      </span>
                    )}
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
                    <span
                      style={{
                        padding: "4px 10px",
                        background: `color-mix(in srgb, ${categoryStyle.color} 12%, transparent)`,
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: categoryStyle.color,
                      }}
                    >
                      {lesson.type}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "19px",
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
                    </div>

                    {lesson.completed ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#4CAF50",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle size={16} color="#4CAF50" />
                        {isPT ? "Completo" : "Completed"}
                      </div>
                    ) : !lesson.locked ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "var(--brand)",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        <Play size={16} fill="var(--brand)" />
                        {isPT ? "Iniciar" : "Start"}
                        <ChevronRight size={14} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>

          {filteredLessons.length > visibleCount && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                style={{
                  padding: "14px 32px",
                  borderRadius: "14px",
                  border: "1.5px solid var(--border)",
                  background: "var(--surface-raised)",
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isPT
                  ? `Carregar mais (${filteredLessons.length - visibleCount} restantes)`
                  : `Load more (${filteredLessons.length - visibleCount} remaining)`}
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredLessons.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <Search size={48} color="var(--border)" style={{ marginBottom: "16px" }} />
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                {isPT ? "Nenhuma lição encontrada" : "No lessons found"}
              </h3>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                {isPT
                  ? "Tente ajustar os filtros ou buscar por outro termo"
                  : "Try adjusting filters or searching for another term"}
              </p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 399px) {
          .lesson-filter-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
