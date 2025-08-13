import { useEffect, useState } from "react";
import { User as UserIcon, Lock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";
import supabase from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

const OfficerSettings = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      setEmail(user.email ?? "");

      try {
        // Get personnel_id from profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("personnel_id")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile?.personnel_id) return;

        // Get personnel details
        const { data: personnel, error: personnelError } = await supabase
          .from("personnel")
          .select("first_name, last_name")
          .eq("id", profile.personnel_id)
          .single();

        if (personnelError) throw personnelError;

        setFullName(`${personnel.first_name} ${personnel.last_name}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Save profile
  const handleSaveProfile = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.warn("Please enter your full name.");
      return;
    }

    setIsSaving(true);
    try {
      const { data: profile } = await supabase
  .from("profiles")
  .select("personnel_id")
  .eq("id", user.id)
  .maybeSingle(); // ✅ returns null if no row
  
       if (!profile) {
  toast.warn("No profile found. Please complete your details.");
  return;
}

      if (!profile?.personnel_id) throw new Error("No personnel record linked.");

      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ");

      const { error } = await supabase
        .from("personnel")
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", profile.personnel_id);

      if (error) throw error;

      toast.success("Profile updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleUpdatePassword = async () => {
    if (!user) return;
    if (!currentPassword) {
      toast.warn("Enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.warn("New password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);
    try {
      // Re-authenticate
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });
      if (signInError) throw signInError;

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <OfficerContainer active="settings">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Settings
      </div>

      {/* Profile Info */}
      <div className="bg-gray-800 p-6 rounded-md shadow mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <UserIcon size={18} /> Profile Information
        </h2>

        <div className="space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="Full Name"
            disabled={isLoading}
          />
          <input
            value={email}
            disabled
            className="w-full p-3 rounded-md bg-gray-700 text-gray-400 outline-none"
            placeholder="Email Address"
          />
          <button
            onClick={handleSaveProfile}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md disabled:opacity-60"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Change Password */}
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
            disabled={isChangingPassword}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="New Password"
            disabled={isChangingPassword}
          />
          <button
            onClick={handleUpdatePassword}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md disabled:opacity-60"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </OfficerContainer>
  );
};

export default OfficerSettings;
