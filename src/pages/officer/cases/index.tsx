/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { CalendarDays, User, Tag, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../utils/supabaseClient";
import OfficerContainer from "../../../components/containers/OfficerContainer";

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

  return (
    <OfficerContainer active="case files">
      <h2 className="text-2xl font-bold text-white mb-6">Case Files</h2>

      {loading ? (
        <p className="text-gray-400">Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="text-gray-400">No case files found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((item) => (
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

      {/* Modal for details */}
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
                {selectedCase.assigned_officer || "Unassigned"}
              </div>
              {selectedCase.criminal_name && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <UserCircle size={16} />
                  {selectedCase.criminal_name}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Tag size={16} />
                {statusLabels[selectedCase.status]}
              </div>

              <p className="text-gray-300 mb-4">{selectedCase.description}</p>

              <button className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400">
                Update Progress
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OfficerContainer>
  );
};

export default CaseFiles;
