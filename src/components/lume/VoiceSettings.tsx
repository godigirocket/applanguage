import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { isTTSSupported, speak, stopSpeaking } from "@/lib/language-apis/webSpeech";

export function VoiceSettings({
  language,
  ui,
}: {
  language: "en" | "es" | "pt";
  ui: "en" | "es" | "pt";
}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState("");
  const [supported, setSupported] = useState(false);
  const text = (pt: string, en: string, es: string) => (ui === "pt" ? pt : ui === "es" ? es : en);
  useEffect(() => {
    try {
      setSelected(localStorage.getItem(`lume_voice_${language}`) ?? "");
    } catch {
      setSelected("");
    }
    setSupported(isTTSSupported());
    if (!isTTSSupported()) return;
    const update = () =>
      setVoices(
        window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(language)),
      );
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", update);
      stopSpeaking();
    };
  }, [language]);
  return (
    <section className="lume-voice-settings">
      <div className="voice-settings-heading">
        <Volume2 size={22} />
        <h2>
          {text("Uma voz que combina com você", "A voice that suits you", "Una voz que va contigo")}
        </h2>
      </div>
      <p>
        {text(
          "Priorizamos as vozes naturais disponíveis. A oferta varia conforme o celular e o navegador; experimente e escolha a sua favorita.",
          "We prioritize available natural voices. Your phone and browser determine the options; listen and choose your favorite.",
          "Priorizamos las voces naturales disponibles. Las opciones dependen del móvil y el navegador; escucha y elige tu favorita.",
        )}
      </p>
      <p>
        {text(
          "Algumas palavras usam gravações humanas. A escolha abaixo vale para a leitura automática; uma voz escolhida manualmente também substitui as gravações.",
          "Some words use human recordings. The choice below controls automatic reading; a manually selected voice also overrides recordings.",
          "Algunas palabras usan grabaciones humanas. La opción siguiente controla la lectura automática; una voz elegida manualmente también sustituye las grabaciones.",
        )}{" "}
        <a href="/audio/credits.html" target="_blank" rel="noreferrer">
          {text("Créditos dos áudios", "Audio credits", "Créditos de audio")}
        </a>
      </p>
      <label htmlFor="lume-voice">
        {text("Voz de leitura", "Reading voice", "Voz de lectura")}
      </label>
      <select
        id="lume-voice"
        value={voices.some((v) => v.voiceURI === selected) ? selected : ""}
        onChange={(event) => {
          const value = event.target.value;
          setSelected(value);
          try {
            localStorage.setItem(`lume_voice_${language}`, value);
          } catch {
            /* Keep the control usable without storage. */
          }
        }}
      >
        <option value="">
          {text(
            "Automática · melhor voz disponível",
            "Automatic · best available voice",
            "Automática · mejor voz disponible",
          )}
        </option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name} · {v.lang}
          </option>
        ))}
      </select>
      <button
        className="voice-preview"
        disabled={!supported}
        onClick={() =>
          speak(
            language === "pt"
              ? "Olá! Vamos aprender algo novo hoje?"
              : language === "es"
                ? "¡Hola! ¿Aprendemos algo nuevo hoy?"
                : "Hello! Let’s learn something new today.",
            language,
          )
        }
      >
        <Volume2 size={18} />
        {text("Ouvir exemplo", "Listen to a sample", "Escuchar ejemplo")}
      </button>
    </section>
  );
}
