import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface PersonnelType {
  id?: number;
  name: string;
  securityId: string;
  unit: string;
  enlistmentDate: string;
  status: string;
  rank: string;
  pic?: string;
}

interface AddPersonnelModalProps {
  onClose: () => void;
  onSave: (data: PersonnelType & { file?: File | null }) => void;
  personnel: PersonnelType | undefined | null;
}

const AddPersonnelModal = ({
  onClose,
  onSave,
  personnel,
}: AddPersonnelModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<PersonnelType>({
    name: "",
    securityId: "",
    unit: "",
    enlistmentDate: "",
    status: "Active",
    rank: "",
    pic: "",
  });

  useEffect(() => {
    if (personnel) {
      setFormData(personnel);
      setImagePreview(personnel.pic || null);
    }
  }, [personnel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const previewURL = URL.createObjectURL(selected);
      setImagePreview(previewURL);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, file });
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
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Security ID
            </label>
            <input
              name="securityId"
              type="text"
              value={formData.securityId}
              onChange={handleChange}
              placeholder="e.g. 12345ABC"
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            />
          </div>

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
              name="enlistmentDate"
              type="date"
              value={formData.enlistmentDate}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg border border-cyan-500 bg-gray-800 text-white outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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

          <div>
            <label className="text-sm font-medium text-white">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full mt-2 text-white file:bg-cyan-600 file:border-none file:rounded file:px-4 file:py-2 file:text-white file:cursor-pointer bg-gray-700"
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-white mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Selected personnel"
                  className="rounded-lg border border-cyan-500 w-[70px] h-[70px] object-cover"
                />
              </div>
            )}
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
