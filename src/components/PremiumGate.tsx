/**
 * PREMIUM GATE COMPONENT
 * Blocks premium content for free users and shows upgrade modal
 */

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Check } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";

interface PremiumGateProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueFree: () => void;
}

export function PremiumGate({ isOpen, onClose, onContinueFree }: PremiumGateProps) {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const monthlyUrl = import.meta.env.VITE_CAKTO_CHECKOUT_MONTHLY;
  const annualUrl = import.meta.env.VITE_CAKTO_CHECKOUT_ANNUAL;

  const features = [
    {
      icon: "✅",
      title: isPT ? "300+ lições premium" : "300+ premium lessons",
      description: isPT ? "Acesso completo a todo conteúdo" : "Full access to all content",
    },
    {
      icon: "🎮",
      title: isPT ? "5 modos de jogo" : "5 game modes",
      description: isPT ? "Aprenda jogando de verdade" : "Learn by playing for real",
    },
    {
      icon: "🏆",
      title: isPT ? "Sistema de XP e conquistas" : "XP and achievements system",
      description: isPT ? "Gamificação completa" : "Full gamification",
    },
    {
      icon: "☁️",
      title: isPT ? "Progresso na nuvem" : "Cloud progress",
      description: isPT ? "Sincronizado em todos os dispositivos" : "Synced across all devices",
    },
    {
      icon: "📧",
      title: isPT ? "Suporte por e-mail" : "Email support",
      description: isPT ? "Tire suas dúvidas quando precisar" : "Get help when you need it",
    },
    {
      icon: "🔄",
      title: isPT ? "Atualizações incluídas" : "Updates included",
      description: isPT ? "Novos conteúdos todo mês" : "New content every month",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 48px)",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--bg)",
              borderRadius: "24px",
              border: "2px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              zIndex: 9999,
              padding: "32px",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "20px",
                color: "var(--text-secondary)",
              }}
              aria-label={isPT ? "Fechar" : "Close"}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C9A84C, #B8962E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 8px 24px rgba(201, 168, 76, 0.3)",
                }}
              >
                <Lock size={32} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                {isPT ? "Desbloqueie o Premium" : "Unlock Premium"}
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {isPT
                  ? "Você completou todas as lições gratuitas! Desbloqueie o acesso completo."
                  : "You've completed all free lessons! Unlock full access."}
              </p>
            </div>

            {/* Features grid */}
            <div
              style={{
                display: "grid",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px",
                    background: "var(--surface-raised)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: "24px", lineHeight: 1 }}>
                    {feature.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {feature.title}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {/* Monthly */}
              <a
                href={monthlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "2px solid var(--border)",
                  background: "var(--card-bg)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {isPT ? "Mensal" : "Monthly"}
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  R$ 47
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {isPT ? "por mês" : "per month"}
                </div>
              </a>

              {/* Annual - Best Value */}
              <a
                href={annualUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "2px solid #C9A84C",
                  background: "linear-gradient(135deg, rgba(201, 168, 76, 0.1), rgba(184, 150, 46, 0.05))",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(201, 168, 76, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "3px 12px",
                    background: "#C9A84C",
                    color: "white",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isPT ? "Melhor Custo" : "Best Value"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#C9A84C",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {isPT ? "Anual" : "Annual"}
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  R$ 297
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {isPT ? "por ano" : "per year"}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#4CAF50",
                    marginTop: "8px",
                  }}
                >
                  {isPT ? "Economize 47%" : "Save 47%"}
                </div>
              </a>
            </div>

            {/* Continue free button */}
            <button
              onClick={onContinueFree}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {isPT ? "Continuar com 10 lições grátis" : "Continue with 10 free lessons"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
