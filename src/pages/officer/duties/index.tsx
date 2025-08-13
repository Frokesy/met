import { CalendarDays, MapPin, Clock9 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import supabase from "../../../lib/supabase";
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from "react";

const MyDuties = () => {
  const [showPast, setShowPast] = useState(false);
  type Duty = {
    id: string | number;
    duty_date: string;
    location?: string;
    type?: string;
    status?: string;
    // [key: string]: any; // Removed to avoid using 'any'
    
  };
  
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);


const fetchDuties = useCallback(async () => {
  setLoading(true);
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error(authError?.message || "No authenticated user");
    }

    console.log("Logged in user ID:", user.id);

    // Resolve personnel_id via profiles linking to personnel
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("personnel_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    let personnelId = profile?.personnel_id ?? null;

    // Legacy fallback: if personnel and user share ids
    if (!personnelId) {
      const { data: maybeSameId } = await supabase
        .from("personnel")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (maybeSameId?.id) {
        personnelId = maybeSameId.id;
      }
    }

    if (!personnelId) {
      console.log("No personnel record linked for user:", user.id);
      toast.warning("No personnel record found. Please contact an administrator to set up your profile.");
      setDuties([]);
      setLoading(false);
      return;
    }

    // Fetch duties for that personnel
    const { data, error } = await supabase
      .from("duty_roster")
      .select("*")
      .eq("personnel_id", personnelId)
      .order("duty_date", { ascending: !showPast });

    if (error) throw error;

    // 4️⃣ Ensure each duty has a unique key
    const dutiesWithKeys = (data || []).map((duty, index) => ({
      ...duty,
      _key: duty.id || `${duty.personnel_id}-${duty.duty_date}-${index}`
    }));

    setDuties(dutiesWithKeys);
  } catch (error: unknown) {
    console.error("Fetch error:", error);
    if (error instanceof Error) {
      toast.error(`Failed to load duties: ${error.message}`);
    } else {
      toast.error("Failed to load duties: Unknown error");
    }
    setDuties([]);
  } finally {
    setLoading(false);
  }
}, [showPast]);


  useEffect(() => {
    fetchDuties();
  }, [showPast, fetchDuties]);

  const formatDutyDate = (dutyDate: string) => {
    return new Date(dutyDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDutyTime = (dutyDate: string) => {
    return new Date(dutyDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  

  return (
    <OfficerContainer active="my duties">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / My Duties
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-semibold">
          {showPast ? "Past Duties" : "Upcoming Duties"}
        </h2>
        <button
          onClick={() => setShowPast(!showPast)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white rounded-md text-sm transition-colors"
        >
          {showPast ? "View Upcoming" : "View Past"}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-400 animate-pulse">Loading duties...</p>
          </div>
        ) : duties.length > 0 ? (
          duties.map((duty) => (
            <DutyCard 
              key={duty.id}
              date={formatDutyDate(duty.duty_date)}
              time={formatDutyTime(duty.duty_date)}
              location={duty.location || "Not specified"}
              type={duty.type || "Duty"}
              status={
                duty.status === "completed"
                  ? "completed"
                  : duty.status === "missed"
                  ? "missed"
                  : "upcoming"
              }
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            {duties.length === 0 && !loading ? (
              <div className="space-y-4">
                <p className="text-lg">No {showPast ? "past" : "upcoming"} duties found</p>
                <p className="text-sm text-gray-500">
                  This could be because:
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• No duties have been assigned to you yet</li>
                  <li>• Your personnel profile needs to be set up by an administrator</li>
                  <li>• There are no duties scheduled for this time period</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  If you believe this is an error, please contact your unit administrator.
                </p>
              </div>
            ) : (
              <p>No {showPast ? "past" : "upcoming"} duties found</p>
            )}
          </div>
        )}
      </div>
    </OfficerContainer>
  );
};

type DutyStatus = "completed" | "missed" | "upcoming";

type DutyCardProps = {
  date: string;
  time: string;
  location: string;
  type: string;
  status: DutyStatus;
};

const DutyCard = ({ date, time, location, type, status }: DutyCardProps) => {
  const statusConfig: Record<DutyStatus, { color: string; text: string }> = {
    completed: { color: "text-green-500", text: "Completed" },
    missed: { color: "text-red-500", text: "Missed" },
    upcoming: { color: "text-yellow-400", text: "Upcoming" },
  };

  const { color, text } = statusConfig[status] || statusConfig.upcoming;

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium text-lg capitalize">{type.toLowerCase()}</h3>
        <span className={`text-sm font-medium ${color}`}>
          {text}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="text-gray-300 flex items-center space-x-2 text-sm">
          <CalendarDays size={16} className="flex-shrink-0" />
          <span>{date}</span>
        </div>
        <div className="text-gray-300 flex items-center space-x-2 text-sm">
          <Clock9 size={16} className="flex-shrink-0" />
          <span>{time}</span>
        </div>
        <div className="text-gray-300 flex items-center space-x-2 text-sm">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default MyDuties;