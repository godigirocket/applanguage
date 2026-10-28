import { uiFallback } from "@/i18n/ui-fallback";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { toast } from "sonner";
import { ChevronRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Logo } from "@/components/lume/Logo";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/promise-timeout";
import { safeAuthRedirect } from "@/lib/auth-redirect";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: safeAuthRedirect(search.redirect),
  }),
  head: () => ({
    meta: [
      { title: "Entrar - Lume" },
      { name: "description", content: "Faça login para aprender idiomas com prática guiada." },
    ],
  }),
  component: Login,
});

function Login() {
  const clientReady = useClientReady();
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isPT = interfaceLanguage === "pt";
  const connectionError = isPT
    ? "Nao consegui conectar ao servidor de login. Verifique sua conexão e tente novamente."
    : uiFallback("Could not connect to the login server. Check your connection and try again.");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(
        isPT
          ? "Senha precisa ter no mínimo 6 caracteres"
          : uiFallback("Password must be at least 6 characters"),
      );
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        }),
        8000,
        "Auth request timeout",
      );

      if (!signInError) {
        toast.success(isPT ? "Bem-vindo!" : uiFallback("Welcome!"));
        nav({ href: safeAuthRedirect(redirect), replace: true });
        return;
      }

      if (
        signInError.message.includes("Failed to fetch") ||
        signInError.message.includes("NetworkError")
      ) {
        setError(connectionError);
        return;
      }

      if (signInError.message.includes("Invalid login credentials")) {
        setError(
          isPT
            ? "Email ou senha incorretos. Se ainda nao tem conta, toque em Criar conta."
            : uiFallback(
                "Email or password is incorrect. If you do not have an account yet, choose Create account.",
              ),
        );
        return;
      }

      if (signInError.message.includes("Email not confirmed")) {
        setError(
          isPT
            ? "Email não confirmado. Verifique sua caixa de entrada e spam."
            : uiFallback("Email not confirmed. Check your inbox and spam folder."),
        );
        return;
      }

      setError(signInError.message);
    } catch {
      setError(connectionError);
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
            <span>
              {isPT ? "Rotina inteligente de idiomas" : uiFallback("Smarter language routine")}
            </span>
          </div>
          <h1>
            {isPT
              ? "Entre e continue de onde parou."
              : uiFallback("Sign in and keep your streak alive.")}
          </h1>
          <p>
            {isPT
              ? "Lições curtas, prática guiada, jogos e progresso em um app com a nova identidade Lume."
              : uiFallback(
                  "Short lessons, guided practice, games and progress in the new Lume identity.",
                )}
          </p>
        </section>

        <section
          className="lume-auth-card animated-container"
          aria-label={isPT ? "Entrar" : uiFallback("Sign in")}
        >
          <h2>{isPT ? "Entrar" : uiFallback("Sign in")}</h2>
          <p>
            {isPT
              ? "Use seu email e senha para continuar."
              : uiFallback("Use your email and password to continue.")}
          </p>

          <form
            onSubmit={onSubmit}
            className="lume-auth-form"
            aria-label={isPT ? "Formulário de login" : uiFallback("Login form")}
          >
            <div>
              <label htmlFor="login-email">Email</label>
              <div className="lume-auth-field">
                <Mail size={18} />
                <input
                  id="login-email"
                  disabled={!clientReady}
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
              <label htmlFor="login-password">{isPT ? "Senha" : uiFallback("Password")}</label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="login-password"
                  disabled={!clientReady}
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
                  aria-label={
                    showPassword
                      ? isPT
                        ? "Ocultar senha"
                        : uiFallback("Hide password")
                      : isPT
                        ? "Mostrar senha"
                        : uiFallback("Show password")
                  }
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

            <button
              type="submit"
              disabled={!clientReady || loading}
              className="btn-gold lume-auth-submit"
            >
              {loading ? "..." : isPT ? "Entrar" : uiFallback("Sign in")} <ChevronRight size={18} />
            </button>
          </form>

          <div className="lume-auth-footer">
            <a href="/forgot-password" className="hover-underline">
              {isPT ? "Esqueceu a senha?" : uiFallback("Forgot password?")}
            </a>
            <span aria-hidden="true"> · </span>
            <a href="/signup" className="hover-underline">
              {isPT ? "Criar conta" : uiFallback("Create account")}
            </a>
          </div>
        </section>

        <p className="lume-auth-terms">
          {isPT
            ? "Ao entrar, você concorda com nossos Termos."
            : uiFallback("By signing in you agree to our Terms.")}
        </p>
      </div>
    </div>
  );
}
