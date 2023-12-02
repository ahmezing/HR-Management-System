import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { HelperFunctions } from "@/helpers/HelperFunctions";
import { notifications } from "@mantine/notifications";
import { Log } from "@/models/Logs";

export default function LogsList({
  logs,
  fetchLogs,
}: {
  logs: Log[];
  fetchLogs: () => void;
}) {
  const [shownLogs, setShownLogs] = useState<Log[]>([]);
  const [showCount, setShowCount] = useState(10);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    color: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setShownLogs(logs.slice(0, showCount));
  }, [logs, showCount]);

  const loadMoreLogs = () => {
    setShowCount((prevCount) => prevCount + 10);
  };

  if (showNotification) {
    notifications.show({
      title: notification.title,
      message: notification.message,
      color: notification.color,
    });
    setShowNotification(false);
  }

  const filterLogs = (logs: Log[], query: string): Log[] => {
    return logs.filter((log) =>
      log?.log?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const filteredLogs = filterLogs(logs, e.target.value);
    setShownLogs(filteredLogs.slice(0, showCount));
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-end">
        {" "}
        {/* Changed to flex and aligned items to the end */}
        <div className="mt-4">
          {" "}
          {/* Moved the search bar above the logs container */}
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={handleSearch}
            className="py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div
          className="mx-auto mt-5 max-w-2xl grid-cols-1 gap-y-16 border-t border-gray-200 pt-2 sm:mt-4 sm:pt-8 lg:mx-0 lg:max-w-none
            w-full"
        >
          {shownLogs.length > 0 ? (
            shownLogs.map((log) => (
              <article
                key={log.id}
                className="flex max-w-xl flex-col items-start justify-between rounded-lg shadow-lg p-6 bg-white mb-6
              transform transition duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105
              border border-gray-200 rounded-lg shadow-sm overflow-hidden
              hover:shadow-xl hover:scale-105 hover:transition hover:duration-500 hover:ease-in-out"
                style={{ minWidth: "100%", width: "100%" }}
              >
                <div className="flex items-center justify-between gap-x-4 text-xs">
                  <time
                    dateTime={log.created_at.toLocaleString()}
                    className="text-gray-500"
                  >
                    {HelperFunctions.formatTimeAgo(
                      log.created_at.toLocaleString()
                    )}
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    {/* <a href={''}> */}
                    <span className="absolute inset-0" />
                    {/* </a> */}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {log.log}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      {/* <a href={''}> */}
                      <span className="absolute inset-0" />
                      <p className="text-gray-600"></p>
                      {/* </a> */}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-x-2"></div>
              </article>
            ))
          ) : (
            <div>No matching logs found.</div>
          )}
          {logs.length > showCount && (
            <button
              onClick={loadMoreLogs}
              className="bg-violet-100 mx-auto my-2 py-2 px-4 border border-violet-900 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-violet-200
            w-full
            "
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
