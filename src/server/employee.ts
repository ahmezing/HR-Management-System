import { Employee } from "@/models/Employee";
import { supabase, supabaseAdmin } from "../utils/supabase";

//write a function that retrives all employees from the database
export async function getAllEmployees() {
  const { data, error } = await supabase.from("employees").select("*");

  if (error) {
    throw error;
  }

  return data;
}

export async function updateEmployee(employee: Employee) {
  const { data, error } = await supabase
    .from("employees")
    .update({
      first_name: employee.first_name,
      last_name: employee.last_name,
      employee_since: employee.employee_since,
      id_number: employee.id_number,
      date_of_birth: employee.date_of_birth,
      id_expiry_date: employee.id_expiry_date,
      salary: employee.salary,
      position: employee.position,
      contract_expiry: employee.contract_expiry,
      nationality: employee.nationality,
    })
    .eq("id", employee.id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function addEmployee(
  employee: Partial<Employee>
) {
  const { data, error } = await supabase
    .from("employees")
    .insert([
      {
        first_name: employee.first_name,
        last_name: employee.last_name,
        employee_since: employee.employee_since,
        id_number: employee.id_number,
        date_of_birth: employee.date_of_birth,
        id_expiry_date: employee.id_expiry_date,
        salary: employee.salary,
        position: employee.position,
        contract_expiry: employee.contract_expiry,
        nationality: employee.nationality,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteEmployee(id: string) {
  const { data, error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id)
    .select();
    
  if (error) {
    throw error;
  }

  return data;
}