import { supabase, supabaseAdmin } from "../utils/supabase";
import { Log } from "../models/Logs";

export async function addLog(log: Partial<Log>) {
  const { data, error } = await supabase
    .from("logs")
    .insert([
      {
        log: log.log,
        user_id: log.user_id,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllLogs() {
  const { data, error } = await supabase.from("logs").select("*");

  if (error) {
    throw error;
  }

  return data;
}

//clear all logs
export async function clearLogs() {
  const { data, error } = await supabase.from("logs").delete();

  if (error) {
    throw error;
  }

  return data;
}

//clear logs older than 30 days
export async function clearOldLogs() {
  const { data, error } = await supabase
    .from("logs")
    .delete()
    .lte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  if (error) {
    throw error;
  }

  return data;
}
