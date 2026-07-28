import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  Mic,
  Sliders,
  Play,
  Smartphone,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

interface FAQItem {
  id: string;
  qEN: string;
  qPT: string;
  qES: string;
  aEN: string;
  aPT: string;
  aES: string;
}

const FAQS: FAQItem[] = [
  {
    id: "what-is-lume",
    qEN: "What makes Lume different from other language apps?",
    qPT: "O que torna o Lume diferente de outros aplicativos de idiomas?",
    qES: "¿Qué hace a Lume diferente de otras aplicaciones de idiomas?",
    aEN: "Lume prioritizes cultural authenticity, regional accents, and human-like voice interaction over simple multiple-choice drills. Inspired by neuroaesthetics and boutique design, we believe language learning should be sensory, beautiful, and culturally immersive.",
    aPT: "O Lume prioriza a autenticidade cultural, sotaques regionais e interação de voz humanizada em vez de exercícios repetitivos de múltipla escolha. Inspirados em neuroestética e design boutique, acreditamos que aprender um idioma deve ser sensorial, bonito e culturalmente imersivo.",
    aES: "Lume prioriza la autenticidad cultural, los acentos regionales y la interacción de voz humanizada en lugar de ejercicios repetitivos de opción múltiple. Inspirados en la neuroestética y el diseño boutique, creemos que aprender un idioma debe ser sensorial, hermoso y culturalmente inmersivo.",
  },
  {
    id: "how-xp",
    qEN: "How does the XP system work?",
    qPT: "Como funciona o sistema de XP?",
    qES: "¿Cómo funciona el sistema de XP?",
    aEN: "You earn XP by completing conversations, participating in the Play Arena's 18 game modes, and completing daily challenges. Earning XP advances your level: from Beginner, to Explorer, Conversationalist, Fluent, and finally Native Soul.",
    aPT: "Você ganha XP completando conversas, participando dos 18 modos de jogo na Arena Play e concluindo desafios diários. Acumular XP avança seu nível: de Beginner a Explorer, Conversationalist, Fluent e finalmente Native Soul.",
    aES: "Ganas XP al completar conversaciones, participar en los 18 modos de juego de la Arena Play y completar desafíos diarios. Acumular XP aumenta tu nivel: de Beginner a Explorer, Conversationalist, Fluent y finalmente Native Soul.",
  },
  {
    id: "regional-tts",
    qEN: "How do regional accents and Speech Synthesis work?",
    qPT: "Como funcionam os sotaques regionais e a síntese de voz?",
    qES: "¿Cómo funcionan los acentos regionales y la síntesis de voz?",
    aEN: "When exploring the Culture Hub, each regional slang features specialized Speech Synthesis parameters. Lume automatically adjusts local audio parameters (such as London vs. Scotland, or São Paulo vs. Rio de Janeiro) to guarantee authentic phonetics.",
    aPT: "Ao explorar o Hub Cultural, cada gíria regional apresenta parâmetros especializados de Síntese de Voz. O Lume ajusta automaticamente os parâmetros de áudio locais (como Londres vs. Escócia, ou São Paulo vs. Rio de Janeiro) para garantir uma fonética autêntica.",
    aES: "Al explorar el Hub Cultural, cada jerga regional presenta parámetros especializados de Síntesis de Voz. Lume ajusta automáticamente los parámetros de audio locales (como Londres frente a Escocia, o São Paulo frente a Río de Janeiro) para garantizar una fonética auténtica.",
  },
  {
    id: "save-expr",
    qEN: "How do I save expressions during conversations?",
    qPT: "Como salvo expressões durante as conversas?",
    qES: "¿Cómo guardo expresiones durante las conversaciones?",
    aEN: "Inside the voice-chat dashboard, click the 'Save' button under any interesting phrase sent by the AI. This instantly saves it to your Progress page, complete with context and an active Text-to-Speech pronunciation button.",
    aPT: "Dentro do chat de voz, clique no botão 'Salvar' abaixo de qualquer frase interessante enviada pela IA. Isso a salva instantaneamente em sua página de Progresso, completa com contexto e um botão de pronúncia ativa via voz.",
    aES: "Dentro del chat de voz, haz clic en el botón 'Guardar' debajo de cualquier frase interesante enviada por la IA. Esto la guarda instantáneamente en tu página de Progreso, completa con contexto y un botón de pronunciación activa por voz.",
  },
  {
    id: "mobile-pwa",
    qEN: "Can I install Lume on my mobile device?",
    qPT: "Posso instalar o Lume no meu celular?",
    qES: "¿Puedo instalar Lume en mi móvil?",
    aEN: "Yes! Lume is built as a progressive web app (PWA). You can install it on your device for a full-screen, premium app experience. On iOS, open Safari, tap Share, and select 'Add to Home Screen'. On Android, tap the three dots in Chrome and select 'Install'.",
    aPT: "Sim! O Lume é desenvolvido como um Progressive Web App (PWA). Você pode instalá-lo diretamente no seu dispositivo para ter uma experiência em tela cheia premium. No iOS, abra o Safari, toque em Compartilhar e selecione 'Adicionar à Tela de Início'. No Android, toque nos três pontos no Chrome e selecione 'Instalar'.",
    aES: "¡Sí! Lume está desarrollado como una Progressive Web App (PWA). Puedes instalarla directamente en tu dispositivo para tener una experiencia en pantalla completa premium. En iOS, abre Safari, toca Compartir y selecciona 'Agregar a la pantalla de inicio'. En Android, toca los tres puntos en Chrome y selecciona 'Instalar'.",
  },
  {
    id: "system-lang",
    qEN: "How do I change the system language?",
    qPT: "Como altero o idioma do sistema?",
    qES: "¿Cómo cambio el idioma del sistema?",
    aEN: "You can change the system language (English, Portuguese, Spanish) at any time inside the Profile settings page. This immediately translates the entire dashboard, lesson guidelines, and interactive maps.",
    aPT: "Você pode alterar o idioma do sistema (Inglês, Português, Espanhol) a qualquer momento na página de Perfil. Isso traduz imediatamente todo o painel, diretrizes de lições e mapas interativos.",
    aES: "Puedes cambiar el idioma del sistema (inglés, portugués, español) en cualquier momento en la página de Perfil. Esto traduce inmediatamente todo el panel, las directrices de las lecciones y los mapas interactivos.",
  },
];

function GuidePage() {
  const { interfaceLanguage } = useStore();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const getTranslation = (item: any, keyBase: string) => {
    if (isPT) return item[`${keyBase}PT`] || item[keyBase];
    if (isES) return item[`${keyBase}ES`] || item[keyBase];
    return item[`${keyBase}EN`] || item[keyBase];
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          padding: "48px 16px 40px",
          animation: "pageEnter 0.4s ease forwards",
        }}
      >
        {/* Back Button */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "32px" }}>
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
            {isPT ? "Voltar ao Início" : isES ? "Volver al Inicio" : "Back to Home"}
          </Link>
        </div>

        {/* Editorial Header */}
        <header style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--brand)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                background: "var(--brand)",
                borderRadius: "50%",
              }}
            ></span>
            {isPT ? "Metodologia Lume" : isES ? "Metodología Lume" : "Lume Methodology"}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(36px, 6vw, 56px)",
              marginBottom: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {isPT
              ? "A arte de aprender com elegância."
              : isES
                ? "El arte de aprender con elegancia."
                : "The art of learning with elegance."}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "19px",
              lineHeight: 1.6,
              maxWidth: "640px",
              fontWeight: 500,
            }}
          >
            {isPT
              ? "Esqueça exercícios mecânicos e decoreba de gramática. O Lume une neuroestética, imersão em sotaques reais e o prazer da descoberta cultural."
              : isES
                ? "Olvídese de los ejercicios mecánicos y la memorización de gramática. Lume une la neuroestética, la inmersión en acentos reales y el placer del descubrimiento cultural."
                : "Forget mechanical vocabulary drills and boring grammar tables. Lume blends neuroaesthetics, real accent immersion, and the pure sensory pleasure of cultural discovery."}
          </p>
        </header>

        {/* The Core Pillars */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "56px" }}
        >
          {/* Pillar 1 */}
          <div
            className="glass premium-shadow"
            style={{
              padding: "40px",
              borderRadius: "28px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ color: "var(--brand)", marginBottom: "18px" }}>
              <Mic size={32} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              {isPT
                ? "1. Fale, não apenas digite."
                : isES
                  ? "1. Hable, no sólo escriba."
                  : "1. Speak, don't just type."}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "560px",
              }}
            >
              {isPT
                ? "Nossa interface de conversação foi desenhada para simular diálogos e ligações reais. Use o microfone para falar livremente. O sotaque regional se ajusta para guiar sua confiança e pronúncia."
                : isES
                  ? "Nuestra interfaz de conversación está diseñada para simular diálogos y llamadas reales. Use el micrófono para hablar libremente. El acento regional se ajusta para guiar su confianza y pronunciación."
                  : "Our conversation dashboard is designed to simulate natural, human dialogue. Use the microphone to speak freely. The regional accent adapts in real-time to build your speech confidence and perfect your phonetic flow."}
            </p>
          </div>

          {/* Pillar 2 */}
          <div
            className="glass premium-shadow"
            style={{
              padding: "40px",
              borderRadius: "28px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ color: "var(--accent-green)", marginBottom: "18px" }}>
              <Sliders size={32} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              {isPT
                ? "2. Imersão Cultural Total"
                : isES
                  ? "2. Inmersión Cultural Total"
                  : "2. Total Cultural Immersion"}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "560px",
              }}
            >
              {isPT
                ? "Explore o Culture Hub para clicar em pins reais ao redor do mundo. Conheça pratos típicos, pontos históricos icônicos e gírias audíveis em inglês americano, britânico, espanhol e muito mais."
                : isES
                  ? "Explore el Culture Hub para hacer clic en pins reales de todo el mundo. Conozca platos típicos, monumentos históricos y escuche jerga real en inglés americano, británico, español y más."
                  : "Explore the Culture Hub to interact with regional pins. Discover typical cuisine, historic trivia, and listen to authentic regional slangs in authentic voice outputs."}
            </p>
          </div>

          {/* Pillar 3 */}
          <div
            className="glass premium-shadow"
            style={{
              padding: "40px",
              borderRadius: "28px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ color: "var(--accent-terra)", marginBottom: "18px" }}>
              <BookOpen size={32} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              {isPT
                ? "3. Colecione o Idioma"
                : isES
                  ? "3. Coleccione el Idioma"
                  : "3. Collect the Language"}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "560px",
              }}
            >
              {isPT
                ? "Sempre que descobrir termos curiosos na plataforma, salve-os instantaneamente. Revise-os na página de Progresso e use o botão de áudio dedicado para ouvir sua fonética quantas vezes quiser."
                : isES
                  ? "Cada vez que descubra términos curiosos, guárdelos al instante. Revíselos en la página de Progreso y use el botón de audio dedicado para escuchar su fonética cuántas veces quiera."
                  : "Whenever you discover interesting expressions, save them instantly. Review them inside your Progress hub and tap the active speech audio button to master their pronunciation."}
            </p>
          </div>
        </div>

        {/* Premium FAQ Accordion */}
        <section style={{ marginBottom: "56px" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <HelpCircle size={24} color="var(--brand)" />
            {isPT
              ? "Perguntas Frequentes"
              : isES
                ? "Preguntas Frecuentes"
                : "Frequently Asked Questions"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="glass"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-raised)",
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      border: "none",
                      background: "transparent",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        paddingRight: "16px",
                      }}
                    >
                      {getTranslation(faq, "q")}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          style={{
                            padding: "0 24px 20px",
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                            borderTop: "1px solid var(--border)",
                            paddingTop: "16px",
                          }}
                        >
                          {getTranslation(faq, "a")}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* PWA Installation Guides */}
        <section
          className="glass premium-shadow"
          style={{
            padding: "40px",
            borderRadius: "32px",
            border: "1px solid var(--border)",
            background: "var(--surface-raised)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Smartphone size={24} color="var(--accent-green)" />
            {isPT
              ? "Lume no Celular (PWA)"
              : isES
                ? "Lume en el Móvil (PWA)"
                : "Lume on Mobile (PWA)"}
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: 1.6,
              marginBottom: "28px",
              maxWidth: "600px",
            }}
          >
            {isPT
              ? "Instale o Lume diretamente na tela de início do seu celular para uma experiência de aprendizado fluida, rápida e sem distração de abas do navegador."
              : isES
                ? "Instale Lume directamente en la pantalla de inicio de su móvil para tener una experiencia de aprendizaje fluida, rápida y sin la distracción del navegador."
                : "Install Lume directly onto your device screen for a seamless, blazing-fast learning experience without address bars."}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
              gap: "24px",
            }}
          >
            {/* iOS */}
            <div
              className="glass"
              style={{
                padding: "24px",
                borderRadius: "20px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                iOS (iPhone & iPad)
              </div>
              <ol
                style={{
                  paddingLeft: "16px",
                  margin: 0,
                  fontSize: "13.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <li>
                  {isPT
                    ? "Abra o app no Safari."
                    : isES
                      ? "Abra la app en Safari."
                      : "Open Lume in Safari."}
                </li>
                <li>
                  {isPT
                    ? "Toque no ícone Compartilhar (caixa com seta)."
                    : isES
                      ? "Toque en Compartir (caja con flecha)."
                      : "Tap Share button."}
                </li>
                <li>
                  {isPT
                    ? "Role e clique em 'Tela de Início'."
                    : isES
                      ? "Seleccione 'Añadir a pantalla de inicio'."
                      : "Select 'Add to Home Screen'."}
                </li>
                <li>
                  {isPT
                    ? "Confirme tocando em 'Adicionar'."
                    : isES
                      ? "Toque en 'Añadir'."
                      : "Tap 'Add' to install."}
                </li>
              </ol>
            </div>

            {/* Android */}
            <div
              className="glass"
              style={{
                padding: "24px",
                borderRadius: "20px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Android (Chrome)
              </div>
              <ol
                style={{
                  paddingLeft: "16px",
                  margin: 0,
                  fontSize: "13.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <li>
                  {isPT
                    ? "Abra o Chrome no celular."
                    : isES
                      ? "Abra Chrome en su móvil."
                      : "Open Chrome on your phone."}
                </li>
                <li>
                  {isPT
                    ? "Toque nos 3 pontos de menu."
                    : isES
                      ? "Toque en los 3 puntos de menú."
                      : "Tap the 3 dots menu."}
                </li>
                <li>
                  {isPT
                    ? "Clique em 'Instalar aplicativo'."
                    : isES
                      ? "Seleccione 'Instalar aplicación'."
                      : "Select 'Install app'."}
                </li>
                <li>
                  {isPT
                    ? "Confirme para finalizar."
                    : isES
                      ? "Confirme para finalizar."
                      : "Confirm to complete."}
                </li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
