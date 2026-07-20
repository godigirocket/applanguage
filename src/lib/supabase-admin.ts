/**
 * SUPABASE ADMIN CLIENT
 * Uses service_role key for server-side operations
 * NEVER expose this in the frontend!
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Admin client with service_role key
 * Bypasses RLS - use with caution!
 * Only use in server-side code (API routes, webhooks)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
