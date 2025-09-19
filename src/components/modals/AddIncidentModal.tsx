/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, AnimatePresence } from "framer-motion";

interface AddIncidentModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newCase: { title: string; description: string; related_person_id: string };
  setNewCase: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      related_person_id: string;
    }>
  >;
  profiles: any[];
}

const AddIncidentModal = ({
  show,
  onClose,
  onSubmit,
  newCase,
  setNewCase,
  profiles,
}: AddIncidentModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              Log New Incident
            </h3>

            {/* Title */}
            <input
              type="text"
              placeholder="Title"
              value={newCase.title}
              onChange={(e) =>
                setNewCase({ ...newCase, title: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
            />

            {/* Description */}
            <textarea
              placeholder="Description"
              value={newCase.description}
              onChange={(e) =>
                setNewCase({ ...newCase, description: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
            />

            {/* Related Person (Suspect) */}
            <label className="block text-gray-300 mb-2 text-sm">
              Suspect (optional)
            </label>
            <select
              value={newCase.related_person_id || ""}
              onChange={(e) =>
                setNewCase({ ...newCase, related_person_id: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
            >
              <option value="">-- Select a suspect --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} {p.alias ? `(${p.alias})` : ""}
                </option>
              ))}
            </select>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddIncidentModal;
