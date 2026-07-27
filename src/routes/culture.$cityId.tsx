import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { getCityBySlug } from "@/data/culturalContent";
import { FlagByEmoji } from "@/components/lume/Flags";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Sparkles,
  MessageCircle,
  Book,
  Lightbulb,
  Play,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/culture/$cityId")({
  component: CityDetailPage,
});

function CityDetailPage() {
  const { cityId } = Route.useParams();
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const city = getCityBySlug(cityId);

  // 404 if city not found
  if (!city) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <AppHeader />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "16px" }}>
            404
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px" }}>
            {isPT ? "Cidade não encontrada" : "City not found"}
          </p>
          <button
            onClick={() => nav({ to: "/culture" })}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "var(--brand)",
              color: "white",
              border: "none",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isPT ? "Voltar para Cultura" : "Back to Culture"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      {/* HERO */}
      <section style={{ background: city.gradient, padding: "60px 24px", color: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => nav({ to: "/culture" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "32px",
              backdropFilter: "blur(10px)",
            }}
          >
            <ArrowLeft size={16} />
            {isPT ? "Voltar" : "Back"}
          </button>

          <div style={{ marginBottom: "16px" }}>
            <FlagByEmoji emoji={city.flag} size={64} />
          </div>

          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            {city.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} />
              <span style={{ fontSize: "18px", fontWeight: 600 }}>{city.country}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Globe size={20} />
              <span style={{ fontSize: "18px", fontWeight: 600 }}>{city.language}</span>
            </div>
          </div>

          <p style={{ fontSize: "clamp(16px, 3vw, 20px)", opacity: 0.95, maxWidth: "800px", lineHeight: 1.6 }}>
            {city.fullDescription}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* CURIOSITIES */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Sparkles size={28} color="var(--brand)" />
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>
              {isPT ? "Curiosidades" : "Curiosities"}
            </h2>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {city.curiosities.map((curiosity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "2px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{
                    background: "var(--brand)",
                    color: "white",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "14px",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: "16px", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
                    {curiosity}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* USEFUL PHRASES */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <MessageCircle size={28} color="#E67E22" />
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>
              {isPT ? "Frases Úteis" : "Useful Phrases"}
            </h2>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {city.usefulPhrases.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "2px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--brand)", marginBottom: "8px" }}>
                  "{item.phrase}"
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  → {item.translation}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* VOCABULARY */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Book size={28} color="#3498DB" />
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>
              {isPT ? "Vocabulário" : "Vocabulary"}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "16px" }}>
            {city.vocabulary.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "2px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 900, color: "var(--brand)", marginBottom: "8px" }}>
                  {item.word}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  {item.meaning}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.5 }}>
                  "{item.example}"
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CULTURAL TIP */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Lightbulb size={28} color="#F39C12" />
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>
              {isPT ? "Dica Cultural" : "Cultural Tip"}
            </h2>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #FFF4E6 0%, #FFE5B4 100%)",
            borderRadius: "16px",
            padding: "24px",
            border: "2px solid #F39C12",
          }}>
            <p style={{ fontSize: "16px", color: "#8B4513", lineHeight: 1.6, margin: 0 }}>
              💡 {city.culturalTip}
            </p>
          </div>
        </section>

        {/* RELATED LESSONS CTA */}
        {city.relatedLessonIds.length > 0 && (
          <section>
            <div style={{
              background: "var(--brand)",
              borderRadius: "20px",
              padding: "32px",
              textAlign: "center",
              color: "white",
            }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>
                {isPT ? `Quer praticar ${city.language}?` : `Want to practice ${city.language}?`}
              </h3>
              <p style={{ fontSize: "16px", marginBottom: "24px", opacity: 0.95 }}>
                {isPT 
                  ? `Temos ${city.relatedLessonIds.length} lições relacionadas a ${city.name}` 
                  : `We have ${city.relatedLessonIds.length} lessons related to ${city.name}`}
              </p>
              <button
                onClick={() => nav({ to: "/lessons" })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "white",
                  color: "var(--brand)",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <Play size={18} fill="var(--brand)" />
                {isPT ? "Ver Lições" : "View Lessons"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
