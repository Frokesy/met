import { CalendarDays, MapPin, Clock9 } from "lucide-react";
import { useState } from "react";
import OfficerContainer from "../../../components/containers/OfficerContainer";

const MyDuties = () => {
  const [showPast, setShowPast] = useState(false);

  type Duty = {
    id: number;
    date: string;
    time: string;
    location: string;
    type: string;
    status: "upcoming" | "completed" | "missed";
  };

  const upcomingDuties: Duty[] = [
    {
      id: 1,
      date: "Aug 2, 2025",
      time: "08:00 - 16:00",
      location: "Main Gate",
      type: "Day Patrol",
      status: "upcoming",
    },
    {
      id: 2,
      date: "Aug 3, 2025",
      time: "22:00 - 06:00",
      location: "Sector B",
      type: "Night Patrol",
      status: "upcoming",
    },
  ];

  const pastDuties: Duty[] = [
    {
      id: 3,
      date: "Jul 30, 2025",
      time: "08:00 - 16:00",
      location: "HQ Entrance",
      type: "Day Patrol",
      status: "completed",
    },
    {
      id: 4,
      date: "Jul 28, 2025",
      time: "22:00 - 06:00",
      location: "Sector A",
      type: "Night Patrol",
      status: "missed",
    },
  ];

  const dutiesToDisplay = showPast ? pastDuties : upcomingDuties;

  return (
    <OfficerContainer active="my duties">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / My Duties
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-semibold">Scheduled Duties</h2>
        <button
          onClick={() => setShowPast(!showPast)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white rounded-md text-sm"
        >
          {showPast ? "View Upcoming" : "View Past"}
        </button>
      </div>

      <div className="space-y-4">
        {dutiesToDisplay.map((duty) => (
          <DutyCard key={duty.id} {...duty} />
        ))}
        {dutiesToDisplay.length === 0 && (
          <p className="text-gray-400">No duties to show.</p>
        )}
      </div>
    </OfficerContainer>
  );
};

export default MyDuties;


const DutyCard = ({
  date,
  time,
  location,
  type,
  status,
}: {
  date: string;
  time: string;
  location: string;
  type: string;
  status: "completed" | "missed" | "upcoming";
}) => {
  const statusColors = {
    completed: "text-green-500",
    missed: "text-red-500",
    upcoming: "text-yellow-400",
  };

  const statusText = {
    completed: "Completed",
    missed: "Missed",
    upcoming: "Upcoming",
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium text-lg">{type}</h3>
        <span className={`text-sm font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <CalendarDays size={16} />
        <span>{date}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <Clock9 size={16} />
        <span>{time}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <MapPin size={16} />
        <span>{location}</span>
      </div>
    </div>
  );
};
