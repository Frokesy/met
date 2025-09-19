import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, UserCircle, FileText } from "lucide-react";
import { format } from "date-fns";

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

interface CaseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  caseFile: CaseFile | null;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
}

const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  show,
  onClose,
  caseFile,
  statusLabels,
  statusColors,
}) => {
  if (!caseFile) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-lg max-w-lg w-full shadow-lg text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyan-400">
                {caseFile.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[caseFile.status] || "bg-gray-500 text-white"
                }`}
              >
                {statusLabels[caseFile.status] || caseFile.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <CalendarDays size={16} />
              {format(new Date(caseFile.created_at), "PPP")}
            </div>

            {caseFile.criminal_name && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <UserCircle size={16} />
                {caseFile.criminal_name}
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <FileText size={16} />
                <span className="font-semibold">Description</span>
              </div>
              <p className="text-gray-300 text-sm">{caseFile.description}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-md text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaseDetailsModal;
