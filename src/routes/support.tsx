import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { MessageCircle, Send, Clock, ArrowLeft } from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

function SupportPage() {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const supportEmail = "suporte@lume.app";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={16} />
          {isPT ? "Voltar ao início" : "Back to home"}
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <MessageCircle size={32} color="var(--brand)" />
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "var(--text-primary)" }}>
            {isPT ? "Suporte" : "Support"}
          </h1>
        </div>

        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "40px", lineHeight: 1.6 }}>
          {isPT
            ? "Estamos aqui para ajudar! Entre em contato e responderemos o mais rápido possível."
            : "We're here to help! Get in touch and we'll respond as soon as possible."}
        </p>

        <div style={{ display: "grid", gap: "24px", marginBottom: "40px" }}>
          <ContactCard
            icon={<Send size={24} color="var(--brand)" />}
            title={isPT ? "Email de Suporte" : "Support Email"}
            description={supportEmail}
            action={
              <a
                href={`mailto:${supportEmail}`}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "var(--brand)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {isPT ? "Enviar Email" : "Send Email"}
              </a>
            }
          />

          <ContactCard
            icon={<Clock size={24} color="var(--brand)" />}
            title={isPT ? "Tempo de Resposta" : "Response Time"}
            description={
              isPT
                ? "Respondemos em até 24 horas úteis. Para questões urgentes, mencione 'URGENTE' no assunto."
                : "We respond within 24 business hours. For urgent matters, mention 'URGENT' in the subject."
            }
          />
        </div>

        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: "20px",
            padding: "40px",
            border: "1.5px solid var(--border)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "20px",
            }}
          >
            {isPT ? "Dúvidas Frequentes" : "Frequently Asked Questions"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <FAQ
              question={isPT ? "Como faço para atualizar meu plano?" : "How do I upgrade my plan?"}
              answer={
                isPT
                  ? "Acesse a página de Planos e selecione o plano Premium. Você será redirecionado para o checkout seguro."
                  : "Go to the Plans page and select the Premium plan. You'll be redirected to the secure checkout."
              }
            />

            <FAQ
              question={isPT ? "Posso cancelar a qualquer momento?" : "Can I cancel anytime?"}
              answer={
                isPT
                  ? "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais."
                  : "Yes! You can cancel your subscription at any time without additional fees."
              }
            />

            <FAQ
              question={
                isPT ? "Como funciona a garantia de reembolso?" : "How does the refund guarantee work?"
              }
              answer={
                isPT
                  ? "Oferecemos garantia de 7 dias para novas assinaturas. Solicite o reembolso através do suporte."
                  : "We offer a 7-day guarantee for new subscriptions. Request a refund through support."
              }
            />

            <FAQ
              question={
                isPT ? "Meu progresso é salvo automaticamente?" : "Is my progress saved automatically?"
              }
              answer={
                isPT
                  ? "Sim! Todo seu progresso é salvo automaticamente na nuvem. Você pode acessar de qualquer dispositivo."
                  : "Yes! All your progress is automatically saved to the cloud. You can access it from any device."
              }
            />

            <FAQ
              question={
                isPT
                  ? "Posso usar em múltiplos dispositivos?"
                  : "Can I use it on multiple devices?"
              }
              answer={
                isPT
                  ? "Sim! Você pode acessar sua conta em até 3 dispositivos simultaneamente."
                  : "Yes! You can access your account on up to 3 devices simultaneously."
              }
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "rgba(255,122,69, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,122,69, 0.3)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 700 }}>
            {isPT ? "Não encontrou o que procura?" : "Didn't find what you're looking for?"}
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
            {isPT
              ? "Envie um email para suporte@lume.app com sua dúvida."
              : "Send an email to support@lume.app with your question."}
          </p>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            to="/guide"
            style={{
              color: "var(--brand)",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {isPT ? "Ver Guia Completo →" : "View Complete Guide →"}
          </Link>
        </div>
      </main>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "16px",
        padding: "24px",
        border: "1.5px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
        {question}
      </h3>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {answer}
      </p>
    </div>
  );
}
