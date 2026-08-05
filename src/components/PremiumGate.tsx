/**
 * PREMIUM GATE COMPONENT
 * Blocks premium content for free users and shows upgrade modal
 */

import { useEffect, useId, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, X } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { Portal } from "@/components/lume/Portal";
import { useScrollLock } from "@/hooks/useScrollLock";

interface PremiumGateProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueFree: () => void;
}

export function PremiumGate({ isOpen, onClose, onContinueFree }: PremiumGateProps) {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useScrollLock(isOpen);

  // Escape to close, focus trap, and initial focus — plus returning focus to
  // whatever triggered the modal once it closes, per standard dialog a11y.
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen, onClose]);

  const monthlyUrl = "https://cakto.app/AmYjYgH/";
  const annualUrl = "https://cakto.app/AmYjYgH/";

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
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div className="premium-gate-layer">
            {/* Backdrop — a real button (not a div) so it's keyboard reachable
                and doesn't need a redundant role/tabIndex. */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
              onClick={onClose}
              aria-hidden="true"
              tabIndex={-1}
              className="premium-gate-backdrop"
            />

            {/* Modal — centering comes entirely from the parent's `grid;
                place-items: center` (see .premium-gate-layer below). It must
                NOT also set top/left/transform for centering: framer-motion
                takes full ownership of the `transform` CSS property the
                moment `animate` includes a transform-affecting key like `y`
                or `scale`, silently discarding any transform set via the
                `style` prop. That's what caused the modal to render with its
                top-left corner (not its center) pinned to the viewport
                center — pushing most of it off-screen to the right/bottom. */}
            <motion.section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.99 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="premium-gate-modal"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  color: "var(--text-secondary)",
                  flexShrink: 0,
                }}
                aria-label={isPT ? "Fechar" : "Close"}
              >
                <X size={18} />
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
                id={titleId}
                style={{
                  fontSize: "clamp(22px, 6vw, 28px)",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  overflowWrap: "anywhere",
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

            {/* Pricing — single CTA to checkout page with all plans */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isPT ? "A partir de" : "Starting at"}
                </div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--text-primary)" }}>
                  R$ 9,90<span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>/mês</span>
                </div>
              </div>

              <a
                href="https://cakto.app/AmYjYgH/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-green"
                style={{
                  width: "100%",
                  padding: "18px",
                  textDecoration: "none",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                {isPT ? "VER PLANOS E ASSINAR" : "SEE PLANS & SUBSCRIBE"}
              </a>

              <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-secondary)" }}>
                {isPT ? "Mensal R$9,90 · Trimestral R$25,90 · Anual R$65,90 · Vitalício R$110" : "Monthly R$9.90 · Quarterly R$25.90 · Annual R$65.90 · Lifetime R$110"}
              </div>
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
            </motion.section>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        .premium-gate-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding:
            max(16px, env(safe-area-inset-top))
            max(16px, env(safe-area-inset-right))
            max(16px, env(safe-area-inset-bottom))
            max(16px, env(safe-area-inset-left));
          overflow: hidden;
          isolation: isolate;
        }
        .premium-gate-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 0;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          cursor: pointer;
        }
        .premium-gate-modal {
          position: relative;
          z-index: 1;
          width: min(100%, 560px);
          max-width: 100%;
          max-height: min(88dvh, 760px);
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          box-sizing: border-box;
          background: var(--bg);
          border-radius: 24px;
          border: 2px solid var(--border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          padding: 32px;
        }
        @media (max-width: 640px) {
          .premium-gate-layer {
            place-items: end center;
            padding:
              max(12px, env(safe-area-inset-top))
              max(10px, env(safe-area-inset-right))
              max(10px, env(safe-area-inset-bottom))
              max(10px, env(safe-area-inset-left));
          }
          .premium-gate-modal {
            width: 100%;
            max-width: none;
            max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 20px);
            border-radius: 24px 24px 16px 16px;
            padding: clamp(18px, 5vw, 32px);
          }
        }
      `}</style>
    </Portal>
  );
}
