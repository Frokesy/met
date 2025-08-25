import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import MainContainer from "../../../components/containers/MainContainer";
import { AvatarIcon } from "../../../components/svgs/Icons";
import AddPersonnelModal, {
  type PersonnelType,
} from "../../../components/modals/AddPersonnelModal";
import { AnimatePresence } from "framer-motion";
import { supabase } from "../../../../utils/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Personnel = () => {
  const [personnel, setPersonnel] = useState<PersonnelType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonnelType | null>(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select("*")
        .order("full_name", { ascending: true });

      if (!error && data) {
        setPersonnel(data);
      } else if (error) {
        toast.error("Failed to fetch personnel");
      }
    };
    fetchPersonnel();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleAdd = () => {
    setSelectedPersonnel(null);
    setShowModal(true);
  };

  const handleEdit = (p: PersonnelType) => {
    setSelectedPersonnel(p);
    setShowModal(true);
  };

  const handleSave = async (newPersonnel: PersonnelType) => {
    if (newPersonnel.id) {
      const { data, error } = await supabase
        .from("officers")
        .update({
          full_name: newPersonnel.full_name,
          unit: newPersonnel.unit,
          created_at: newPersonnel.created_at,
          status: newPersonnel.status,
          rank: newPersonnel.rank,
        })
        .eq("id", newPersonnel.id)
        .select()
        .single();

      if (!error && data) {
        setPersonnel((prev) =>
          prev.map((p) => (p.id === newPersonnel.id ? data : p))
        );
        toast.success("Personnel updated successfully");
      } else {
        toast.error("Failed to update personnel");
      }
    } else {
      if (!newPersonnel.email || !newPersonnel.password) {
        toast.error("Email and password are required for new personnel");
        return;
      }

      const { error: authError } = await supabase.auth.signUp({
        email: newPersonnel.email,
        password: newPersonnel.password,
      });

      if (authError) {
        toast.error("Failed to create account: " + authError.message);
        return;
      }

      const { data, error } = await supabase
        .from("officers")
        .insert([
          {
            full_name: newPersonnel.full_name,
            email: newPersonnel.email,
            security_id: newPersonnel.security_id,
            unit: newPersonnel.unit,
            created_at: newPersonnel.created_at,
            status: newPersonnel.status,
            rank: newPersonnel.rank,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setPersonnel((prev) => [...prev, data]);
        toast.success("Personnel added successfully");
      } else {
        toast.error("Failed to add personnel");
      }
    }

    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("officers").delete().eq("id", id);
    if (!error) {
      setPersonnel((prev) => prev.filter((p) => p.id !== id));
      toast.success("Personnel deleted successfully");
    } else {
      toast.error("Failed to delete personnel");
    }
  };

  return (
    <MainContainer active="personnel">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="flex justify-between items-center">
        <span className="text-[20px] text-gray-500 font-semibold mb-6 block">
          Home / Personnel
        </span>

        <button
          onClick={handleAdd}
          className="py-2 px-6 bg-cyan-600 text-[#fff] hover:bg-cyan-800 cursor-pointer transition rounded-lg font-semibold text-lg flex items-center space-x-3"
        >
          <UserPlus />
          <span>Add New Personnel</span>
        </button>
      </div>

      <div className="grid gap-4 mt-6">
        {personnel.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-[#0d1329] text-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <AvatarIcon />

              <div>
                <p className="font-semibold text-lg">{p.full_name}</p>
                <p className="text-xs text-gray-400">{p.security_id}</p>
                {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
              </div>
            </div>

            <div className="text-center space-y-2 hidden md:block">
              <div className="flex space-x-2 items-center">
                <div className="p-1 rounded-full bg-gray-700">
                  <Users size={16} />
                </div>
                <p className="text-sm">{p.unit}</p>
              </div>
              <p className="text-xs text-gray-400">
                {formatDate(p.created_at)}
              </p>
            </div>

            <div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  p.status
                    ? "bg-green-700 text-green-100"
                    : "bg-red-700 text-red-100"
                }`}
              >
                {p.status ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold text-cyan-400">
                {p.rank}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(p)}
                className="hover:text-yellow-400 transition"
              >
                <Pencil size={18} color="blue" />
              </button>
              <button
                onClick={() => handleDelete(p.id!)}
                className="hover:text-red-500 transition"
              >
                <Trash2 size={18} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <AddPersonnelModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            personnel={selectedPersonnel}
          />
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default Personnel;
