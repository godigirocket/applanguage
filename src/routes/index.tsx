import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumeLearn — Aprenda Idiomas com Lições Curtas e Jogos" },
      {
        name: "description",
        content:
          "App de idiomas com 710+ lições, 6 modos de jogo, prática com IA e gamificação. Inglês, Espanhol e Português. Comece grátis.",
      },
      { property: "og:title", content: "LumeLearn — Aprenda Idiomas" },
      { property: "og:description", content: "710+ lições, 3 idiomas, 6 modos de jogo. Comece grátis." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://langlume.vercel.app" },
      { property: "og:image", content: "https://langlume.vercel.app/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();

  // If already logged in, go to home
  useEffect(() => {
    if (user) nav({ to: "/home" });
  }, [user, nav]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />

      {/* HERO */}
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "99px",
            background: "rgba(88,204,2,0.1)",
            border: "1px solid rgba(88,204,2,0.2)",
            marginBottom: "24px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#58CC02",
          }}
        >
          710+ lições disponíveis
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 7vw, 48px)",
            fontWeight: 900,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Aprenda idiomas com lições curtas e jogos
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "32px",
            maxWidth: "440px",
            margin: "0 auto 32px",
          }}
        >
          Inglês, Espanhol e Português. Prática diária com IA, progresso salvo e gamificação inteligente.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <Link
            to="/login"
            className="btn-3d btn-3d-green"
            style={{ padding: "16px 48px", fontSize: "16px", textDecoration: "none" }}
          >
            COMEÇAR GRÁTIS
          </Link>
          <span style={{ fontSize: "12px", color: "var(--text-soft)" }}>
            Sem cartão de crédito. 24h de acesso total.
          </span>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginTop: "48px",
            marginBottom: "48px",
          }}
        >
          {[
            { value: "710+", label: "Lições" },
            { value: "3", label: "Idiomas" },
            { value: "6", label: "Jogos" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "16px 12px",
                borderRadius: "14px",
                border: "2px solid var(--border)",
                borderBottomWidth: "4px",
                background: "var(--card-bg)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          {[
            { title: "Lições de 5 minutos", desc: "Vocabulário, gramática, listening e speaking em lições curtas que cabem na rotina." },
            { title: "6 modos de jogo", desc: "Quiz, Sobrevivência, Desafio Diário, Flashcards, Escuta Ativa e Contra o Tempo." },
            { title: "Progresso real", desc: "XP, streak diário, ranking e certificados. Acompanhe sua evolução." },
            { title: "Funciona offline", desc: "Baixe lições e pratique sem internet. Progresso sincroniza depois." },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid var(--border)",
                borderBottomWidth: "4px",
                background: "var(--card-bg)",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* PRICING PREVIEW */}
        <div style={{ marginTop: "48px", padding: "24px", borderRadius: "16px", border: "2px solid #58CC02", borderBottomWidth: "5px", borderBottomColor: "#46a302", background: "var(--card-bg)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "8px" }}>
            Premium a partir de R$ 9,90/mês
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Lições ilimitadas, todos os jogos, IA conversacional e modo offline.
          </p>
          <Link
            to="/pricing"
            className="btn-3d btn-3d-blue"
            style={{ padding: "12px 32px", fontSize: "14px", textDecoration: "none" }}
          >
            VER PLANOS
          </Link>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {[
            { to: "/terms", label: "Termos" },
            { to: "/support", label: "Suporte" },
            { to: "/refund", label: "Reembolso" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to as any}
              style={{ fontSize: "12px", color: "var(--text-soft)", textDecoration: "none", fontWeight: 600 }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
