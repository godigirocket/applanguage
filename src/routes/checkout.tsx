import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { getPlanDetails, type SubscriptionPlan } from "@/lib/subscription";
import { Check, ArrowLeft, Shield, Star, Lock, Globe, Users, GraduationCap, Zap } from "@/components/lume/CustomIcons";
import { CharacterCelebrating } from "@/components/lume/LumeCharacters";

// ==========================================
// CAKTO CHECKOUT LINKS (Production - Real)
// ==========================================
const CAKTO_LINKS: Record<string, string> = {
  premium_monthly: "https://pay.cakto.com.br/t3z3hhs_984445",
  premium_annual: "https://pay.cakto.com.br/wf6iugo",
  premium_lifetime: "https://pay.cakto.com.br/33vgk53",
};

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      plan: (search.plan as SubscriptionPlan) || "premium_lifetime",
    };
  },
});

function CheckoutPage() {
  const { plan } = Route.useSearch();
  const { interfaceLanguage } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plan);

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";
  const planDetails = getPlanDetails(selectedPlan);

  if (!planDetails) return null;

  const t = {
    heroTitle: isPT ? "Desbloqueie seu potencial em idiomas" : isES ? "Desbloquea tu potencial en idiomas" : "Unlock your language potential",
    heroSubtitle: isPT ? "Pratique todos os dias com lições rápidas, jogos inteligentes e progresso salvo automaticamente." : isES ? "Practica todos los días con lecciones rápidas, juegos inteligentes y progreso guardado automáticamente." : "Practice daily with short lessons, smart games and auto-saved progress.",
    benefit1: isPT ? "630+ lições em 3 idiomas" : isES ? "630+ lecciones en 3 idiomas" : "630+ lessons in 3 languages",
    benefit2: isPT ? "IA conversacional para prática real" : isES ? "IA conversacional para práctica real" : "Conversational AI for real practice",
    benefit3: isPT ? "5 modos de jogo gamificados" : isES ? "5 modos de juego gamificados" : "5 gamified game modes",
    benefit4: isPT ? "Progresso salvo automaticamente" : isES ? "Progreso guardado automáticamente" : "Progress auto-saved",
    benefit5: isPT ? "Funciona offline no celular" : isES ? "Funciona sin conexión en el móvil" : "Works offline on mobile",
    benefit6: isPT ? "Todas as atualizações futuras incluídas" : isES ? "Todas las actualizaciones futuras incluidas" : "All future updates included",
    guaranteeTitle: isPT ? "Garantia de 7 dias — Risco Zero" : isES ? "Garantía de 7 días — Riesgo Cero" : "7-day Guarantee — Zero Risk",
    guaranteeDesc: isPT ? "Teste por 7 dias. Se não gostar, devolvemos 100% do valor. Sem perguntas." : isES ? "Prueba por 7 días. Si no te gusta, devolvemos el 100%. Sin preguntas." : "Try for 7 days. If you don't like it, full refund. No questions asked.",
    choosePlan: isPT ? "Escolha o plano ideal para você" : isES ? "Elige el plan ideal para ti" : "Choose the right plan for you",
    monthly: isPT ? "Mensal" : isES ? "Mensual" : "Monthly",
    annual: isPT ? "Anual" : isES ? "Anual" : "Annual",
    perMonth: isPT ? "/mês" : isES ? "/mes" : "/mo",
    perYear: isPT ? "/ano" : isES ? "/año" : "/yr",
    save16: isPT ? "Economize 45%" : isES ? "Ahorra 45%" : "Save 45%",
    mostPopular: isPT ? "Mais popular" : isES ? "Más popular" : "Most popular",
    bestValue: isPT ? "Melhor investimento" : isES ? "Mejor inversión" : "Best investment",
    cta: isPT ? "Começar agora" : isES ? "Empezar ahora" : "Start now",
    securePayment: isPT ? "Pagamento seguro • PIX, Cartão ou Boleto • Acesso imediato" : isES ? "Pago seguro • PIX, Tarjeta o Boleto • Acceso inmediato" : "Secure payment • PIX, Card or Bank Slip • Instant access",
    backToPricing: isPT ? "← Voltar" : isES ? "← Volver" : "← Back",
    redirect: isPT ? "Checkout seguro Cakto — seu acesso é liberado em segundos após o pagamento" : isES ? "Checkout seguro Cakto — tu acceso se libera en segundos tras el pago" : "Secure Cakto checkout — access unlocked seconds after payment",
    trialNote: isPT ? "🎁 Crie sua conta grátis e comece a praticar agora" : isES ? "🎁 Crea tu cuenta gratis y empieza a practicar ahora" : "🎁 Create your free account and start practicing now",
    urgency: isPT ? "⚡ Preço promocional de lançamento — pode aumentar a qualquer momento" : isES ? "⚡ Precio promocional de lanzamiento — puede aumentar en cualquier momento" : "⚡ Launch promotional price — may increase at any time",
  };

  const handleCheckout = () => {
    const link = CAKTO_LINKS[selectedPlan];
    if (!link) {
      // No checkout URL configured yet
      navigate({ to: "/support" });
      return;
    }
    // Append user email as query param for Cakto pre-fill (if logged in)
    const url = new URL(link);
    if (user?.email) {
      url.searchParams.set("email", user.email);
    }
    window.location.href = url.toString();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #E5E5E5", background: "#FFFFFF", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 900, color: "#2D4A3E" }}>LUME</div>
          <button onClick={() => navigate({ to: "/pricing" })} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666666", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            <ArrowLeft size={16} />
            {t.backToPricing}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px 120px" }}>

        {/* Hero Banner */}
        <div style={{ marginTop: "80px", background: "linear-gradient(135deg, #2D4A3E 0%, #1B3A4B 100%)", borderRadius: "24px", padding: "80px 60px", display: "grid", gridTemplateColumns: "1fr 300px", alignItems: "center", gap: "60px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }} className="hero-banner">
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "48px", fontWeight: 900, color: "#FFFFFF", marginBottom: "16px", lineHeight: 1.1 }}>{t.heroTitle}</h1>
            <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.9)", maxWidth: "600px", lineHeight: 1.4 }}>{t.heroSubtitle}</p>
            <div style={{ marginTop: "32px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Globe size={20} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>3 idiomas</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GraduationCap size={20} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>300+ lições</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={20} color="#FFD700" />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>Sistema de XP</span>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1, transform: "scale(1.4)", transformOrigin: "center" }} className="hero-character-wrapper">
            <CharacterCelebrating />
          </div>
        </div>

        {/* Benefits */}
        <section style={{ marginTop: "80px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#1A1A1A", marginBottom: "12px" }}>
            {isPT ? "O que está incluso" : isES ? "Qué incluye" : "What's included"}
          </h2>
          <div style={{ height: "1px", width: "80px", background: "#2D4A3E", marginBottom: "40px" }} />
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6].map((benefit, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#1A1A1A" }}>
                <Check size={20} color="#2D4A3E" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Plan Selector + CTA */}
        <section style={{ marginTop: "80px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#1A1A1A", marginBottom: "40px" }}>{t.choosePlan}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", maxWidth: "900px" }} className="plan-grid">
            {/* Monthly */}
            <button
              type="button"
              onClick={() => setSelectedPlan("premium_monthly")}
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: `2px solid ${selectedPlan === "premium_monthly" ? "#2D4A3E" : "#E5E5E5"}`,
                background: selectedPlan === "premium_monthly" ? "rgba(45,74,62,0.04)" : "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666666", marginBottom: "8px" }}>{t.monthly}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "32px", fontWeight: 900, color: "#1A1A1A" }}>R$ 9,90</span>
                <span style={{ fontSize: "14px", color: "#666666" }}>{t.perMonth}</span>
              </div>
            </button>

            {/* Annual */}
            <button
              type="button"
              onClick={() => setSelectedPlan("premium_annual")}
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: `2px solid ${selectedPlan === "premium_annual" ? "#2D4A3E" : "#E5E5E5"}`,
                background: selectedPlan === "premium_annual" ? "rgba(45,74,62,0.04)" : "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {selectedPlan === "premium_annual" && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "#2D4A3E", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>
                  {t.mostPopular}
                </div>
              )}
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666666", marginBottom: "8px" }}>{t.annual}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "32px", fontWeight: 900, color: "#1A1A1A" }}>R$ 63,90</span>
                <span style={{ fontSize: "14px", color: "#666666" }}>{t.perYear}</span>
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", fontWeight: 700, color: "#2D4A3E" }}>
                <Zap size={14} color="#2D4A3E" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                {isPT ? "Economize 45%" : isES ? "Ahorra 45%" : "Save 45%"}
              </div>
            </button>

            {/* Lifetime */}
            <button
              type="button"
              onClick={() => setSelectedPlan("premium_lifetime" as SubscriptionPlan)}
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: `2px solid ${selectedPlan === "premium_lifetime" ? "#C9A84C" : "#E5E5E5"}`,
                background: selectedPlan === "premium_lifetime" ? "rgba(201,168,76,0.06)" : "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {selectedPlan === "premium_lifetime" && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "linear-gradient(135deg, #C9A84C, #D4A23B)", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>
                  {t.bestValue}
                </div>
              )}
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666666", marginBottom: "8px" }}>
                {isPT ? "Vitalício" : isES ? "Vitalicio" : "Lifetime"}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "32px", fontWeight: 900, color: "#1A1A1A" }}>R$ 119</span>
                <span style={{ fontSize: "14px", color: "#666666" }}>{isPT ? "único" : isES ? "único" : "once"}</span>
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", fontWeight: 700, color: "#C9A84C" }}>
                <Star size={14} color="#C9A84C" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                {isPT ? "Acesso para sempre" : isES ? "Acceso para siempre" : "Access forever"}
              </div>
            </button>
          </div>

          {/* CTA Button */}
          <div style={{ maxWidth: "700px", marginTop: "40px" }}>
            <button
              type="button"
              onClick={handleCheckout}
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "14px",
                border: "none",
                background: "#2D4A3E",
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <Lock size={18} color="white" />
              {t.cta} — {selectedPlan === "premium_lifetime" ? "R$ 119,00" : selectedPlan === "premium_annual" ? "R$ 63,90" : "R$ 9,90"}
            </button>
            
            {/* Trial + Urgency messages */}
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#2D4A3E", fontWeight: 700, marginBottom: "8px" }}>
                {t.trialNote}
              </p>
              <p style={{ fontSize: "13px", color: "#E67E22", fontWeight: 600, marginBottom: "12px" }}>
                {t.urgency}
              </p>
            </div>
            
            <p style={{ marginTop: "12px", textAlign: "center", fontSize: "14px", color: "#999999" }}>
              {t.redirect}
            </p>
            <p style={{ marginTop: "8px", textAlign: "center", fontSize: "13px", color: "#AAAAAA" }}>
              {t.securePayment}
            </p>
          </div>
        </section>

        {/* Guarantee */}
        <section style={{ marginTop: "80px", padding: "40px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E5E5", display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <Shield size={32} color="#2D4A3E" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A", marginBottom: "8px" }}>{t.guaranteeTitle}</h3>
            <p style={{ fontSize: "16px", color: "#666666", lineHeight: 1.6 }}>{t.guaranteeDesc}</p>
          </div>
        </section>

        {/* Social Proof */}
        <section style={{ marginTop: "80px", textAlign: "center", paddingBottom: "60px" }}>
          <p style={{ fontSize: "16px", color: "#666666", marginBottom: "16px" }}>
            {isPT ? "Junte-se aos primeiros usuários fundadores" : isES ? "Únete a los primeros usuarios fundadores" : "Join the founding users"}
          </p>
          <div style={{ fontSize: "14px", color: "#999999" }}>
            {isPT ? "Garantia de 7 dias • Pagamento seguro • Cancele quando quiser" : isES ? "Garantía de 7 días • Pago seguro • Cancela cuando quieras" : "7-day guarantee • Secure payment • Cancel anytime"}
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .hero-banner {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-character-wrapper {
            display: none;
          }
        }

        @media (max-width: 768px) {
          main {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          header > div {
            padding: 16px 24px !important;
          }
          .hero-banner {
            padding: 60px 32px !important;
          }
          .plan-grid {
            grid-template-columns: 1fr !important;
          }
        }

        button:not(:disabled):hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
