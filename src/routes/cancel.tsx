import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { AlertTriangle, ArrowLeft, RefreshCw } from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/cancel")({
  component: CancelPage,
});

function CancelPage() {
  const { interfaceLanguage } = useStore();
  const navigate = useNavigate();
  const isPT = interfaceLanguage === "pt";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 152, 0, 0.1)",
            border: "2px solid rgba(255, 152, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <AlertTriangle size={48} color="#FF9800" />
        </div>

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          {isPT ? "Pagamento Cancelado" : "Payment Cancelled"}
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            marginBottom: "40px",
            lineHeight: 1.6,
          }}
        >
          {isPT
            ? "Seu pagamento não foi concluído. Nenhuma cobrança foi realizada."
            : "Your payment was not completed. No charges were made."}
        </p>

        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: "20px",
            padding: "32px",
            border: "1.5px solid var(--border)",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "20px",
            }}
          >
            {isPT ? "O que aconteceu?" : "What happened?"}
          </h2>

          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
            {isPT
              ? "O processo de pagamento foi cancelado antes da conclusão. Isso pode acontecer se você:"
              : "The payment process was cancelled before completion. This can happen if you:"}
          </p>

          <ul style={{ paddingLeft: "24px", margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Clicou no botão 'Voltar' durante o checkout"
                : "Clicked the 'Back' button during checkout"}
            </li>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Fechou a janela de pagamento antes de finalizar"
                : "Closed the payment window before completing"}
            </li>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Optou por não concluir a compra no momento"
                : "Chose not to complete the purchase at this time"}
            </li>
          </ul>
        </div>

        <div
          style={{
            padding: "20px",
            background: "rgba(45, 74, 62, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(45, 74, 62, 0.3)",
            marginBottom: "40px",
          }}
        >
          <p style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 700, marginBottom: "8px" }}>
            {isPT ? "Nenhuma cobrança foi realizada" : "No charges were made"}
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            {isPT
              ? "Sua forma de pagamento não foi cobrada. Você pode tentar novamente quando quiser."
              : "Your payment method was not charged. You can try again whenever you want."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate({ to: "/pricing" })}
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              background: "var(--brand)",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <RefreshCw size={20} />
            {isPT ? "Tentar Novamente" : "Try Again"}
          </button>

          <button
            onClick={() => navigate({ to: "/home" })}
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              background: "var(--surface-raised)",
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: 700,
              border: "1.5px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {isPT ? "Voltar ao Início" : "Back to Home"}
          </button>
        </div>

        <div style={{ marginTop: "32px" }}>
          <Link
            to="/support"
            style={{
              color: "var(--brand)",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {isPT ? "Precisa de ajuda? Fale com o suporte →" : "Need help? Contact support →"}
          </Link>
        </div>
      </main>
    </div>
  );
}
