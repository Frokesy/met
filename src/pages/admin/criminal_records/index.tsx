import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, List, Eye, PieChart, Edit2, Trash2 } from "lucide-react";
import MainContainer from "../../../components/containers/MainContainer";
import { supabase } from "../../../../utils/supabaseClient";
import EditArrestModal from "../../../components/modals/EditArrestModal";
import EditProfileModal from "../../../components/modals/EditProfileModal";

const tabs = [
  { key: "arrests", label: "Arrest Records", icon: <List size={16} /> },
  { key: "profiles", label: "Criminal Profiles", icon: <User size={16} /> },
  { key: "watchlist", label: "Suspect Watchlist", icon: <Eye size={16} /> },
  { key: "analytics", label: "Analytics", icon: <PieChart size={16} /> },
];

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

interface Profile {
  id: string;
  full_name: string;
  alias?: string;
  prior_convictions?: string;
  parole_status?: string;
  watchlist?: boolean;
  risk_level?: string;
}

interface Officer {
  user_id: string;
  full_name: string;
}

interface Case {
  id: string;
  title: string;
}

const AdminCriminalRecords = () => {
  const [activeTab, setActiveTab] = useState("arrests");
  const [search, setSearch] = useState("");

  const [arrests, setArrests] = useState<Arrest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingArrest, setEditingArrest] = useState<Arrest | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [arrestRes, profileRes, officerRes, caseRes] = await Promise.all([
        supabase.from("arrests").select("*"),
        supabase.from("criminal_profiles").select("*"),
        supabase.from("officers").select("*"),
        supabase.from("cases").select("*"),
      ]);

      if (!arrestRes.error) setArrests(arrestRes.data);
      if (!profileRes.error) setProfiles(profileRes.data);
      if (!officerRes.error) setOfficers(officerRes.data);
      if (!caseRes.error) setCases(caseRes.data);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper functions
  const getOfficerName = (id: string) =>
    officers.find((o) => o.user_id === id)?.full_name || id;
  const getCriminalName = (id: string) =>
    profiles.find((p) => p.id === id)?.full_name || id;
  const getCaseTitle = (id?: string) =>
    cases.find((c) => c.id === id)?.title || "N/A";

  // Filters
  const filteredArrests = arrests.filter(
    (a) =>
      getCriminalName(a.criminal_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      getOfficerName(a.officer_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      a.charges.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProfiles = profiles.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.alias && p.alias.toLowerCase().includes(search.toLowerCase()))
  );

  const watchlistProfiles = profiles.filter((p) => p.watchlist);

  // CRUD Handlers
  const handleDeleteArrest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this arrest record?")) return;
    const { error } = await supabase.from("arrests").delete().eq("id", id);
    if (!error) setArrests((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    const { error } = await supabase
      .from("criminal_profiles")
      .delete()
      .eq("id", id);
    if (!error) setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateArrest = (updated: Arrest) => {
    setArrests((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingArrest(null);
  };

  const handleUpdateProfile = (updated: Profile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProfile(null);
  };

  const handleRemoveFromWatchlist = async (id: string) => {
    const { data, error } = await supabase
      .from("criminal_profiles")
      .update({ watchlist: false })
      .eq("id", id)
      .select()
      .single();

    if (!error && data)
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, watchlist: false } : p))
      );
  };

  return (
    <MainContainer active="criminal records">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Criminal Records</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Global search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-64"
          />
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading records...</p>
      ) : (
        <div>
          {/* Arrest Records */}
          {activeTab === "arrests" && (
            <motion.div
              key="arrests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 px-3">Criminal</th>
                    <th>Officer</th>
                    <th>Case</th>
                    <th>Charges</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArrests.map((arrest) => (
                    <tr
                      key={arrest.id}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-2 px-3">
                        {getCriminalName(arrest.criminal_id)}
                      </td>
                      <td>{getOfficerName(arrest.officer_id)}</td>
                      <td>{getCaseTitle(arrest.case_id)}</td>
                      <td>{arrest.charges}</td>
                      <td>{arrest.arrest_date}</td>
                      <td>{arrest.status}</td>
                      <td className="flex gap-4 mt-3">
                        <button
                          className="text-blue-500 hover:text-blue-400"
                          onClick={() => setEditingArrest(arrest)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400"
                          onClick={() => handleDeleteArrest(arrest.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Criminal Profiles */}
          {activeTab === "profiles" && (
            <motion.div
              key="profiles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
                >
                  <h4 className="text-white font-semibold">
                    {profile.full_name} {profile.alias && `(${profile.alias})`}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Prior Convictions: {profile.prior_convictions || "N/A"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Parole Status: {profile.parole_status || "N/A"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Risk Level: {profile.risk_level || "N/A"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-400"
                      onClick={() => setEditingProfile(profile)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Watchlist */}
          {activeTab === "watchlist" && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {watchlistProfiles.map((suspect) => (
                <div
                  key={suspect.id}
                  className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-white font-semibold">
                      {suspect.full_name}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Risk Level: {suspect.risk_level || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-400"
                      onClick={() => setEditingProfile(suspect)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleRemoveFromWatchlist(suspect.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 text-gray-300"
            >
              <div className="bg-gray-800 p-4 rounded-md">
                <h4 className="font-semibold text-white">Arrest Trends</h4>
                <p>Chart goes here</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h4 className="font-semibold text-white">Watchlist Changes</h4>
                <p>Chart goes here</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Modals */}
      {editingArrest && (
        <EditArrestModal
          arrest={editingArrest}
          onClose={() => setEditingArrest(null)}
          onSave={handleUpdateArrest}
          cases={cases}
        />
      )}
      {editingProfile && (
        <EditProfileModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={handleUpdateProfile}
        />
      )}
    </MainContainer>
  );
};

export default AdminCriminalRecords;
