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

export async function updateAssistant(assistant: Assistant) {
  const { data, error } = await supabase
    .from("assistants")
    .update({
      first_name: assistant.first_name,
      last_name: assistant.last_name,
      employee_since: assistant.employee_since,
      id_number: assistant.id_number,
      date_of_birth: assistant.date_of_birth,
      id_expiry_date: assistant.id_expiry_date,
      salary: assistant.salary,
      contract_expiry: assistant.contract_expiry,
      nationality: assistant.nationality,
    })
    .eq("id", assistant.id);

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllAssistants() {
  const { data, error } = await supabase.from("assistants").select("*");

  if (error) {
    throw error;
  }

  return data;
}
