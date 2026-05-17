import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Welcome to Lume" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPT = interfaceLanguage === "pt";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(isPT ? "A senha precisa ter pelo menos 6 caracteres." : "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    
    // 1. Attempt login first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!signInError) {
      setLoading(false);
      toast.success(isPT ? "Bem-vindo de volta! 👋" : "Welcome back! 👋");
      nav({ to: "/onboarding" });
      return;
    }

    // 2. If login fails, check if we should auto-register the user.
    // If the error message indicates invalid credentials (user might not exist or wrong password)
    // We will automatically attempt to create the account to provide a zero-friction "instant play" flow!
    if (signInError.message.includes("Invalid login credentials") || signInError.message.includes("does not exist")) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }

      toast.success(isPT ? "Conta criada com sucesso! Redirecionando... 🚀" : "Account created successfully! Redirecting... 🚀");
      nav({ to: "/onboarding" });
      return;
    }

    setLoading(false);
    toast.error(signInError.message);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden transition-colors duration-300">
      <AppHeader />
      
      {/* Decorative Glowing Orbs */}
      <div className="orb bg-accent-green/10 w-96 h-96 top-24 left-[-100px]" />
      <div className="orb bg-accent-terra/10 w-[500px] h-[500px] bottom-[-200px] right-[-100px]" />
      
      <main className="page-enter flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="glass premium-shadow w-full max-w-md p-8 md:p-10 rounded-[32px] border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-[#1C1C1A] dark:text-white font-extrabold tracking-tight">
              {isPT ? "Começar Agora" : "Start Learning"}
            </h1>
            <p className="mt-2.5 text-sm text-[#6B6B63] dark:text-gray-400 font-medium">
              {isPT 
                ? "Digite seu e-mail e senha. Se for sua primeira vez, criaremos sua conta na hora!" 
                : "Enter email & password. If it's your first time, we'll create your account instantly!"}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="dark:text-gray-300">{isPT ? "Endereço de E-mail" : "Email Address"}</label>
              <input 
                id="email"
                required 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="dark:text-gray-300">{isPT ? "Senha" : "Password"}</label>
              <input 
                id="password"
                required 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-white"
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full btn-premium py-3.5 mt-2 bg-gradient-to-r from-accent-green to-accent-teal hover:from-accent-teal hover:to-accent-green transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isPT ? "Conectando..." : "Connecting..."}
                </span>
              ) : (
                <span>{isPT ? "Entrar / Cadastrar 🚀" : "Sign In / Register 🚀"}</span>
              )}
            </button>
            
            <div className="text-center text-xs text-[#6B6B63] dark:text-gray-400 font-medium pt-3 leading-relaxed">
              {isPT 
                ? "Ao prosseguir, você concorda em iniciar sua personalização de ensino no Lume."
                : "By continuing, you agree to start your personalized learning journey with Lume."}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}