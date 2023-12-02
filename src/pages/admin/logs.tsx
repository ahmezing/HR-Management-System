import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import LogsList from "@/components/admin/LogsList";
import { getAllLogs } from "@/server/logs";
import { Log } from "@/models/Logs";

const logsList = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  const fetchLogs = async () => {
    const logs = await getAllLogs();
    setLogs(logs.reverse());
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;

    fetchLogs();
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
            Logs
          </h1>
        </div>
        <LogsList logs={logs} fetchLogs={fetchLogs}/>
      </main>
    </div>
  );
};

export default logsList;
