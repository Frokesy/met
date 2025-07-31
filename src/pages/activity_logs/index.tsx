import MainContainer from "../../components/containers/MainContainer";
import { Clock, User } from "lucide-react";

const logs = [
  {
    id: 1,
    name: "John Doe",
    role: "Commander",
    action: "Approved verification document for Sarah Lee",
    timestamp: "2025-07-30 10:23 AM",
    color: "green",
  },
  {
    id: 2,
    name: "Mary Smith",
    role: "Officer",
    action: "Logged into the system",
    timestamp: "2025-07-30 09:01 AM",
    color: "blue",
  },
  {
    id: 3,
    name: "Admin",
    role: "Admin",
    action: "Deleted personnel record for Daniel",
    timestamp: "2025-07-29 04:40 PM",
    color: "red",
  },
  {
    id: 4,
    name: "John Doe",
    role: "Commander",
    action: "Approved verification document for Sarah Lee",
    timestamp: "2025-07-30 10:23 AM",
    color: "green",
  },
  {
    id: 5,
    name: "Mary Smith",
    role: "Officer",
    action: "Logged into the system",
    timestamp: "2025-07-30 09:01 AM",
    color: "blue",
  },
  {
    id: 6,
    name: "Admin",
    role: "Admin",
    action: "Deleted personnel record for Daniel",
    timestamp: "2025-07-29 04:40 PM",
    color: "red",
  },
];

const ActivityLogs = () => {
  return (
    <MainContainer active="activity logs">
      <div className="text-[20px] text-gray-400 font-semibold mb-8">
        Home / Activity Logs
      </div>

      <div className="relative border-l-2 border-gray-700 pl-6 py-6 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            <div
              style={{ backgroundColor: log.color }}
              className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-gray-900`}
            />
            <div className="bg-gray-800 p-4 rounded-md shadow-md">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <User size={14} /> {log.name} – {log.role}
              </div>
              <p className="text-white font-medium">{log.action}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1" />
                {log.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainContainer>
  );
};

export default ActivityLogs;
