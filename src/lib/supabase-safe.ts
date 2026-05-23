import { supabase } from "./supabase";

let tablesChecked = false;
let tablesExist = false;

export async function checkTables(): Promise<boolean> {
  if (tablesChecked) return tablesExist;
  tablesChecked = true;

  try {
    const { error } = await supabase.from("profiles").select("id").limit(1).maybeSingle();

    tablesExist = !error || error.code !== "42P01";
    return tablesExist;
  } catch {
    tablesExist = false;
    return false;
  }
}

export async function safeSelect(table: string, query: any) {
  if (!(await checkTables())) return { data: null, error: null };
  return query;
}
