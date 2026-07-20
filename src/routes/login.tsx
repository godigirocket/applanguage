import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — LangLume" },
      { name: "description", content: "Faça login para aprender idiomas com IA." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isPT = interfaceLanguage === "pt";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(isPT ? "Senha precisa ter no mínimo 6 caracteres" : "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (!signInError) {
        toast.success(isPT ? "Bem-vindo!" : "Welcome!");
        nav({ to: "/home" });
        return;
      }
      if (signInError.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        toast.success(isPT ? "Conta criada!" : "Account created!");
        nav({ to: "/onboarding" });
        return;
      }
      setError(signInError.message);
    } catch {
      setError(isPT ? "Erro de conexão. Verifique sua internet." : "Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#2D4A3E", letterSpacing: "-0.02em" }}>LangLume</h1>
          <p style={{ fontSize: "14px", color: "#6B6B63", marginTop: "4px" }}>
            {isPT ? "Aprenda idiomas praticando" : "Learn languages by practicing"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #E8E6E1" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1C1A", marginBottom: "4px" }}>
            {isPT ? "Entrar" : "Sign in"}
          </h2>
          <p style={{ fontSize: "13px", color: "#8B8B83", marginBottom: "24px" }}>
            {isPT ? "Email e senha para continuar" : "Email and password to continue"}
          </p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A45", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                required type="email" autoComplete="email" placeholder="seu@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #E5E5E3", background: "#FAFAF9", fontSize: "15px", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A45", display: "block", marginBottom: "6px" }}>
                {isPT ? "Senha" : "Password"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  required type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: "10px", border: "1.5px solid #E5E5E3", background: "#FAFAF9", fontSize: "15px", outline: "none" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8B8B83", cursor: "pointer", padding: "4px" }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: "10px", background: "#2D4A3E", color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : isPT ? "Entrar" : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <a href="/forgot-password" style={{ fontSize: "13px", color: "#2D4A3E", fontWeight: 600, textDecoration: "none" }}>
              {isPT ? "Esqueceu a senha?" : "Forgot password?"}
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#A0A098", marginTop: "20px" }}>
          {isPT ? "Ao entrar, você concorda com nossos Termos" : "By signing in you agree to our Terms"}
        </p>
      </div>
    </div>
  );
}
