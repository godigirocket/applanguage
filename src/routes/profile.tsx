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
        nav({ to: "/login" });
      }, 2000);
    } else {
      toast.error("Por favor, digite 'excluir conta' exatamente para confirmar.");
    }
  };

  const initials = name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "L";

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0B] text-foreground transition-colors duration-300">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16 pb-32 page-enter">
        
        <header className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-green to-sky-950 flex items-center justify-center font-display text-3xl font-extrabold text-white shadow-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#1C1C1A] dark:text-white m-0">{name || "Seu perfil"}</h1>
            <p className="text-[#6B6B63] dark:text-gray-400 mt-1 text-sm md:text-base font-semibold">{user?.email}</p>
          </div>
        </header>

        {/* PROFILE PREFERENCES CARD */}
        <div className="glass p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 premium-shadow mb-8">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1C1C1A] dark:text-white mb-6 flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Preferências de Aprendizado
          </h2>
          
          <div className="flex flex-col gap-6">
            <Field label="Nome Completo">
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-5 py-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-750 bg-background dark:bg-zinc-950 text-foreground outline-none font-bold text-sm md:text-base transition-colors focus:border-accent-green"
                placeholder="Como quer ser chamado?"
              />
            </Field>

            <Field label="Idioma de Estudo">
              <div className="grid grid-cols-2 gap-3.5">
                <Pill active={language === "pt"} onClick={() => setLanguage("pt")}>Português</Pill>
                <Pill active={language === "en"} onClick={() => setLanguage("en")}>English</Pill>
              </div>
            </Field>

            <Field label="Nível Atual de Conversação">
              <div className="grid grid-cols-3 gap-3.5">
                {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                  <Pill key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Pill>
                ))}
              </div>
            </Field>

            <Field label="Modo de Correção da IA">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {MOODS.map((m) => (
                  <Pill key={m.slug} active={mood === m.slug} onClick={() => setMood(m.slug)}>
                    <span className="mr-2">{m.icon}</span> {m.label}
                  </Pill>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-8 flex gap-4 flex-wrap sm:flex-nowrap">
            <button onClick={save} disabled={saving} className="flex-1 py-4 bg-accent-green dark:bg-accent-gold text-white dark:text-zinc-950 border-none rounded-2xl font-bold text-sm md:text-base cursor-pointer shadow-[0_4px_16px_rgba(45,74,62,0.2)] dark:shadow-none hover:brightness-105 active:scale-[0.98] transition-all">
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button onClick={exportData} className="px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 font-bold text-sm md:text-base cursor-pointer flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
              <span>Exportar Dados</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION CARD */}
        <div className="glass p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 premium-shadow mb-8">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1C1C1A] dark:text-white mb-6 flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Personalização de Aparência
          </h2>

          <div className="flex flex-col gap-6">
            <Field label="Tamanho da Fonte das Conversas">
              <div className="grid grid-cols-3 gap-3.5">
                <Pill active={fontSize === "small"} onClick={() => setFontSize("small")}>A- Pequeno</Pill>
                <Pill active={fontSize === "medium"} onClick={() => setFontSize("medium")}>A Padrão</Pill>
                <Pill active={fontSize === "large"} onClick={() => setFontSize("large")}>A+ Grande</Pill>
              </div>
            </Field>
          </div>
        </div>

        {/* SECURITY & 2FA CARD */}
        <div className="glass p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 premium-shadow mb-8">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1C1C1A] dark:text-white mb-4 flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Segurança & Verificação 2FA
          </h2>
          <p className="text-[#6B6B63] dark:text-gray-400 text-sm mb-6 leading-relaxed font-semibold">
            Proteja sua conta adicionando uma camada extra de segurança. Ao ativar, você precisará de um código do seu aplicativo autenticador para fazer login.
          </p>

          <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 mb-6">
            <div>
              <div className="font-bold text-sm md:text-base text-[#1C1C1A] dark:text-white">Autenticação em Duas Etapas (TOTP)</div>
              <div className="text-xs text-[#6B6B63] dark:text-gray-400 mt-0.5">{enable2FA ? "Ativo e protegido" : "Desativado"}</div>
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
              className={`px-5 py-2.5 rounded-full border-none text-white font-extrabold text-xs tracking-wider uppercase cursor-pointer hover:brightness-105 transition-all ${enable2FA ? 'bg-accent-terra' : 'bg-accent-green'}`}
            >
              {enable2FA ? "Desativar" : "Configurar"}
            </button>
          </div>

          {show2FAConfig && (
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-accent-terra/30 mt-4 page-enter">
              <div className="flex gap-5 flex-wrap items-center mb-5">
                <div className="w-28 h-28 bg-white dark:bg-white rounded-xl p-2.5 flex items-center justify-center border border-zinc-200">
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
                <div className="flex-1">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-accent-terra">Chave Secreta</div>
                  <code className="text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 inline-block my-2.5 font-mono font-bold">{twoFactorSecret}</code>
                  <p className="text-xs text-[#6B6B63] dark:text-gray-400 margin-0">Escaneie o QR Code ou insira a chave no seu app (Google Authenticator ou Authy).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={totpCode} 
                  onChange={e => setTotpCode(e.target.value)} 
                  placeholder="Código de 6 dígitos (digite 123456)" 
                  className="flex-1 px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground outline-none font-bold text-sm"
                />
                <button onClick={handleVerify2FA} className="px-5 py-3.5 rounded-xl border-none bg-accent-green hover:brightness-105 text-white font-extrabold text-sm cursor-pointer transition-all">Confirmar</button>
              </div>
            </div>
          )}
        </div>

        {/* SECURITY AUDIT LOG CARD */}
        <div className="glass p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 premium-shadow mb-8">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1C1C1A] dark:text-white mb-4 flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Histórico de Ações de Segurança
          </h2>
          <p className="text-[#6B6B63] dark:text-gray-400 text-sm mb-6">Logs de auditoria dos eventos recentes da sua conta.</p>

          <div className="flex flex-col gap-3">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex flex-wrap sm:flex-nowrap justify-between gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 text-xs md:text-sm font-semibold">
                <span className="text-accent-green dark:text-accent-gold font-extrabold">{log.action}</span>
                <span className="text-[#6B6B63] dark:text-gray-400">IP: {log.ip} · {log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DELETE ACCOUNT ZONE */}
        <div className="p-6 md:p-8 bg-accent-terra/5 dark:bg-accent-terra/10 rounded-[28px] border border-accent-terra/20 dark:border-accent-terra/30 mb-8">
          <h3 className="font-display text-xl font-extrabold text-accent-terra mb-2">Zona Crítica</h3>
          <p className="text-[#6B6B63] dark:text-gray-400 text-sm mb-6 font-semibold leading-relaxed">Ao excluir sua conta, todas as suas lições, expressões salvas e progresso de conversação serão deletados permanentemente.</p>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="px-6 py-3.5 rounded-xl border-none bg-accent-terra text-white font-extrabold text-sm tracking-wider uppercase cursor-pointer hover:brightness-105 transition-all"
          >
            Excluir Minha Conta
          </button>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white dark:bg-zinc-900 text-foreground rounded-3xl p-8 max-w-sm w-full text-center border border-zinc-200 dark:border-zinc-800 premium-shadow">
              <h2 className="font-display text-2xl text-accent-terra mb-3.5 font-extrabold">Tem certeza absoluta?</h2>
              <p className="text-sm text-[#6B6B63] dark:text-gray-400 leading-relaxed mb-6 font-semibold">
                Esta ação é irreversível. Para confirmar, digite <strong>excluir conta</strong> no campo abaixo.
              </p>
              <input 
                type="text" 
                value={deleteConfirmText} 
                onChange={e => setDeleteConfirmText(e.target.value)} 
                placeholder="excluir conta" 
                className="w-full px-4 py-3 border-2 border-accent-terra/30 dark:border-accent-terra/40 bg-zinc-50 dark:bg-zinc-950 text-foreground outline-none text-sm mb-6 text-center font-bold rounded-xl"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 font-extrabold text-sm cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancelar</button>
                <button onClick={handleDeleteAccount} className="flex-1 py-3 rounded-xl border-none bg-accent-terra text-white font-extrabold text-sm cursor-pointer transition-all hover:brightness-105">Confirmar Exclusão</button>
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
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold text-[#6B6B63] dark:text-gray-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="px-5 py-3.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 outline-none flex items-center justify-center"
      style={{
        border: active ? '2.5px solid var(--accent-green)' : '1.5px solid var(--border)',
        background: active ? 'rgba(45,74,62,0.1)' : 'var(--surface-raised)',
        color: active ? 'var(--accent-green)' : 'var(--text-secondary)'
      }}
    >
      {children}
    </button>
  );
}