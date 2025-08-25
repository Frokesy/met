import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_EMAIL = `admin-8h97uets@sfims.local`;
const ADMIN_PASSWORD = "st83a31l";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_session", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-10 bg-[#010725] flex items-center justify-center">
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
          <h2 className="text-[20px] font-bold">Admin Login</h2>
          <p className="text-[15px] text-gray-300 mt-1">
            Enter your credentials to access the system.
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Enter your Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Password"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg"
          >
            Login
          </button>
          <p className="text-sm text-cyan-400 hover:underline text-center mt-2 cursor-pointer">
            <NavLink to="/">Login as Officer</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
