/* eslint-disable  @typescript-eslint/no-explicit-any*/

import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../utils/supabaseClient";
import { format } from "date-fns";

const OfficerDashboard = () => {
  const { officer } = useAuth();
  const [todayDuty, setTodayDuty] = useState<string>("Loading...");
  const [nextDuty, setNextDuty] = useState<string>("Loading...");
  const [attendanceStatus, setAttendanceStatus] =
    useState<string>("Not marked yet");
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!officer) return;

    const fetchDashboardData = async () => {
      const now = new Date();

      const { data: dutyData, error } = await supabase
        .from("duty_roaster")
        .select("week_start, day, shift, unit")
        .eq("unit", officer.unit)
        .order("week_start", { ascending: true });

      if (error) {
        console.error("Error fetching duties:", error.message);
        return;
      }

      if (dutyData && dutyData.length > 0) {
        const dutiesWithDates = dutyData.map((d) => {
          const weekStart = new Date(d.week_start);
          const daysOfWeek = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const dayIndex = daysOfWeek.indexOf(d.day);
          const dutyDate = new Date(weekStart);
          dutyDate.setDate(weekStart.getDate() + dayIndex);

          return { ...d, dutyDate };
        });

        const todayDutyData = dutiesWithDates.find(
          (d) => d.dutyDate.toDateString() === now.toDateString()
        );

        if (todayDutyData) {
          setTodayDuty(
            `${todayDutyData.shift} on ${format(
              todayDutyData.dutyDate,
              "MMM dd"
            )}`
          );
        } else {
          setTodayDuty("No duty assigned for today");
        }

        const upcomingDuty = dutiesWithDates
          .filter((d) => d.dutyDate > now)
          .sort((a, b) => a.dutyDate.getTime() - b.dutyDate.getTime())[0];

        if (upcomingDuty) {
          setNextDuty(
            `${upcomingDuty.shift} on ${upcomingDuty.day}, ${format(
              upcomingDuty.dutyDate,
              "MMM dd"
            )}`
          );
        } else {
          setNextDuty("No upcoming duty");
        }
      }

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("status, marked_at")
        .eq("user_id", officer.user_id)
        .gte("marked_at", startOfDay(now).toISOString())
        .lte("marked_at", endOfDay(now).toISOString())
        .order("marked_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attendanceData) {
        const markedTime = new Date(
          attendanceData.marked_at
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let message = "";
        if (attendanceData.status === "checked_in") {
          message = `You have checked in for today at ${markedTime}`;
        } else if (attendanceData.status === "checked_out") {
          message = `You have checked out for today at ${markedTime}`;
        } else {
          message = `You have marked attendance for today at ${markedTime}`;
        }

        setAttendanceStatus(message);
      } else {
        setAttendanceStatus("You have not marked attendance today");
      }

      const { data: requestsData } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", officer.user_id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (requestsData) setRequests(requestsData);
    };

    fetchDashboardData();
  }, [officer]);

  return (
    <OfficerContainer active="dashboard">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Dashboard
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Today's Duty"
          description={todayDuty}
          icon={<ClipboardList className="text-blue-500" />}
        />
        <DashboardCard
          title="Next Duty"
          description={nextDuty}
          icon={<Clock className="text-yellow-400" />}
        />
        <DashboardCard
          title="Attendance Status"
          description={attendanceStatus}
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      <div className="bg-gray-800 rounded-md p-6 shadow-md">
        <h3 className="text-xl text-white font-semibold mb-4">
          Recent Requests
        </h3>
        <ul className="space-y-4">
          {requests.length > 0 ? (
            requests.map((req) => (
              <li
                key={req.id}
                className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2"
              >
                <span>
                  {req.type} request (
                  {req.date ? `${formatDate(req.date)}` : "No date"})
                </span>
                <span
                  className={
                    req.status === "pending"
                      ? "text-yellow-400"
                      : req.status === "approved"
                      ? "text-green-500"
                      : "text-red-400"
                  }
                >
                  {req.status}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No recent requests</p>
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

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};
