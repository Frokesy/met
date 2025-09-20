import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, User, List, Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../../../utils/supabaseClient";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import NewArrestModal from "../../../components/modals/NewArrestModal";

const tabs = [
  { key: "arrests", label: "Arrest Records", icon: <List size={16} /> },
  { key: "profiles", label: "Criminal Profiles", icon: <User size={16} /> },
  { key: "watchlist", label: "Suspect Watchlist", icon: <Eye size={16} /> },
];

interface Arrest {
  id: string;
  criminal_id: string;
  officer_id: string;
  case_id: string;
  arrest_date: string;
  charges: string;
  location: string;
  status: string;
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

const OfficerCriminalRecords = () => {
  const [activeTab, setActiveTab] = useState("arrests");
  const [search, setSearch] = useState("");

  const [arrests, setArrests] = useState<Arrest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewArrestModal, setShowNewArrestModal] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Arrests
      const { data: arrestData, error: arrestError } = await supabase
        .from("arrests")
        .select("*")
        .order("arrest_date", { ascending: false });

      if (arrestError) console.error("Error fetching arrests:", arrestError);
      else setArrests(arrestData || []);

      // Profiles
      const { data: profileData, error: profileError } = await supabase
        .from("criminal_profiles")
        .select("*");

      if (profileError) console.error("Error fetching profiles:", profileError);
      else setProfiles(profileData || []);

      // Officers
      const { data: officerData, error: officerError } = await supabase
        .from("officers")
        .select("*");

      if (officerError) console.error("Error fetching officers:", officerError);
      else setOfficers(officerData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper to resolve IDs to names
  const getOfficerName = (id: string) =>
    officers.find((o) => o.user_id === id)?.full_name || id;

  const getCriminalName = (id: string) =>
    profiles.find((p) => p.id === id)?.full_name || id;

  // Filter by search
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

  return (
    <OfficerContainer active="criminal records">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Criminal Records</h2>
        {activeTab === "arrests" && (
          <button
            onClick={() => setShowNewArrestModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Log new arrest
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700 mb-6">
        {tabs.map(
          (tab: { key: string; label: string; icon: React.ReactNode }) => (
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
          )
        )}
      </div>

      {/* Search */}
      <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md w-80 mb-6">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="bg-transparent text-white w-full outline-none"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading records...</p>
      ) : (
        <div>
          {activeTab === "arrests" && (
            <motion.div
              key="arrests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredArrests.map((arrest: Arrest) => (
                <div
                  key={arrest.id}
                  className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="text-white font-semibold">
                      {getCriminalName(arrest.criminal_id)}
                    </h4>
                    <span className="text-gray-400 text-sm">
                      {arrest.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Officer: {getOfficerName(arrest.officer_id)}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Charges: {arrest.charges}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Date: {format(new Date(arrest.arrest_date), "PPP")} |
                    Location: {arrest.location}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "profiles" && (
            <motion.div
              key="profiles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredProfiles.map((profile: Profile) => (
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
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "watchlist" && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {watchlistProfiles.map((suspect: Profile) => (
                <div
                  key={suspect.id}
                  className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
                >
                  <h4 className="text-white font-semibold">
                    {suspect.full_name}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Risk Level: {suspect.risk_level || "N/A"}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* 🔹 New Arrest Modal */}
      {showNewArrestModal && (
        <NewArrestModal
          onClose={(): void => setShowNewArrestModal(false)}
          onSuccess={(newArrest: Arrest) => setArrests([newArrest, ...arrests])}
          profiles={profiles}
          officers={officers}
        />
      )}
    </OfficerContainer>
  );
};

export default OfficerCriminalRecords;
