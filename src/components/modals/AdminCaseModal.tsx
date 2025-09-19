import { useEffect, useState } from "react";
import { CalendarDays, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "../../../utils/supabaseClient";

interface CaseFile {
  id: string;
  title: string;
  description: string;
  assigned_officer: string;
  status: string;
  created_at: string;
  notes?: string | null;
}

interface Officer {
  user_id: string;
  full_name: string;
}

interface AdminCaseModalProps {
  caseFile: CaseFile | null;
  statusLabels: Record<string, string>;
  onClose: () => void;
  onStatusUpdate: (caseId: string, newStatus: string) => void;
  onNotesUpdate: (caseId: string, newNotes: string) => void;
  officers: Record<string, string>;
  onReassign: (caseId: string, newOfficerId: string) => void;
}

const AdminCaseModal = ({
  caseFile,
  statusLabels,
  onReassign,
  onClose,
  onStatusUpdate,
  onNotesUpdate,
}: AdminCaseModalProps) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [note, setNote] = useState("");
  const [assignedOfficerName, setAssignedOfficerName] = useState<string>("");

  useEffect(() => {
    const fetchOfficers = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select("user_id, full_name");

      if (!error && data) {
        setOfficers(data);

        if (caseFile?.assigned_officer) {
          setSelectedOfficer(caseFile.assigned_officer);
          const officer = data.find(
            (o) => o.user_id === caseFile.assigned_officer
          );
          setAssignedOfficerName(
            officer ? officer.full_name : "Unknown officer"
          );
        }
      }
    };
    fetchOfficers();
  }, [caseFile]);

  const handleReassign = async () => {
    if (!selectedOfficer || !caseFile?.id) return;

    const { error } = await supabase
      .from("cases")
      .update({ assigned_officer: selectedOfficer })
      .eq("id", caseFile.id);

    if (!error) {
      const officer = officers.find((o) => o.user_id === selectedOfficer);
      onReassign(caseFile.id, selectedOfficer);
      setAssignedOfficerName(officer ? officer.full_name : "Unknown officer");
    }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !caseFile?.id) return;

    const timestamp = format(new Date(), "PPpp");
    const newEntry = `[${timestamp}] ${note}`;
    const updatedNotes = caseFile.notes
      ? `${caseFile.notes}\n${newEntry}`
      : newEntry;

    const { error } = await supabase
      .from("cases")
      .update({ notes: updatedNotes })
      .eq("id", caseFile.id);

    if (!error) {
      setNote("");
      onNotesUpdate(caseFile.id, updatedNotes);
    }
  };

  if (!caseFile) return null;

  return (
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
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-cyan-400 mb-4">
          {caseFile.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <CalendarDays size={16} />
          {caseFile.created_at
            ? format(new Date(caseFile.created_at), "PPP")
            : "Unknown date"}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <User size={16} />
          {assignedOfficerName || "Unknown officer"}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <Tag size={16} />
          {caseFile.status
            ? statusLabels[caseFile.status] || caseFile.status
            : "Unknown status"}
        </div>

        <p className="text-gray-300 mb-4">{caseFile.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Case Notes
          </h4>
          <div className="bg-gray-800 p-3 rounded-md text-sm text-gray-300 max-h-40 overflow-y-auto whitespace-pre-line">
            {caseFile.notes ? caseFile.notes : "No notes yet."}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Update Status
          </label>
          <select
            value={caseFile.status}
            onChange={(e) => {
              if (caseFile.id) {
                onStatusUpdate(caseFile.id, e.target.value);
              }
            }}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Re-Assign Officer
          </label>
          <select
            value={selectedOfficer}
            onChange={(e) => setSelectedOfficer(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full"
          >
            <option value="">Select officer</option>
            {officers.map((off) => (
              <option key={off.user_id} value={off.user_id}>
                {off.full_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleReassign}
            disabled={
              !selectedOfficer || selectedOfficer === caseFile.assigned_officer
            }
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full disabled:opacity-50"
          >
            Reassign
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Add Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type a note..."
            className="bg-gray-800 text-white w-full p-2 rounded-md"
          />
          <button
            onClick={handleAddNote}
            disabled={!note.trim()}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md w-full disabled:opacity-50"
          >
            Add Note
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminCaseModal;
