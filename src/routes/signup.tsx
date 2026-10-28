import { uiFallback } from "@/i18n/ui-fallback";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserPlus } from "lucide-react";
import { Logo } from "@/components/lume/Logo";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/promise-timeout";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Criar conta - Lume" },
      {
        name: "description",
        content: "Crie sua conta no Lume para aprender idiomas com prática guiada.",
      },
    ],
  }),
  component: Signup,
});

function friendlyAuthError(message: string, isPT: boolean) {
  const lower = message.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return isPT
      ? "Nao consegui conectar ao servidor de cadastro. Verifique sua conexão e tente novamente."
      : uiFallback("Could not connect to the signup server. Check your connection and try again.");
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return isPT
      ? "Este email ja tem conta. Entre pelo login."
      : uiFallback("This email already has an account. Sign in instead.");
  }
  if (lower.includes("invalid") && lower.includes("email")) {
    return isPT ? "Digite um email valido." : uiFallback("Enter a valid email.");
  }
  if (lower.includes("password")) {
    return isPT
      ? "Use uma senha mais forte, com pelo menos 6 caracteres."
      : uiFallback("Use a stronger password, at least 6 characters.");
  }
  return message;
}

function Signup() {
  const clientReady = useClientReady();
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isPT = interfaceLanguage === "pt";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(
        isPT
          ? "Senha precisa ter no minimo 6 caracteres."
          : uiFallback("Password must be at least 6 characters."),
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(isPT ? "As senhas nao conferem." : uiFallback("Passwords do not match."));
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        }),
        8000,
        "Auth request timeout",
      );

      if (signUpError) {
        setError(friendlyAuthError(signUpError.message, isPT));
        return;
      }

      if (data.session) {
        toast.success(isPT ? "Conta criada!" : uiFallback("Account created!"));
        nav({ to: "/onboarding" });
      } else {
        toast.success(
          isPT
            ? "Conta criada. Confira seu email para confirmar."
            : uiFallback("Account created. Check your email to confirm."),
        );
        nav({ to: "/login" });
      }
    } catch {
      setError(
        isPT
          ? "Nao consegui conectar ao servidor de cadastro. Verifique sua conexão e tente novamente."
          : uiFallback(
              "Could not connect to the signup server. Check your connection and try again.",
            ),
      );
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
            <span>{isPT ? "Comece sua jornada" : uiFallback("Start your journey")}</span>
          </div>
          <h1>
            {isPT
              ? "Crie sua conta e desbloqueie o mapa."
              : uiFallback("Create your account and unlock the map.")}
          </h1>
          <p>
            {isPT
              ? "Seu progresso, streak, lições e jogos ficam salvos em todos os dispositivos."
              : uiFallback("Your progress, streak, lessons and games stay synced across devices.")}
          </p>
        </section>

        <section
          className="lume-auth-card animated-container"
          aria-label={isPT ? "Criar conta" : uiFallback("Create account")}
        >
          <h2>{isPT ? "Criar conta" : uiFallback("Create account")}</h2>
          <p>
            {isPT
              ? "Use um email real para confirmar e recuperar acesso depois."
              : uiFallback("Use a real email so you can confirm and recover access later.")}
          </p>

          <form
            onSubmit={onSubmit}
            className="lume-auth-form"
            aria-label={isPT ? "Formulario de cadastro" : uiFallback("Signup form")}
          >
            <div>
              <label htmlFor="signup-email">Email</label>
              <div className="lume-auth-field">
                <Mail size={18} />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password">{isPT ? "Senha" : uiFallback("Password")}</label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="signup-password"
                  disabled={!clientReady}
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="minimo 6 caracteres"
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

            <div>
              <label htmlFor="signup-confirm">
                {isPT ? "Confirmar senha" : uiFallback("Confirm password")}
              </label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="signup-confirm"
                  disabled={!clientReady}
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
              {loading ? "..." : isPT ? "Criar conta" : uiFallback("Create account")}{" "}
              {loading ? null : <UserPlus size={18} />}
            </button>
          </form>

          <div className="lume-auth-footer">
            <a href="/login" className="hover-underline">
              {isPT ? "Ja tenho conta" : uiFallback("I already have an account")}
            </a>
          </div>
        </section>

        <p className="lume-auth-terms">
          {isPT
            ? "Ao criar conta, voce concorda com nossos Termos."
            : uiFallback("By creating an account you agree to our Terms.")}
        </p>
      </div>
    </div>
  );
}
