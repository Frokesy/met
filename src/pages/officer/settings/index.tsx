import { useState } from "react";
import { User, Lock } from "lucide-react";
import OfficerContainer from "../../../components/containers/OfficerContainer";

const OfficerSettings = () => {
  const [name, setName] = useState("John Doe");
  const [email] = useState("john.doe@sfims.ng");
  const [phone, setPhone] = useState("08012345678");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = () => {
    console.log("Updating profile:", { name, phone });
  };

  const handleChangePassword = () => {
    console.log("Changing password:", { currentPassword, newPassword });
  };

  return (
    <OfficerContainer active="settings">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Settings
      </div>

      <div className="bg-gray-800 p-6 rounded-md shadow mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Profile Information
        </h2>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="Full Name"
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
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md"
          >
            Save Changes
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
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white outline-none"
            placeholder="New Password"
          />
          <button
            onClick={handleChangePassword}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md"
          >
            Update Password
          </button>
        </div>
      </div>
    </OfficerContainer>
  );
};

export default OfficerSettings;
