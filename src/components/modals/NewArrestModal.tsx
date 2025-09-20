/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../utils/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  alias?: string;
}

interface Officer {
  user_id: string;
  full_name: string;
}

interface Case {
  id: string;
  title: string;
}

interface NewArrestModalProps {
  onClose: () => void;
  onSuccess: (arrest: any) => void;
  profiles: Profile[];
  officers: Officer[];
}

const NewArrestModal = ({
  onClose,
  onSuccess,
  profiles,
  officers,
}: NewArrestModalProps) => {
  const [criminalId, setCriminalId] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [arrestDate, setArrestDate] = useState("");
  const [charges, setCharges] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("detained");
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, title")
        .order("created_at", { ascending: false });
      if (!error && data) setCases(data);
    };
    fetchCases();
  }, []);

  const handleSubmit = async () => {
    if (!criminalId || !officerId || !arrestDate || !charges || !location)
      return;

    setLoading(true);

    const { data: arrestData, error: arrestError } = await supabase
      .from("arrests")
      .insert([
        {
          criminal_id: criminalId,
          officer_id: officerId,
          case_id: caseId || null,
          arrest_date: arrestDate,
          charges,
          location,
          status,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (arrestError) {
      console.error("Error creating arrest:", arrestError);
      return;
    }

    onSuccess(arrestData);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg relative overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-cyan-400 mb-4">New Arrest</h3>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Criminal</label>
          <select
            value={criminalId}
            onChange={(e) => setCriminalId(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            <option value="">Select criminal</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} {p.alias && `(${p.alias})`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Officer</label>
          <select
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            <option value="">Select officer</option>
            {officers.map((o) => (
              <option key={o.user_id} value={o.user_id}>
                {o.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">
            Linked Case (optional)
          </label>
          <select
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            <option value="">None</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">
            Arrest Date
          </label>
          <input
            type="date"
            value={arrestDate}
            onChange={(e) => setArrestDate(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Charges</label>
          <textarea
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            placeholder="Type charges..."
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter arrest location"
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            <option value="detained">Detained</option>
            <option value="transferred">Transferred</option>
            <option value="released">Released</option>
          </select>
        </div>

        {/* Placeholder for photos/biometrics
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">
            Photos / Biometric info (optional)
          </label>
          <input
            type="file"
            multiple
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          />
        </div> */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-colors"
        >
          {loading ? "Saving..." : "Create Arrest"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default NewArrestModal;
