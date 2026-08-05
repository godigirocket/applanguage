import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, LockKeyhole, Rocket, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { useEffect } from "react";
import { AgentDock } from "@/components/ui/agent-dock";
import { BorderGlow } from "@/components/ui/border-glow";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import Lightfall from "@/components/ui/lightfall";
import { AppHeader } from "@/components/lume/AppHeader";
import { Logo } from "@/components/lume/Logo";
import { useAuth } from "@/lib/auth";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lume",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description: "App de idiomas com lições curtas, prática guiada por IA, gamificação e rotina diária.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
};

const previewSlides: CoverflowSlide[] = [
  {
    src: "/brand/lume-companion.png",
    alt: "Personagem Lume segurando um painel luminoso",
    title: "Companheiro IA",
    subtitle: "Prática guiada sem pressão",
  },
  {
    src: "/brand/lume-logo-mark.png",
    alt: "Logo premium do Lume",
    title: "Identidade Lume",
    subtitle: "Azul, ouro e movimento",
  },
  {
    src: "/lume_mascot_hero.png",
    alt: "Arte anterior do Lume usada como material visual do app",
    title: "Rotina diária",
    subtitle: "Lições curtas e progresso",
  },
  {
    src: "/logo.png",
    alt: "Marca anterior do Lume como peça de transição visual",
    title: "Idiomas vivos",
    subtitle: "Inglês, Espanhol e Português",
  },
];

const launchSteps = [
  {
    title: "Fluxo real logado",
    body: "Cadastro, login, onboarding, escolher idioma, fazer lição, salvar progresso e retornar.",
    icon: CheckCircle2,
  },
  {
    title: "Retenção Duolingo",
    body: "Streak confiável, missões diárias, recompensas, ranking e revisão espaçada clara.",
    icon: Star,
  },
  {
    title: "Conteúdo e pedagogia",
    body: "Revisar dificuldade, tradução, áudio, sequência A1-C2 e exercícios naturais.",
    icon: Sparkles,
  },
  {
    title: "Premium e monetização",
    body: "Paywall, trial, checkout, benefícios premium e limites do plano gratuito.",
    icon: LockKeyhole,
  },
  {
    title: "Performance e produção",
    body: "Bundle menor, imagens otimizadas, PWA, cache, service worker e monitoramento.",
    icon: Zap,
  },
  {
    title: "Confiança legal",
    body: "Termos, política, suporte, recuperação de senha e estados de erro bem escritos.",
    icon: ShieldCheck,
  },
  {
    title: "Lançamento",
    body: "Domínio, analytics, conta demo, feedback in-app e deploy estável para primeiros usuários.",
    icon: Rocket,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lume - Aprenda idiomas com rotina, IA e jogos" },
      {
        name: "description",
        content:
          "Lume é um app de idiomas com lições curtas, prática guiada por IA, gamificação e uma rotina diária bonita de usar.",
      },
      { property: "og:title", content: "Lume - Aprenda idiomas com rotina, IA e jogos" },
      {
        property: "og:description",
        content: "Lições curtas, personagens premium, prática com IA e progresso diário.",
      },
      { property: "og:image", content: "https://langlume.vercel.app/og-image.svg" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav({ to: "/home" });
  }, [nav, user]);

  return (
    <div className="lume-launch-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <AppHeader />
      <main id="main-content">
        <section className="lume-landing-hero">
          <div className="lume-hero-lightfall" aria-hidden="true">
            <Lightfall
              colors={["#A6C8FF", "#0F6BFF", "#FFD76A", "#14B8A6"]}
              backgroundColor="#0F6BFF"
              speed={0.52}
              streakCount={5}
              density={0.52}
              zoom={3.1}
              opacity={0.72}
              mouseStrength={0.55}
              mixBlendMode="screen"
            />
          </div>
          <div className="lume-landing-shell">
            <motion.div
              className="lume-hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="lume-landing-kicker">
                <Logo size={34} />
                <span>Pronto para virar produto</span>
              </div>
              <h1>Lume transforma prática diária em vontade de voltar amanhã.</h1>
              <p>
                Uma landing dentro do app com identidade premium, personagem PNG, efeitos React Bits,
                cards vivos e um plano claro até o lançamento.
              </p>
              <div className="lume-hero-actions">
                <Link to="/login" className="btn-gold animated-container">
                  Entrar no app <ChevronRight size={18} />
                </Link>
                <Link to="/pricing" className="btn-outline-premium animated-container">
                  Ver premium
                </Link>
              </div>
              <div className="lume-trust-row" aria-label="Launch readiness">
                <span>Mobile testado</span>
                <span>IA + jogos</span>
                <span>7 etapas</span>
              </div>
            </motion.div>

            <motion.div
              className="lume-phone-stage"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <BorderGlow animated backgroundColor="rgba(255,255,255,0.84)" borderRadius={36} glowColor="212 100 70">
                <div className="lume-phone-mockup">
                  <div className="lume-phone-top">
                    <img src="/brand/lume-logo-mark.png" alt="" />
                    <span>Lume Daily</span>
                  </div>
                  <div className="lume-phone-card">
                    <img className="lume-phone-character" src="/brand/lume-companion.png" alt="Personagem Lume" />
                    <div>
                      <strong>Boa tarde, Ruboy.</strong>
                      <span>3 minutos para manter sua ofensiva.</span>
                    </div>
                  </div>
                  <div className="lume-mini-path" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <AgentDock
                    agentName="Lume"
                    avatarSrc="/brand/lume-logo-mark.png"
                    idleStatus="Pronto para conversar"
                    workingStatus="Pensando na próxima lição..."
                    onMessageSubmit={async () => new Promise((resolve) => window.setTimeout(resolve, 700))}
                  />
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </section>

        <section className="lume-section lume-carousel-section">
          <div className="lume-section-heading">
            <span>Assets dentro do app</span>
            <h2>PNG, mockup e cards com profundidade.</h2>
          </div>
          <CoverflowCarousel
            slides={previewSlides}
            showCaption
            showPagination
            showNavigation
            cardWidth="clamp(150px, 30vw, 270px)"
            cardClassName="lume-cover-card"
          />
        </section>

        <section className="lume-section">
          <div className="lume-section-heading">
            <span>As 7 etapas</span>
            <h2>Do acabamento visual ao lançamento.</h2>
          </div>
          <div className="lume-launch-grid">
            {launchSteps.map((step, index) => (
              <BorderGlow
                key={step.title}
                className="lume-launch-step-glow"
                backgroundColor="rgba(255,255,255,0.78)"
                borderRadius={24}
                glowRadius={28}
                glowColor={index % 2 ? "43 96 62" : "212 100 70"}
                colors={index % 2 ? ["#f5b700", "#ff6b5a", "#0f6bff"] : ["#0f6bff", "#14b8a6", "#f5b700"]}
              >
                <article className="lume-launch-step animated-container">
                  <div className="lume-step-index">{String(index + 1).padStart(2, "0")}</div>
                  <step.icon size={24} />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              </BorderGlow>
            ))}
          </div>
        </section>

        <section className="lume-section lume-final-cta">
          <BorderGlow animated backgroundColor="#07101f" borderRadius={32} glowColor="43 96 62" colors={["#f5b700", "#0f6bff", "#14b8a6"]}>
            <div className="lume-final-panel">
              <img src="/brand/lume-companion.png" alt="" />
              <div>
                <span>Próximo passo</span>
                <h2>Testar logado e fechar o MVP para usuários reais.</h2>
                <p>Depois disso, o trabalho vira retenção, monetização, produção e lançamento.</p>
              </div>
              <Link to="/login" className="btn-gold animated-container">
                Começar teste
              </Link>
            </div>
          </BorderGlow>
        </section>
      </main>
    </div>
  );
}
