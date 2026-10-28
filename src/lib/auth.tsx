import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { startTrial } from "@/lib/trial";
import { withTimeout } from "@/lib/promise-timeout";
import { switchAccount } from "@/lib/account-session";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip SSR
    if (typeof window === "undefined") return;
    let active = true;
    let authEventReceived = false;
    let generation = 0;
    let publishedOwner: string | null | undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (!active) return;
      authEventReceived = true;
      const current = ++generation;
      if (publishedOwner === (s?.user.id || null)) {
        setSession(s);
        return;
      }
      setLoading(true);
      setTimeout(async () => {
        try {
          await switchAccount(s?.user.id || null, event === "INITIAL_SESSION");
          if (!active || current !== generation) return;
          publishedOwner = s?.user.id || null;
          setSession(s);
          setLoading(false);
          if (s) startTrial();
        } catch {
          if (active && current === generation) {
            setSession(null);
            setLoading(false);
          }
        }
      }, 0);

      // After sign up or sign in, claim any pending payments for this email
      if (s?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        // Leave the auth callback before calling Supabase: it holds the auth lock.
        setTimeout(async () => {
          if (!active) return;
          try {
            const { data, error } = await supabase.rpc("claim_pending_payments", {
              user_email: s.user.email || "",
              user_id: s.user.id,
            });

            if (error) {
              console.warn("[Auth] Pending payment claim skipped:", error.message || error);
            } else if (data && data > 0) {
              console.log(`[Auth] Claimed ${data} pending payment(s).`);
              // Optional: Show toast notification
              // toast.success("Premium activated!");
            }
          } catch (err) {
            console.warn("[Auth] Error claiming payments:", err);
          }
        }, 0);
      }
    });
    withTimeout(supabase.auth.getSession(), 8000)
      .then(async ({ data }) => {
        // An older initial read must not undo a newer sign-in/sign-out event.
        if (!active || authEventReceived) return;
        const current = ++generation;
        await switchAccount(data.session?.user.id || null, true);
        if (!active || current !== generation) return;
        publishedOwner = data.session?.user.id || null;
        setSession(data.session);
        setLoading(false);
      })
      .catch(async (err) => {
        if (!active || authEventReceived) return;
        // A rejected getSession() (e.g. network failure) must not leave `loading`
        // stuck at true forever — that renders as an infinite spinner instead of
        // a usable (logged-out) screen.
        console.error("[Auth] getSession failed:", err);
        await switchAccount(null);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
