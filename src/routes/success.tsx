import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { CheckCircle, Sparkles, ArrowRight, RefreshCw } from "@/components/lume/CustomIcons";
import { CharacterCelebrating } from "@/components/lume/LumeCharacters";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const { interfaceLanguage } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPT = interfaceLanguage === "pt";
  const [premiumStatus, setPremiumStatus] = useState<"checking" | "active" | "pending">("checking");

  useEffect(() => {
    // Confetti effect
    if (typeof window !== "undefined" && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, []);

  // Check premium status in real-time
  useEffect(() => {
    if (!user) {
      setPremiumStatus("pending");
      return;
    }

    async function checkPremiumStatus() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user!.id)
          .single();

        if (error) {
          console.error("[Success] Error checking premium:", error);
          setPremiumStatus("pending");
          return;
        }

        if (data?.plan === "premium") {
          setPremiumStatus("active");
        } else {
          setPremiumStatus("pending");
        }
      } catch (err) {
        console.error("[Success] Failed to check premium:", err);
        setPremiumStatus("pending");
      }
    }

    checkPremiumStatus();

    // Poll every 5 seconds for premium activation
    const interval = setInterval(checkPremiumStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

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
            background: "linear-gradient(135deg, #4CAF50, #ff7a45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 10px 30px rgba(76, 175, 80, 0.3)",
          }}
        >
          <CheckCircle size={48} color="white" />
        </div>

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          {isPT ? "Pagamento Recebido!" : "Payment Received!"}
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
            ? "Obrigado por escolher o Lume! Seu pagamento foi confirmado com sucesso."
            : "Thank you for choosing Lume! Your payment has been confirmed successfully."}
        </p>

        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
          <div style={{ transform: "scale(0.8)" }}>
            <CharacterCelebrating />
          </div>
        </div>

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
          {/* Premium Status Indicator */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "12px",
              background:
                premiumStatus === "active"
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(201, 168, 76, 0.1)",
              border: `1px solid ${
                premiumStatus === "active"
                  ? "rgba(76, 175, 80, 0.3)"
                  : "rgba(201, 168, 76, 0.3)"
              }`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {premiumStatus === "checking" && (
              <>
                <RefreshCw size={20} color="var(--brand)" />
                <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600 }}>
                  {isPT ? "Verificando status..." : "Checking status..."}
                </span>
              </>
            )}
            {premiumStatus === "active" && (
              <>
                <CheckCircle size={20} color="#4CAF50" />
                <span style={{ fontSize: "14px", color: "#4CAF50", fontWeight: 700 }}>
                  {isPT ? "✅ Premium Ativado!" : "✅ Premium Activated!"}
                </span>
              </>
            )}
            {premiumStatus === "pending" && (
              <>
                <span style={{ fontSize: "20px" }}>⏳</span>
                <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600 }}>
                  {isPT ? "Processando pagamento..." : "Processing payment..."}
                </span>
              </>
            )}
          </div>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={24} color="var(--brand)" />
            {isPT ? "Próximos Passos" : "Next Steps"}
          </h2>

          <ol style={{ paddingLeft: "24px", margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Sua conta Premium será ativada automaticamente nos próximos minutos."
                : "Your Premium account will be activated automatically in the next few minutes."}
            </li>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Você receberá um email de confirmação com os detalhes da sua assinatura."
                : "You will receive a confirmation email with your subscription details."}
            </li>
            <li style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {isPT
                ? "Acesse todas as lições, jogos e conteúdo premium imediatamente."
                : "Access all lessons, games and premium content immediately."}
            </li>
          </ol>
        </div>

        <div
          style={{
            padding: "20px",
            background: "rgba(201, 168, 76, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(201, 168, 76, 0.3)",
            marginBottom: "40px",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-primary)", margin: 0 }}>
            {isPT
              ? "Caso sua conta não seja atualizada automaticamente em até 10 minutos, entre em contato com o suporte."
              : "If your account is not updated automatically within 10 minutes, please contact support."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate({ to: "/home" })}
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
            {isPT ? "Começar Agora" : "Start Now"}
            <ArrowRight size={20} />
          </button>

          <Link
            to="/support"
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              background: "var(--surface-raised)",
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: 700,
              border: "1.5px solid var(--border)",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {isPT ? "Falar com Suporte" : "Contact Support"}
          </Link>
        </div>
      </main>
    </div>
  );
}
