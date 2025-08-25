import { useEffect, useState } from "react";
import { Clock, FileWarning, ShieldUser, UserPen } from "lucide-react";
import MainContainer from "../../../components/containers/MainContainer";
import { supabase } from "../../../../utils/supabaseClient";
const Dashboard = () => {
  const [activePersonnel, setActivePersonnel] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [todaysAttendance, setTodaysAttendance] = useState(0);
  useEffect(() => {
    const fetchDashboardData = async () => {
      const { count: activeCount } = await supabase
        .from("officers")
        .select("*", { count: "exact", head: true })
        .eq("status", true);
      setActivePersonnel(activeCount || 0);
      const { count: pendingCount } = await supabase
        .from("officers")
        .select("*", { count: "exact", head: true })
        .eq("verified", false);
      setPendingVerification(pendingCount || 0);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      const { count: attendanceCount } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .gte("marked_at", startOfToday.toISOString())
        .lte("marked_at", endOfToday.toISOString());
      const { count: totalOfficers } = await supabase
        .from("officers")
        .select("*", { count: "exact", head: true });
      setTodaysAttendance(
        totalOfficers ? Math.round((attendanceCount! / totalOfficers) * 100) : 0
      );
    };
    fetchDashboardData();
  }, []);
  return (
    <MainContainer active="dashboard">
      <span className="text-[20px] text-gray-500 font-semibold">
        Home / Dashboard
      </span>
      <div className="grid grid-cols-4 gap-6 w-[100%] mt-10">
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>Active Personnel</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <ShieldUser />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">{activePersonnel}</h2>
          <span className="text-cyan-600">from database</span>
        </div>
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>Pending Verification</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <UserPen />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">{pendingVerification}</h2>
          <span className="text-yellow-600">needs attention</span>
        </div>
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>Today's Attendance</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <Clock />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">{todaysAttendance}%</h2>
        </div>
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>System Alerts</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <FileWarning />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">0</h2>
          <span className="text-green-600">in last 24 hours</span>
        </div>
      </div>
    </MainContainer>
  );
};
export default Dashboard;
