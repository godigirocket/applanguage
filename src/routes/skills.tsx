import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { DynamicIcon } from "@/components/lume/DynamicIcon";
import {
  Lock,
  Check,
  Sparkles,
  Trophy,
  Star,
  ShieldAlert,
  Award,
  Compass,
  Volume2,
  Gamepad2,
  GraduationCap,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/skills")({
  component: SkillsPage,
});

const SKILLS = [
  {
    id: "foundations",
    title: "Fundamentos",
    icon: "Seedling",
    desc: "O básico da comunicação.",
    level: 3,
    xpNeeded: 100,
    locked: false,
    completed: true,
    parent: null,
  },
  {
    id: "daily-life",
    title: "Vida Diária",
    icon: "Coffee",
    desc: "Cenários do dia a dia.",
    level: 2,
    xpNeeded: 150,
    locked: false,
    completed: true,
    parent: "foundations",
  },
  {
    id: "basic-grammar",
    title: "Gramática Básica",
    icon: "Book",
    desc: "Estruture seus primeiros pensamentos.",
    level: 1,
    xpNeeded: 150,
    locked: false,
    completed: false,
    parent: "foundations",
  },
  {
    id: "social-chat",
    title: "Redes Sociais",
    icon: "Share2",
    desc: "Interação online e gírias digitais.",
    level: 1,
    xpNeeded: 200,
    locked: false,
    completed: false,
    parent: "daily-life",
  },
  {
    id: "conversations",
    title: "Conversações",
    icon: "MessageSquare",
    desc: "Fluidez natural em diálogos.",
    level: 0,
    xpNeeded: 200,
    locked: false,
    completed: false,
    parent: "daily-life",
  },
  {
    id: "travel-survival",
    title: "Viagem & Sobrevivência",
    icon: "Compass",
    desc: "Perguntas e direções cruciais.",
    level: 0,
    xpNeeded: 220,
    locked: false,
    completed: false,
    parent: "basic-grammar",
  },
  {
    id: "vocabulary",
    title: "Vocabulário Rico",
    icon: "Library",
    desc: "Expanda seu dicionário mental.",
    level: 0,
    xpNeeded: 250,
    locked: true,
    completed: false,
    parent: "basic-grammar",
  },
  {
    id: "slang-idioms",
    title: "Expressões Idiomáticas",
    icon: "Smile",
    desc: "Fale como um nativo real.",
    level: 0,
    xpNeeded: 250,
    locked: true,
    completed: false,
    parent: "social-chat",
  },
  {
    id: "professional",
    title: "Linguagem de Negócios",
    icon: "Briefcase",
    desc: "Entrevistas e e-mails corporativos.",
    level: 0,
    xpNeeded: 300,
    locked: true,
    completed: false,
    parent: "conversations",
  },
  {
    id: "interviews",
    title: "Laboratório de Entrevistas",
    icon: "UserCheck",
    desc: "Simulações de emprego sob pressão.",
    level: 0,
    xpNeeded: 320,
    locked: true,
    completed: false,
    parent: "professional",
  },
  {
    id: "culture",
    title: "Cultura & Costumes",
    icon: "Palette",
    desc: "Etiqueta social e tradições.",
    level: 0,
    xpNeeded: 350,
    locked: true,
    completed: false,
    parent: "vocabulary",
  },
  {
    id: "public-speaking",
    title: "Oratória Avançada",
    icon: "Mic",
    desc: "Fale em público com autoridade.",
    level: 0,
    xpNeeded: 380,
    locked: true,
    completed: false,
    parent: "travel-survival",
  },
  {
    id: "advanced-grammar",
    title: "Gramática Profunda",
    icon: "Zap",
    desc: "Domine a complexidade estrutural.",
    level: 0,
    xpNeeded: 400,
    locked: true,
    completed: false,
    parent: "professional",
  },
  {
    id: "debates",
    title: "Debates & Argumentos",
    icon: "Scale",
    desc: "Defenda pontos de vista complexos.",
    level: 0,
    xpNeeded: 420,
    locked: true,
    completed: false,
    parent: "culture",
  },
  {
    id: "expression",
    title: "Expressão Artística",
    icon: "Music",
    desc: "Análise de músicas e poemas nativos.",
    level: 0,
    xpNeeded: 450,
    locked: true,
    completed: false,
    parent: "advanced-grammar",
  },
  {
    id: "accent-reduction",
    title: "Treino de Sotaque",
    icon: "Volume2",
    desc: "Entonação e pronúncia perfeita.",
    level: 0,
    xpNeeded: 480,
    locked: true,
    completed: false,
    parent: "advanced-grammar",
  },
  {
    id: "negotiation",
    title: "Diplomacia & Vendas",
    icon: "Handshake",
    desc: "Técnicas de persuasão linguística.",
    level: 0,
    xpNeeded: 500,
    locked: true,
    completed: false,
    parent: "debates",
  },
  {
    id: "fluency-master",
    title: "Mestre da Fluência",
    icon: "Trophy",
    desc: "O pináculo da sua evolução!",
    level: 0,
    xpNeeded: 600,
    locked: true,
    completed: false,
    parent: "negotiation",
  },
];

function SkillsPage() {
  const { language } = useStore();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 20%, rgba(255,122,69,0.05), transparent), var(--bg)",
      }}
    >
      <AppHeader />
      <main
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "48px 24px 40px",
          animation: "pageEnter 0.4s ease forwards",
        }}
      >
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
            {language === "pt" ? "Voltar ao Início" : "Back to Home"}
          </Link>
        </div>

        <header style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--accent-green)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "16px",
            }}
          >
            <Sparkles size={14} />
            <span>{language === "pt" ? "Árvore de Maestria" : "Mastery Tree"}</span>
          </div>
          <h1
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              color: "var(--text-primary)",
              marginBottom: "12px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            {language === "pt" ? "Mapa de Habilidades Lume" : "Lume Skills Map"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              fontStyle: "italic",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: 0.85,
              fontWeight: 500,
            }}
          >
            {language === "pt"
              ? "Desbloqueie conquistas, conclua lições e domine a comunicação real através de um caminho gameficado de elite."
              : "Unlock accomplishments, complete lessons, and master real interaction via an elite gamified pathway."}
          </p>
        </header>

        {/* EXTRA Practice Modes Deck */}
        <section style={{ marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "var(--accent-green)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "28px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Award size={16} />{" "}
            {language === "pt"
              ? "Modos de Estudo Extras & Ferramentas"
              : "Extra Study Modes & Tools"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: "20px",
            }}
          >
            <Link to="/culture" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass premium-shadow"
                style={{
                  padding: "28px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  height: "100%",
                  borderTop: "4px solid var(--accent-terra)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "16px",
                    background: "rgba(196,109,75,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-terra)",
                    marginBottom: "20px",
                  }}
                >
                  <Compass size={24} />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {language === "pt" ? "Centro Cultural Lume" : "Lume Cultural Hub"}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {language === "pt"
                    ? "Abra mapas interativos de países, selecione cidades e descubra comidas locais, pontos turísticos e gírias audíveis!"
                    : "Open interactive country maps, select cities and discover local foods, landmarks and auditable slangs!"}
                </p>
              </motion.div>
            </Link>

            <Link to="/lessons" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass premium-shadow"
                style={{
                  padding: "28px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  height: "100%",
                  borderTop: "4px solid var(--accent-green)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "16px",
                    background: "rgba(74,122,90,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-green)",
                    marginBottom: "20px",
                  }}
                >
                  <Volume2 size={24} />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {language === "pt" ? "Laboratório de Pronúncia" : "Accent Lab"}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {language === "pt"
                    ? "Fale frases nativas complexas e ganhe pontuação instantânea guiada pela nossa inteligência de reconhecimento."
                    : "Speak complex native phrases and get instant feedback driven by our voice recognition engine."}
                </p>
              </motion.div>
            </Link>

            <Link to="/games" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass premium-shadow"
                style={{
                  padding: "28px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  height: "100%",
                  borderTop: "4px solid var(--accent-gold)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "16px",
                    background: "rgba(212,162,59,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-gold)",
                    marginBottom: "20px",
                  }}
                >
                  <Gamepad2 size={24} />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {language === "pt" ? "Arena de Desafios" : "Challengers Arena"}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {language === "pt"
                    ? "Jogue quizzes cronometrados rápidos, acumule vitórias consecutivas e suba de nível na liga de fluência Lume."
                    : "Play rapid timed quizzes, accumulate winning streaks and climb up in the Lume fluency league."}
                </p>
              </motion.div>
            </Link>

            <Link to="/guide" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass premium-shadow"
                style={{
                  padding: "28px",
                  borderRadius: "24px",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  height: "100%",
                  borderTop: "4px solid var(--accent-teal)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "16px",
                    background: "rgba(78,143,183,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-teal)",
                    marginBottom: "20px",
                  }}
                >
                  <GraduationCap size={24} />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {language === "pt" ? "Biblioteca Lume" : "Lume Library"}
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {language === "pt"
                    ? "Acesse o nosso guia passo a passo completo ensinando como otimizar o seu tempo e suas habilidades."
                    : "Access our complete step-by-step guide teaching how to optimize your time and language acquisition."}
                </p>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Winding game-like pathway grid */}
        <section>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "var(--accent-green)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            {language === "pt" ? "Seu Trilho de Maestria" : "Your Mastery Pathway"}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {SKILLS.map((skill, index) => {
              const isEven = index % 2 === 0;
              const hasNext = index < SKILLS.length - 1;
              return (
                <div
                  key={skill.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* Skill Node Row with winding shifts */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        index === 0 || index === SKILLS.length - 1
                          ? "center"
                          : isEven
                            ? "flex-start"
                            : "flex-end",
                      width: "100%",
                      maxWidth: "680px",
                      padding: "10px 0",
                      boxSizing: "border-box",
                    }}
                  >
                    <SkillNode skill={skill} />
                  </div>

                  {/* Glowing Connection line */}
                  {hasNext && (
                    <div
                      style={{
                        width: "3px",
                        height: "52px",
                        background: skill.completed
                          ? "linear-gradient(180deg, var(--accent-green), var(--accent-green)40)"
                          : "linear-gradient(180deg, var(--border), rgba(255,255,255,0.01))",
                        boxShadow: skill.completed ? "0 0 10px rgba(76,175,80,0.4)" : "none",
                        opacity: skill.locked ? 0.3 : 0.8,
                        margin: "6px 0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function SkillNode({ skill }: { skill: (typeof SKILLS)[0] }) {
  const [hovered, setHovered] = useState(false);

  const bg = skill.completed
    ? "linear-gradient(135deg, var(--brand), var(--brand-2))"
    : skill.locked
      ? "var(--surface)"
      : "var(--surface-raised)";
  const borderColor = skill.completed
    ? "transparent"
    : skill.locked
      ? "var(--border)"
      : "var(--accent-green)";
  const borderStyle = skill.completed ? "solid" : skill.locked ? "solid" : "dashed";
  const opacity = skill.locked ? 0.65 : 1;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={!skill.locked ? { scale: 1.04, y: -4 } : {}}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        opacity,
        cursor: skill.locked ? "default" : "pointer",
        transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
        position: "relative",
        background: "var(--surface-raised)",
        padding: "16px 24px",
        borderRadius: "28px",
        border: "1.5px solid var(--border)",
        boxShadow:
          hovered && !skill.locked ? "0 12px 28px rgba(0,0,0,0.04)" : "0 2px 8px rgba(0,0,0,0.01)",
        width: "320px",
      }}
    >
      <div
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          border: `2px ${borderStyle} ${borderColor}`,
          position: "relative",
          flexShrink: 0,
          boxShadow: skill.completed ? "0 8px 24px rgba(255,122,69,0.2)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {skill.completed ? (
          <Check size={28} color="white" strokeWidth={3.5} />
        ) : skill.locked ? (
          <Lock size={20} color="var(--text-secondary)" opacity={0.4} />
        ) : (
          <div style={{ color: "var(--accent-green)" }}>
            <DynamicIcon name={skill.icon} size={28} />
          </div>
        )}

        {/* Floating progress star badge */}
        {skill.level > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "var(--accent-gold)",
              color: "white",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 900,
              border: "2.5px solid var(--surface-raised)",
              boxShadow: "0 2px 6px rgba(212,162,59,0.3)",
            }}
          >
            {skill.level}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "16.5px",
            color: skill.locked ? "var(--text-secondary)" : "var(--text-primary)",
            fontWeight: 800,
            marginBottom: "2px",
          }}
        >
          {skill.title}
        </h3>
        <p
          style={{
            fontSize: "12.5px",
            color: "var(--text-secondary)",
            lineHeight: 1.45,
            opacity: 0.8,
            fontWeight: 500,
          }}
        >
          {skill.desc}
        </p>

        {/* Progress bar on active skills */}
        {!skill.locked && !skill.completed && (
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "9px",
                fontWeight: 800,
                color: "var(--text-secondary)",
                marginBottom: "3px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>XP Restante</span>
              <span>75 / {skill.xpNeeded} XP</span>
            </div>
            <div
              style={{
                height: "5px",
                background: "var(--border)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--accent-green)",
                  width: "50%",
                  borderRadius: "99px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
