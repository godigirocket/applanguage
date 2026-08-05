import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Logo } from "@/components/lume/Logo";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar - Lume" },
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
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (signUpData.session) {
          toast.success(isPT ? "Conta criada!" : "Account created!");
          nav({ to: "/onboarding" });
        } else {
          toast.success(isPT ? "Conta criada! Verifique seu email para confirmar." : "Account created! Check your email to confirm.");
          setError(isPT ? "Verifique seu email para confirmar a conta e depois faça login." : "Check your email to confirm your account, then log in.");
        }
        return;
      }

      if (signInError.message.includes("Email not confirmed")) {
        setError(isPT ? "Email não confirmado. Verifique sua caixa de entrada e spam." : "Email not confirmed. Check your inbox and spam folder.");
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
    <div className="lume-auth-page">
      <div className="lume-auth-shell">
        <section className="lume-auth-copy" aria-label="Lume">
          <Logo size={64} />
          <div className="lume-auth-kicker">
            <Sparkles size={16} />
            <span>{isPT ? "Rotina inteligente de idiomas" : "Smarter language routine"}</span>
          </div>
          <h1>{isPT ? "Entre e continue de onde parou." : "Sign in and keep your streak alive."}</h1>
          <p>
            {isPT
              ? "Lições curtas, IA, jogos e progresso em um app com a nova identidade Lume."
              : "Short lessons, AI practice, games and progress in the new Lume identity."}
          </p>
        </section>

        <section className="lume-auth-card animated-container" aria-label={isPT ? "Entrar" : "Sign in"}>
          <h2>{isPT ? "Entrar" : "Sign in"}</h2>
          <p>{isPT ? "Use seu email e senha para continuar." : "Use your email and password to continue."}</p>

          <form onSubmit={onSubmit} className="lume-auth-form" aria-label={isPT ? "Formulário de login" : "Login form"}>
            <div>
              <label htmlFor="login-email">Email</label>
              <div className="lume-auth-field">
                <Mail size={18} />
                <input
                  id="login-email"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password">{isPT ? "Senha" : "Password"}</label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="login-password"
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? (isPT ? "Ocultar senha" : "Hide password") : (isPT ? "Mostrar senha" : "Show password")}
                  className="lume-auth-eye"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="lume-auth-error">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold lume-auth-submit">
              {loading ? "..." : isPT ? "Entrar" : "Sign in"} <ChevronRight size={18} />
            </button>
          </form>

          <div className="lume-auth-footer">
            <a href="/forgot-password" className="hover-underline">
              {isPT ? "Esqueceu a senha?" : "Forgot password?"}
            </a>
          </div>
        </section>

        <p className="lume-auth-terms">
          {isPT ? "Ao entrar, você concorda com nossos Termos." : "By signing in you agree to our Terms."}
        </p>
      </div>
    </div>
  );
}
