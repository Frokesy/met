import { CheckCircle, Clock9, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import supabase from "../../../lib/supabase";

const OfficerAttendance = () => {
  const [status, setStatus] = useState<"not_checked_in" | "checked_in" | "checked_out">("not_checked_in");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user session & today's record
  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUserId(session.user.id);

      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("date", today)
        .single();

      if (data) {
        if (data.check_in_time && !data.check_out_time) {
          setStatus("checked_in");
          setCheckInTime(data.check_in_time);
        } else if (data.check_out_time) {
          setStatus("checked_out");
          setCheckInTime(data.check_in_time);
          setCheckOutTime(data.check_out_time);
        }
      }
    };

    getData();
  }, []);

  const handleAction = async () => {
    if (!userId) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const today = new Date().toISOString().split("T")[0];

    if (status === "not_checked_in") {
      await supabase.from("attendance").insert([
        { user_id: userId, date: today, check_in_time: nowTime }
      ]);
      setStatus("checked_in");
      setCheckInTime(nowTime);

    } else if (status === "checked_in") {
      await supabase
        .from("attendance")
        .update({ check_out_time: nowTime })
        .eq("user_id", userId)
        .eq("date", today);

      setStatus("checked_out");
      setCheckOutTime(nowTime);
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
          <h2 className="text-white text-xl font-semibold">Today's Attendance</h2>
          <CalendarDays className="text-gray-400" />
        </div>

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
            <span>{status === "not_checked_in" ? "Check In" : "Check Out"}</span>
          </button>
        )}
      </div>
    </OfficerContainer>
  );
};

export default OfficerAttendance;
