import { createClient } from '@supabase/supabase-js';

const url = "https://fxfjnrvbyqhmrllexljo.supabase.co";
const key = "sb_publishable_txQ_Rra5LY2QjblbFf2AAg_vhCwylAU";
const client = createClient(url, key);

async function run() {
  const { data, error } = await client.from('t_user_accounts').select('*');
  console.log("USERS:", data);
  console.log("ERRORS:", error);
}

run();
