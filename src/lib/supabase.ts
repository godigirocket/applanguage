import { supabase } from "@/integrations/supabase/client";

// Safe query wrapper — never crashes on missing table
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const { data, error } = await queryFn()
    if (error) {
      console.warn('Supabase query error (non-fatal):', error.message)
      return null
    }
    return data
  } catch (e) {
    console.warn('Supabase query failed (non-fatal):', e)
    return null
  }
}

export { supabase };
