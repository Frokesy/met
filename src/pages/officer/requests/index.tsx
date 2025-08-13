import { useState, useEffect } from "react";
import { Send, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import supabase from "../../../lib/supabase";
import { toast } from "react-toastify";

const RequestItem = ({ type, reason, status }: { type: string; reason: string; status: string }) => {
  const statusColor =
    status === "Approved"
      ? "text-green-500"
      : status === "pending"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="bg-gray-800 p-4 rounded-md flex justify-between items-start mb-4">
      <div>
        <h4 className="text-white font-semibold">{type}</h4>
        <p className="text-gray-400 text-sm mt-1">{reason}</p>
      </div>
      <span className={`capitalize font-semibold ${statusColor}`}>{status}</span>
    </div>
  );
};

const Requests = () => {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState<{ type: string; reason: string; status: string }[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.error(userError?.message || "Not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from("requests")
          .select("type, reason, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } catch (err: unknown) {
        const message = typeof err === 'object' && err && 'message' in err ? String((err as { message?: unknown }).message) : 'Unknown error';
        console.error("Failed to load requests", err);
        toast.error(`Failed to load requests: ${message}`);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    if (!type || !reason) {
      toast.warn("Please select a request type and enter a reason");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error(userError?.message || "Not authenticated");
      }

      // Ensure a profile exists for this user (FK target for requests.user_id)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert([{ id: user.id, email: user.email ?? null, role: null, security_id: null }], { onConflict: "id" });
        if (upsertError) throw upsertError;
      }

      const { error: insertError } = await supabase
        .from("requests")
        .insert([{ user_id: user.id, type, reason, status: "pending" }]);

      if (insertError) throw insertError;

      setRequests((prev) => [{ type, reason, status: "pending" }, ...prev]);
      setType("");
      setReason("");
      toast.success("Request submitted");
    } catch (err: unknown) {
      const message = typeof err === 'object' && err && 'message' in err ? String((err as { message?: unknown }).message) : 'Unknown error';
      console.error("Failed to submit request", err);
      toast.error(`Failed to submit request: ${message}`);
    }
  };

  return (
    <OfficerContainer active="requests">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">Home / Requests</div>

      <div className="bg-gray-800 p-6 rounded-md shadow mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Send size={18} /> Submit a Request
        </h2>

        <select
          title="Select Request Type"
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
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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

      {requests.length === 0 ? (
        <p className="text-gray-400">No requests submitted yet.</p>
      ) : (
        requests.map((req, i) => (
          <RequestItem key={i} type={req.type} reason={req.reason} status={req.status} />
        ))
      )}
    </OfficerContainer>
  );
};

export default Requests;
