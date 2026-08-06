import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { PLANS, type SubscriptionPlan } from "@/lib/subscription";
import { Check, Sparkles, Zap, Target, Lock, RefreshCw } from "@/components/lume/CustomIcons";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Planos e Preços — LumeLearn Premium" },
      {
        name: "description",
        content: "Comece grátis ou assine o LumeLearn Premium por R$ 9,90/mês. 700+ lições, 3 idiomas, 5 modos de jogo, IA conversacional. Garantia de 7 dias.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { interfaceLanguage } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle] = useState<"monthly" | "annual">("monthly");

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const t = {
    title: isPT ? "Escolha Seu Plano" : isES ? "Elige Tu Plan" : "Choose Your Plan",
    subtitle: isPT
      ? "Comece grátis e faça upgrade quando estiver pronto para desbloquear todo o potencial"
      : isES
        ? "Comienza gratis y actualiza cuando estés listo para desbloquear todo el potencial"
        : "Start free and upgrade when you're ready to unlock full potential",
    monthly: isPT ? "Mensal" : isES ? "Mensual" : "Monthly",
    annual: isPT ? "Anual" : isES ? "Anual" : "Annual",
    perMonth: isPT ? "/mês" : isES ? "/mes" : "/month",
    perYear: isPT ? "/ano" : isES ? "/año" : "/year",
    getStarted: isPT ? "Começar Agora" : isES ? "Comenzar Ahora" : "Get Started",
    currentPlan: isPT ? "Plano Atual" : isES ? "Plan Actual" : "Current Plan",
    upgrade: isPT ? "Fazer Upgrade" : isES ? "Actualizar" : "Upgrade",
    mostPopular: isPT ? "Mais Popular" : isES ? "Más Popular" : "Most Popular",
    faq: isPT ? "Perguntas Frequentes" : isES ? "Preguntas Frecuentes" : "FAQ",
    moneyBack: isPT
      ? "Garantia de 7 dias - 100% do dinheiro de volta"
      : isES
        ? "Garantía de 7 días - 100% de devolución"
        : "7-day money-back guarantee",
    securePayment: isPT
      ? "Pagamento seguro via Cakto"
      : isES
        ? "Pago seguro vía Cakto"
        : "Secure payment via Cakto",
    cancelAnytime: isPT
      ? "Cancele a qualquer momento"
      : isES
        ? "Cancela en cualquier momento"
        : "Cancel anytime",
  };

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/pricing" } });
      return;
    }

    if (planId === "free") {
      navigate({ to: "/home" });
      return;
    }

    // Navigate directly to Cakto checkout (all plans on one page)
    window.open("https://cakto.app/AmYjYgH/", "_blank");
  };

  const visiblePlans = PLANS.filter((plan) => plan.id !== "free");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 24px",
          animation: "pageEnter 0.5s ease",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(201,168,76,0.1)",
              borderRadius: "99px",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={16} color="#C9A84C" />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#C9A84C",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {isPT ? "Planos Flexíveis" : isES ? "Planes Flexibles" : "Flexible Plans"}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 6vw, 48px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 3vw, 16px)",
              color: "var(--text-secondary)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            {t.subtitle}
          </p>
        </header>

        {/* Pricing Cards — All 4 plans stacked on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "16px",
            marginBottom: "48px",
            maxWidth: "800px",
            margin: "0 auto 48px",
          }}
        >
          {visiblePlans.map((plan) => {
            const isPopular = plan.popular;
            const periodLabel = plan.id === "premium_monthly" ? (isPT ? "/mês" : "/mo")
              : plan.id === "premium_quarterly" ? (isPT ? "/tri" : "/qtr")
              : plan.id === "premium_annual" ? (isPT ? "/ano" : "/yr")
              : (isPT ? "único" : "once");

            return (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  background: "var(--card-bg)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: isPopular ? "2.5px solid #58CC02" : "2px solid var(--border)",
                  borderBottomWidth: isPopular ? "5px" : "4px",
                  borderBottomColor: isPopular ? "#46a302" : "var(--border)",
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "16px",
                      background: "#58CC02",
                      color: "white",
                      padding: "3px 10px",
                      borderRadius: "99px",
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.mostPopular}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                      {isPT ? plan.namePT : isES ? plan.nameES : plan.name}
                    </h3>
                    {plan.savings && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#58CC02" }}>
                        {isPT ? plan.savingsPT : isES ? plan.savingsES : plan.savings}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)" }}>
                      {plan.priceFormatted}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginLeft: "4px" }}>
                      {periodLabel}
                    </span>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(isPT ? plan.featuresPT : isES ? plan.featuresES : plan.features).map(
                    (feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          padding: "4px 10px",
                          background: "var(--bg)",
                          borderRadius: "99px",
                        }}
                      >
                        <Check size={10} color="#58CC02" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={isPopular ? "btn-3d btn-3d-green" : ""}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: isPopular ? undefined : "12px",
                    border: isPopular ? undefined : "2px solid var(--border)",
                    background: isPopular ? undefined : "var(--card-bg)",
                    color: isPopular ? undefined : "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {isPT ? "ASSINAR AGORA" : "SUBSCRIBE NOW"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap",
            padding: "40px 0",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              <Check size={28} color="var(--brand)" />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t.moneyBack}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              <Lock size={28} color="var(--brand)" />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t.securePayment}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              <RefreshCw size={28} color="var(--brand)" />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t.cancelAnytime}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
