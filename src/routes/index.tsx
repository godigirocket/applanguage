import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  Gamepad2,
  Globe2,
  Headphones,
  MessageCircle,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AppHeader } from "@/components/lume/AppHeader";
import { FlagByEmoji } from "@/components/lume/Flags";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/hooks/useStore";
import { useClientReady } from "@/hooks/useClientReady";
import { speak, stopSpeaking } from "@/lib/language-apis/webSpeech";
import { productEvent } from "@/lib/product-metrics";
import "@/components/lume/landing.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Langlume — Seu próximo idioma começa aqui" },
      {
        name: "description",
        content:
          "Experimente uma lição de inglês, espanhol ou português. Aprenda com jogos, conversa guiada e uma trilha que continua de onde você parou.",
      },
    ],
  }),
  component: Landing,
});

type Copy = (pt: string, en: string, es: string) => string;
const examples = {
  en: {
    flag: "🇺🇸",
    label: "English",
    word: "water",
    correct: 0,
    options: [
      ["Água", "Water", "Agua"],
      ["Café", "Coffee", "Café"],
      ["Pão", "Bread", "Pan"],
    ],
  },
  es: {
    flag: "🇪🇸",
    label: "Español",
    word: "reserva",
    correct: 1,
    options: [
      ["Passagem", "Ticket", "Billete"],
      ["Reserva", "Reservation", "Reserva"],
      ["Bagagem", "Luggage", "Equipaje"],
    ],
  },
  pt: {
    flag: "🇧🇷",
    label: "Português",
    word: "bagagem",
    correct: 2,
    options: [
      ["Passagem", "Ticket", "Billete"],
      ["Passaporte", "Passport", "Pasaporte"],
      ["Bagagem", "Luggage", "Equipaje"],
    ],
  },
} as const;
type Course = keyof typeof examples;

function LandingDemo({ t, locale }: { t: Copy; locale: string }) {
  const ready = useClientReady();
  const [course, setCourse] = useState<Course>("en");
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "retry" | null>(null);
  const [audioError, setAudioError] = useState(false);
  const item = examples[course];
  // Translate into a different language even when the interface matches the course.
  const answerLocale =
    locale === course ? (course === "en" ? 0 : 1) : locale === "en" ? 1 : locale === "es" ? 2 : 0;
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="lp-stage" id="experimentar" tabIndex={-1} data-result={result || undefined}>
      <div className="lp-stage-top">
        <span>
          <Sparkles size={15} /> {t("PRÁTICA EXPRESSA", "QUICK PRACTICE", "PRÁCTICA RÁPIDA")}
        </span>
        <span>01 / 01</span>
      </div>
      <div className="lp-demo">
        <div
          className="lp-demo-languages"
          role="group"
          aria-label={t("Idioma da demonstração", "Demo language", "Idioma de la demostración")}
        >
          {(Object.keys(examples) as Course[]).map((key) => (
            <button
              key={key}
              type="button"
              disabled={!ready}
              aria-pressed={course === key}
              onClick={() => {
                stopSpeaking();
                setCourse(key);
                setSelected(null);
                setResult(null);
                setAudioError(false);
              }}
            >
              <FlagByEmoji emoji={examples[key].flag} size={17} /> {examples[key].label}
            </button>
          ))}
        </div>
        <div className="lp-prompt">
          <img src="/brand/lume-companion.webp" width="86" height="86" alt="" decoding="async" />
          <div>
            <p>{t("Qual é a tradução?", "What is the translation?", "¿Cuál es la traducción?")}</p>
            <div className="lp-word">
              <strong lang={course}>{item.word}</strong>
              <button
                type="button"
                disabled={!ready}
                aria-label={t("Ouvir palavra", "Listen to word", "Escuchar palabra")}
                onClick={() => {
                  setAudioError(false);
                  if (!speak(item.word, course, { onError: () => setAudioError(true) }))
                    setAudioError(true);
                }}
              >
                <Volume2 size={19} />
              </button>
            </div>
          </div>
        </div>
        {audioError && (
          <p role="status" className="lp-feedback">
            {t(
              "O áudio não está disponível neste navegador.",
              "Audio is unavailable in this browser.",
              "El audio no está disponible en este navegador.",
            )}
          </p>
        )}
        <div
          className="lp-options"
          role="group"
          aria-label={t("Respostas", "Answers", "Respuestas")}
        >
          {item.options.map((option, i) => (
            <button
              type="button"
              key={i}
              lang={["pt", "en", "es"][answerLocale]}
              aria-pressed={selected === i}
              disabled={!ready || result === "correct"}
              onClick={() => {
                setSelected(i);
                setResult(null);
              }}
            >
              {option[answerLocale]}
            </button>
          ))}
        </div>
        <div className="lp-demo-action">
          {result === "correct" ? (
            <Link
              to="/signup"
              search={{ course }}
              className="lp-button"
              onClick={() => productEvent("landing_signup", { placement: "demo" })}
            >
              {t("Quero continuar", "Keep learning", "Quiero continuar")} <ArrowRight size={17} />
            </Link>
          ) : (
            <button
              type="button"
              className="lp-button"
              disabled={selected === null || result === "retry"}
              onClick={() => {
                const correct = selected === item.correct;
                setResult(correct ? "correct" : "retry");
                productEvent("landing_demo_answer", {
                  course,
                  result: correct ? "correct" : "retry",
                });
              }}
            >
              {t("Verificar", "Check answer", "Comprobar")} <ArrowRight size={17} />
            </button>
          )}
          <p role="status" className="lp-feedback">
            {result === "correct"
              ? t(
                  "Acertou! Sua primeira palavra já entrou na bagagem.",
                  "Correct! Your first word is packed.",
                  "¡Correcto! Ya tienes tu primera palabra.",
                )
              : result === "retry"
                ? t(
                    "Quase! Escolha outra resposta.",
                    "Almost! Pick another answer.",
                    "¡Casi! Elige otra respuesta.",
                  )
                : t(
                    "Demonstração sem cadastro",
                    "Try it without signing up",
                    "Prueba sin registrarte",
                  )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = useStore((state) => state.interfaceLanguage);
  const t: Copy = (pt, en, es) => (lang === "en" ? en : lang === "es" ? es : pt);
  useEffect(() => {
    if (user) void navigate({ to: "/home", replace: true });
  }, [user, navigate]);
  const features = [
    {
      style: "path",
      art: (
        <>
          <span>
            <Check />
          </span>
          <span>
            <BookOpen />
          </span>
          <span>
            <Headphones />
          </span>
        </>
      ),
      title: t("Uma lição de cada vez", "One lesson at a time", "Una lección a la vez"),
      body: t(
        "Leia, escute e monte frases em uma trilha que guarda seu progresso.",
        "Read, listen and build sentences in a path that saves your progress.",
        "Lee, escucha y construye frases en una ruta que guarda tu progreso.",
      ),
    },
    {
      style: "chat",
      art: (
        <>
          <span>Where is the station?</span>
          <span>
            It’s on the left. <MessageCircle size={15} />
          </span>
        </>
      ),
      title: t(
        "Frases para usar de verdade",
        "Phrases you'll actually use",
        "Frases que sí usarás",
      ),
      body: t(
        "Ensaie situações de viagem, trabalho e cotidiano em conversas guiadas.",
        "Rehearse travel, work and everyday situations in guided conversations.",
        "Ensaya situaciones de viaje, trabajo y del día a día en conversaciones guiadas.",
      ),
    },
    {
      style: "game",
      art: (
        <>
          <span>
            <Gamepad2 />
          </span>
          <span>
            <Globe2 />
          </span>
          <span>
            <Sparkles />
          </span>
        </>
      ),
      title: t("Revisar pode ser um jogo", "Review can be a game", "Repasar puede ser un juego"),
      body: t(
        "Reveja palavras com quizzes e flashcards. Explore o idioma pela cultura.",
        "Revisit words with quizzes and flashcards. Explore the language through culture.",
        "Repasa palabras con cuestionarios y tarjetas. Explora el idioma a través de la cultura.",
      ),
    },
  ];
  const faq = [
    [
      t(
        "Preciso saber o idioma para começar?",
        "Do I need any experience?",
        "¿Necesito saber el idioma?",
      ),
      t(
        "Não. Comece pelas primeiras lições, com palavras e frases úteis, e avance no seu ritmo.",
        "No. Start with useful words and phrases in the first lessons, then move at your pace.",
        "No. Empieza con palabras y frases útiles y avanza a tu ritmo.",
      ),
    ],
    [
      t("Posso praticar sem pagar?", "Can I practise for free?", "¿Puedo practicar gratis?"),
      t(
        "Sim. A demonstração funciona sem cadastro. Com uma conta gratuita você começa as lições iniciais. Consulte os planos para ver o que o Premium inclui.",
        "Yes. The demo needs no account. A free account lets you start the introductory lessons. See plans for what Premium includes.",
        "Sí. La demo funciona sin registro. Una cuenta gratuita te permite empezar las primeras lecciones. Consulta los planes para ver qué incluye Premium.",
      ),
    ],
    [
      t(
        "Meu progresso passa para outro aparelho?",
        "Can I continue on another device?",
        "¿Puedo continuar en otro dispositivo?",
      ),
      t(
        "Sim. Entre na mesma conta para sincronizar lições, quizzes, palavras salvas e revisões.",
        "Yes. Use the same account to sync lessons, quizzes, saved words and reviews.",
        "Sí. Usa la misma cuenta para sincronizar lecciones, cuestionarios, palabras guardadas y repasos.",
      ),
    ],
  ];
  return (
    <div className="lume-fast-landing lp">
      <AppHeader />
      <main className="lp-main">
        <section className="lume-landing-hero lp-hero" aria-labelledby="lp-title">
          <div className="lp-copy">
            <span className="lp-kicker">
              <Sparkles size={16} />{" "}
              {t(
                "SEU PASSAPORTE PARA OUTRO IDIOMA",
                "YOUR PASSPORT TO A NEW LANGUAGE",
                "TU PASAPORTE A OTRO IDIOMA",
              )}
            </span>
            <h1 id="lp-title">
              {t("Poucos minutos.", "A few minutes.", "Pocos minutos.")}
              <br />
              <em>{t("Muitos lugares.", "A world of places.", "Muchos lugares.")}</em>
            </h1>
            <p>
              {t(
                "Aprenda inglês, espanhol ou português com lições curtas, jogos e conversas que preparam você para situações reais.",
                "Learn English, Spanish or Portuguese with short lessons, games and guided conversations for real situations.",
                "Aprende inglés, español o portugués con lecciones cortas, juegos y conversaciones para situaciones reales.",
              )}
            </p>
            <div className="lp-actions">
              <Link
                to="/signup"
                className="lp-button"
                onClick={() => productEvent("landing_signup", { placement: "hero" })}
              >
                {t("Começar grátis", "Start for free", "Empieza gratis")} <ArrowRight size={19} />
              </Link>
              <a href="#experimentar" className="lp-secondary">
                {t("Testar uma lição", "Try a lesson", "Probar una lección")}{" "}
                <ArrowDown size={17} />
              </a>
            </div>
            <div className="lp-reassurance">
              <Check size={17} />{" "}
              {t(
                "Do celular ao computador, no seu ritmo.",
                "On your phone or computer, at your pace.",
                "En móvil u ordenador, a tu ritmo.",
              )}
            </div>
          </div>
          <LandingDemo t={t} locale={lang} />
        </section>
        <div className="lp-language-bar">
          <span>
            {t(
              "TRÊS IDIOMAS PARA EXPLORAR",
              "THREE LANGUAGES TO EXPLORE",
              "TRES IDIOMAS PARA EXPLORAR",
            )}
          </span>
          {Object.values(examples).map((item) => (
            <span key={item.label}>
              <FlagByEmoji emoji={item.flag} size={24} /> {item.label}
            </span>
          ))}
        </div>
        <section className="lp-section" aria-labelledby="lp-method">
          <div className="lp-section-heading">
            <span className="lp-kicker">
              {t(
                "DO PRIMEIRO OLÁ À PRÓXIMA CONVERSA",
                "FROM YOUR FIRST HELLO",
                "DESDE EL PRIMER HOLA",
              )}
            </span>
            <h2 id="lp-method">
              {t("Aprenda fazendo.", "Learn by doing.", "Aprende practicando.")}
            </h2>
            <p>
              {t(
                "Uma trilha diz o que vem depois. Você escolhe quando dar o próximo passo.",
                "A learning path shows what's next. You decide when to take the next step.",
                "Una ruta te indica lo que sigue. Tú decides cuándo dar el próximo paso.",
              )}
            </p>
          </div>
          <div className="lp-features">
            {features.map((f) => (
              <article key={f.style} className="lp-feature">
                <div className={"lp-feature-art lp-art-" + f.style} aria-hidden="true">
                  {f.art}
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="lp-offer" aria-labelledby="lp-offer-title">
          <div>
            <span className="lp-kicker">{t("COMECE HOJE", "START TODAY", "EMPIEZA HOY")}</span>
            <h2 id="lp-offer-title">
              {t(
                "A próxima palavra é sua.",
                "The next word is yours.",
                "La próxima palabra es tuya.",
              )}
            </h2>
            <p>
              {t(
                "Abra sua conta gratuita para começar a trilha. Quando quiser ir além das primeiras lições, compare as opções do Premium.",
                "Create a free account to start the path. When you're ready to go beyond the first lessons, compare Premium options.",
                "Crea tu cuenta gratuita para empezar la ruta. Cuando quieras seguir más allá de las primeras lecciones, compara las opciones de Premium.",
              )}
            </p>
          </div>
          <div className="lp-offer-actions">
            <Link
              to="/signup"
              className="lp-button"
              onClick={() => productEvent("landing_signup", { placement: "offer" })}
            >
              {t("Criar conta grátis", "Create free account", "Crear cuenta gratis")}{" "}
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/pricing"
              className="lp-secondary"
              onClick={() => productEvent("landing_pricing", { placement: "offer" })}
            >
              {t("Ver planos Premium", "See Premium plans", "Ver planes Premium")}
            </Link>
          </div>
        </section>
        <section className="landing-faq lp-faq" aria-labelledby="lp-faq-title">
          <div>
            <span className="lp-kicker">
              {t("SEM DÚVIDAS NA BAGAGEM", "BEFORE YOU GO", "ANTES DE VIAJAR")}
            </span>
            <h2 id="lp-faq-title">
              {t("Antes de começar", "Before you start", "Antes de empezar")}
            </h2>
          </div>
          <div>
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="lp-footer">
        <strong>Langlume</strong>
        <nav aria-label={t("Links do rodapé", "Footer links", "Enlaces del pie")}>
          <Link to="/login">{t("Entrar", "Sign in", "Iniciar sesión")}</Link>
          <Link to="/guide">{t("Guia", "Guide", "Guía")}</Link>
          <Link to="/terms">{t("Termos", "Terms", "Términos")}</Link>
          <Link to="/refund">{t("Reembolsos", "Refunds", "Reembolsos")}</Link>
          <Link to="/support">{t("Suporte", "Support", "Soporte")}</Link>
        </nav>
      </footer>
    </div>
  );
}
