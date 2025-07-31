import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";

const OfficerDashboard = () => {
  return (
    <OfficerContainer active="dashboard">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Dashboard
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Today's Duty"
          description="You are assigned to Gate Patrol (08:00 - 16:00)"
          icon={<ClipboardList className="text-blue-500" />}
        />
        <DashboardCard
          title="Next Duty"
          description="Night Patrol on Aug 2nd (22:00 - 06:00)"
          icon={<Clock className="text-yellow-400" />}
        />
        <DashboardCard
          title="Attendance Status"
          description="You have marked attendance for today"
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      <div className="bg-gray-800 rounded-md p-6 shadow-md">
        <h3 className="text-xl text-white font-semibold mb-4">Recent Requests</h3>
        <ul className="space-y-4">
          <li className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2">
            <span>Pass request (Aug 5 - Aug 7)</span>
            <span className="text-yellow-400">Pending</span>
          </li>
          <li className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2">
            <span>Leave request (July 20 - July 24)</span>
            <span className="text-green-500">Approved</span>
          </li>
          <li className="flex justify-between items-center text-gray-300">
            <span>Shift swap request (Aug 3)</span>
            <span className="text-red-400">Declined</span>
          </li>
        </ul>
      </div>
    </OfficerContainer>
  );
};

export default OfficerDashboard;

// ========== COMPONENTS ==========

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
