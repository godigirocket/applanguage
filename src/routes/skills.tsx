import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { generateLessons } from "@/data/contentEngine";
import { summarizeSkills } from "@/lib/learning-collections";
import { Mascot } from "@/components/lume/Mascot";
import { sounds } from "@/lib/soundEffects";
import {
  ArrowLeft,
  Crown,
  Search,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Zap,
  Star,
  Book,
  Globe,
  Heart,
  ShoppingBag,
  Briefcase,
  Coffee,
  Plane,
  Utensils,
  Trophy,
  Dumbbell,
  Mic,
  Headphones,
  Laptop,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Árvore de Habilidades — LumeLearn" },
      {
        name: "description",
        content: "Explore suas habilidades de idiomas, acompanhe temas dominados e ganhe XP no estilo Duolingo.",
      },
    ],
  }),
  component: SkillsPage,
});

interface SkillVisual {
  icon: any;
  color: string;
  shadowColor: string;
  desc: { pt: string; en: string; es: string };
}

const TOPIC_VISUALS: Record<string, SkillVisual> = {
  daily: {
    icon: Coffee,
    color: "#58CC02",
    shadowColor: "#46A302",
    desc: {
      pt: "Rotinas, hábitos e conversas cotidianas essenciais.",
      en: "Routines, habits, and essential everyday conversations.",
      es: "Rutinas, hábitos y conversaciones cotidianas esenciales.",
    },
  },
  travel: {
    icon: Plane,
    color: "#1CB0F6",
    shadowColor: "#1899D6",
    desc: {
      pt: "Aeroporto, hotéis, direções e aventuras pelo mundo.",
      en: "Airports, hotels, directions, and world adventures.",
      es: "Aeropuertos, hoteles, direcciones y aventuras por el mundo.",
    },
  },
  food: {
    icon: Utensils,
    color: "#FF9600",
    shadowColor: "#D47E00",
    desc: {
      pt: "Restaurantes, ingredientes e pedidos sem hesitar.",
      en: "Restaurants, ingredients, and ordering with confidence.",
      es: "Restaurantes, ingredientes y pedidos con total confianza.",
    },
  },
  business: {
    icon: Briefcase,
    color: "#2B70C9",
    shadowColor: "#1D559E",
    desc: {
      pt: "Reuniões, e-mails profissionais e negociações.",
      en: "Meetings, professional emails, and negotiations.",
      es: "Reuniones, correos profesionales y negociaciones.",
    },
  },
  sports: {
    icon: Trophy,
    color: "#FF4B4B",
    shadowColor: "#D43636",
    desc: {
      pt: "Jogos, competições, torcida e entusiasmo esportivo.",
      en: "Games, competitions, cheering, and sports enthusiasm.",
      es: "Juegos, competiciones, animación y pasión deportiva.",
    },
  },
  fitness: {
    icon: Dumbbell,
    color: "#2CE58D",
    shadowColor: "#1DB86D",
    desc: {
      pt: "Treinos, academia, bem-estar e superação física.",
      en: "Workouts, gym routines, wellness, and fitness goals.",
      es: "Entrenamientos, gimnasio, bienestar y metas físicas.",
    },
  },
  culture: {
    icon: Globe,
    color: "#AC5CF6",
    shadowColor: "#8B3FD4",
    desc: {
      pt: "Tradições, celebrações e expressões locais autênticas.",
      en: "Traditions, celebrations, and authentic local idioms.",
      es: "Tradiciones, celebraciones y expresiones locales auténticas.",
    },
  },
  grammar: {
    icon: Book,
    color: "#00CD9C",
    shadowColor: "#00A37B",
    desc: {
      pt: "Estruturas sólidas, tempos verbais e concordância.",
      en: "Solid structures, verb tenses, and correct agreement.",
      es: "Estructuras sólidas, tiempos verbales y concordancia.",
    },
  },
  pronunciation: {
    icon: Mic,
    color: "#FF86D0",
    shadowColor: "#D45EAA",
    desc: {
      pt: "Sons nativos, ritmo da fala e clareza vocal.",
      en: "Native sounds, speech rhythm, and vocal clarity.",
      es: "Sonidos nativos, ritmo de habla y claridad vocal.",
    },
  },
  listening: {
    icon: Headphones,
    color: "#1CB0F6",
    shadowColor: "#1899D6",
    desc: {
      pt: "Compreensão auditiva em conversas naturais rápidas.",
      en: "Auditory comprehension in natural, fast conversations.",
      es: "Comprensión auditiva en conversaciones naturales rápidas.",
    },
  },
  shopping: {
    icon: ShoppingBag,
    color: "#FFC200",
    shadowColor: "#D4A100",
    desc: {
      pt: "Lojas, pechinchas, tamanhos e pagamentos.",
      en: "Stores, bargains, sizing, and payment methods.",
      es: "Tiendas, regateo, tallas y métodos de pago.",
    },
  },
  health: {
    icon: Heart,
    color: "#E03E3E",
    shadowColor: "#B52B2B",
    desc: {
      pt: "Consultas, farmácias, sintomas e primeiros socorros.",
      en: "Doctor visits, pharmacies, symptoms, and first aid.",
      es: "Consultas médicas, farmacias, síntomas y primeros auxilios.",
    },
  },
  technology: {
    icon: Laptop,
    color: "#7C4DFF",
    shadowColor: "#5C2EE0",
    desc: {
      pt: "Aplicativos, inovação, redes e o mundo digital.",
      en: "Apps, innovation, online networks, and digital life.",
      es: "Aplicaciones, innovación, redes y vida digital.",
    },
  },
  family: {
    icon: Users,
    color: "#FF7555",
    shadowColor: "#D4553B",
    desc: {
      pt: "Parentesco, amigos, relacionamentos e celebrações.",
      en: "Family ties, friendships, bonds, and gatherings.",
      es: "Familiares, amigos, vínculos y reuniones entrañables.",
    },
  },
  work: {
    icon: Briefcase,
    color: "#E6A23C",
    shadowColor: "#B87B22",
    desc: {
      pt: "Carreira, escritório, projetos e colaboração em equipe.",
      en: "Career paths, office life, projects, and teamwork.",
      es: "Carrera profesional, oficina, proyectos y trabajo en equipo.",
    },
  },
};

const DEFAULT_VISUAL: SkillVisual = {
  icon: Sparkles,
  color: "#58CC02",
  shadowColor: "#46A302",
  desc: {
    pt: "Pratique vocabulário e exercícios essenciais.",
    en: "Practice vocabulary and key core exercises.",
    es: "Practica vocabulario y ejercicios esenciales.",
  },
};

type FilterType = "all" | "in-progress" | "mastered" | "unstarted";

function SkillsPage() {
  const { targetLanguage, completedLessons, isKidAccount, learningLevel, interfaceLanguage } =
    useStore();
  const t = (pt: string, en: string, es: string) =>
    interfaceLanguage === "pt" ? pt : interfaceLanguage === "es" ? es : en;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    generateLessons(targetLanguage, Infinity, completedLessons, {
      kidMode: isKidAccount,
      progressiveLock: true,
      startLevel: learningLevel || undefined,
    })
      .then((data) => {
        if (active) {
          setLessons(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [targetLanguage, completedLessons, isKidAccount, learningLevel]);

  const rawSkills = useMemo(
    () => summarizeSkills(lessons, completedLessons, interfaceLanguage),
    [lessons, completedLessons, interfaceLanguage],
  );

  // Gamified metrics
  const stats = useMemo(() => {
    const total = rawSkills.length;
    const mastered = rawSkills.filter((s) => s.percent === 100).length;
    const inProgress = rawSkills.filter((s) => s.percent > 0 && s.percent < 100).length;
    const unstarted = rawSkills.filter((s) => s.percent === 0).length;
    const totalXp = rawSkills.reduce((sum, s) => sum + s.xp, 0);
    return { total, mastered, inProgress, unstarted, totalXp };
  }, [rawSkills]);

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return rawSkills.filter((skill) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const visual = TOPIC_VISUALS[skill.id] || DEFAULT_VISUAL;
      const allSearchText = `${skill.title} ${skill.id} ${visual.desc.pt} ${visual.desc.en} ${visual.desc.es}`.toLowerCase();
      const matchesSearch = !query || allSearchText.includes(query);

      if (!matchesSearch) return false;

      // Filter state
      if (activeFilter === "mastered") return skill.percent === 100;
      if (activeFilter === "in-progress") return skill.percent > 0 && skill.percent < 100;
      if (activeFilter === "unstarted") return skill.percent === 0;
      return true;
    });
  }, [rawSkills, searchQuery, activeFilter]);

  const motivationalQuote = useMemo(() => {
    if (stats.mastered >= 5) {
      return t(
        "Incrível! Você já domina várias habilidades. O caminho para a maestria está a todo vapor!",
        "Incredible! You already master multiple skills. The path to fluency is in full swing!",
        "¡Increíble! Ya dominas varias habilidades. ¡El camino a la fluidez va viento en popa!",
      );
    }
    if (stats.inProgress > 0) {
      return t(
        "Excelente ritmo! Cada lição concluída constrói conexões neurais sólidas no novo idioma.",
        "Great rhythm! Each finished lesson builds strong neural connections in your new language.",
        "¡Excelente ritmo! Cada lección completada crea conexiones neuronales sólidas.",
      );
    }
    return t(
      "Pronto para começar? Escolha um tema abaixo e avance pelo caminho do aprendizado!",
      "Ready to start? Pick a topic below and progress along your learning journey!",
      "¿Listo para empezar? ¡Elige un tema y avanza en tu camino de aprendizaje!",
    );
  }, [stats, t]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <main style={{ maxWidth: 1140, width: "100%", margin: "0 auto", padding: "32px 20px 80px", boxSizing: "border-box" }}>
        {/* Top Navigation Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link
            to="/home"
            className="btn-back-pill"
            onClick={() => sounds.playClick()}
          >
            <ArrowLeft size={16} />
            {t("Voltar ao Início", "Back to Home", "Volver al Inicio")}
          </Link>

          <Link
            to="/lessons"
            className="btn-back-pill"
            style={{ color: "var(--brand)" }}
            onClick={() => sounds.playClick()}
          >
            <Play size={15} fill="currentColor" />
            {t("Ver Mapa de Aulas", "View Lesson Map", "Ver Mapa de Lecciones")}
          </Link>
        </div>

        {/* Hero Banner: Mascot + Motivational Speech Bubble + Stat Pills */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "var(--surface-raised)",
            border: "2.5px solid var(--border)",
            borderBottomWidth: "5px",
            borderRadius: "28px",
            padding: "28px 24px",
            marginBottom: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Mascot */}
            <div style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
              <Mascot state={stats.mastered > 0 ? "celebrating" : "happy"} size={90} />
            </div>

            {/* Speech Bubble */}
            <div style={{ flex: 1, minWidth: "min(100%, 280px)" }}>
              <div className="duo-speech-bubble">
                <p style={{ margin: 0 }}>{motivationalQuote}</p>
              </div>
            </div>
          </div>

          {/* Gamified Stat Pills */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              borderTop: "1.5px solid var(--border)",
              paddingTop: "18px",
            }}
          >
            <div className="duo-stat-pill" style={{ color: "#FFC200", borderColor: "#FFC20040" }}>
              <Crown size={18} fill="#FFC200" />
              <span>
                <strong>{stats.mastered}</strong> / {stats.total} {t("Dominadas", "Mastered", "Dominadas")}
              </span>
            </div>

            <div className="duo-stat-pill" style={{ color: "#1CB0F6", borderColor: "#1CB0F640" }}>
              <Zap size={18} fill="#1CB0F6" />
              <span>
                <strong>{stats.inProgress}</strong> {t("Em Progresso", "In Progress", "En Progreso")}
              </span>
            </div>

            <div className="duo-stat-pill" style={{ color: "#58CC02", borderColor: "#58CC0240" }}>
              <Star size={18} fill="#58CC02" />
              <span>
                <strong>{stats.totalXp}</strong> XP {t("Acumulados", "Earned", "Acumulados")}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Page Title & Search / Filters Toolbar */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(26px, 4.5vw, 36px)",
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                {t("Árvore de Habilidades", "Skills Tree", "Árbol de Habilidades")}
              </h1>
              <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 15, fontWeight: 500 }}>
                {t(
                  "Desenvolva seu vocabulário e gramática tópico por tópico até a fluência.",
                  "Build your vocabulary and grammar topic by topic towards fluency.",
                  "Desarrolla tu vocabulario y gramática tema por tema hasta la fluidez.",
                )}
              </p>
            </div>

            {/* Quick Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface-raised)",
                border: "2px solid var(--border)",
                borderBottomWidth: "3.5px",
                borderRadius: 14,
                padding: "8px 14px",
                width: "min(100%, 280px)",
              }}
            >
              <Search size={16} color="var(--text-secondary)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Buscar tema…", "Search skill…", "Buscar tema…")}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { id: "all", label: t("Todas", "All", "Todas"), count: stats.total },
              { id: "in-progress", label: t("Em Progresso", "In Progress", "En Progreso"), count: stats.inProgress },
              { id: "mastered", label: t("Dominadas", "Mastered", "Dominadas"), count: stats.mastered },
              { id: "unstarted", label: t("A Iniciar", "Unstarted", "Por Iniciar"), count: stats.unstarted },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveFilter(f.id as FilterType);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: "99px",
                    border: `2px solid ${active ? "var(--brand)" : "var(--border)"}`,
                    borderBottomWidth: active ? "4px" : "2px",
                    background: active ? "var(--brand)" : "var(--surface-raised)",
                    color: active ? "#ffffff" : "var(--text-primary)",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{f.label}</span>
                  <span
                    style={{
                      background: active ? "rgba(255,255,255,0.25)" : "var(--border)",
                      color: active ? "#ffffff" : "var(--text-secondary)",
                      padding: "2px 8px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Mascot state="thinking" size={80} />
            <p style={{ marginTop: 16, fontWeight: 700, color: "var(--text-secondary)" }}>
              {t("Carregando habilidades…", "Loading skills…", "Cargando habilidades…")}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(255, 75, 75, 0.08)",
              border: "2px solid #FF4B4B",
              borderRadius: 20,
              padding: 24,
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: 700, color: "#FF4B4B", margin: "0 0 12px" }}>
              {t(
                "Não foi possível carregar as habilidades.",
                "Could not load skills.",
                "No se pudieron cargar las habilidades.",
              )}
            </p>
            <Link to="/lessons" className="btn-duo btn-duo-green" style={{ width: "auto" }}>
              {t("Abrir Lições", "Open Lessons", "Abrir Lecciones")}
            </Link>
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !error && filteredSkills.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "var(--surface-raised)",
              borderRadius: 24,
              border: "2px solid var(--border)",
            }}
          >
            <Mascot state="idle" size={80} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "16px 0 8px" }}>
              {t("Nenhum tema encontrado", "No skills found", "No se encontraron temas")}
            </h3>
            <p style={{ color: "var(--text-secondary)", margin: "0 0 16px", fontSize: 14 }}>
              {t(
                "Tente ajustar o termo de busca ou o filtro selecionado.",
                "Try adjusting your search query or selected filter.",
                "Prueba ajustando el término de búsqueda o el filtro seleccionado.",
              )}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="btn-back-pill"
            >
              {t("Limpar Filtros", "Clear Filters", "Limpiar Filtros")}
            </button>
          </div>
        )}

        {/* Skills Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "22px",
          }}
        >
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const visual = TOPIC_VISUALS[skill.id] || DEFAULT_VISUAL;
              const IconComp = visual.icon;
              const isMastered = skill.percent === 100;
              const isStarted = skill.completed > 0;
              const isAvailable = Boolean(skill.nextId);

              // Level label
              let levelBadge = {
                label: t("Novo", "New", "Nuevo"),
                color: "var(--text-secondary)",
                bg: "var(--border)",
                icon: Sparkles,
              };
              if (isMastered) {
                levelBadge = {
                  label: t("Nível 3 · Mestre", "Level 3 · Master", "Nivel 3 · Maestro"),
                  color: "#D4A100",
                  bg: "rgba(255, 194, 0, 0.14)",
                  icon: Crown,
                };
              } else if (skill.percent >= 50) {
                levelBadge = {
                  label: t("Nível 2 · Avançado", "Level 2 · Advanced", "Nivel 2 · Avanzado"),
                  color: "#1CB0F6",
                  bg: "rgba(28, 176, 246, 0.14)",
                  icon: Zap,
                };
              } else if (isStarted) {
                levelBadge = {
                  label: t("Nível 1 · Iniciado", "Level 1 · Started", "Nivel 1 · Iniciado"),
                  color: "#58CC02",
                  bg: "rgba(88, 204, 2, 0.14)",
                  icon: Star,
                };
              }

              const LevelIcon = levelBadge.icon;

              return (
                <motion.article
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="card-duo"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px",
                    borderColor: isMastered ? "#FFC200" : `${visual.color}44`,
                    borderBottomColor: isMastered ? "#D4A100" : visual.shadowColor,
                    background: "var(--surface-raised)",
                    borderRadius: "24px",
                    gap: "18px",
                  }}
                >
                  <div>
                    {/* Card Top: Floating Icon + Level Pill */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "18px",
                          background: `${visual.color}18`,
                          border: `2px solid ${visual.color}35`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 4px 0 ${visual.shadowColor}25`,
                        }}
                      >
                        <IconComp size={26} color={visual.color} />
                      </div>

                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 99,
                          background: levelBadge.bg,
                          color: levelBadge.color,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        <LevelIcon size={14} fill={isMastered ? "#D4A100" : "none"} />
                        <span>{levelBadge.label}</span>
                      </div>
                    </div>

                    {/* Skill Title & Description */}
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: 900,
                        letterSpacing: "-0.01em",
                        margin: "0 0 6px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {skill.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.5,
                        color: "var(--text-secondary)",
                        margin: "0 0 14px",
                        minHeight: "38px",
                      }}
                    >
                      {interfaceLanguage === "es"
                        ? visual.desc.es
                        : interfaceLanguage === "en"
                          ? visual.desc.en
                          : visual.desc.pt}
                    </p>

                    {/* Progress Bar & Details */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "var(--text-secondary)",
                          marginBottom: "8px",
                        }}
                      >
                        <span>
                          {skill.completed} / {skill.total} {t("lições", "lessons", "lecciones")}
                        </span>
                        <span style={{ color: isMastered ? "#D4A100" : visual.color }}>
                          {skill.percent}%
                        </span>
                      </div>

                      <div className="duo-progress-track">
                        <div
                          className="duo-progress-fill"
                          style={{
                            width: `${Math.max(skill.percent, 0)}%`,
                            background: isMastered
                              ? "linear-gradient(90deg, #FFC200, #FFD54F)"
                              : `linear-gradient(90deg, ${visual.color}, ${visual.color}dd)`,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={13} fill="#FFC200" color="#FFC200" />
                          {skill.xp} XP
                        </span>
                        {isMastered && (
                          <span style={{ color: "#4A7A5B", display: "flex", alignItems: "center", gap: 4 }}>
                            <CheckCircle2 size={13} /> {t("Concluído", "Completed", "Completado")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3D Action Button */}
                  <div style={{ marginTop: "6px" }}>
                    {isAvailable ? (
                      isStarted ? (
                        <Link
                          to="/lesson/$id"
                          params={{ id: skill.nextId! }}
                          className="btn-duo btn-duo-green"
                          onClick={() => sounds.playClick()}
                        >
                          <Play size={16} fill="white" />
                          {t("Continuar Lição", "Continue Lesson", "Continuar Lección")}
                        </Link>
                      ) : (
                        <Link
                          to="/lesson/$id"
                          params={{ id: skill.nextId! }}
                          className="btn-duo btn-duo-blue"
                          onClick={() => sounds.playClick()}
                        >
                          <Sparkles size={16} />
                          {t("Começar Tema", "Start Topic", "Comenzar Tema")}
                        </Link>
                      )
                    ) : isMastered ? (
                      <Link
                        to="/lesson/$id"
                        params={{
                          id: lessons.find((l) => l.topic === skill.id)?.id || skill.nextId || "lesson-en-1",
                        }}
                        className="btn-duo btn-duo-gold"
                        onClick={() => sounds.playClick()}
                      >
                        <RotateCcw size={16} />
                        {t("Praticar & Revisar", "Practice & Review", "Practicar y Repasar")}
                      </Link>
                    ) : (
                      <Link
                        to="/lessons"
                        className="btn-duo btn-duo-locked"
                        onClick={() => sounds.playClick()}
                      >
                        <Lock size={15} />
                        {t("Avançar no Caminho", "Advance on Path", "Avanzar en el Camino")}
                      </Link>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
