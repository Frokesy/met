import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../utils/supabaseClient";

interface Case {
  id: string;
  title: string;
}
interface Arrest {
  id: string;
  criminal_id: string;
  officer_id: string;
  case_id?: string;
  arrest_date: string;
  charges: string;
  location: string;
  status: "detained" | "transferred" | "released";
}

interface EditArrestModalProps {
  arrest: Arrest;
  onClose: () => void;
  onSave: (updated: Arrest) => void;
  cases: Case[];
}

const EditArrestModal = ({
  arrest,
  onClose,
  onSave,
  cases,
}: EditArrestModalProps) => {
  const [charges, setCharges] = useState(arrest.charges);
  const [location, setLocation] = useState(arrest.location);
  const [status, setStatus] = useState(arrest.status);
  const [caseId, setCaseId] = useState(arrest.case_id || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("arrests")
      .update({ charges, location, status, case_id: caseId || null })
      .eq("id", arrest.id)
      .select()
      .single();

    setLoading(false);
    if (error) console.error("Error updating arrest:", error);
    else if (data) onSave(data);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Edit Arrest</h3>

        <label className="block text-sm text-gray-400 mb-1">Charges</label>
        <textarea
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        />

        <label className="block text-sm text-gray-400 mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        />

        <label className="block text-sm text-gray-400 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Arrest["status"])}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        >
          <option value="detained">Detained</option>
          <option value="transferred">Transferred</option>
          <option value="released">Released</option>
        </select>

        <label className="block text-sm text-gray-400 mb-1">Linked Case</label>
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        >
          <option value="">None</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EditArrestModal;
