import { useEffect, useState } from "react";
import { CalendarDays, User, Search, UserCircle } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";
import { supabase } from "../../../../utils/supabaseClient";
import MainContainer from "../../../components/containers/MainContainer";
import AdminCaseModal from "../../../components/modals/AdminCaseModal";

interface CaseFile {
  id: string;
  title: string;
  description: string;
  assigned_officer: string;
  status: string;
  created_at: string;
  criminal_profiles?: {
    full_name: string;
    alias?: string;
  };
}

const statusLabels: Record<string, string> = {
  incident: "Incident Report",
  pending: "Pending",
  under_investigation: "Under Investigation",
  transferred: "Transferred",
  charge_to_court: "Charge to Court",
  court: "Court Case",
  closed: "Closed",
};

const statusColors: Record<string, string> = {
  incident: "bg-orange-500 text-white",
  pending: "bg-yellow-500 text-black",
  under_investigation: "bg-blue-500 text-white",
  transferred: "bg-purple-500 text-white",
  charge_to_court: "bg-pink-500 text-white",
  court: "bg-indigo-600 text-white",
  closed: "bg-green-600 text-white",
};

const AdminCaseManagement = () => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [officers, setOfficers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchOfficers = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select("user_id, full_name");

      if (!error && data) {
        const officerMap: Record<string, string> = {};
        data.forEach((o) => {
          officerMap[o.user_id] = o.full_name;
        });
        setOfficers(officerMap);
      }
    };
    fetchOfficers();
  }, []);

  const handleNotesUpdate = (caseId: string, newNotes: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, notes: newNotes } : c))
    );
    setSelectedCase((prev) => (prev ? { ...prev, notes: newNotes } : prev));
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select(
            `
              *,
              criminal_profiles(full_name, alias)
            `
          )
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
      c.assigned_officer?.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      startDate && endDate
        ? isWithinInterval(new Date(c.created_at), {
            start: new Date(startDate),
            end: new Date(endDate),
          })
        : true;

    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleUpdateStatus = async (caseId: string, newStatus: string) => {
    const { error } = await supabase
      .from("cases")
      .update({ status: newStatus })
      .eq("id", caseId);

    if (!error) {
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
      setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
  };

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
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
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

        <div>
          <label className="block text-sm text-gray-400">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1 rounded-md bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1 rounded-md bg-gray-800 text-white border border-gray-600"
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
                    statusColors[item.status] || "bg-gray-500 text-white"
                  }`}
                >
                  {statusLabels[item.status] || item.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarDays size={16} />
                {format(new Date(item.created_at), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <User size={16} />
                {officers[item.assigned_officer] || "Unknown officer"}
              </div>
              {item.criminal_profiles?.full_name && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                  <UserCircle size={16} />
                  {item.criminal_profiles.full_name}{" "}
                  {item.criminal_profiles.alias &&
                    `(${item.criminal_profiles.alias})`}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AdminCaseModal
        caseFile={selectedCase}
        statusLabels={statusLabels}
        onClose={() => setSelectedCase(null)}
        onStatusUpdate={handleUpdateStatus}
        onNotesUpdate={handleNotesUpdate}
        officers={officers}
        onReassign={(caseId, newOfficerId) => {
          setCases((prev) =>
            prev.map((c) =>
              c.id === caseId ? { ...c, assigned_officer: newOfficerId } : c
            )
          );
          setSelectedCase((prev) =>
            prev ? { ...prev, assigned_officer: newOfficerId } : prev
          );
        }}
      />
    </MainContainer>
  );
};

export default AdminCaseManagement;
