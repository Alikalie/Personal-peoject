import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zwexqcotjrhprxzarvsw.supabase.co',
  'sb_publishable_qtYC9pzo9sC3bXhaKuDBKA_lx5ShaRI'
)

async function testInsert() {
  const payload = {
    home_team: "Test Home",
    away_team: "Test Away",
    match_date: "2026-06-01"
  }
  
  console.log("Attempting insert...")
  const { data, error } = await supabase.from('matches').insert([payload]).select()
  
  if (error) {
    console.error("Insert error:", error)
  } else {
    console.log("Insert success:", data)
  }
}

testInsert()
