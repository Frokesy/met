import { useEffect, useState } from "react";
import { CalendarDays, User, Tag, Search } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../utils/supabaseClient";
import MainContainer from "../../../components/containers/MainContainer";

interface CaseFile {
  id: string;
  title: string;
  description: string;
  assigned_officer: string;
  status: string;
  created_at: string;
}

const AdminCaseManagement = () => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCases(data || []);
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.assigned_officer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <MainContainer active="case management">
      <h2 className="text-2xl font-bold text-white mb-6">Case Management</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Transferred">Transferred</option>
          <option value="Charge-to-Court">Charge-to-Court</option>
          <option value="Court Tracker">Court Tracker</option>
          <option value="Closed">Closed</option>
        </select>

        <div className="flex items-center bg-gray-800 px-3 rounded-md w-72">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white w-full outline-none"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading cases...</p>
      ) : filteredCases.length === 0 ? (
        <p className="text-gray-400">No cases found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-gray-800 p-5 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedCase(item)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-cyan-400">
                  {item.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Pending"
                      ? "bg-yellow-500 text-black"
                      : item.status === "Under Investigation"
                      ? "bg-blue-500 text-white"
                      : item.status === "Transferred"
                      ? "bg-purple-500 text-white"
                      : item.status === "Charge-to-Court"
                      ? "bg-orange-500 text-white"
                      : item.status === "Court Tracker"
                      ? "bg-indigo-500 text-white"
                      : item.status === "Closed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarDays size={16} />
                {format(new Date(item.created_at), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <User size={16} />
                {item.assigned_officer}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCase && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-lg max-w-lg w-full shadow-lg relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setSelectedCase(null)}
              >
                ✕
              </button>

              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                {selectedCase.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <CalendarDays size={16} />
                {format(new Date(selectedCase.created_at), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User size={16} />
                {selectedCase.assigned_officer}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Tag size={16} />
                {selectedCase.status}
              </div>

              <p className="text-gray-300 mb-4">{selectedCase.description}</p>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400">
                  Re-Assign
                </button>
                <button className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400">
                  Update Status
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default AdminCaseManagement;
