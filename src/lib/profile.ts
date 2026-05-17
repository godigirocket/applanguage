import { supabase } from "@/integrations/supabase/client";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle(); 
  
  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
  return data;
}

export async function upsertProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
    .select()
    .maybeSingle();
  
  if (error) {
    console.error('Profile upsert error:', error);
    return null;
  }
  return data;
}

export async function ensureProfile(userId: string, email?: string) {
  const profile = await getProfile(userId);
  if (profile) return profile;
  
  // Create missing profile
  return await upsertProfile(userId, { 
    email: email,
    full_name: email ? email.split('@')[0] : 'Student'
  });
}
