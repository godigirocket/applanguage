import { uiFallback } from "@/i18n/ui-fallback";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { Mail, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { Logo } from "@/components/lume/Logo";
import { withTimeout } from "@/lib/promise-timeout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recuperar senha - Lume" },
      { name: "description", content: "Receba um link seguro para redefinir sua senha no Lume." },
    ],
  }),
  component: ForgotPassword,
});

function friendlyResetError(message: string, isPT: boolean) {
  const lower = message.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return isPT
      ? "Nao consegui conectar ao servidor de recuperacao. Verifique sua conexão e tente novamente."
      : uiFallback(
          "Could not connect to the recovery server. Check your connection and try again.",
        );
  }
  if (lower.includes("invalid") && lower.includes("email")) {
    return isPT
      ? "Use um email real e valido para receber o link."
      : uiFallback("Use a real, valid email to receive the link.");
  }
  if (lower.includes("rate limit")) {
    return isPT
      ? "Muitas tentativas. Aguarde alguns minutos e tente de novo."
      : uiFallback("Too many attempts. Wait a few minutes and try again.");
  }
  return message;
}

function ForgotPassword() {
  const clientReady = useClientReady();
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const isPT = interfaceLanguage === "pt";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    try {
      const { error: resetError } = await withTimeout(
        supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo,
        }),
        8000,
        "Auth request timeout",
      );

      if (resetError) {
        const friendly = friendlyResetError(resetError.message, isPT);
        setError(friendly);
        toast.error(friendly);
        return;
      }

      setSent(true);
      toast.success(isPT ? "Link enviado!" : uiFallback("Link sent!"));
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to fetch";
      const friendly = friendlyResetError(message, isPT);
      setError(friendly);
      toast.error(friendly);
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
            <span>{isPT ? "Acesso seguro" : uiFallback("Secure access")}</span>
          </div>
          <h1>
            {isPT
              ? "Recupere sua conta sem perder o ritmo."
              : uiFallback("Recover your account without losing momentum.")}
          </h1>
          <p>
            {isPT
              ? "Enviamos um link seguro para o email cadastrado. Depois dele, voce cria uma nova senha."
              : uiFallback(
                  "We send a secure link to your account email. Then you create a new password.",
                )}
          </p>
        </section>

        <section
          className="lume-auth-card animated-container"
          aria-label={isPT ? "Recuperar senha" : uiFallback("Reset password")}
        >
          {!sent ? (
            <>
              <h2>{isPT ? "Recuperar senha" : uiFallback("Reset password")}</h2>
              <p>
                {isPT
                  ? "Digite o email da sua conta Lume."
                  : uiFallback("Enter your Lume account email.")}
              </p>

              <form
                onSubmit={handleSubmit}
                className="lume-auth-form"
                aria-label={isPT ? "Recuperar senha" : uiFallback("Reset password")}
              >
                <div>
                  <label htmlFor="reset-email">Email</label>
                  <div className="lume-auth-field">
                    <Mail size={18} />
                    <input
                      id="reset-email"
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
                  {loading ? "..." : isPT ? "Enviar link" : uiFallback("Send link")}{" "}
                  {loading ? null : <Send size={18} />}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div className="lume-mail-success">
                <Mail size={32} />
              </div>
              <h2>{isPT ? "Confira seu email" : uiFallback("Check your email")}</h2>
              <p>
                {isPT ? "Enviamos o link para" : uiFallback("We sent the link to")}{" "}
                <strong>{email}</strong>
              </p>
            </div>
          )}

          <div className="lume-auth-footer">
            <Link to="/login" className="hover-underline">
              {isPT ? "Voltar ao login" : uiFallback("Back to login")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
