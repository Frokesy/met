"use client";
import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import supabase from "../../../lib/supabase";



interface Duty {
  duty_date: string;
  shift: string;
  location: string | null;
  type: string | null;
}

interface Attendance {
  check_in: string | null;
}

interface Request {
  type: string;
  created_at: string;
  status: string;
}

const OfficerDashboard = () => {
  const [todayDuty, setTodayDuty] = useState<Duty | null>(null);
  const [nextDuty, setNextDuty] = useState<Duty | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get logged-in user's profile to fetch their personnel_id
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("personnel_id")
        .eq("id", user.id)
        .single();

      if (!profile?.personnel_id) return;

      const personnelId = profile.personnel_id;
      const today = new Date().toISOString().split("T")[0];

      // Today's duty
      const { data: todayDutyData } = await supabase
        .from("duty_roster")
        .select("duty_date, shift, location, type")
        .eq("personnel_id", personnelId)
        .eq("duty_date", today)
        .single();

      setTodayDuty(todayDutyData || null);

      // Next duty
      const { data: nextDutyData } = await supabase
        .from("duty_roster")
        .select("duty_date, shift, location, type")
        .eq("personnel_id", personnelId)
        .gt("duty_date", today)
        .order("duty_date", { ascending: true })
        .limit(1)
        .single();

      setNextDuty(nextDutyData || null);

      // Attendance for today
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("check_in")
        .eq("personnel_id", personnelId)
        .eq("duty_date", today)
        .single();

      setAttendance(attendanceData || null);

      // Recent requests
      const { data: requestsData } = await supabase
        .from("requests")
        .select("type, created_at, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setRequests(requestsData || []);
    };

    fetchData();
  }, []);

  return (
    <OfficerContainer active="dashboard">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Dashboard
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Today's Duty"
          description={
            todayDuty
              ? `${todayDuty.type || ""} - ${todayDuty.shift} ${
                  todayDuty.location ? `(${todayDuty.location})` : ""
                }`
              : "No duty assigned for today"
          }
          icon={<ClipboardList className="text-blue-500" />}
        />
        <DashboardCard
          title="Next Duty"
          description={
            nextDuty
              ? `${nextDuty.type || ""} on ${new Date(
                  nextDuty.duty_date
                ).toDateString()} - ${nextDuty.shift} ${
                  nextDuty.location ? `(${nextDuty.location})` : ""
                }`
              : "No upcoming duty"
          }
          icon={<Clock className="text-yellow-400" />}
        />
        <DashboardCard
          title="Attendance Status"
          description={
            attendance?.check_in
              ? "You have marked attendance for today"
              : "Attendance not marked today"
          }
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      <div className="bg-gray-800 rounded-md p-6 shadow-md">
        <h3 className="text-xl text-white font-semibold mb-4">
          Recent Requests
        </h3>
        <ul className="space-y-4">
          {requests.length > 0 ? (
            requests.map((req, i) => (
              <li
                key={i}
                className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2 last:border-none"
              >
                <span>
                  {req.type} (
                  {new Date(req.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  )
                </span>
                <span
                  className={
                    req.status === "pending"
                      ? "text-yellow-400"
                      : req.status === "Approved"
                      ? "text-green-500"
                      : "text-red-400"
                  }
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No recent requests</li>
          )}
        </ul>
      </div>
    </OfficerContainer>
  );
};

export default OfficerDashboard;

const DashboardCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-md flex items-start space-x-4 shadow-md">
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-white font-semibold text-lg mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};
