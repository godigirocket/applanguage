import { supabase } from "@/integrations/supabase/client";

export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session || error) {
    throw new Error('Unauthorized');
  }
  return { session, supabase };
}
