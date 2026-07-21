import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, LogOut } from "@/components/lume/CustomIcons";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

type AppLanguage = "en" | "es" | "pt";

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  es: "Espanol",
  pt: "Portugues",
};

function SettingsPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { interfaceLanguage, targetLanguage, setInterfaceLanguage, setTargetLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const copy = {
    back: isPT ? "Voltar" : isES ? "Volver" : "Back",
    title: isPT ? "Configuracoes" : isES ? "Configuracion" : "Settings",
    account: isPT ? "Conta" : isES ? "Cuenta" : "Account",
    signOut: isPT ? "Sair da conta" : isES ? "Cerrar sesion" : "Sign out",
    signedOut: isPT ? "Ate logo!" : isES ? "Hasta luego!" : "See you!",
    languages: isPT ? "Idiomas" : isES ? "Idiomas" : "Languages",
    target: isPT
      ? "Idioma alvo (aprendendo)"
      : isES
        ? "Idioma objetivo (aprendiendo)"
        : "Target language (learning)",
    ui: isPT ? "Idioma da interface" : isES ? "Idioma de la interfaz" : "Interface language",
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(copy.signedOut);
    nav({ to: "/login" });
  };

  const handleTargetLanguage = (lang: AppLanguage) => {
    setTargetLanguage(lang);
    localStorage.setItem("lume_target_language", lang);
    if (user) {
      supabase
        .from("profiles")
        .update({ target_language: lang } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.warn("[Settings] Could not save target language:", error.message);
        });
    }
  };

  const handleInterfaceLanguage = async (lang: AppLanguage) => {
    setInterfaceLanguage(lang);
    await i18n.changeLanguage(lang);
    localStorage.setItem("lume_interface_language", lang);
    if (user) {
      supabase
        .from("profiles")
        .update({ language: lang } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.warn("[Settings] Could not save interface language:", error.message);
        });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "88px" }}>
      <AppHeader />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
        <button
          onClick={() => nav({ to: "/profile" })}
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
            marginBottom: "24px",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} /> {copy.back}
        </button>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "32px",
          }}
        >
          {copy.title}
        </h1>

        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            {copy.account}
          </h2>
          <div
            style={{
              background: "var(--surface-raised)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                Email
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {user?.email || "-"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#E74C3C",
                fontSize: "14px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              <LogOut size={18} color="#E74C3C" />
              {copy.signOut}
            </button>
          </div>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            {copy.languages}
          </h2>
          <div
            style={{
              background: "var(--surface-raised)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                {copy.target}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["en", "es", "pt"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTargetLanguage(lang)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: `2px solid ${targetLanguage === lang ? "var(--brand)" : "var(--border)"}`,
                      background: targetLanguage === lang ? "rgba(255,122,69,0.08)" : "transparent",
                      color: targetLanguage === lang ? "var(--brand)" : "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                {copy.ui}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["en", "es", "pt"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleInterfaceLanguage(lang)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: `2px solid ${interfaceLanguage === lang ? "var(--brand)" : "var(--border)"}`,
                      background:
                        interfaceLanguage === lang ? "rgba(255,122,69,0.08)" : "transparent",
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

        <section>
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "40px",
            }}
          >
            LangLume v1.0 - 2026
          </div>
        </section>
      </main>
    </div>
  );
}
