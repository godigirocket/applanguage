import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { RefreshCw, ArrowLeft, CheckCircle } from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
});

function RefundPage() {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

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
          <RefreshCw size={32} color="var(--brand)" />
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "var(--text-primary)" }}>
            {isPT ? "Política de Reembolso" : "Refund Policy"}
          </h1>
        </div>

        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "40px" }}>
          {isPT ? "Última atualização: 25 de junho de 2026" : "Last updated: June 25, 2026"}
        </p>

        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: "20px",
            padding: "40px",
            border: "1.5px solid var(--border)",
            marginBottom: "32px",
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
            {isPT ? "Garantia de 7 Dias" : "7-Day Guarantee"}
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            {isPT
              ? "Oferecemos uma garantia de reembolso total de 7 dias para todas as novas assinaturas. Se você não estiver satisfeito com a plataforma, devolveremos 100% do valor pago, sem perguntas."
              : "We offer a full refund guarantee of 7 days for all new subscriptions. If you are not satisfied with the platform, we will refund 100% of the amount paid, no questions asked."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              padding: "20px",
              background: "rgba(76, 175, 80, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(76, 175, 80, 0.3)",
            }}
          >
            <CheckCircle size={24} color="#4CAF50" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 700 }}>
                {isPT ? "Reembolso rápido e sem burocracia" : "Fast refund without bureaucracy"}
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {isPT
                  ? "Processamos reembolsos em até 5 dias úteis após a solicitação."
                  : "We process refunds within 5 business days after the request."}
              </p>
            </div>
          </div>
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
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            {isPT ? "Como Solicitar Reembolso" : "How to Request a Refund"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Step
              number="1"
              title={isPT ? "Acesse o Suporte" : "Access Support"}
              description={
                isPT
                  ? "Entre em contato através da página de Suporte ou envie um email para suporte@lume.app"
                  : "Contact us through the Support page or send an email to support@lume.app"
              }
            />
            <Step
              number="2"
              title={isPT ? "Informe seus Dados" : "Provide Your Information"}
              description={
                isPT
                  ? "Inclua seu email de cadastro e número do pedido (se disponível)"
                  : "Include your registration email and order number (if available)"
              }
            />
            <Step
              number="3"
              title={isPT ? "Aguarde Confirmação" : "Wait for Confirmation"}
              description={
                isPT
                  ? "Nossa equipe processará sua solicitação em até 24 horas úteis"
                  : "Our team will process your request within 24 business hours"
              }
            />
            <Step
              number="4"
              title={isPT ? "Receba o Reembolso" : "Receive the Refund"}
              description={
                isPT
                  ? "O valor será estornado para o mesmo método de pagamento usado na compra"
                  : "The amount will be refunded to the same payment method used in the purchase"
              }
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            background: "rgba(255, 152, 0, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 152, 0, 0.3)",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600 }}>
            {isPT ? "Importante:" : "Important:"}
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
            {isPT
              ? "A garantia de reembolso é válida apenas para a primeira compra. Renovações automáticas não são elegíveis para reembolso após o período de garantia."
              : "The refund guarantee is valid only for the first purchase. Automatic renewals are not eligible for refund after the guarantee period."}
          </p>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            to="/support"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "12px",
              background: "var(--brand)",
              color: "white",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            {isPT ? "Falar com Suporte" : "Contact Support"}
          </Link>
        </div>
      </main>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "var(--brand)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
