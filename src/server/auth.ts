import { supabase, supabaseAdmin } from "../utils/supabase";

//this function is for login, it recives an email, passowrd and returns user or error
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}
