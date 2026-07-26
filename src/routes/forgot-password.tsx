import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const isPT = interfaceLanguage === "pt";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success(isPT ? "Link enviado!" : "Link sent!");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--brand)" }}>LangLume</h1>
        </div>

        <div style={{ background: "var(--card-bg)", borderRadius: "20px", padding: "32px 28px", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border)" }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                {isPT ? "Recuperar senha" : "Reset password"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                {isPT ? "Enviaremos um link de recuperação" : "We'll send you a reset link"}
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Email</label>
                  <input
                    required type="email" placeholder="seu@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid var(--border)", background: "var(--surface-raised)", fontSize: "15px", outline: "none", color: "var(--text-primary)" }}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg, var(--brand), var(--brand-2))", color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "..." : isPT ? "Enviar link" : "Send link"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
                {isPT ? "Verifique seu email" : "Check your email"}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {isPT ? "Enviamos um link de recuperação para" : "We sent a reset link to"} <strong>{email}</strong>
              </p>
            </div>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/login" style={{ fontSize: "13px", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
              ← {isPT ? "Voltar ao login" : "Back to login"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
