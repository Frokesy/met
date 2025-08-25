import { useEffect, useState } from "react";
import MainContainer from "../../../components/containers/MainContainer";
import { Clock, User } from "lucide-react";
import { supabase } from "../../../../utils/supabaseClient";

type LogItem = {
  id: string;
  user_id: string | null;
  action: string;
  color: string;
  created_at: string;
  name?: string;
  role?: string;
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      const { data: logData, error } = await supabase
        .from("activity_logs")
        .select("id, user_id, action, color, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching logs:", error);
        setLoading(false);
        return;
      }

      const userIds = logData?.map((l) => l.user_id).filter(Boolean) || [];

      const officersMap: Record<string, { full_name: string; unit: string }> =
        {};

      if (userIds.length > 0) {
        const { data: officers } = await supabase
          .from("officers")
          .select("user_id, full_name, unit")
          .in("user_id", userIds);

        officers?.forEach((o) => {
          officersMap[o.user_id] = { full_name: o.full_name, unit: o.unit };
        });
      }

      const enrichedLogs: LogItem[] =
        logData?.map((log) => ({
          ...log,
          name: officersMap[log.user_id || ""]?.full_name || "System",
          role: officersMap[log.user_id || ""]?.unit || "Admin",
        })) || [];

      setLogs(enrichedLogs);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <MainContainer active="activity logs">
      <div className="text-[20px] text-gray-400 font-semibold mb-8">
        Home / Activity Logs
      </div>

      {loading ? (
        <p className="text-gray-400">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">No logs found</p>
      ) : (
        <div className="relative border-l-2 border-gray-700 pl-6 py-6 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
          {logs.map((log) => (
            <div key={log.id} className="relative">
              <div
                style={{ backgroundColor: log.color }}
                className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-gray-900"
              />
              <div className="bg-gray-800 p-4 rounded-md shadow-md">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                  <User size={14} /> {log.name} – {log.role}
                </div>
                <p className="text-white font-medium">{log.action}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock size={12} className="mr-1" />
                  {new Date(log.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainContainer>
  );
};

export default ActivityLogs;
