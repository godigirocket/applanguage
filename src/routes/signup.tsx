import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/lume/AppHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your Lume account" }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"pt" | "en">("en");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { full_name: name, language, level },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome to Lume. Check your inbox to confirm your email.");
    nav({ to: "/onboarding" });
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="page-enter mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-4xl">Create your space</h1>
        <p className="mt-2 text-muted-foreground">A few details to tailor your sessions.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Your name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className="lume-input" />
          </Field>
          <Field label="Email">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="lume-input" />
          </Field>
          <Field label="Password">
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="lume-input" />
          </Field>
          <Field label="Language to practice">
            <div className="grid grid-cols-2 gap-2">
              <ChoicePill active={language === "pt"} onClick={() => setLanguage("pt")}>🇧🇷 Portuguese</ChoicePill>
              <ChoicePill active={language === "en"} onClick={() => setLanguage("en")}>🇺🇸 English</ChoicePill>
            </div>
          </Field>
          <Field label="Current level">
            <div className="grid grid-cols-3 gap-2">
              {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                <ChoicePill key={l} active={level === l} onClick={() => setLevel(l)}>{l}</ChoicePill>
              ))}
            </div>
          </Field>
          <button disabled={loading} className="w-full mt-2 px-5 py-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50">
            {loading ? "Creating…" : "Create account"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have one? <Link to="/login" className="text-foreground underline">Log in</Link>
          </p>
        </form>
        <style>{`.lume-input{width:100%;padding:.7rem 1rem;border:1px solid var(--border);background:var(--card);border-radius:12px;outline:none}.lume-input:focus{border-color:var(--ring)}`}</style>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ChoicePill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-full border text-sm capitalize ${active ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-foreground/80 hover:text-foreground"}`}>
      {children}
    </button>
  );
}