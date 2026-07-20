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
    <div style={{ minHeight: "100vh", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#2D4A3E" }}>LangLume</h1>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #E8E6E1" }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1C1A", marginBottom: "4px" }}>
                {isPT ? "Recuperar senha" : "Reset password"}
              </h2>
              <p style={{ fontSize: "13px", color: "#8B8B83", marginBottom: "24px" }}>
                {isPT ? "Enviaremos um link de recuperação" : "We'll send you a reset link"}
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A45", display: "block", marginBottom: "6px" }}>Email</label>
                  <input
                    required type="email" placeholder="seu@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #E5E5E3", background: "#FAFAF9", fontSize: "15px", outline: "none" }}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "13px", borderRadius: "10px", background: "#2D4A3E", color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "..." : isPT ? "Enviar link" : "Send link"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1C1A", marginBottom: "8px" }}>
                {isPT ? "Verifique seu email" : "Check your email"}
              </h2>
              <p style={{ fontSize: "14px", color: "#6B6B63" }}>
                {isPT ? "Enviamos um link de recuperação para" : "We sent a reset link to"} <strong>{email}</strong>
              </p>
            </div>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/login" style={{ fontSize: "13px", color: "#2D4A3E", fontWeight: 600, textDecoration: "none" }}>
              ← {isPT ? "Voltar ao login" : "Back to login"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
