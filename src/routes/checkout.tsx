import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { getPlanDetails, type SubscriptionPlan } from "@/lib/subscription";
import { Lock, Shield, ArrowLeft } from "@/components/lume/CustomIcons";
import { useEffect } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — LumeLearn" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

const CHECKOUT_URL_BY_PLAN: Partial<Record<SubscriptionPlan, string | undefined>> = {
  premium_monthly: "https://cakto.app/AmYjYgH/",
  premium_quarterly: "https://cakto.app/AmYjYgH/",
  premium_annual: "https://cakto.app/AmYjYgH/",
  premium_lifetime: "https://cakto.app/AmYjYgH/",
};

function CheckoutPage() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const search = Route.useSearch() as { plan?: string };
  const planId = (search.plan as SubscriptionPlan) || "premium_monthly";
  const plan = getPlanDetails(planId);
  const checkoutUrl = CHECKOUT_URL_BY_PLAN[planId];

  useEffect(() => {
    // Wait for the auth check to resolve — on a fresh page load (deep link,
    // refresh, bookmark) `user` starts out null before the session loads,
    // which was kicking out already-logged-in users straight to /login.
    if (!authLoading && !user) {
      nav({ to: "/login", search: { redirect: "/pricing" } });
    }
  }, [user, authLoading, nav]);

  const planName = plan ? (isPT ? plan.namePT : isES ? plan.nameES : plan.name) : planId;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <AppHeader />
      <main
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <button
          onClick={() => nav({ to: "/pricing" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            padding: 0,
            alignSelf: "flex-start",
          }}
        >
          <ArrowLeft size={16} /> {isPT ? "Voltar aos planos" : isES ? "Volver a los planes" : "Back to plans"}
        </button>

        <div
          style={{
            background: "var(--card-bg)",
            border: "2px solid var(--border)",
            borderRadius: "20px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--brand)",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <Shield size={16} />
            {isPT ? "Pagamento seguro via Cakto" : isES ? "Pago seguro vía Cakto" : "Secure payment via Cakto"}
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text-primary)" }}>
            {isPT ? "Assinar" : isES ? "Suscribirse" : "Subscribe to"} {planName}
          </h1>

          {plan && (
            <p style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>
              {plan.priceFormatted}
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>
                {plan.interval === "year"
                  ? isPT
                    ? "/ano"
                    : isES
                      ? "/año"
                      : "/year"
                  : isPT
                    ? "/mês"
                    : isES
                      ? "/mes"
                      : "/month"}
              </span>
            </p>
          )}

          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              style={{
                textDecoration: "none",
                textAlign: "center",
                padding: "16px",
                borderRadius: "14px",
                background: "var(--brand)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Lock size={18} />
              {isPT ? "Continuar para pagamento" : isES ? "Continuar al pago" : "Continue to payment"}
            </a>
          ) : (
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "rgba(196,109,75,0.08)",
                border: "1px solid rgba(196,109,75,0.2)",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              {isPT
                ? "Checkout temporariamente indisponível para este plano. Tente novamente em instantes ou fale com o suporte."
                : isES
                  ? "Checkout temporalmente no disponible para este plan. Inténtalo de nuevo o contacta con soporte."
                  : "Checkout is temporarily unavailable for this plan. Please try again shortly or contact support."}
            </div>
          )}

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", margin: 0 }}>
            {isPT
              ? "Você será redirecionado para o ambiente seguro da Cakto para concluir o pagamento."
              : isES
                ? "Serás redirigido al entorno seguro de Cakto para completar el pago."
                : "You'll be redirected to Cakto's secure checkout to complete payment."}
          </p>
        </div>
      </main>
    </div>
  );
}
