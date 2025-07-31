import { Clock, FileWarning, ShieldUser, UserPen } from "lucide-react";
import MainContainer from "../../../components/containers/MainContainer";

const Dashboard = () => {
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
          <h2 className="text-[40px] mt-6">1</h2>
          <span className="text-cyan-600">from database</span>
        </div>
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>Pending Verification</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <UserPen />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">0</h2>
          <span className="text-yellow-600">needs attention</span>
        </div>
        <div className="bg-gray-800 border border-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h2>Today's Attendance</h2>
            <div className="p-2 rounded-lg bg-gray-700">
              <Clock />
            </div>
          </div>
          <h2 className="text-[40px] mt-6">0.0%</h2>
          <span className="text-red-600">below target</span>
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

      <div className="space-y-6 mt-10 w-[70%]">
        <div className="bg-gray-800 border border-cyan-600 pt-6 px-6 pb-12 rounded-xl flex justify-between items-center">
          <h2 className="text-[18px] font-semibold">Recent Activity</h2>
          <span className="text-gray-500">View All</span>
        </div>
        <div className="bg-gray-800 border border-cyan-600 pt-6 px-6 pb-12 rounded-xl flex justify-between items-center">
          <h2 className="text-[18px] font-semibold">
            Current Duty Assignments
          </h2>
          <span className="text-gray-500">View All</span>
        </div>
      </div>
    </MainContainer>
  );
};

export default Dashboard;
