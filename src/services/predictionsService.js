import { supabase } from "../lib/supabase"

export async function getPredictions() {
  const { data, error } = await supabase
    .from("predictions")
    .select(`
      *,
      matches (*)
    `)
    .order("id", { ascending: false })

  if (error) throw error
  return data
}

export async function createPrediction(values) {
  const { data, error } = await supabase
    .from("predictions")
    .insert(values)
    .select()

  if (error) throw error
  return data
}

export async function updatePrediction(id, values) {
  const { data, error } = await supabase
    .from("predictions")
    .update(values)
    .eq("id", id)
    .select()

  if (error) throw error
  return data
}

export async function deletePrediction(id) {
  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("id", id)

  if (error) throw error
}
