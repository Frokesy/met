import { useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name: string;
  alias?: string;
  prior_convictions?: string;
  parole_status?: string;
  watchlist?: boolean;
  risk_level?: string;
}

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updated: Profile) => void;
}

const EditProfileModal = ({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) => {
  const [alias, setAlias] = useState(profile.alias || "");
  const [priorConvictions, setPriorConvictions] = useState(
    profile.prior_convictions || ""
  );
  const [paroleStatus, setParoleStatus] = useState(profile.parole_status || "");
  const [riskLevel, setRiskLevel] = useState(profile.risk_level || "");
  const [watchlist, setWatchlist] = useState(profile.watchlist || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("criminal_profiles")
      .update({
        alias,
        prior_convictions: [priorConvictions],
        parole_status: paroleStatus,
        risk_level: riskLevel,
        watchlist,
      })
      .eq("id", profile.id)
      .select()
      .single();

    setLoading(false);
    if (error) console.error("Error updating profile:", error);
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
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Edit Profile</h3>

        <input
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        />
        <textarea
          placeholder="Prior Convictions"
          value={priorConvictions}
          onChange={(e) => setPriorConvictions(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        />
        <select
          value={paroleStatus}
          onChange={(e) => setParoleStatus(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        >
          <option value="" disabled>
            Parole Status
          </option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="revoked">Revoked</option>
        </select>
        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full mb-3"
        >
          <option value="" disabled>
            Risk Level
          </option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={watchlist}
            onChange={() => setWatchlist(!watchlist)}
          />
          Add to Watchlist
        </label>

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

export default EditProfileModal;
