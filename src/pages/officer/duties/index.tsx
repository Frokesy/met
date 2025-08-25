import { CalendarDays, MapPin, Clock9 } from "lucide-react";
import { useEffect, useState } from "react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../utils/supabaseClient";

type Duty = {
  id: string;
  start_time: string;
  end_time: string;
  location: string;
  title: string;
  status: "upcoming" | "completed" | "missed";
};

const MyDuties = () => {
  const [showPast, setShowPast] = useState(false);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);
  const { officer } = useAuth();

  useEffect(() => {
    if (!officer) return;

    const fetchDuties = async () => {
      setLoading(true);

      let query = supabase
        .from("duties")
        .select("id, start_time, end_time, location, title, status")
        .eq("user_id", officer.user_id)
        .order("start_time", { ascending: false });

      if (showPast) {
        query = query.in("status", ["completed", "missed"]);
      } else {
        query = query.eq("status", "upcoming");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching duties:", error.message);
        setDuties([]);
      } else {
        setDuties(data as Duty[]);
      }

      setLoading(false);
    };

    fetchDuties();
  }, [officer, showPast]);

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

      {loading ? (
        <p className="text-gray-400">Loading duties...</p>
      ) : duties.length > 0 ? (
        <div className="space-y-4">
          {duties.map((duty) => (
            <DutyCard key={duty.id} {...duty} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No duties to show.</p>
      )}
    </OfficerContainer>
  );
};

export default MyDuties;

const DutyCard = ({ start_time, end_time, location, title, status }: Duty) => {
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

  const start = new Date(start_time);
  const end = new Date(end_time);

  const dateStr = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium text-lg">{title}</h3>
        <span className={`text-sm font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <CalendarDays size={16} />
        <span>{dateStr}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <Clock9 size={16} />
        <span>{timeStr}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <MapPin size={16} />
        <span>{location}</span>
      </div>
    </div>
  );
};
