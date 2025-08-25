import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import { supabase } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficerSettings = () => {
  const { officer, setOfficer } = useAuth();

  const [full_name, setFullName] = useState(officer?.full_name || "");
  const [email, setEmail] = useState(officer?.email || "");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (!officer) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("officers")
        .select("full_name, email, phone")
        .eq("user_id", officer.user_id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } else if (data) {
        setFullName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone || "");
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [officer]);

  const handleUpdateProfile = async () => {
    if (!officer) return;
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from("officers")
      .update({ full_name, phone })
      .eq("user_id", officer.user_id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } else if (data) {
      toast.success("Profile updated!");
      setOfficer({
        ...officer,
        full_name: data.full_name,
        email: data.email,
        security_id: officer.security_id,
      });
    }

    setLoadingProfile(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Both password fields are required");
      return;
    }

    setLoadingPassword(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) throw signInError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Failed to update password");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <OfficerContainer active="settings">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Settings
      </div>

      <div className="bg-gray-800 p-6 rounded-md shadow mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Profile Information
        </h2>

        <div className="space-y-4">
          <input
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="Full Name"
            disabled={loadingProfile}
          />
          <input
            value={email}
            disabled
            className="w-full p-3 rounded-md bg-gray-700 text-gray-400 outline-none"
            placeholder="Email Address"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="Phone Number"
            disabled={loadingProfile}
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md disabled:opacity-50"
            disabled={loadingProfile}
          >
            {loadingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-md shadow">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock size={18} /> Change Password
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="Current Password"
            disabled={loadingPassword}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="New Password"
            disabled={loadingPassword}
          />
          <button
            onClick={handleChangePassword}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md disabled:opacity-50"
            disabled={loadingPassword}
          >
            {loadingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </OfficerContainer>
  );
};

export default OfficerSettings;
