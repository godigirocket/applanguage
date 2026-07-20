import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  CharacterRunner,
  CharacterCelebrating,
  CharacterThinking,
  CharacterReading,
  CharacterSpeaking,
  CharacterWaving,
} from "./LumeCharacters";

interface VisualCard {
  title: string;
  subtitle: string;
  bg: string;
  textColor?: string;
  Character: React.FC<{ size?: number; animated?: boolean }>;
  href?: string;
  characterSize?: number;
}

/**
 * Cartoon-style visual grid for home/landing/quiz pages.
 * Each card features a friendly animated character.
 */
export function VisualGrid({
  cards,
  cols = 2,
}: {
  cards: VisualCard[];
  cols?: 1 | 2 | 3 | 4;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "16px",
        width: "100%",
      }}
      className="visual-grid"
    >
      {cards.map((card, i) => {
        const Character = card.Character;
        const Wrapper: React.FC<{ children: React.ReactNode }> = card.href
          ? ({ children }) => (
              <Link to={card.href as any} style={{ textDecoration: "none" }}>
                {children}
              </Link>
            )
          : ({ children }) => <>{children}</>;

        return (
          <Wrapper key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: card.bg,
                borderRadius: "24px",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
                cursor: card.href ? "pointer" : "default",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s",
              }}
            >
              {/* Decorative pattern */}
              <div
                style={{
                  position: "absolute",
                  right: "-30px",
                  top: "-30px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "-20px",
                  bottom: "-20px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  pointerEvents: "none",
                }}
              />

              {/* Character at top */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Character size={card.characterSize || 110} animated />
              </div>

              {/* Text */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 900,
                    color: card.textColor || "white",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: card.textColor || "white",
                    opacity: 0.85,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {card.subtitle}
                </div>
              </div>
            </motion.div>
          </Wrapper>
        );
      })}
    </div>
  );
}

/**
 * Pre-built grid for the home dashboard with default cards.
 */
export function HomeVisualGrid({ isPT = true }: { isPT?: boolean }) {
  const cards: VisualCard[] = [
    {
      title: isPT ? "Pratique Falando" : "Practice Speaking",
      subtitle: isPT ? "Conversações com IA" : "AI conversations",
      bg: "linear-gradient(135deg, #6C5CE7 0%, #4834D4 100%)",
      Character: CharacterSpeaking,
      href: "/conversation/free-talk",
    },
    {
      title: isPT ? "Aprenda Lendo" : "Learn by Reading",
      subtitle: isPT ? "Lições estruturadas" : "Structured lessons",
      bg: "linear-gradient(135deg, #00B894 0%, #00997A 100%)",
      Character: CharacterReading,
      href: "/lessons",
    },
    {
      title: isPT ? "Jogue e Ganhe" : "Play & Win",
      subtitle: isPT ? "21 modos de jogo" : "21 game modes",
      bg: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)",
      Character: CharacterRunner,
      href: "/games",
    },
    {
      title: isPT ? "Conquiste Metas" : "Reach Goals",
      subtitle: isPT ? "XP, streaks e troféus" : "XP, streaks & trophies",
      bg: "linear-gradient(135deg, #FDCB6E 0%, #F0932B 100%)",
      Character: CharacterCelebrating,
      href: "/progress",
    },
  ];

  return <VisualGrid cards={cards} cols={2} />;
}

/**
 * Pre-built grid for the landing page features.
 */
export function LandingVisualGrid({ isPT = true }: { isPT?: boolean }) {
  const cards: VisualCard[] = [
    {
      title: isPT ? "Sem Pressão" : "No Pressure",
      subtitle: isPT ? "Aprenda no seu ritmo" : "Learn at your pace",
      bg: "linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)",
      Character: CharacterReading,
    },
    {
      title: isPT ? "IA Empática" : "Empathetic AI",
      subtitle: isPT ? "Conversas calorosas" : "Warm conversations",
      bg: "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)",
      Character: CharacterSpeaking,
    },
    {
      title: isPT ? "Cultura Real" : "Real Culture",
      subtitle: isPT ? "Histórias e gírias" : "Stories and slang",
      bg: "linear-gradient(135deg, #55EFC4 0%, #00B894 100%)",
      Character: CharacterThinking,
    },
    {
      title: isPT ? "Celebre Cada Vitória" : "Celebrate Every Win",
      subtitle: isPT ? "Você consegue!" : "You can do it!",
      bg: "linear-gradient(135deg, #FF7675 0%, #D63031 100%)",
      Character: CharacterCelebrating,
    },
  ];

  return <VisualGrid cards={cards} cols={2} />;
}
