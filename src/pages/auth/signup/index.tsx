import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router";

const generateSecurityId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `OFC/2025/${randomPart}`;
};

const OfficerSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [securityId, setSecurityId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSecurityId(generateSecurityId());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { fullName, email, password, confirmPassword } = form;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to get user ID");

      const { error: dbError } = await supabase.from("officers").insert([
        {
          user_id: userId,
          full_name: fullName,
          security_id: securityId,
          email,
        },
      ]);

      if (dbError) throw dbError;

      toast.success(
        `Signup successful! Your Security ID is ${securityId}. Redirecting to login...`
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);

      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSecurityId(generateSecurityId());
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Signup failed");
      } else {
        toast.error("Signup failed");
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
          <h2 className="text-[20px] font-bold">Officer Signup</h2>
          <p className="text-[15px] text-gray-300 mt-1">
            Register to access the system.
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
          />

          <input
            type="text"
            value={securityId}
            readOnly
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-700 text-gray-300 outline-none cursor-not-allowed"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
          />

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <NavLink to="/" className="text-cyan-400 hover:underline">
              Login here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerSignup;
