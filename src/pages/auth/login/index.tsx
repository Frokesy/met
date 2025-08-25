import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const OfficerLogin = () => {
  const [securityId, setSecurityId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setOfficer } = useAuth();

  const handleLogin = async () => {
    if (!securityId || !password) {
      toast.error("Both fields are required");
      return;
    }

    try {
      setLoading(true);

      const { data: officer, error: officerError } = await supabase
        .from("officers")
        .select("email, user_id, security_id")
        .eq("security_id", securityId)
        .single();

      if (officerError || !officer) {
        throw new Error("Invalid Security ID");
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: officer.email,
        password,
      });

      if (authError) throw authError;

      setOfficer(officer);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/officer/dashboard"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-10 bg-[#010725] flex items-center justify-center">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="w-full max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img src="/assets/logo.svg" alt="logo" className="w-16 h-16" />
          <p className="text-2xl text-cyan-500 font-semibold uppercase tracking-widest">
            s.f.i.m.s
          </p>
          <p className="text-center text-cyan-400 text-sm uppercase font-medium px-6">
            security forces information management system
          </p>
        </div>

        <div className="text-center my-10">
          <h2 className="text-[20px] font-bold">Officer Login</h2>
          <p className="text-[15px] text-gray-300 mt-1">
            Enter your credentials to access the system.
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            value={securityId}
            onChange={(e) => setSecurityId(e.target.value)}
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Enter your Security ID"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Password"
          />

          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-cyan-400 hover:underline text-center mt-2 cursor-pointer">
            <NavLink to="/login/admin">Login as Admin</NavLink>
          </p>
          <p className="text-sm text-cyan-400 hover:underline text-center mt-2 cursor-pointer">
            <NavLink to="/signup">Signup</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;
