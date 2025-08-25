import { useState } from "react";
import { Send, Clock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";

const RequestItem = ({ type, reason, status }: { type: string; reason: string; status: string }) => {
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
        <p className="text-gray-400 text-sm mt-1">{reason}</p>
      </div>
      <span className={`capitalize font-semibold ${statusColor}`}>{status}</span>
    </div>
  );
};

const Requests = () => {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState<
    { type: string; reason: string; status: string }[]
  >([]);

  const handleSubmit = () => {
    if (!type || !reason) return;

    setRequests((prev) => [
      ...prev,
      { type, reason, status: "pending" },
    ]);

    setType("");
    setReason("");
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
