import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { Lock, AlertTriangle, CheckCircle, ChevronLeft } from "@/components/lume/CustomIcons";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/settings/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  const { language } = useStore();
  const isPt = language === "pt";

  const [localOnly, setLocalOnly] = useState(true);

  const handleExport = () => {
    toast.success("Dados exportados com sucesso!");
  };

  const handleDelete = () => {
    if (
      confirm("Tem certeza? Esta ação apagará todo seu progresso e vocabulário permanentemente.")
    ) {
      localStorage.clear();
      toast.success("Todos os dados locais foram apagados.");
      window.location.reload();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px 40px" }}>
        <Link
          to="/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "32px",
          }}
        >
          <ChevronLeft size={16} /> Voltar
        </Link>

        <header style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--accent-green)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <Lock size={14} />
            <span>{isPt ? "Privacidade & Dados" : "Privacy & Data"}</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontWeight: 900,
            }}
          >
            Seus dados são seus.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            O Lume opera com uma arquitetura *local-first*. Isso significa que a maior parte do
            processamento e armazenamento ocorre no seu próprio dispositivo.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Local Mode Toggle */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: "var(--surface-raised)",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(76,175,80,0.1)",
                color: "var(--accent-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircle size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                Modo 100% Local
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  marginBottom: "16px",
                }}
              >
                Força o Lume a nunca sincronizar com servidores externos. Algumas integrações de IA
                avançadas podem ser desativadas, mas sua privacidade é absoluta.
              </p>
              <button
                onClick={() => {
                  setLocalOnly(!localOnly);
                  toast.success(`Modo local ${!localOnly ? "ativado" : "desativado"}.`);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "99px",
                  background: localOnly ? "var(--accent-green)" : "var(--surface)",
                  color: localOnly ? "white" : "var(--text-primary)",
                  border: localOnly ? "none" : "1px solid var(--border)",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {localOnly ? "Ativado" : "Desativado"}
              </button>
            </div>
          </div>

          {/* Export Data */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: "var(--surface-raised)",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                Exportar Meus Dados
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                Baixe todo seu vocabulário e histórico em formato JSON.
              </p>
            </div>
            <button
              onClick={handleExport}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Exportar
            </button>
          </div>

          {/* Danger Zone */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: "rgba(239,83,80,0.05)",
              border: "1.5px dashed rgba(239,83,80,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--accent-terra)",
                marginBottom: "12px",
                fontWeight: 800,
              }}
            >
              <AlertTriangle size={18} /> Zona de Perigo
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                fontWeight: 500,
                marginBottom: "16px",
                lineHeight: 1.5,
              }}
            >
              A exclusão de dados é irreversível. Certifique-se de exportar um backup antes de
              prosseguir.
            </p>
            <button
              onClick={handleDelete}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "var(--accent-terra)",
                color: "white",
                border: "none",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Apagar todos os dados locais
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
