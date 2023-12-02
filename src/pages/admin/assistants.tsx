import { useEffect, useState } from "react";
import EmployeesTable from "@/components/EmployeesTable";
import { Loader } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import { getAllEmployees } from "@/server/employee";
import { Assistant } from "@/models/Assistant";
import { getAllAssistants } from "@/server/assistant";
import AssistantsTable from "@/components/admin/AssistantsTable";

const assistantsList = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  const fetchAssistants = async () => {
    const assistants = await getAllAssistants();
    setAssistants(assistants);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;

    fetchAssistants();
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
          <h1 className="text-4xl text-gray-700">HR Assistants List</h1>
        </div>
        <AssistantsTable
          assistants={assistants}
          fetchAssistants={fetchAssistants}
        />
      </main>
    </div>
  );
};

export default assistantsList;
