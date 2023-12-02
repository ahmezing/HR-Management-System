import { useEffect, useState } from "react";
import { Employee } from "../models/Employee";
import EmployeesTable from "../components/EmployeesTable";
import { Loader } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import { getAllEmployees } from "@/server/employee";
import { getAssistantById } from "@/server/assistant";
import { Assistant } from "@/models/Assistant";

const HomePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const [assistant, setAssistant] = useState<Assistant>();

  const fetchEmployees = async () => {
    const employees = await getAllEmployees();
    const assistant = await getAssistantById(session!.user.id);
    setAssistant(assistant);
    setEmployees(employees);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;

    fetchEmployees();
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="xl" variant="dots" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <main className="w-full">
        <div className="flex justify-center items-center h-24">
          <h1 className="text-4xl text-gray-700">
            Welcome {assistant?.first_name} {assistant?.last_name}
          </h1>
        </div>

        <EmployeesTable employees={employees} fetchEmployees={fetchEmployees} />
      </main>
    </div>
  );
};

export default HomePage;
