import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { Crown, Zap, X } from "./lume/CustomIcons";

interface PaywallProps {
  onClose?: () => void;
  reason?: "daily_limit" | "premium_content" | "premium_feature";
}

export function Paywall({ onClose, reason = "premium_content" }: PaywallProps) {
  const { interfaceLanguage } = useStore();
  const navigate = useNavigate();

  // Proteção SSR
  if (typeof window === "undefined") {
    return null;
  }

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const content = {
    daily_limit: {
      title: isPT
        ? "Limite Diário Atingido"
        : isES
          ? "Límite Diario Alcanzado"
          : "Daily Limit Reached",
      subtitle: isPT
        ? "Você completou suas 5 lições gratuitas de hoje"
        : isES
          ? "Has completado tus 5 lecciones gratuitas de hoy"
          : "You've completed your 5 free lessons today",
      features: isPT
        ? [
            "✨ Lições ilimitadas todos os dias",
            "🎮 Todos os jogos desbloqueados",
            "🤖 Conversação com IA ilimitada",
            "📱 Modo offline completo",
            "🎯 Suporte prioritário",
          ]
        : isES
          ? [
              "✨ Lecciones ilimitadas todos los días",
              "🎮 Todos los juegos desbloqueados",
              "🤖 Conversación con IA ilimitada",
              "📱 Modo sin conexión completo",
              "🎯 Soporte prioritario",
            ]
          : [
              "✨ Unlimited lessons every day",
              "🎮 All games unlocked",
              "🤖 Unlimited AI conversation",
              "📱 Full offline mode",
              "🎯 Priority support",
            ],
    },
    premium_content: {
      title: isPT
        ? "Conteúdo Premium"
        : isES
          ? "Contenido Premium"
          : "Premium Content",
      subtitle: isPT
        ? "Este conteúdo está disponível apenas para membros Premium"
        : isES
          ? "Este contenido está disponible solo para miembros Premium"
          : "This content is available only for Premium members",
      features: isPT
        ? [
            "🎓 Acesso a lições avançadas (C1, C2)",
            "🌍 Conteúdo cultural exclusivo",
            "🎯 Exercícios personalizados",
            "📊 Relatórios detalhados de progresso",
            "🏆 Certificados de conclusão",
          ]
        : isES
          ? [
              "🎓 Acceso a lecciones avanzadas (C1, C2)",
              "🌍 Contenido cultural exclusivo",
              "🎯 Ejercicios personalizados",
              "📊 Informes detallados de progreso",
              "🏆 Certificados de finalización",
            ]
          : [
              "🎓 Access to advanced lessons (C1, C2)",
              "🌍 Exclusive cultural content",
              "🎯 Personalized exercises",
              "📊 Detailed progress reports",
              "🏆 Completion certificates",
            ],
    },
    premium_feature: {
      title: isPT
        ? "Recurso Premium"
        : isES
          ? "Función Premium"
          : "Premium Feature",
      subtitle: isPT
        ? "Desbloqueie todos os recursos com Premium"
        : isES
          ? "Desbloquea todas las funciones con Premium"
          : "Unlock all features with Premium",
      features: isPT
        ? [
            "🚀 Todos os recursos desbloqueados",
            "💎 Conteúdo exclusivo semanal",
            "🎨 Temas personalizados",
            "📥 Download de lições offline",
            "⚡ Sem anúncios",
          ]
        : isES
          ? [
              "🚀 Todas las funciones desbloqueadas",
              "💎 Contenido exclusivo semanal",
              "🎨 Temas personalizados",
              "📥 Descarga de lecciones sin conexión",
              "⚡ Sin anuncios",
            ]
          : [
              "🚀 All features unlocked",
              "💎 Exclusive weekly content",
              "🎨 Custom themes",
              "📥 Offline lesson downloads",
              "⚡ No ads",
            ],
    },
  };

  const currentContent = content[reason];

  const t = {
    upgrade: isPT ? "Fazer Upgrade" : isES ? "Actualizar" : "Upgrade to Premium",
    viewPlans: isPT ? "Ver Planos" : isES ? "Ver Planes" : "View Plans",
    maybeLater: isPT ? "Talvez Depois" : isES ? "Quizás Después" : "Maybe Later",
    from: isPT ? "A partir de" : isES ? "Desde" : "From",
    perMonth: isPT ? "/mês" : isES ? "/mes" : "/month",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{
          background: "var(--surface-raised)",
          borderRadius: "32px",
          padding: "48px 40px",
          maxWidth: "500px",
          width: "100%",
          border: "2px solid var(--brand)",
          boxShadow: "0 20px 60px rgba(45,74,62,0.3)",
          position: "relative",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              background: "var(--bg)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Crown Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, var(--brand), #1B3A4B)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 24px rgba(45,74,62,0.3)",
          }}
        >
          <Crown size={40} color="white" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "32px",
            fontWeight: 900,
            color: "var(--text-primary)",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          {currentContent.title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginBottom: "32px",
            lineHeight: 1.5,
          }}
        >
          {currentContent.subtitle}
        </p>

        {/* Features */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 32px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {currentContent.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                fontSize: "15px",
                color: "var(--text-primary)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            background: "var(--bg)",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            {t.from}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
            <span style={{ fontSize: "40px", fontWeight: 900, color: "var(--text-primary)" }}>
              R$ 29
            </span>
            <span style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)" }}>
              ,90
            </span>
            <span style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {t.perMonth}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => navigate({ to: "/pricing" })}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              border: "none",
              background: "var(--brand)",
              color: "white",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(45,74,62,0.25)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Zap size={20} />
            {t.upgrade}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.maybeLater}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
