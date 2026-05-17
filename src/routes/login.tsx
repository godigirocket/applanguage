import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/lume/AppHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in to Lume" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    nav({ to: "/home" });
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="page-enter mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-4xl">Welcome back.</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card outline-none focus:border-ring" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card outline-none focus:border-ring" />
          <button disabled={loading} className="w-full px-5 py-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50">
            {loading ? "Signing in…" : "Continue"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            New to Lume? <Link to="/signup" className="text-foreground underline">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}