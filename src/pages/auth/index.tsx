import { useState } from "react";
import { ShieldCheck, Star, Settings } from "lucide-react";

const Auth = () => {
  const [loginType, setLoginType] = useState<"officer" | "commander" | "admin">(
    "officer",
  );

  const roleOptions = [
    { label: "Officer", icon: <ShieldCheck size={40} />, value: "officer" },
    { label: "Commander", icon: <Star size={40} />, value: "commander" },
    { label: "Admin", icon: <Settings size={40} />, value: "admin" },
  ];

  const isAdminOrCommander = loginType === "admin" || loginType === "commander";

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

        <div className="grid grid-cols-3 gap-4 mb-6">
          {roleOptions.map((role) => (
            <div
              key={role.value}
              onClick={() =>
                setLoginType(role.value as "officer" | "commander" | "admin")
              }
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-lg cursor-pointer transition-all ${
                loginType === role.value
                  ? "bg-cyan-700 text-white scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {role.icon}
              <span className="mt-2 font-semibold text-sm">{role.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center my-10">
          <h2 className="text-[20px] font-bold">Secure Access Portal</h2>
          <p className="text-[15px] text-gray-300 mt-1">
            Enter your credentials to access the system.
          </p>
        </div>

        <div className="space-y-6">
          {isAdminOrCommander ? (
            <input
              type="email"
              className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              placeholder="Enter your Email"
            />
          ) : (
            <input
              type="text"
              className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              placeholder="Enter your Security ID"
            />
          )}
          <input
            type="password"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Password"
          />

          <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg">
            Login
          </button>

          <p
            className="text-sm text-cyan-400 hover:underline text-center mt-2 cursor-pointer"
            onClick={() =>
              setLoginType(loginType === "officer" ? "admin" : "officer")
            }
          >
            {loginType === "officer" ? "Login as Admin?" : "Login as Officer?"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
