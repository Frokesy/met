import { useState, useEffect } from "react";
import { Send, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { supabase } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

type Request = {
  id: number;
  type: string;
  details: string;
  status: string;
  date: string;
};

const RequestItem = ({
  type,
  details,
  status,
}: {
  type: string;
  details: string;
  status: string;
}) => {
  const statusColor =
    status === "approved"
      ? "text-green-500"
      : status === "pending"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="bg-gray-800 p-4 rounded-md flex justify-between items-start mb-4">
      <div>
        <h4 className="text-white font-semibold">{type}</h4>
        <p className="text-gray-400 text-sm mt-1">{details}</p>
      </div>
      <span className={`capitalize font-semibold ${statusColor}`}>
        {status}
      </span>
    </div>
  );
};

const Requests = () => {
  const { officer } = useAuth();
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!officer) return;

    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("requests")
        .select("id, type, details, status, date")
        .eq("user_id", officer.user_id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error.message);
      } else {
        setRequests(data);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [officer]);

  const handleSubmit = async () => {
    if (!type || !details || !officer) return;

    const newRequest = {
      user_id: officer.user_id,
      type,
      details,
      status: "pending",
      date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("requests")
      .insert([newRequest])
      .select();

    if (error) {
      console.error("Error submitting request:", error.message);
      return;
    }

    if (data) {
      setRequests((prev) => [data[0], ...prev]);
      setType("");
      setDetails("");
    }
  };

  return (
    <OfficerContainer active="requests">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Requests
      </div>

      <div className="bg-gray-800 p-6 rounded-md shadow mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Send size={18} /> Submit a Request
        </h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-3 rounded-md bg-gray-700 text-white outline-none"
        >
          <option value="">Select Request Type</option>
          <option value="Leave Request">Leave Request</option>
          <option value="Duty Change Request">Duty Change</option>
          <option value="Equipment Request">Equipment</option>
        </select>

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Reason or Description..."
          className="w-full p-3 rounded-md bg-gray-700 text-white outline-none resize-none mb-4"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md"
        >
          Submit Request
        </button>
      </div>

      <div className="mb-4 text-white text-lg font-semibold flex items-center gap-2">
        <Clock size={18} />
        Recent Requests
      </div>

      {loading ? (
        <p className="text-gray-400">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">No requests submitted yet.</p>
      ) : (
        requests.map((req) => (
          <RequestItem
            key={req.id}
            type={req.type}
            details={req.details}
            status={req.status}
          />
        ))
      )}
    </OfficerContainer>
  );
};

export default Requests;
