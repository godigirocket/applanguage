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
        content: "Comece grátis ou assine o LumeLearn Premium por R$ 29,90/mês. 700+ lições, 3 idiomas, 5 modos de jogo, IA conversacional. Garantia de 7 dias.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { interfaceLanguage } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

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

    // Navigate to checkout
    navigate({ to: "/checkout", search: { plan: planId } });
  };

  const visiblePlans = PLANS.filter((plan) => {
    if (billingCycle === "monthly") {
      return plan.id === "free" || plan.id === "premium_monthly";
    } else {
      return plan.id === "free" || plan.id === "premium_annual" || plan.id === "premium_lifetime";
    }
  });

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
              fontSize: "clamp(15px, 3vw, 18px)",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            {t.subtitle}
          </p>

          {/* Billing Cycle Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "var(--surface-raised)",
              padding: "6px",
              borderRadius: "99px",
              border: "1.5px solid var(--border)",
              gap: "4px",
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "10px 24px",
                borderRadius: "99px",
                border: "none",
                background: billingCycle === "monthly" ? "var(--brand)" : "transparent",
                color: billingCycle === "monthly" ? "white" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "10px 24px",
                borderRadius: "99px",
                border: "none",
                background: billingCycle === "annual" ? "var(--brand)" : "transparent",
                color: billingCycle === "annual" ? "white" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {t.annual}
              {billingCycle === "annual" && (
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                  }}
                >
                  -16%
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            marginBottom: "80px",
          }}
        >
          {visiblePlans.map((plan) => {
            const isPremium = plan.id !== "free";
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className="glass hover-lift"
                style={{
                  position: "relative",
                  background: isPremium
                    ? "linear-gradient(135deg, var(--surface-raised), var(--bg))"
                    : "var(--surface-raised)",
                  borderRadius: "32px",
                  padding: "40px 32px",
                  border: isPopular ? "2px solid var(--brand)" : "1.5px solid var(--border)",
                  boxShadow: isPopular
                    ? "0 20px 60px rgba(255,122,69,0.15)"
                    : "0 4px 20px rgba(0,0,0,0.02)",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--brand)",
                      color: "white",
                      padding: "6px 20px",
                      borderRadius: "99px",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(255,122,69,0.3)",
                    }}
                  >
                    <Sparkles size={14} />
                    {t.mostPopular}
                  </div>
                )}

                {/* Plan Icon */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    background: isPremium
                      ? "linear-gradient(135deg, var(--brand), #2f80ed)"
                      : "var(--bg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  {isPremium ? (
                    <Zap size={32} color="white" />
                  ) : (
                    <Target size={32} color="var(--text-secondary)" />
                  )}
                </div>

                {/* Plan Name */}
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {isPT ? plan.namePT : isES ? plan.nameES : plan.name}
                </h3>

                {/* Savings Badge */}
                {plan.savings && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      background: "rgba(201,168,76,0.1)",
                      color: "#C9A84C",
                      borderRadius: "99px",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    {isPT ? plan.savingsPT : isES ? plan.savingsES : plan.savings}
                  </div>
                )}

                {/* Price */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span
                      style={{
                        fontSize: "48px",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      {plan.priceFormatted.split(" ")[0]}
                    </span>
                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                      }}
                    >
                      {plan.priceFormatted.split(" ")[1]}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                      }}
                    >
                      {plan.interval === "month" ? t.perMonth : t.perYear}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(isPT ? plan.featuresPT : isES ? plan.featuresES : plan.features).map(
                    (feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          fontSize: "15px",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: isPremium
                              ? "rgba(255,122,69,0.1)"
                              : "rgba(0,0,0,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <Check size={12} color={isPremium ? "var(--brand)" : "var(--text-secondary)"} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "none",
                    background: isPremium ? "var(--brand)" : "var(--bg)",
                    color: isPremium ? "white" : "var(--text-primary)",
                    fontSize: "16px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: isPremium
                      ? "0 4px 16px rgba(255,122,69,0.25)"
                      : "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {plan.id === "free" ? t.getStarted : t.upgrade}
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
