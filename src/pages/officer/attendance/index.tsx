import { CheckCircle, Clock9, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { supabase } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

type AttendanceStatus = "not_checked_in" | "checked_in" | "checked_out";

type AttendanceRecord = {
  id: number;
  status: string;
  marked_at: string;
};

const OfficerAttendance = () => {
  const { officer } = useAuth();
  const [status, setStatus] = useState<AttendanceStatus>("not_checked_in");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!officer) return;

    const fetchAttendance = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("attendance")
        .select("id, status, marked_at")
        .eq("user_id", officer.user_id)
        .order("marked_at", { ascending: false });

      if (error) {
        console.error("Error fetching attendance:", error.message);
        setLoading(false);
        return;
      }

      setHistory(data);

      const today = new Date().toDateString();
      const todaysRecords = data.filter(
        (rec) => new Date(rec.marked_at).toDateString() === today
      );

      const first = todaysRecords.find((a) => a.status === "checked_in");
      const last = todaysRecords.find((a) => a.status === "checked_out");

      if (first) {
        setStatus("checked_in");
        setCheckInTime(
          new Date(first.marked_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      if (last) {
        setStatus("checked_out");
        setCheckOutTime(
          new Date(last.marked_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      setLoading(false);
    };

    fetchAttendance();
  }, [officer]);

  const handleAction = async () => {
    if (!officer) return;

    const now = new Date();

    try {
      if (status === "not_checked_in") {
        const { error } = await supabase.from("attendance").insert([
          {
            user_id: officer.user_id,
            duty_id: null,
            status: "checked_in",
            marked_at: now.toISOString(),
          },
        ]);

        if (error) throw error;
        setStatus("checked_in");
        setCheckInTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );

        setHistory((prev) => [
          {
            id: Date.now(),
            status: "checked_in",
            marked_at: now.toISOString(),
          },
          ...prev,
        ]);
      } else if (status === "checked_in") {
        const { error } = await supabase.from("attendance").insert([
          {
            user_id: officer.user_id,
            duty_id: null,
            status: "checked_out",
            marked_at: now.toISOString(),
          },
        ]);

        if (error) throw error;
        setStatus("checked_out");
        setCheckOutTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );

        setHistory((prev) => [
          {
            id: Date.now(),
            status: "checked_out",
            marked_at: now.toISOString(),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Attendance action error:", err);
    }
  };

  const getStatusText = () => {
    if (status === "not_checked_in") return "You haven't checked in yet.";
    if (status === "checked_in") return "You are currently checked in.";
    return "You have checked out for today.";
  };

  return (
    <OfficerContainer active="attendance">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Attendance
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">
            Today's Attendance
          </h2>
          <CalendarDays className="text-gray-400" />
        </div>

        {loading ? (
          <p className="text-gray-400">Loading attendance...</p>
        ) : (
          <>
            <p className="text-gray-300 mb-4">{getStatusText()}</p>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock9 size={16} />
                <span>Check In: {checkInTime || "--:--"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock9 size={16} />
                <span>Check Out: {checkOutTime || "--:--"}</span>
              </div>
            </div>

            {status !== "checked_out" && (
              <button
                onClick={handleAction}
                className="mt-6 w-full py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-md flex items-center justify-center space-x-2"
              >
                <CheckCircle size={18} />
                <span>
                  {status === "not_checked_in" ? "Check In" : "Check Out"}
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-white text-lg font-semibold mb-4">
          Attendance History
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No attendance records yet.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {history.map((record) => (
              <li
                key={record.id}
                className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2"
              >
                <span className="capitalize">
                  {record.status.replace("_", " ")}
                </span>
                <span>
                  {new Date(record.marked_at).toLocaleDateString()}{" "}
                  {new Date(record.marked_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OfficerContainer>
  );
};

export default OfficerAttendance;
