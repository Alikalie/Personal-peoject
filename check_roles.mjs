import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwexqcotjrhprxzarvsw.supabase.co';
const supabaseKey = 'sb_publishable_qtYC9pzo9sC3bXhaKuDBKA_lx5ShaRI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', [
      '72a15a0e-3e77-4602-8e4c-b1f11ed49ffd',
      '11fe8700-4636-4520-b943-409633ffee19'
    ]);
  
  console.log("Profiles:", data);
  console.log("Error:", error);
}

run();
