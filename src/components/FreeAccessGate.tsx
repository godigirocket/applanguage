import { Link } from "@tanstack/react-router";
import { Clock, Sparkles } from "@/components/lume/CustomIcons";

export function FreeAccessGate({ language }: { language: "pt" | "en" | "es" }) {
  const copy = language === "pt"
    ? { eyebrow: "Pausa de hoje", title: "Seus 20 minutos terminaram.", body: "Amanhã sua prática gratuita volta. Para continuar agora, escolha um plano.", action: "Ver planos", later: "Voltar amanhã" }
    : language === "es"
      ? { eyebrow: "Pausa de hoy", title: "Tus 20 minutos terminaron.", body: "Tu práctica gratuita vuelve mañana. Para continuar ahora, elige un plan.", action: "Ver planes", later: "Volver mañana" }
      : { eyebrow: "Today's pause", title: "Your 20 minutes are complete.", body: "Your free practice returns tomorrow. Choose a plan to keep going now.", action: "See plans", later: "Come back tomorrow" };
  return (
    <div className="lume-free-access-layer" role="dialog" aria-modal="true" aria-label={copy.title}>
      <section className="lume-free-access-card">
        <span className="lume-free-access-icon"><Clock size={23} /></span>
        <span className="lume-free-access-eyebrow"><Sparkles size={14} /> {copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        <Link to="/pricing" className="lume-free-access-action">{copy.action}</Link>
        <span className="lume-free-access-later">{copy.later}</span>
      </section>
    </div>
  );
}
