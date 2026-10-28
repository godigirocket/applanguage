import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  MessageCircle,
  Globe2,
  Gamepad2,
  Headphones,
  Check,
  ArrowUpRight,
  Sparkles,
  Route as RouteIcon,
} from "lucide-react";
import { AppHeader } from "@/components/lume/AppHeader";
import { FlagByEmoji } from "@/components/lume/Flags";
import { useAuth } from "@/lib/auth";
import "@/components/lume/landing.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lume — Aprenda através de conversa, cultura e confiança" },
      {
        name: "description",
        content:
          "Prática guiada de conversação para complementar suas aulas particulares no seu ritmo.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t, i18n } = useTranslation(["landing", "common"]);
  const lang = i18n.language?.split("-")[0];
  const text = (pt: string, en: string, es: string) =>
    lang === "en" ? en : lang === "es" ? es : pt;

  useEffect(() => {
    if (user) nav({ to: "/home", replace: true });
  }, [user, nav]);

  const features = [
    {
      icon: <MessageCircle size={24} />,
      title: t("landing:featureAITitle"),
      description: t("landing:featureAIDesc"),
      to: "/home" as const,
      cta: t("landing:mktAICta"),
    },
    {
      icon: <BookOpen size={24} />,
      title: t("common:lessons"),
      description: text(
        "Lições curtas de vocabulário, escuta e escrita. Continue de onde parou, no seu ritmo.",
        "Short vocabulary, listening and writing lessons. Pick up where you left off, at your pace.",
        "Lecciones cortas de vocabulario, escucha y escritura. Continúa donde lo dejaste, a tu ritmo.",
      ),
      to: "/lessons" as const,
      cta: t("common:lessons"),
    },
    {
      icon: <Globe2 size={24} />,
      title: t("landing:featureCultureTitle"),
      description: t("landing:featureCultureDesc"),
      to: "/culture" as const,
      cta: t("landing:mktCultureCta"),
    },
    {
      icon: <Gamepad2 size={24} />,
      title: t("landing:mktChallengeTitle"),
      description: t("landing:mktChallengeDesc"),
      to: "/games" as const,
      cta: text("Explorar jogos", "Explore games", "Explorar juegos"),
    },
  ];

  return (
    <div className="lume-fast-landing">
      <AppHeader />
      <main className="lume-landing-main">
        <section className="lume-landing-hero lume-landing-compact">
          <div className="lume-landing-copy">
            <span className="lume-landing-eyebrow">
              ✦{" "}
              {text(
                "Um pouco de prática, todos os dias",
                "A little practice, every day",
                "Un poco de práctica, cada día",
              )}
            </span>
            <h1 className="gradient-text-brand">
              {text(
                "Seu próximo idioma começa com uma boa conversa.",
                "Your next language starts with a good conversation.",
                "Tu próximo idioma empieza con una buena conversación.",
              )}
            </h1>
            <p>{t("landing:subtitle")}</p>
            <div className="lume-landing-actions">
              <Link to="/signup" className="btn-premium">
                {t("landing:ctaStart")} <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/login" className="lume-landing-secondary">
                {t("landing:ctaTryFree")}
              </Link>
            </div>
            <p className="lume-landing-note">{t("landing:testimonial")}</p>
            <div
              className="landing-language-strip"
              aria-label={text("Idiomas disponíveis", "Available languages", "Idiomas disponibles")}
            >
              <span>
                <FlagByEmoji emoji="🇺🇸" size={18} /> English
              </span>
              <span>
                <FlagByEmoji emoji="🇪🇸" size={18} /> Español
              </span>
              <span>
                <FlagByEmoji emoji="🇧🇷" size={18} /> Português
              </span>
            </div>
          </div>
          <div
            className="lume-practice-preview"
            aria-label={text(
              "Exemplo de prática guiada",
              "Guided practice example",
              "Ejemplo de práctica guiada",
            )}
          >
            <div className="lume-preview-header">
              <img
                src="/brand/lume-companion.webp"
                width="44"
                height="44"
                alt=""
                decoding="async"
              />
              <div>
                <strong>Lume</strong>
                <span>{t("landing:featureAITitle")}</span>
              </div>
              <span className="lume-preview-label">{text("Exemplo", "Example", "Ejemplo")}</span>
            </div>
            <div className="lume-preview-messages">
              <div className="lume-preview-message">
                What did you do last weekend? Tell me — no pressure.
              </div>
              <div className="lume-preview-message lume-preview-answer">
                I go to a concert. My friend, she invite me last Saturday.
              </div>
              <div className="lume-preview-message">
                {text(
                  "Boa! Um pequeno ajuste:",
                  "Nice! One small adjustment:",
                  "¡Bien! Un pequeño ajuste:",
                )}{" "}
                <strong>“I went”</strong> / <strong>“she invited me”</strong> —{" "}
                {text(
                  "para falar do passado.",
                  "to talk about the past.",
                  "para hablar del pasado.",
                )}
              </div>
            </div>
            <Link to="/signup" className="lume-preview-start">
              {text("Agora é a sua vez", "Now it's your turn", "Ahora es tu turno")}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <p className="lume-preview-caption">
              {text(
                "Cenários guiados. Você escolhe o ritmo.",
                "Guided scenarios. You set the pace.",
                "Escenarios guiados. Tú marcas el ritmo.",
              )}
            </p>
            <div className="landing-word-note">
              <Sparkles size={18} />
              <div>
                <small>
                  {text(
                    "Uma palavra, novas possibilidades",
                    "One word, new possibilities",
                    "Una palabra, nuevas posibilidades",
                  )}
                </small>
                <strong>
                  Serendipity <span>/ˌser.ənˈdɪp.ə.ti/</span>
                </strong>
                <p>
                  {text(
                    "Encontrar algo bom sem estar procurando.",
                    "Finding something wonderful when you least expect it.",
                    "Encontrar algo bueno sin estar buscándolo.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="landing-promise-strip">
          <span>
            <Check size={17} />
            {text("No seu ritmo", "At your pace", "A tu ritmo")}
          </span>
          <span>
            <Headphones size={17} />
            {text(
              "Ouça. Pratique. Descubra.",
              "Listen. Practice. Discover.",
              "Escucha. Practica. Descubre.",
            )}
          </span>
          <span>
            <Sparkles size={17} />
            {text("Pequenas vitórias diárias", "Small daily wins", "Pequeñas victorias diarias")}
          </span>
        </div>
        <section className="lume-landing-features" aria-labelledby="landing-features-title">
          <div className="lume-landing-section-heading">
            <span>EN · ES · PT</span>
            <h2 id="landing-features-title">{t("landing:featuresTitle")}</h2>
          </div>
          <div className="lume-landing-feature-grid">
            {features.map((feature) => (
              <article key={feature.to} className="lume-landing-feature">
                <span className="lume-feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.to}>
                  {feature.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="landing-journey" aria-labelledby="landing-journey-title">
          <div className="landing-journey-copy">
            <span className="landing-kicker">
              <RouteIcon size={17} />
              {text("SUA JORNADA, SEU RITMO", "YOUR JOURNEY, YOUR PACE", "TU CAMINO, TU RITMO")}
            </span>
            <h2 id="landing-journey-title">
              {text(
                "Do primeiro “hello” à confiança de falar.",
                "From your first “hello” to speaking with confidence.",
                "Del primer “hello” a la confianza para hablar.",
              )}
            </h2>
            <p>
              {text(
                "Um caminho de aprendizado que cabe na sua rotina. Descubra palavras, escute com atenção e coloque tudo em prática, uma lição de cada vez.",
                "A learning path that fits your day. Discover words, listen closely and put them into practice, one lesson at a time.",
                "Un camino que cabe en tu rutina. Descubre palabras, escucha y ponlo todo en práctica, una lección a la vez.",
              )}
            </p>
            <Link to="/lessons" className="landing-text-link">
              {text("Conheça as lições", "Explore lessons", "Explora las lecciones")}{" "}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="landing-lesson-demo">
            <div className="landing-demo-top">
              <span>01 / 03</span>
              <span>
                {text(
                  "Um gostinho da sua jornada",
                  "A taste of your journey",
                  "Un vistazo a tu camino",
                )}
              </span>
            </div>
            <div className="landing-demo-track">
              <i />
            </div>
            <div className="landing-demo-word">
              <span aria-hidden="true">👋</span>
              <small>{text("SEU PRIMEIRO PASSO", "YOUR FIRST STEP", "TU PRIMER PASO")}</small>
              <strong>Hello, world.</strong>
              <p>
                {text(
                  "Olá, mundo. Vamos começar?",
                  "A whole world to discover. Ready?",
                  "Hola, mundo. ¿Empezamos?",
                )}
              </p>
            </div>
            <div className="landing-steps">
              {[
                text("Descubra", "Discover", "Descubre"),
                text("Pratique", "Practice", "Practica"),
                text("Evolua", "Grow", "Avanza"),
              ].map((label, i) => (
                <div key={label}>
                  <span>{i === 0 ? <Check size={18} /> : String(i + 1).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="landing-discover" aria-labelledby="landing-discover-title">
          <div className="lume-landing-section-heading">
            <span>
              {text("MUITO ALÉM DAS PALAVRAS", "BEYOND THE WORDS", "MÁS ALLÁ DE LAS PALABRAS")}
            </span>
            <h2 id="landing-discover-title">
              {text(
                "Aprender também é descobrir o mundo.",
                "Learning is discovering the world.",
                "Aprender también es descubrir el mundo.",
              )}
            </h2>
            <p>
              {text(
                "Novos lugares, histórias e jeitos de dizer. Leve o idioma para situações que fazem sentido para você.",
                "New places, stories and ways to express yourself. Make the language part of your world.",
                "Nuevos lugares, historias y formas de expresarte. Lleva el idioma a tu mundo.",
              )}
            </p>
          </div>
          <div className="landing-destination-grid">
            {[
              {
                city: "London",
                emoji: "☕",
                id: "london",
                label: text("Uma pausa para o chá", "Time for tea", "Hora del té"),
              },
              {
                city: "Madrid",
                emoji: "☀️",
                id: "madrid",
                label: text(
                  "Uma conversa na praça",
                  "A chat in the plaza",
                  "Una charla en la plaza",
                ),
              },
              {
                city: "New York",
                emoji: "🗽",
                id: "new-york",
                label: text(
                  "Histórias em cada esquina",
                  "Stories on every corner",
                  "Historias en cada esquina",
                ),
              },
            ].map((place, i) => (
              <Link
                to="/culture/$cityId"
                params={{ cityId: place.id }}
                className={`landing-destination destination-${i}`}
                key={place.id}
              >
                <span className="landing-destination-art" aria-hidden="true">
                  {place.emoji}
                  <i />
                  <i />
                </span>
                <small>{place.label}</small>
                <strong>
                  {place.city}
                  <ArrowUpRight size={22} />
                </strong>
              </Link>
            ))}
          </div>
        </section>
        <section className="landing-faq" aria-labelledby="landing-faq-title">
          <div>
            <span className="landing-kicker">
              {text("PODE CHEGAR, SEM PRESSA", "MAKE YOURSELF AT HOME", "AQUÍ, SIN PRISAS")}
            </span>
            <h2 id="landing-faq-title">
              {text("Antes de começar…", "Before you begin…", "Antes de empezar…")}
            </h2>
            <p>
              {text(
                "Um espaço para aprender com leveza, com um passo claro de cada vez.",
                "A comfortable space to learn, with one clear step at a time.",
                "Un espacio para aprender con calma, un paso a la vez.",
              )}
            </p>
          </div>
          <div>
            {[
              [
                text(
                  "Preciso saber o idioma para começar?",
                  "Do I need any experience?",
                  "¿Necesito saber el idioma?",
                ),
                text(
                  "Não. Comece pelas primeiras lições e avance no seu ritmo. Você pode trocar o idioma de estudo nas configurações.",
                  "No. Start with the first lessons and go at your pace. You can change your learning language in settings.",
                  "No. Empieza con las primeras lecciones y avanza a tu ritmo. Puedes cambiar el idioma en ajustes.",
                ),
              ],
              [
                text(
                  "Como funciona a conversa com o Lume?",
                  "How does conversation practice work?",
                  "¿Cómo funciona la conversación?",
                ),
                text(
                  "Você escolhe um tema e segue cenários guiados, com frases de apoio e ajustes de escrita. É uma prática estruturada para complementar seus estudos.",
                  "Choose a topic and follow guided scenarios with sample phrases and writing tips. It is structured practice to support your studies.",
                  "Elige un tema y sigue escenarios guiados, con frases de apoyo y ajustes de escritura para complementar tus estudios.",
                ),
              ],
              [
                text(
                  "Posso usar no celular e no computador?",
                  "Can I use it on my phone and computer?",
                  "¿Puedo usarlo en el móvil y el ordenador?",
                ),
                text(
                  "Sim. Entre na mesma conta para continuar seu progresso em outra tela. Você também pode adicionar o Lume à tela inicial do celular.",
                  "Yes. Sign in to the same account to continue on another screen. You can also add Lume to your phone’s home screen.",
                  "Sí. Inicia sesión con la misma cuenta para continuar en otra pantalla. También puedes añadir Lume a la pantalla de inicio.",
                ),
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="lume-landing-invite">
          <h2>
            {text(
              "Uma conversa de cada vez.",
              "One conversation at a time.",
              "Una conversación a la vez.",
            )}
          </h2>
          <p>{t("landing:featureCalmDesc")}</p>
          <Link to="/signup" className="btn-premium">
            {t("landing:ctaStart")}
          </Link>
        </section>
      </main>
      <footer className="lume-landing-footer">
        <strong>Lume</strong>
        <nav aria-label={text("Links do rodapé", "Footer links", "Enlaces del pie")}>
          <Link to="/guide">{t("common:guide")}</Link>
          <Link to="/lessons">{t("common:lessons")}</Link>
          <Link to="/login">{t("common:practice")}</Link>
        </nav>
        <span>Learn. Play. Grow.</span>
      </footer>
    </div>
  );
}
