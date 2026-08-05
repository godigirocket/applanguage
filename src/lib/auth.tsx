import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { startTrial } from "@/lib/trial";

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setLoading(false);

      // After sign up or sign in, claim any pending payments for this email
      if (s?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        // Start 24h trial for new users on first sign-in
        startTrial();

        try {
          const { data, error } = await supabase.rpc("claim_pending_payments", {
            user_email: s.user.email || "",
            user_id: s.user.id,
          });

          if (error) {
            console.warn("[Auth] Pending payment claim skipped:", error.message || error);
          } else if (data && data > 0) {
            console.log(`[Auth] ✅ Claimed ${data} pending payment(s) for ${s.user.email}`);
            // Optional: Show toast notification
            // toast.success("Premium activated!");
          }
        } catch (err) {
          console.warn("[Auth] Error claiming payments:", err);
        }
      }
    });
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch((err) => {
        // A rejected getSession() (e.g. network failure) must not leave `loading`
        // stuck at true forever — that renders as an infinite spinner instead of
        // a usable (logged-out) screen.
        console.error("[Auth] getSession failed:", err);
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
