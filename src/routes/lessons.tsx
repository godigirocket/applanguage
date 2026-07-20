import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
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
import { generateLessonCatalog, getRealContentCounts } from "@/data/lessonCatalog";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lições de Idiomas — 630+ Lições Interativas | LumeLearn" },
      {
        name: "description",
        content: "Explore 630+ lições de inglês, espanhol e português. Vocabulário, gramática, listening, speaking e reading. Do A1 ao C2.",
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
  { id: "reading", label: "Reading", icon: BookOpen },
];

function LessonsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, targetLanguage, completedLessons, completeLesson, addXP } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const isPT = interfaceLanguage === "pt";

  // Get real content counts
  const contentCounts = useMemo(() => getRealContentCounts(), []);

  // Persist filters to localStorage
  useEffect(() => {
    try {
      const filters = { searchQuery, selectedLevel, selectedCategory };
      localStorage.setItem("lesson_filters", JSON.stringify(filters));
    } catch (e) {
      console.warn("Could not save filters", e);
    }
  }, [searchQuery, selectedLevel, selectedCategory]);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lesson_filters");
      if (saved) {
        const filters = JSON.parse(saved);
        setSearchQuery(filters.searchQuery || "");
        setSelectedLevel(filters.selectedLevel || "All");
        setSelectedCategory(filters.selectedCategory || "all");
      }
    } catch (e) {
      console.warn("Could not load filters", e);
    }
  }, []);

  // Generate lessons with user progress
  const ALL_CATALOG_LESSONS = useMemo(
    () => generateLessonCatalog(completedLessons),
    [completedLessons]
  );

  // Filter lessons by target language FIRST
  const lessonsInTargetLanguage = ALL_CATALOG_LESSONS.filter(
    lesson => lesson.language === targetLanguage
  );

  // Then apply user filters
  const filteredLessons = lessonsInTargetLanguage.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "All" || lesson.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleLessonClick = (lesson: any) => {
    if (lesson.locked) return;
    nav({ to: `/lesson/${lesson.id}` as any });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", border: "4px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-secondary)" }}>{isPT ? "Carregando..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    nav({ to: "/login" });
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "radial-gradient(ellipse at 20% 20%, rgba(45,74,62,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(196,113,74,0.06) 0%, transparent 60%), var(--bg)",
      paddingBottom: "80px" 
    }}>
      <AppHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #1B3A4B 0%, #2D4A3E 100%)", padding: "clamp(40px, 10vw, 80px) clamp(16px, 3vw, 24px)", color: "white" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Language Selector */}
            <div style={{ marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, opacity: 0.8, marginRight: "8px", display: "flex", alignItems: "center" }}>
                {isPT ? "Estudando:" : "Studying:"}
              </div>
              {[
                { code: "en" as const, label: isPT ? "Inglês" : "English", flag: "🇬🇧" },
                { code: "es" as const, label: isPT ? "Espanhol" : "Spanish", flag: "🇪🇸" },
                { code: "pt" as const, label: isPT ? "Português" : "Portuguese", flag: "🇧🇷" },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    useStore.getState().setTargetLanguage(lang.code);
                    // Clear filters when changing language
                    setSearchQuery("");
                    setSelectedLevel("All");
                    setSelectedCategory("all");
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    background: targetLanguage === lang.code 
                      ? "rgba(255,255,255,0.2)" 
                      : "rgba(0,0,0,0.2)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 20px", background: "rgba(255,255,255,0.15)", borderRadius: "99px", marginBottom: "20px", backdropFilter: "blur(10px)" }}>
              <Book size={20} />
              <span style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 800, letterSpacing: "0.1em" }}>
                {isPT ? "CATÁLOGO COMPLETO" : "FULL CATALOG"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(28px, 7vw, 56px)", fontWeight: 900, marginBottom: "12px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {isPT ? `${lessonsInTargetLanguage.length} Lições de ${targetLanguage === 'en' ? 'Inglês' : targetLanguage === 'es' ? 'Espanhol' : 'Português'}` : `${lessonsInTargetLanguage.length} ${targetLanguage === 'en' ? 'English' : targetLanguage === 'es' ? 'Spanish' : 'Portuguese'} Lessons`}
            </h1>
            <p style={{ fontSize: "clamp(16px, 3vw, 20px)", opacity: 0.95, marginBottom: "32px", maxWidth: "700px", lineHeight: 1.5 }}>
              {isPT ? "Do iniciante ao avançado. Vocabulário, gramática, listening e speaking." : "From beginner to advanced. Vocabulary, grammar, listening and speaking."}
            </p>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "clamp(12px, 2vw, 16px)", maxWidth: "800px" }}>
              {[
                { icon: Book, label: isPT ? "Lições" : "Lessons", value: contentCounts.lessons.toLocaleString(), color: "#FFD700" },
                { icon: Globe, label: isPT ? "Idiomas" : "Languages", value: contentCounts.languages, color: "#FF6B35" },
                { icon: Star, label: isPT ? "Níveis" : "Levels", value: contentCounts.levels, color: "#4CAF50" },
                { icon: Target, label: isPT ? "Categorias" : "Categories", value: contentCounts.categories, color: "#3498DB" },
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
                  <stat.icon size={24} color="white" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900 }}>{stat.value}</div>
                  <div style={{ fontSize: "clamp(10px, 2vw, 12px)", opacity: 0.9, fontWeight: 600 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTERS */}
      <div style={{ background: "var(--card-bg)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)", position: "sticky", top: "0", zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px" }}>
          {/* Search Bar */}
          <div style={{ display: "flex", gap: "8px", marginBottom: showFilters ? "16px" : "0", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "0", width: "100%", position: "relative" }}>
              <Search size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
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
                  fontSize: "16px", /* Minimum 16px to prevent iOS zoom */
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--brand)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
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
              <span style={{ display: window.innerWidth < 400 ? "none" : "inline" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "4px" }}>
                  {/* Level Filter */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                      {isPT ? "Nível" : "Level"}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
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
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                      {isPT ? "Categoria" : "Category"}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 14px",
                            borderRadius: "99px",
                            border: "1.5px solid var(--border)",
                            background: selectedCategory === cat.id ? "var(--brand)" : "var(--bg)",
                            color: selectedCategory === cat.id ? "white" : "var(--text-primary)",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <cat.icon size={14} />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Count */}
          <div style={{ marginTop: showFilters ? "16px" : "12px", paddingTop: showFilters ? "16px" : "12px", borderTop: "1px solid var(--border)", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)" }}>
            {filteredLessons.length} {isPT ? "lições encontradas" : "lessons found"}
          </div>
        </div>
      </div>

      {/* LESSONS GRID */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(24px, 5vw, 40px) clamp(16px, 3vw, 24px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
          {filteredLessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileHover={lesson.locked ? {} : { y: -6 }}
              onClick={() => handleLessonClick(lesson)}
              style={{
                background: "var(--card-bg)",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1.5px solid",
                borderColor: lesson.locked ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.08)",
                cursor: lesson.locked ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                opacity: lesson.locked ? 0.75 : 1,
                position: "relative",
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
                    background: "rgba(250,250,250,0.7)",
                    backdropFilter: "blur(1px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Lock size={32} color="#999" style={{ marginBottom: "8px" }} />
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#666", margin: 0 }}>
                      {isPT ? "Complete a lição anterior" : "Complete previous lesson"}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              {lesson.progress > 0 && !lesson.locked && (
                <div style={{ height: "4px", background: "var(--border)" }}>
                  <div style={{ height: "100%", background: lesson.completed ? "#4CAF50" : "var(--brand)", width: `${lesson.progress}%`, transition: "width 0.3s" }} />
                </div>
              )}

              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {lesson.isPremium && (
                    <span style={{ padding: "4px 10px", background: "linear-gradient(135deg, #FFD700, #FFA500)", borderRadius: "6px", fontSize: "11px", fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={12} />
                      {isPT ? "PREMIUM" : "EDITORIAL"}
                    </span>
                  )}
                  <span style={{ padding: "4px 10px", background: "var(--border)", borderRadius: "6px", fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)" }}>
                    {lesson.difficulty}
                  </span>
                  <span style={{ padding: "4px 10px", background: "rgba(76,175,80,0.1)", borderRadius: "6px", fontSize: "11px", fontWeight: 800, color: "#4CAF50" }}>
                    +{lesson.xp} XP
                  </span>
                  <span style={{ padding: "4px 10px", background: "rgba(52,152,219,0.1)", borderRadius: "6px", fontSize: "11px", fontWeight: 800, color: "#3498DB" }}>
                    {lesson.type}
                  </span>
                </div>

                <h3 style={{ fontSize: "19px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.3 }}>
                  {lesson.title}
                </h3>

                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
                  {lesson.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} />
                      {lesson.duration}min
                    </div>
                  </div>

                  {lesson.completed ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4CAF50", fontSize: "13px", fontWeight: 700 }}>
                      <CheckCircle size={16} color="#4CAF50" />
                      {isPT ? "Completo" : "Completed"}
                    </div>
                  ) : !lesson.locked ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand)", fontSize: "13px", fontWeight: 700 }}>
                      <Play size={16} fill="var(--brand)" />
                      {isPT ? "Iniciar" : "Start"}
                      <ChevronRight size={14} />
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <Search size={48} color="var(--border)" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              {isPT ? "Nenhuma lição encontrada" : "No lessons found"}
            </h3>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
              {isPT ? "Tente ajustar os filtros ou buscar por outro termo" : "Try adjusting filters or searching for another term"}
            </p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
