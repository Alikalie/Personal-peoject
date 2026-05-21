import { supabase } from "../lib/supabase"

export async function getMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true })

  if (error) throw error
  return data
}

export async function createMatch(values) {
  const { data, error } = await supabase
    .from("matches")
    .insert(values)
    .select()

  if (error) throw error
  return data
}

export async function updateMatch(id, values) {
  const { data, error } = await supabase
    .from("matches")
    .update(values)
    .eq("id", id)
    .select()

  if (error) throw error
  return data
}

export async function deleteMatch(id) {
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", id)

  if (error) throw error
}
