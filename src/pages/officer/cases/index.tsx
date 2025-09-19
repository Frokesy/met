/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CalendarDays, UserCircle } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../utils/supabaseClient";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import AddIncidentModal from "../../../components/modals/AddIncidentModal";
import CaseDetailsModal from "../../../components/modals/CaseDetailsModal";

interface CaseFile {
  id: string;
  title: string;
  description: string;
  assigned_officer: string | null;
  status: string;
  created_at: string;
  related_person_id?: string | null;
  criminal_name?: string | null;
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

const CaseFiles = () => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const { officer } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    related_person_id: "",
  });
  const [profiles, setProfiles] = useState<any[]>([]);

  // 🔹 Filter states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const handleCreateIncident = async () => {
    if (!newCase.title || !newCase.description) return;

    const { data, error } = await supabase
      .from("cases")
      .insert([
        {
          title: newCase.title,
          description: newCase.description,
          status: "incident",
          assigned_officer: officer?.user_id,
          related_person_id: newCase.related_person_id || null,
        },
      ])
      .select("*, criminal_profiles(full_name, alias)")
      .single();

    if (error) {
      console.error("Error creating incident:", error);
    } else if (data) {
      setCases((prev) => [data, ...prev]);
      setShowModal(false);
      setNewCase({ title: "", description: "", related_person_id: "" });
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("criminal_profiles")
        .select("id, full_name, alias");

      if (!error && data) {
        setProfiles(data);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (!officer) return;

    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select(
            `
            id, title, description, status, created_at, assigned_officer,
            related_person_id,
            criminal_profiles(full_name)
          `
          )
          .eq("assigned_officer", officer.user_id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted =
          data?.map((c: any) => ({
            ...c,
            criminal_name: c.criminal_profiles?.full_name || null,
          })) || [];

        setCases(formatted);
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [officer]);

  // 🔹 Combined filters
  const filteredCases = cases.filter((c) => {
    let valid = true;

    if (statusFilter) {
      valid = c.status === statusFilter;
    }

    if (startDate && endDate) {
      valid =
        valid &&
        isWithinInterval(new Date(c.created_at), {
          start: new Date(startDate),
          end: new Date(endDate),
        });
    }

    return valid;
  });

  return (
    <OfficerContainer active="case files">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Case Files</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500"
        >
          Log Incident
        </button>
      </div>

      {/* 🔹 Filter controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-400">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          >
            <option value="">All</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div>
          <label className="block text-sm text-gray-400">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading cases...</p>
      ) : filteredCases.length === 0 ? (
        <p className="text-gray-400">No case files found.</p>
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
              {item.criminal_name && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                  <UserCircle size={16} />
                  {item.criminal_name}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AddIncidentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateIncident}
        newCase={newCase}
        setNewCase={setNewCase}
        profiles={profiles}
      />
      <CaseDetailsModal
        show={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        caseFile={selectedCase}
        statusLabels={statusLabels}
        statusColors={statusColors}
      />
    </OfficerContainer>
  );
};

export default CaseFiles;
