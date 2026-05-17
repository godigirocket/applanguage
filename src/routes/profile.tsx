import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeQuery, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { MOODS } from "@/lib/topics";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Seu Perfil & Segurança — Lume" }] }),
  component: Profile,
});

type AuditLog = { action: string; ip: string; timestamp: string };

function Profile() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  
  // Profile settings
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<"pt" | "en">("en");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [mood, setMood] = useState<"calm" | "intensive" | "cultural" | "confidence">("calm");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Advanced customization state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");

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
    { action: "Sessão iniciada", ip: "192.168.1.45", timestamp: new Date(Date.now() - 3600000).toLocaleString() },
    { action: "Preferências atualizadas", ip: "192.168.1.45", timestamp: new Date(Date.now() - 7200000).toLocaleString() }
  ]);

  useEffect(() => {
    if (!loading && !user) { nav({ to: "/login" }); return; }
    if (!user || loaded) return;
    (async () => {
      const data = await safeQuery(() => supabase.from("profiles").select("full_name, language, level, preferred_mood").eq("id", user.id).maybeSingle());
      if (data) {
        setName(data.full_name ?? "");
        setLanguage(data.language as "pt" | "en");
        setLevel(data.level as any);
        setMood(data.preferred_mood as any);
        setLoaded(true);
      }
    })();
  }, [user, loading, nav, loaded]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name, language, level, preferred_mood: mood,
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Suas preferências foram atualizadas com sucesso!");
      logSecurityAction("Configurações atualizadas");
    }
  }

  const logSecurityAction = (action: string) => {
    setAuditLogs(prev => [
      { action, ip: "192.168.1.45", timestamp: new Date().toLocaleString() },
      ...prev
    ]);
  };

  const handleVerify2FA = () => {
    if (totpCode === "123456") {
      setEnable2FA(true);
      setShow2FAConfig(false);
      toast.success("Autenticação em duas etapas (2FA) ativada com sucesso!");
      logSecurityAction("2FA ativado");
    } else {
      toast.error("Código TOTP inválido. Tente usar '123456' para o teste.");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() === "excluir conta") {
      toast.loading("Excluindo conta de forma segura...");
      setTimeout(async () => {
        if (user) {
          await supabase.from("profiles").delete().eq("id", user.id);
          await supabase.auth.signOut();
        }
        toast.dismiss();
        toast.success("Sua conta foi excluída com sucesso.");
        nav({ to: "/signup" });
      }, 2000);
    } else {
      toast.error("Por favor, digite 'excluir conta' exatamente para confirmar.");
    }
  };

  const initials = name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "L";

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF', color: '#1C1C1A' }}>
      <AppHeader />
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 24px 120px', animation: 'pageEnter 0.6s ease forwards' }}>
        
        <header style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #2D4A3E, #1B3A4B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display', fontSize: '32px', fontWeight: 800, color: 'white', boxShadow: '0 4px 16px rgba(45,74,62,0.2)' }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '32px', fontWeight: 800, color: '#1C1C1A', margin: 0 }}>{name || "Seu perfil"}</h1>
            <p style={{ color: '#6B6B63', margin: '4px 0 0', fontSize: '15px' }}>{user?.email}</p>
          </div>
        </header>

        {/* PROFILE PREFERENCES CARD */}
        <div className="glass" style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: 700, color: '#1C1C1A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Preferências de Aprendizado
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Field label="Nome Completo">
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid #E0DDD6', background: '#F7F4EF', outline: 'none', fontWeight: 600, fontSize: '15px' }}
                placeholder="Como quer ser chamado?"
              />
            </Field>

            <Field label="Idioma de Estudo">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Pill active={language === "pt"} onClick={() => setLanguage("pt")}>Português</Pill>
                <Pill active={language === "en"} onClick={() => setLanguage("en")}>English</Pill>
              </div>
            </Field>

            <Field label="Nível Atual de Conversação">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                  <Pill key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Pill>
                ))}
              </div>
            </Field>

            <Field label="Modo de Correção da IA">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {MOODS.map((m) => (
                  <Pill key={m.slug} active={mood === m.slug} onClick={() => setMood(m.slug)}>
                    <span style={{ marginRight: '6px' }}>{m.icon}</span> {m.label}
                  </Pill>
                ))}
              </div>
            </Field>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(45,74,62,0.2)' }}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button onClick={exportData} style={{ padding: '16px 24px', borderRadius: '16px', border: '1px solid #E0DDD6', background: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: '#6B6B63', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Exportar Dados <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION CARD */}
        <div className="glass" style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: 700, color: '#1C1C1A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Personalização de Aparência
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Field label="Tema de Fundo">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Pill active={theme === "light"} onClick={() => setTheme("light")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Claro</Pill>
                <Pill active={theme === "dark"} onClick={() => { setTheme("dark"); toast.info("Tema escuro será aplicado nas próximas interações."); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Escuro</Pill>
              </div>
            </Field>

            <Field label="Tamanho da Fonte das Conversas">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <Pill active={fontSize === "small"} onClick={() => setFontSize("small")}>A- Pequeno</Pill>
                <Pill active={fontSize === "medium"} onClick={() => setFontSize("medium")}>A Padrão</Pill>
                <Pill active={fontSize === "large"} onClick={() => setFontSize("large")}>A+ Grande</Pill>
              </div>
            </Field>
          </div>
        </div>

        {/* SECURITY & 2FA CARD */}
        <div className="glass" style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: 700, color: '#1C1C1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Segurança & Verificação 2FA
          </h2>
          <p style={{ color: '#6B6B63', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
            Proteja sua conta adicionando uma camada extra de segurança. Ao ativar, você precisará de um código do seu aplicativo autenticador para fazer login.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', justifyContentSpace: 'space-between', justifyContentItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', background: '#F7F4EF', border: '1px solid #E0DDD6', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Autenticação em Duas Etapas (TOTP)</div>
              <div style={{ fontSize: '12px', color: '#6B6B63', marginTop: '2px' }}>{enable2FA ? "Ativo e protegido" : "Desativado"}</div>
            </div>
            <button 
              onClick={() => {
                if (enable2FA) {
                  setEnable2FA(false);
                  logSecurityAction("2FA desativado");
                  toast.success("2FA desativado.");
                } else {
                  setShow2FAConfig(true);
                }
              }} 
              style={{ padding: '8px 18px', borderRadius: '99px', border: 'none', background: enable2FA ? '#C4714A' : '#2D4A3E', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              {enable2FA ? "Desativar" : "Configurar"}
            </button>
          </div>

          {show2FAConfig && (
            <div style={{ padding: '20px', borderRadius: '16px', background: '#F7F4EF', border: '1px solid #C4714A30', marginTop: '16px', animation: 'pageEnter 0.3s ease' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
                {/* Mock QR Code SVG */}
                <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E0DDD6' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <rect x="5" y="5" width="20" height="20" fill="#1C1C1A" />
                    <rect x="10" y="10" width="10" height="10" fill="white" />
                    <rect x="75" y="5" width="20" height="20" fill="#1C1C1A" />
                    <rect x="80" y="10" width="10" height="10" fill="white" />
                    <rect x="5" y="75" width="20" height="20" fill="#1C1C1A" />
                    <rect x="10" y="80" width="10" height="10" fill="white" />
                    <rect x="35" y="35" width="30" height="30" fill="#1C1C1A" />
                    <rect x="45" y="45" width="10" height="10" fill="white" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#C4714A' }}>Chave Secreta</div>
                  <code style={{ fontSize: '14px', background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E0DDD6', display: 'inline-block', margin: '6px 0', fontFamily: 'monospace', fontWeight: 'bold' }}>{twoFactorSecret}</code>
                  <p style={{ fontSize: '12px', color: '#6B6B63', margin: 0 }}>Escaneie o QR Code ou insira a chave no seu app (Google Authenticator ou Authy).</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={totpCode} 
                  onChange={e => setTotpCode(e.target.value)} 
                  placeholder="Código de 6 dígitos (digite 123456)" 
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #E0DDD6', outline: 'none', fontSize: '14px', fontWeight: 600 }}
                />
                <button onClick={handleVerify2FA} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#2D4A3E', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Confirmar</button>
              </div>
            </div>
          )}
        </div>

        {/* SECURITY AUDIT LOG CARD */}
        <div className="glass" style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: 700, color: '#1C1C1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Histórico de Ações de Segurança
          </h2>
          <p style={{ color: '#6B6B63', fontSize: '14px', marginBottom: '24px' }}>Logs de auditoria dos eventos recentes da sua conta.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: '#F7F4EF', border: '1px solid #E0DDD650', fontSize: '13px' }}>
                <span style={{ fontWeight: 700, color: '#2D4A3E' }}>{log.action}</span>
                <span style={{ color: '#6B6B63' }}>IP: {log.ip} · {log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DELETE ACCOUNT ZONE */}
        <div className="glass" style={{ background: 'rgba(196,113,74,0.05)', borderRadius: '32px', padding: '32px', border: '1px solid rgba(196,113,74,0.2)' }}>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '20px', fontWeight: 700, color: '#C4714A', marginBottom: '8px' }}>Zona Crítica</h3>
          <p style={{ color: '#6B6B63', fontSize: '14px', marginBottom: '20px' }}>Ao excluir sua conta, todas as suas lições, expressões salvas e progresso de conversação serão deletados permanentemente.</p>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#C4714A', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            Excluir Minha Conta
          </button>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center', animation: 'bounceIn 0.4s ease' }}>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '24px', color: '#C4714A', marginBottom: '12px', fontWeight: 800 }}>Tem certeza absoluta?</h2>
              <p style={{ fontSize: '14px', color: '#6B6B63', lineHeight: 1.5, marginBottom: '24px' }}>
                Esta ação é irreversível. Para confirmar, digite <strong>excluir conta</strong> no campo abaixo.
              </p>
              <input 
                type="text" 
                value={deleteConfirmText} 
                onChange={e => setDeleteConfirmText(e.target.value)} 
                placeholder="excluir conta" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #C4714A30', outline: 'none', fontSize: '14px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E0DDD6', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleDeleteAccount} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#C4714A', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Confirmar Exclusão</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );

  async function exportData() {
    if (!user) return;
    toast.promise(async () => {
      const exprs = await safeQuery(() => supabase.from("saved_expressions").select("*"));
      const convs = await safeQuery(() => supabase.from("conversations").select("*"));
      
      let md = `# Lume Data Export — ${name}\n\n`;
      md += `Gerado em: ${new Date().toLocaleString()}\n\n`;
      
      md += `## Expressões Salvas\n\n`;
      if (!exprs?.length) md += "Nenhuma expressão salva ainda.\n";
      else exprs.forEach(e => {
        md += `### ${e.expression}\nContexto: ${e.context || 'N/A'} · Salvo em: ${new Date(e.created_at).toLocaleDateString()}\n\n`;
      });
      
      md += `\n## Histórico de Conversas\n\n`;
      if (!convs?.length) md += "Nenhuma conversa registrada ainda.\n";
      else convs.forEach(c => {
        md += `### ${c.title}\nTópico: ${c.topic_slug} · Duração: ${Math.round(c.duration_seconds / 60)} min · Data: ${new Date(c.created_at).toLocaleDateString()}\n\n`;
      });
      
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lume-export-${new Date().toISOString().slice(0,10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
      logSecurityAction("Dados exportados");
    }, {
      loading: 'Preparando exportação de dados...',
      success: 'Dados exportados com sucesso!',
      error: 'Erro ao exportar seus dados.'
    });
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B63' }}>{label}</label>
      {children}
    </div>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      style={{
        padding: '14px 20px', borderRadius: '12px', border: active ? '2px solid #2D4A3E' : '1px solid #E0DDD6', background: active ? 'rgba(45,74,62,0.05)' : 'white', color: active ? '#2D4A3E' : '#6B6B63', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
      }}
    >
      {children}
    </button>
  );
}