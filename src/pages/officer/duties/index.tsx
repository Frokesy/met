import { CalendarDays, MapPin, Clock9 } from "lucide-react";
import { useEffect, useState } from "react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../utils/supabaseClient";
import { format, parseISO } from "date-fns";

type Duty = {
  id: string;
  week_start: string;
  day: string;
  shift: string;
  unit: string;
};

const shiftTimes: Record<string, { start: string; end: string }> = {
  "Morning Shift": { start: "06:00", end: "12:00" },
  "Afternoon Shift": { start: "12:00", end: "18:00" },
  "Evening Shift": { start: "18:00", end: "00:00" },
};

const MyDuties = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);
  const { officer } = useAuth();

  useEffect(() => {
    if (!officer) return;

    const fetchDuties = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("duty_roaster")
        .select("id, week_start, day, shift, unit")
        .eq("unit", officer.unit)
        .order("week_start", { ascending: true });

      if (error) {
        console.error("Error fetching duties:", error.message);
        setDuties([]);
      } else {
        setDuties(data as Duty[]);
      }

      setLoading(false);
    };

    fetchDuties();
  }, [officer]);

  return (
    <OfficerContainer active="my duties">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / My Duties
      </div>

      <h2 className="text-white text-2xl font-semibold mb-6">My Duty Roster</h2>

      {loading ? (
        <p className="text-gray-400">Loading duties...</p>
      ) : duties.length > 0 ? (
        <div className="space-y-4">
          {duties.map((duty) => (
            <DutyCard key={duty.id} {...duty} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No duties assigned.</p>
      )}
    </OfficerContainer>
  );
};

export default MyDuties;

const DutyCard = ({ week_start, day, shift, unit }: Duty) => {
  const shiftInfo = shiftTimes[shift] || { start: "00:00", end: "00:00" };

  const dutyDate = parseISO(week_start);
  const dateStr = format(dutyDate, "MMM dd, yyyy") + ` (${day})`;

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium text-lg">{shift}</h3>
        <span className="text-sm text-blue-400 font-medium">{unit}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <CalendarDays size={16} />
        <span>{dateStr}</span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <Clock9 size={16} />
        <span>
          {shiftInfo.start} - {shiftInfo.end}
        </span>
      </div>
      <div className="text-gray-300 flex items-center space-x-2 text-sm">
        <MapPin size={16} />
        <span>Assigned Location</span>
      </div>
    </div>
  );
};
