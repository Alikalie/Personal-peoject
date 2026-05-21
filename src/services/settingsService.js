import { supabase } from "../lib/supabase"

export async function getSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateSettings(values) {
  const { data, error } = await supabase
    .from("site_settings")
    .update(values)
    .eq("id", 1)

  if (error) throw error
  return data
}
