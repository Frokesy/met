import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface PersonnelType {
  id?: number;
  full_name: string;
  email?: string;
  security_id: string;
  unit: string;
  created_at: string;
  status: boolean;
  rank: string;
  password?: string;
  pic?: string;
}

interface AddPersonnelModalProps {
  onClose: () => void;
  onSave: (data: PersonnelType) => void;
  personnel: PersonnelType | null;
}

const AddPersonnelModal = ({
  onClose,
  onSave,
  personnel,
}: AddPersonnelModalProps) => {
  const generateSecurityId = () => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `OFC/2025/${randomPart}`;
  };

  const [formData, setFormData] = useState<PersonnelType>({
    full_name: "",
    email: "",
    security_id: generateSecurityId(),
    unit: "",
    created_at: new Date().toISOString().split("T")[0],
    status: true,
    rank: "",
    password: "",
  });

  useEffect(() => {
    if (personnel) {
      const formattedDate = personnel.created_at
        ? new Date(personnel.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      setFormData({ ...personnel, created_at: formattedDate });
    }
  }, [personnel]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData });
  };

  return (
    <AnimatePresence>
      <div
        id="modal-backdrop"
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleBackdropClick}
      ></div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        key={"modal"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-800 z-50 shadow-lg p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {personnel ? "Edit Personnel" : "Add New Personnel"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Name</label>
            <input
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            />
          </div>

          {!personnel && (
            <div>
              <label className="text-sm font-medium text-white">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white">
              Security ID
            </label>
            <input
              name="security_id"
              type="text"
              value={formData.security_id}
              disabled
              className="w-full p-3 mt-2 rounded-lg border border-gray-500 bg-gray-700 text-gray-200 cursor-not-allowed"
            />
          </div>

          {!personnel && (
            <div>
              <label className="text-sm font-medium text-white">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a password"
                className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white">Unit</label>
            <input
              name="unit"
              type="text"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Unit name"
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Enlistment Date
            </label>
            <input
              name="created_at"
              type="date"
              value={formData.created_at}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="accent-cyan-500"
            />
            <label className="text-sm font-medium text-white">Active</label>
          </div>

          <div>
            <label className="text-sm font-medium text-white">Rank</label>
            <input
              name="rank"
              type="text"
              value={formData.rank}
              onChange={handleChange}
              placeholder="Rank e.g. Corporal"
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded hover:bg-cyan-800 transition"
          >
            {personnel ? "Update Personnel" : "Save Personnel"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPersonnelModal;
