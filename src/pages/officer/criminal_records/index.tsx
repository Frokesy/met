import { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, List, Eye } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";

const tabs = [
  { key: "arrests", label: "Arrest Records", icon: <List size={16} /> },
  { key: "profiles", label: "Criminal Profiles", icon: <User size={16} /> },
  { key: "watchlist", label: "Suspect Watchlist", icon: <Eye size={16} /> },
];

const dummyArrests = [
  {
    id: "AR001",
    criminal: "John Doe",
    officer: "Officer Smith",
    caseId: "C001",
    charges: "Theft, Assault",
    date: "2025-09-15",
    location: "Downtown",
    status: "Closed",
  },
  {
    id: "AR002",
    criminal: "Jane Roe",
    officer: "Officer Adams",
    caseId: "C002",
    charges: "Fraud",
    date: "2025-09-17",
    location: "Uptown",
    status: "Pending",
  },
];

const dummyProfiles = [
  {
    id: "CR001",
    fullName: "John Doe",
    alias: "JD",
    priorConvictions: "Burglary, Theft",
    paroleStatus: "Completed",
  },
  {
    id: "CR002",
    fullName: "Jane Roe",
    alias: "J-Ro",
    priorConvictions: "Fraud",
    paroleStatus: "N/A",
  },
];

const dummyWatchlist = [
  { id: "SW001", fullName: "Jack Black", riskLevel: "High" },
  { id: "SW002", fullName: "Jill White", riskLevel: "Medium" },
];

const OfficerCriminalRecords = () => {
  const [activeTab, setActiveTab] = useState("arrests");
  const [search, setSearch] = useState("");

  return (
    <OfficerContainer active="criminal records">
      <h2 className="text-2xl font-bold text-white mb-6">Criminal Records</h2>

      {/* Tabs */}
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

      {/* Search */}
      <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md w-80 mb-6">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white w-full outline-none"
        />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "arrests" && (
          <motion.div
            key="arrests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {dummyArrests.map((arrest) => (
              <div
                key={arrest.id}
                className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="text-white font-semibold">
                    {arrest.criminal}
                  </h4>
                  <span className="text-gray-400 text-sm">{arrest.status}</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Officer: {arrest.officer}
                </p>
                <p className="text-gray-300 text-sm">
                  Charges: {arrest.charges}
                </p>
                <p className="text-gray-400 text-xs">
                  Date: {arrest.date} | Location: {arrest.location}
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
            {dummyProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
              >
                <h4 className="text-white font-semibold">
                  {profile.fullName} {profile.alias && `(${profile.alias})`}
                </h4>
                <p className="text-gray-300 text-sm">
                  Prior Convictions: {profile.priorConvictions}
                </p>
                <p className="text-gray-300 text-sm">
                  Parole Status: {profile.paroleStatus}
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
            {dummyWatchlist.map((suspect) => (
              <div
                key={suspect.id}
                className="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition-colors"
              >
                <h4 className="text-white font-semibold">{suspect.fullName}</h4>
                <p className="text-gray-300 text-sm">
                  Risk Level: {suspect.riskLevel}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </OfficerContainer>
  );
};

export default OfficerCriminalRecords;
