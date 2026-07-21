import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY env vars. Auth and remote progress will fall back to signed-out/local behavior.",
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL || "https://example.supabase.co",
  SUPABASE_ANON_KEY || "missing-public-key",
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
      detectSessionInUrl: typeof window !== "undefined",
    },
  },
);
