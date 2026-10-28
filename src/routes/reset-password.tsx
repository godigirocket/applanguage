import { uiFallback } from "@/i18n/ui-fallback";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { Logo } from "@/components/lume/Logo";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/promise-timeout";
import { useClientReady } from "@/hooks/useClientReady";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha - Lume" },
      { name: "description", content: "Defina uma nova senha para sua conta Lume." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const clientReady = useClientReady();
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isPT = interfaceLanguage === "pt";

  useEffect(() => {
    let cancelled = false;
    withTimeout(supabase.auth.getSession(), 8000)
      .then(({ data }) => {
        if (!cancelled) setReady(Boolean(data.session));
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!ready) {
      setError(
        isPT
          ? "Abra esta tela pelo link recebido no email."
          : uiFallback("Open this screen from the link in your email."),
      );
      return;
    }

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
      const { error: updateError } = await withTimeout(
        supabase.auth.updateUser({ password }),
        8000,
        "Auth request timeout",
      );

      if (updateError) {
        const lower = updateError.message.toLowerCase();
        setError(
          lower.includes("failed to fetch") || lower.includes("networkerror")
            ? isPT
              ? "Nao consegui conectar ao servidor de senha. Verifique sua conexão e tente novamente."
              : uiFallback(
                  "Could not connect to the password server. Check your connection and try again.",
                )
            : updateError.message,
        );
        return;
      }

      toast.success(isPT ? "Senha atualizada!" : uiFallback("Password updated!"));
      nav({ to: "/home" });
    } catch {
      setError(
        isPT
          ? "Nao consegui conectar ao servidor de senha. Verifique sua conexão e tente novamente."
          : uiFallback(
              "Could not connect to the password server. Check your connection and try again.",
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
            <span>{isPT ? "Nova senha" : uiFallback("New password")}</span>
          </div>
          <h1>
            {isPT
              ? "Defina uma senha nova e volte ao jogo."
              : uiFallback("Set a new password and get back in.")}
          </h1>
          <p>
            {isPT
              ? "Use uma senha facil de lembrar e dificil de adivinhar."
              : uiFallback("Use a password that is easy to remember and hard to guess.")}
          </p>
        </section>

        <section
          className="lume-auth-card animated-container"
          aria-label={isPT ? "Definir nova senha" : uiFallback("Set new password")}
        >
          <h2>{isPT ? "Definir nova senha" : uiFallback("Set new password")}</h2>
          <p>
            {ready
              ? isPT
                ? "Digite sua nova senha abaixo."
                : uiFallback("Enter your new password below.")
              : isPT
                ? "Aguardando o link seguro do email."
                : uiFallback("Waiting for the secure email link.")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="lume-auth-form"
            aria-label={isPT ? "Nova senha" : uiFallback("New password")}
          >
            <div>
              <label htmlFor="new-password">
                {isPT ? "Nova senha" : uiFallback("New password")}
              </label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="new-password"
                  disabled={!clientReady || !ready}
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
              <label htmlFor="new-password-confirm">
                {isPT ? "Confirmar senha" : uiFallback("Confirm password")}
              </label>
              <div className="lume-auth-field">
                <LockKeyhole size={18} />
                <input
                  id="new-password-confirm"
                  disabled={!clientReady || !ready}
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
              disabled={loading || !clientReady || !ready}
              className="btn-gold lume-auth-submit"
            >
              {loading ? "..." : isPT ? "Salvar nova senha" : uiFallback("Save new password")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
