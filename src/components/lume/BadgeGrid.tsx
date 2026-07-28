import { motion } from "framer-motion";
import { Lock, CheckCircle } from "@/components/lume/CustomIcons";
import { DynamicIcon } from "./CustomIcons";
import { useStore } from "@/hooks/useStore";

interface Badge {
  id: string;
  nameEN: string;
  namePT: string;
  descEN: string;
  descPT: string;
  icon: string;
  color: string;
}

const ALL_BADGES: Badge[] = [
  {
    id: "first-spark",
    nameEN: "First Spark",
    namePT: "Primeira Faísca",
    descEN: "Complete first conversation",
    descPT: "Complete a primeira conversa",
    icon: "Flame",
    color: "var(--accent-terra)",
  },
  {
    id: "chatterbox",
    nameEN: "Chatterbox",
    namePT: "Tagarela",
    descEN: "Complete 10 conversations",
    descPT: "Complete 10 conversas",
    icon: "MessageCircle",
    color: "var(--brand)",
  },
  {
    id: "culture-lover",
    nameEN: "Culture Lover",
    namePT: "Cultivado",
    descEN: "Complete Art & Culture topic",
    descPT: "Complete o tópico de Arte e Cultura",
    icon: "Palette",
    color: "var(--accent-green)",
  },
  {
    id: "world-traveler",
    nameEN: "World Traveler",
    namePT: "Cidadão do Mundo",
    descEN: "Complete Travel topic",
    descPT: "Complete o tópico de Viagem",
    icon: "Plane",
    color: "#C9A84C",
  },
  {
    id: "professional",
    nameEN: "Professional",
    namePT: "Líder Global",
    descEN: "Complete Professional topic",
    descPT: "Complete o tópico Corporativo",
    icon: "Briefcase",
    color: "#2f80ed",
  },
  {
    id: "confidence-builder",
    nameEN: "Confidence Builder",
    namePT: "Mente Inabalável",
    descEN: "Complete Speaking Confidence 3x",
    descPT: "Complete Autoconfiança 3 vezes",
    icon: "Brain",
    color: "#9B59B6",
  },
  {
    id: "expression-collector",
    nameEN: "Linguist",
    namePT: "Coletor de Expressões",
    descEN: "Save 20 regional expressions",
    descPT: "Salve 20 expressões regionais",
    icon: "BookOpen",
    color: "var(--accent-terra)",
  },
  {
    id: "dedicated",
    nameEN: "Dedicated",
    namePT: "Incansável",
    descEN: "Practice for 60 total minutes",
    descPT: "Pratique por 60 minutos no total",
    icon: "Clock",
    color: "var(--brand)",
  },
  {
    id: "on-fire",
    nameEN: "On Fire",
    namePT: "Imparável",
    descEN: "Reach a 7-day practice streak",
    descPT: "Alcance 7 dias seguidos de ofensiva",
    icon: "Trophy",
    color: "#C9A84C",
  },
];

export function BadgeGrid({ unlockedIds = [] }: { unlockedIds?: string[] }) {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))",
        gap: "16px",
        marginTop: "16px",
      }}
    >
      {ALL_BADGES.map((b) => {
        const isUnlocked = unlockedIds.includes(b.id);
        return (
          <motion.div
            key={b.id}
            whileHover={{ y: -5 }}
            style={{
              position: "relative",
              borderRadius: "24px",
              padding: "24px 16px",
              border: `1.5px solid ${isUnlocked ? "var(--border)" : "var(--border)"}`,
              background: isUnlocked ? "var(--card-bg)" : "var(--surface-raised)",
              boxShadow: isUnlocked ? `0 8px 24px ${b.color}15` : "none",
              opacity: isUnlocked ? 1 : 0.45,
              filter: isUnlocked ? "none" : "grayscale(100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* SVG Badge with glowing background when unlocked */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: isUnlocked ? `${b.color}15` : "rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isUnlocked ? b.color : "var(--text-secondary)",
                marginBottom: "14px",
                boxShadow: isUnlocked ? `0 0 16px ${b.color}30` : "none",
                transition: "all 0.3s",
              }}
            >
              <DynamicIcon name={b.icon} size={24} />
            </div>

            <h4
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                color: isUnlocked ? "var(--text-primary)" : "var(--text-secondary)",
                textTransform: "uppercase",
                marginBottom: "6px",
                lineHeight: 1.2,
              }}
            >
              {isPT ? b.namePT : b.nameEN}
            </h4>

            <p
              style={{
                fontSize: "9.5px",
                color: "var(--text-secondary)",
                margin: 0,
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              {isPT ? b.descPT : b.descEN}
            </p>

            {isUnlocked ? (
              <div style={{ position: "absolute", top: "10px", right: "10px", color: b.color }}>
                <CheckCircle size={12} />
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "var(--text-secondary)",
                  opacity: 0.5,
                }}
              >
                <Lock size={12} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
