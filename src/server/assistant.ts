import { Assistant } from "@/models/Assistant";
import { supabase, supabaseAdmin } from "../utils/supabase";

//get assistant by id
export async function getAssistantById(id: string) {
  const { data, error } = await supabase
    .from("assistants")
    .select("*")
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data[0];
}
