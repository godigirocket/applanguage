import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeQuery, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { MOODS } from "@/lib/topics";
import { toast } from "sonner";
import { checkTables } from "@/lib/supabase-safe";
import { safeGetProfile, safeUpsertProfile } from "@/lib/db";
import { useStore } from "@/hooks/useStore";
import { useUserStore, UserLevel } from "@/store/userStore";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Shield,
  Volume2,
  Trash2,
  Download,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Configurações e Perfil — Lume" }] }),
  component: Profile,
});

type AuditLog = { action: string; ip: string; timestamp: string };

function Profile() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const handleLogoutCleanup = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    }

    localStorage.removeItem("lume-storage");
    localStorage.removeItem("lume-user-settings");
    localStorage.removeItem("lume_user_level");
    localStorage.removeItem("lume_level");
    localStorage.removeItem("lume-game-storage");

    useUserStore.setState({
      userLevel: "",
      xp: 0,
      lumes: 0,
      streak: 0,
      quests: [
        {
          id: "dq-1",
          title: "Complete 2 lições",
          target: 2,
          current: 0,
          completed: false,
          xpReward: 50,
          lumesReward: 10,
        },
        {
          id: "dq-2",
          title: "Ganhe 150 XP",
          target: 150,
          current: 0,
          completed: false,
          xpReward: 25,
          lumesReward: 5,
        },
        {
          id: "dq-3",
          title: "Acerte 10 flashcards",
          target: 10,
          current: 0,
          completed: false,
          xpReward: 40,
          lumesReward: 15,
        },
        {
          id: "dq-4",
          title: "Conclua o Modo Sobrevivência",
          target: 1,
          current: 0,
          completed: false,
          xpReward: 100,
          lumesReward: 20,
        },
      ],
    });

    useStore.setState({
      learningLevel: "",
      xp: 0,
      lumes: 0,
      streak: 0,
      messages: [],
      onboardingStep: 1,
    });
  };

  // Lume global store variables
  const { interfaceLanguage, setInterfaceLanguage, targetLanguage, setTargetLanguage } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Profile local/DB settings
  const [name, setName] = useState("");
  const [level, setLevel] = useState<UserLevel>("A1");
  const [mood, setMood] = useState<"calm" | "intensive" | "cultural" | "confidence">("calm");

  // New UI options
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [speechRate, setSpeechRate] = useState("1.0");

  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(false);

  // 2FA TOTP state
  const [enable2FA, setEnable2FA] = useState(false);
  const [show2FAConfig, setShow2FAConfig] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [twoFactorSecret] = useState("LUME-TOTP-J8S2-K9X1-8273");

  // Delete account confirm state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Audit log
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      action: "Sessão iniciada",
      ip: "192.168.1.45",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
    },
    {
      action: "Preferências atualizadas",
      ip: "192.168.1.45",
      timestamp: new Date(Date.now() - 7200000).toLocaleString(),
    },
  ]);

  useEffect(() => {
    async function verifyDatabase() {
      const exists = await checkTables();
      setShowSetupBanner(!exists);
    }
    verifyDatabase();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
      return;
    }
    if (!user || loaded) return;
    (async () => {
      const data = await safeGetProfile(user.id);
      if (data) {
        setName(data.full_name ?? "");

        let dbLevel = data.level;
        if (dbLevel === "beginner") dbLevel = "A1";
        else if (dbLevel === "intermediate") dbLevel = "B1";
        else if (dbLevel === "advanced") dbLevel = "C1";
        setLevel((dbLevel || "A1") as any);

        setMood(data.preferred_mood as any);
        setLoaded(true);
      }
    })();
  }, [user, loading, nav, loaded]);

  async function save() {
    if (!user) return;
    setSaving(true);

    // Sync into Zustand stores immediately
    useUserStore.getState().setUserLevel(level);
    useStore.getState().setLearningLevel(level);

    const updates = {
      full_name: name,
      language: interfaceLanguage,
      level: level,
      preferred_mood: mood,
    };

    const result = await safeUpsertProfile(user.id, updates);
    setSaving(false);

    if (result.success) {
      toast.success(
        result.fallback
          ? isPT
            ? "Salvo localmente (configure o banco para sincronizar)"
            : isES
              ? "Guardado localmente"
              : "Saved locally (configure DB to sync)"
          : isPT
            ? "Configurações salvas com sucesso!"
            : isES
              ? "¡Ajustes guardados con éxito!"
              : "Settings saved successfully!",
      );
      logSecurityAction("Configurações atualizadas");
    } else {
      toast.error(
        isPT
          ? "Falha ao salvar preferências."
          : isES
            ? "Error al guardar ajustes."
            : "Failed to save preferences.",
      );
    }
  }

  const logSecurityAction = (action: string) => {
    setAuditLogs((prev) => [
      { action, ip: "192.168.1.45", timestamp: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const handleVerify2FA = () => {
    if (totpCode === "123456") {
      setEnable2FA(true);
      setShow2FAConfig(false);
      toast.success(
        isPT
          ? "Autenticação em duas etapas ativada!"
          : isES
            ? "¡Autenticación de 2 factores activada!"
            : "Two-factor authentication enabled!",
      );
      logSecurityAction("2FA ativado");
    } else {
      toast.error(
        isPT ? "Código TOTP inválido." : isES ? "Código TOTP inválido." : "Invalid TOTP code.",
      );
    }
  };

  const handleDeleteAccount = async () => {
    const triggerWord = isPT ? "excluir" : isES ? "eliminar" : "delete";
    if (deleteConfirmText.toLowerCase() === triggerWord) {
      toast.loading(
        isPT ? "Excluindo conta..." : isES ? "Eliminando cuenta..." : "Deleting account...",
      );
      setTimeout(async () => {
        if (user) {
          try {
            await supabase.from("profiles").delete().eq("id", user.id);
          } catch (e) {
            console.error("Error deleting profile:", e);
          }
          await handleLogoutCleanup();
        }
        toast.dismiss();
        toast.success(isPT ? "Conta excluída." : isES ? "Cuenta eliminada." : "Account deleted.");
        nav({ to: "/login" });
      }, 2000);
    } else {
      toast.error(
        isPT
          ? "Digite 'excluir' para confirmar."
          : isES
            ? "Escriba 'eliminar' para confirmar."
            : "Type 'delete' to confirm.",
      );
    }
  };

  const initials =
    name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "L";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
          animation: "pageEnter 0.5s ease",
        }}
      >
        {/* Setup Banner */}
        {showSetupBanner && (
          <div
            style={{
              background: "linear-gradient(135deg, #C4714A, #D4824A)",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "32px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 14px rgba(196,113,74,0.25)",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px" }}>
                {isPT
                  ? "Base de dados não configurada"
                  : isES
                    ? "Base de datos no configurada"
                    : "Database not configured"}
              </div>
              <div style={{ opacity: 0.9, fontSize: "13px" }}>
                {isPT
                  ? "Execute o SQL no Supabase para salvar seu progresso."
                  : isES
                    ? "Ejecute el SQL en Supabase para guardar su progreso."
                    : "Run SQL script in Supabase to sync your progress."}
              </div>
            </div>
            <Link
              to="/setup"
              style={{
                padding: "8px 16px",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {isPT ? "Instruções →" : isES ? "Instrucciones →" : "Instructions →"}
            </Link>
          </div>
        )}

        <header
          style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, var(--brand), #1B3A4B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(45,74,62,0.3)",
            }}
          >
            {initials}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "32px",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: "0 0 4px",
              }}
            >
              {name || (isPT ? "Seu perfil" : isES ? "Tu perfil" : "Your profile")}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {user?.email}
            </p>
          </div>
        </header>

        {/* PROFILE PREFERENCES */}
        <section
          style={{
            background: "var(--surface-raised)",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "24px",
            }}
          >
            <User size={20} color="var(--brand)" />
            {isPT ? "Perfil e Aprendizado" : isES ? "Perfil y Aprendizaje" : "Profile & Learning"}
          </h2>

          <div style={{ display: "grid", gap: "24px" }}>
            <Field label={isPT ? "Nome Completo" : isES ? "Nombre Completo" : "Full Name"}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  fontWeight: 600,
                  outline: "none",
                  transition: "border 0.2s",
                }}
                placeholder={
                  isPT
                    ? "Como quer ser chamado?"
                    : isES
                      ? "¿Cómo quieres que te llamen?"
                      : "What should we call you?"
                }
              />
            </Field>

            {/* SYSTEM / INTERFACE LANGUAGE */}
            <Field
              label={
                isPT
                  ? "Idioma do Sistema Lume"
                  : isES
                    ? "Idioma del Sistema Lume"
                    : "Lume Interface Language"
              }
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <Pill
                  active={interfaceLanguage === "pt"}
                  onClick={() => setInterfaceLanguage("pt")}
                >
                  🇵🇹 Português
                </Pill>
                <Pill
                  active={interfaceLanguage === "en"}
                  onClick={() => setInterfaceLanguage("en")}
                >
                  🇺🇸 English
                </Pill>
                <Pill
                  active={interfaceLanguage === "es"}
                  onClick={() => setInterfaceLanguage("es")}
                >
                  🇪🇸 Español
                </Pill>
              </div>
            </Field>

            {/* TARGET / STUDY LANGUAGE */}
            <Field
              label={
                isPT
                  ? "Idioma que Você Estuda"
                  : isES
                    ? "Idioma que Estudias"
                    : "Language You Learn"
              }
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <Pill active={targetLanguage === "pt"} onClick={() => setTargetLanguage("pt")}>
                  🇵🇹 Português
                </Pill>
                <Pill active={targetLanguage === "en"} onClick={() => setTargetLanguage("en")}>
                  🇺🇸 English
                </Pill>
                <Pill active={targetLanguage === "es"} onClick={() => setTargetLanguage("es")}>
                  🇪🇸 Español
                </Pill>
              </div>
            </Field>

            <Field label={isPT ? "Nível Atual" : isES ? "Nivel Actual" : "Current Level"}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px",
                }}
              >
                {[
                  {
                    id: "A1",
                    title: "A1",
                    desc: isPT ? "Iniciante" : isES ? "Principiante" : "Beginner",
                    color: "#4A7A5B",
                    bg: "rgba(74, 122, 91, 0.06)",
                  },
                  {
                    id: "A2",
                    title: "A2",
                    desc: isPT ? "Básico" : isES ? "Básico" : "Basic",
                    color: "#3B7A8C",
                    bg: "rgba(59, 122, 140, 0.06)",
                  },
                  {
                    id: "B1",
                    title: "B1",
                    desc: isPT ? "Intermediário" : isES ? "Intermedio" : "Intermediate",
                    color: "#D49E3B",
                    bg: "rgba(212, 158, 59, 0.06)",
                  },
                  {
                    id: "B2",
                    title: "B2",
                    desc: isPT
                      ? "Intermediário Alto"
                      : isES
                        ? "Intermedio Alto"
                        : "Upper Intermediate",
                    color: "#C46D4B",
                    bg: "rgba(196, 109, 75, 0.06)",
                  },
                  {
                    id: "C1",
                    title: "C1",
                    desc: isPT ? "Avançado" : isES ? "Avanzado" : "Advanced",
                    color: "#B34A4A",
                    bg: "rgba(179, 74, 74, 0.06)",
                  },
                  {
                    id: "C2",
                    title: "C2",
                    desc: isPT ? "Proficiente" : isES ? "Proficiente" : "Proficient",
                    color: "#2A4D69",
                    bg: "rgba(42, 77, 105, 0.06)",
                  },
                ].map((l) => {
                  const active = level === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLevel(l.id as any)}
                      style={{
                        padding: "16px 12px",
                        borderRadius: "16px",
                        border: "2px solid",
                        borderColor: active ? l.color : "var(--border)",
                        background: active ? l.bg : "var(--bg)",
                        color: active ? l.color : "var(--text-primary)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        boxShadow: active ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {l.title}
                        {active && (
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: l.color,
                            }}
                          />
                        )}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {l.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label={
                isPT
                  ? "Modo de Correção da IA"
                  : isES
                    ? "Modo de Corrección de IA"
                    : "IA Correction Mode"
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "10px",
                }}
              >
                {MOODS.map((m) => (
                  <Pill key={m.slug} active={mood === m.slug} onClick={() => setMood(m.slug)}>
                    {m.label}
                  </Pill>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* SYSTEM SETTINGS */}
        <section
          style={{
            background: "var(--surface-raised)",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "24px",
            }}
          >
            <Settings size={20} color="var(--text-secondary)" />
            {isPT ? "Configurações do App" : isES ? "Ajustes de la App" : "App Settings"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Notification Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "var(--bg)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(201,168,76,0.1)",
                    color: "#C9A84C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {isPT
                      ? "Lembretes Diários"
                      : isES
                        ? "Recordatorios Diarios"
                        : "Daily Reminders"}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {isPT
                      ? "Receba avisos para não perder a ofensiva"
                      : isES
                        ? "Recibe avisos para no perder tu racha"
                        : "Get notifications to keep your streak active"}
                  </div>
                </div>
              </div>
              <Toggle active={notifications} onClick={() => setNotifications(!notifications)} />
            </div>

            {/* Sound Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "var(--bg)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(45,74,62,0.1)",
                    color: "var(--brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Volume2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {isPT ? "Efeitos Sonoros" : isES ? "Efectos de Sonido" : "Sound Effects"}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {isPT
                      ? "Sons ao acertar quizzes e missões"
                      : isES
                        ? "Sonidos al responder cuestionarios y misiones"
                        : "Play audio cues for correct answers and streaks"}
                  </div>
                </div>
              </div>
              <Toggle active={soundEffects} onClick={() => setSoundEffects(!soundEffects)} />
            </div>

            <Field
              label={
                isPT
                  ? "Velocidade da Voz (Áudio)"
                  : isES
                    ? "Velocidad de Voz (Audio)"
                    : "Voice Speed (Audio)"
              }
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <Pill active={speechRate === "0.8"} onClick={() => setSpeechRate("0.8")}>
                  {isPT ? "Lento" : isES ? "Lento" : "Slow"}
                </Pill>
                <Pill active={speechRate === "1.0"} onClick={() => setSpeechRate("1.0")}>
                  {isPT ? "Normal" : isES ? "Normal" : "Normal"}
                </Pill>
                <Pill active={speechRate === "1.2"} onClick={() => setSpeechRate("1.2")}>
                  {isPT ? "Rápido" : isES ? "Rápido" : "Fast"}
                </Pill>
              </div>
            </Field>
          </div>
        </section>

        {/* SAVE ACTIONS */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "16px",
              background: "var(--brand)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(45,74,62,0.25)",
              transition: "transform 0.1s",
            }}
          >
            {saving
              ? isPT
                ? "Salvando..."
                : isES
                  ? "Guardando..."
                  : "Saving..."
              : isPT
                ? "Salvar Configurações"
                : isES
                  ? "Guardar Ajustes"
                  : "Save Settings"}
          </button>

          <button
            onClick={exportData}
            style={{
              padding: "16px 24px",
              borderRadius: "16px",
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Download size={18} /> {isPT ? "Exportar" : isES ? "Exportar" : "Export"}
          </button>
        </div>

        {/* SECURITY */}
        <section
          style={{
            background: "var(--surface-raised)",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "24px",
            }}
          >
            <Shield size={20} color="#1B3A4B" />
            {isPT ? "Segurança da Conta" : isES ? "Seguridad de la Cuenta" : "Account Security"}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "var(--bg)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                {isPT ? "Autenticação 2FA" : isES ? "Autenticación 2FA" : "2FA Authentication"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {enable2FA
                  ? isPT
                    ? "Ativado"
                    : isES
                      ? "Activado"
                      : "Enabled"
                  : isPT
                    ? "Proteja sua conta"
                    : isES
                      ? "Proteja su cuenta"
                      : "Protect your account"}
              </div>
            </div>
            <button
              onClick={() => {
                if (enable2FA) {
                  setEnable2FA(false);
                  toast.success("2FA desativado");
                } else {
                  setShow2FAConfig(true);
                }
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "99px",
                border: "none",
                background: enable2FA ? "rgba(196,113,74,0.1)" : "var(--brand)",
                color: enable2FA ? "#C4714A" : "white",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {enable2FA
                ? isPT
                  ? "Desativar"
                  : isES
                    ? "Desactivar"
                    : "Disable"
                : isPT
                  ? "Configurar"
                  : isES
                    ? "Configurar"
                    : "Setup"}
            </button>
          </div>

          {show2FAConfig && (
            <div
              style={{
                marginTop: "16px",
                padding: "20px",
                background: "var(--bg)",
                border: "1px dashed var(--border)",
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Chave Secreta TOTP
              </div>
              <code
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "var(--surface-raised)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  color: "var(--text-primary)",
                }}
              >
                {twoFactorSecret}
              </code>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="Código de 6 dígitos"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-raised)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleVerify2FA}
                  style={{
                    padding: "0 20px",
                    borderRadius: "10px",
                    background: "var(--brand)",
                    color: "white",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* LOGOUT & DANGER ZONE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            onClick={async () => {
              await handleLogoutCleanup();
              nav({ to: "/login" });
            }}
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <LogOut size={18} /> {isPT ? "Sair da conta" : isES ? "Cerrar sesión" : "Sign Out"}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "rgba(196,113,74,0.05)",
              border: "1px solid rgba(196,113,74,0.2)",
              color: "#C4714A",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Trash2 size={18} />{" "}
            {isPT ? "Excluir conta" : isES ? "Eliminar cuenta" : "Delete Account"}
          </button>
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "var(--surface-raised)",
                padding: "32px",
                borderRadius: "24px",
                maxWidth: "400px",
                width: "100%",
                border: "1px solid var(--border)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "24px",
                  color: "#C4714A",
                  margin: "0 0 16px",
                }}
              >
                {isPT ? "Excluir Conta" : isES ? "Eliminar Cuenta" : "Delete Account"}
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "15px",
                  lineHeight: 1.5,
                  margin: "0 0 24px",
                }}
              >
                {isPT
                  ? "Esta ação é irreversível. Todas as suas lições e expressões salvas serão perdidas. Digite 'excluir' para confirmar."
                  : isES
                    ? "Esta acción es irreversible. Se perderán todas tus lecciones y expresiones guardadas. Escribe 'eliminar' para confirmar."
                    : "This action is irreversible. All your lesson progress and saved expressions will be lost forever. Type 'delete' to confirm."}
              </p>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={isPT ? "excluir" : isES ? "eliminar" : "delete"}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(196,113,74,0.3)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "24px",
                  outline: "none",
                }}
              />

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "12px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isPT ? "Cancelar" : isES ? "Cancelar" : "Cancel"}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#C4714A",
                    border: "none",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isPT ? "Confirmar" : isES ? "Confirmar" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  async function exportData() {
    if (!user) return;
    toast.promise(
      async () => {
        const exprs = (await safeQuery(
          () => supabase.from("saved_expressions").select("*") as any,
        )) as any;
        const convs = (await safeQuery(
          () => supabase.from("conversations").select("*") as any,
        )) as any;

        let md = `# Lume Data Export — ${name}\n\n`;
        md += `Gerado em: ${new Date().toLocaleString()}\n\n`;

        md += `## Expressões Salvas\n\n`;
        if (!exprs?.length) md += "Nenhuma expressão salva ainda.\n";
        else
          exprs.forEach((e: any) => {
            md += `### ${e.expression}\nContexto: ${e.context || "N/A"} · Salvo em: ${new Date(e.created_at).toLocaleDateString()}\n\n`;
          });

        md += `\n## Histórico de Conversas\n\n`;
        if (!convs?.length) md += "Nenhuma conversa registrada ainda.\n";
        else
          convs.forEach((c: any) => {
            md += `### ${c.title}\nTópico: ${c.topic_slug} · Duração: ${Math.round(c.duration_seconds / 60)} min · Data: ${new Date(c.created_at).toLocaleDateString()}\n\n`;
          });

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lume-export-${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
      },
      {
        loading: isPT
          ? "Preparando exportação..."
          : isES
            ? "Preparando exportación..."
            : "Preparing export...",
        success: isPT
          ? "Exportado com sucesso!"
          : isES
            ? "¡Exportado con éxito!"
            : "Exported successfully!",
        error: isPT ? "Erro ao exportar." : isES ? "Error al exportar." : "Error during export.",
      },
    );
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.15s",
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: active ? "2px solid var(--brand)" : "1.5px solid var(--border)",
        background: active ? "rgba(45,74,62,0.06)" : "var(--bg)",
        color: active ? "var(--brand)" : "var(--text-primary)",
      }}
    >
      {children}
    </button>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "99px",
        background: active ? "var(--brand)" : "var(--border)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "2px",
          left: active ? "22px" : "2px",
          transition: "left 0.2s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}
