import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { getAllCities, getCitiesByLanguage } from "@/data/culturalContent";
import {
  MapPin,
  Globe,
  Sparkles,
  Book,
  ArrowRight,
  MessageCircle,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/culture/")({
  head: () => ({
    meta: [
      { title: "Cultura — Explore 8 Cidades do Mundo | LumeLearn" },
      {
        name: "description",
        content:
          "Descubra curiosidades, frases úteis e vocabulário de 8 cidades: London, New York, Sydney, Toronto, Dublin, Madrid, Barcelona e Mexico City.",
      },
    ],
  }),
  component: CulturePage,
});

function CulturePage() {
  const nav = useNavigate();
  const { interfaceLanguage, targetLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Scope city cards to the language being learned. There is no curated Portuguese
  // city content yet (culturalContent.ts only covers English/Spanish cities), so for
  // a "pt" target we fall back to the full list rather than showing an empty page.
  const languageNameByTarget: Record<string, string> = {
    en: "English",
    es: "Spanish",
    pt: "Portuguese",
  };
  const citiesForTarget = getCitiesByLanguage(languageNameByTarget[targetLanguage] || "English");
  const cities = citiesForTarget.length > 0 ? citiesForTarget : getAllCities();

  const t = {
    title: isPT ? "Imersão Cultural" : isES ? "Inmersión Cultural" : "Cultural Immersion",
    subtitle: isPT
      ? "Explore cidades reais, aprenda frases úteis e descubra curiosidades"
      : isES
        ? "Explora ciudades reales, aprende frases útiles y descubre curiosidades"
        : "Explore real cities, learn useful phrases and discover curiosities",
    cities: isPT ? "cidades" : isES ? "ciudades" : "cities",
    curiosities: isPT ? "curiosidades" : isES ? "curiosidades" : "curiosities",
    phrases: isPT ? "frases" : isES ? "frases" : "phrases",
    words: isPT ? "palavras" : isES ? "palabras" : "words",
    explore: isPT ? "Explorar" : isES ? "Explorar" : "Explore",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: "88px",
      }}
    >
      <AppHeader />

      {/* Hero — clean, minimal */}
      <section
        style={{
          padding: "60px 24px 48px",
          textAlign: "center",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(255,122,69,0.06)",
              borderRadius: "99px",
              marginBottom: "20px",
              border: "1px solid rgba(255,122,69,0.1)",
            }}
          >
            <Globe size={14} color="var(--brand)" />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "var(--brand)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {t.cities.toUpperCase()}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
              lineHeight: 1.1,
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              maxWidth: "500px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {t.subtitle}
          </p>

          {/* Stats pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: MapPin, value: cities.length, label: t.cities },
              { icon: Sparkles, value: cities.length * 3, label: t.curiosities },
              { icon: MessageCircle, value: cities.length * 5, label: t.phrases },
              { icon: Book, value: cities.length * 5, label: t.words },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "var(--surface-raised)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                }}
              >
                <stat.icon size={14} color="var(--text-secondary)" />
                <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* City Grid — clean cards */}
      <section
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "20px",
          }}
        >
          {cities.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => nav({ to: `/culture/${city.slug}` as any })}
              style={{
                background: "var(--surface-raised)",
                borderRadius: "20px",
                padding: "24px",
                border: "1.5px solid var(--border)",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
              }}
            >
              {/* Top row: flag + country */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "40px", lineHeight: 1 }}>{city.flag}</div>
                <div
                  style={{
                    padding: "4px 10px",
                    background: "var(--bg)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {city.language}
                </div>
              </div>

              {/* City name */}
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                  letterSpacing: "-0.01em",
                }}
              >
                {city.name}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                {city.country}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: "20px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {city.shortDescription}
              </p>

              {/* Footer: stats + arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {city.curiosities.length} {t.curiosities}
                  </span>
                  <span>•</span>
                  <span>
                    {city.usefulPhrases.length} {t.phrases}
                  </span>
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s ease",
                  }}
                >
                  <ArrowRight size={14} color="var(--text-secondary)" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
