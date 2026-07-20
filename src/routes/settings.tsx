import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Globe, Moon, Sun, Bell, Shield, LogOut } from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { interfaceLanguage, targetLanguage, setInterfaceLanguage, setTargetLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(isPT ? "Até logo!" : "See you!");
    nav({ to: "/login" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "88px" }}>
      <AppHeader />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
        <button
          onClick={() => nav({ to: "/profile" })}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "24px", padding: 0 }}
        >
          <ArrowLeft size={16} /> {isPT ? "Voltar" : "Back"}
        </button>

        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "32px" }}>
          {isPT ? "Configurações" : "Settings"}
        </h1>

        {/* Account */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
            {isPT ? "Conta" : "Account"}
          </h2>
          <div style={{ background: "var(--surface-raised)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Email</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>{user?.email || "—"}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", cursor: "pointer", color: "#E74C3C", fontSize: "14px", fontWeight: 700, textAlign: "left" }}
            >
              <LogOut size={18} color="#E74C3C" />
              {isPT ? "Sair da conta" : "Sign out"}
            </button>
          </div>
        </section>

        {/* Language */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
            {isPT ? "Idiomas" : "Languages"}
          </h2>
          <div style={{ background: "var(--surface-raised)", borderRadius: "16px", border: "1px solid var(--border)", padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                {isPT ? "Idioma alvo (aprendendo)" : "Target language (learning)"}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["en", "es", "pt"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setTargetLanguage(lang)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: `2px solid ${targetLanguage === lang ? "var(--brand)" : "var(--border)"}`,
                      background: targetLanguage === lang ? "rgba(45,74,62,0.08)" : "transparent",
                      color: targetLanguage === lang ? "var(--brand)" : "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {lang === "en" ? "English" : lang === "es" ? "Español" : "Português"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                {isPT ? "Idioma da interface" : "Interface language"}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["en", "es", "pt"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setInterfaceLanguage(lang)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: `2px solid ${interfaceLanguage === lang ? "var(--brand)" : "var(--border)"}`,
                      background: interfaceLanguage === lang ? "rgba(45,74,62,0.08)" : "transparent",
                      color: interfaceLanguage === lang ? "var(--brand)" : "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* App info */}
        <section>
          <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-secondary)", marginTop: "40px" }}>
            LangLume v1.0 • © 2026
          </div>
        </section>
      </main>
    </div>
  );
}
