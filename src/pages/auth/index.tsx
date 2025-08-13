import { useState } from "react";
import { ShieldCheck, Star, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginType, setLoginType] = useState<"officer" | "commander" | "admin">("officer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);

    try {
      if (authMode === "signup") {
        const emailToUse =
          loginType === "officer" && !identifier.includes("@")
            ? `${identifier}@sfims.local`
            : identifier;

        // 1️⃣ Create auth user (trigger will create profile)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: emailToUse,
          password,
        });

        if (signUpError) throw signUpError;
        const userId = signUpData.user?.id;
        if (!userId) throw new Error("Signup failed — no user ID returned");

        // 2️⃣ Optional: update profile with role & security_id after trigger runs
        await supabase
          .from("profiles")
          .update({
            role: loginType,
            security_id: loginType === "officer" ? identifier : null,
          })
          .eq("id", userId);

        // 3️⃣ Auto-login
        alert("Signup successful! Logging you in...");
        await loginAfterSignup(emailToUse, password);
        return;
      }

      // LOGIN
      let emailToUse = identifier;

      if (loginType === "officer" && !identifier.includes("@")) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("security_id", identifier)
          .single();

        if (error || !profile) {
          alert("Security ID not found");
          setLoading(false);
          return;
        }
        emailToUse = profile.email;
      }

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (loginError) throw loginError;

      const { data: roleData, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", loginData.user.id)
        .single();

      if (roleError) throw roleError;

      alert("Login successful!");
      navigateBasedOnRole(roleData.role);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const loginAfterSignup = async (email: string, pass: string) => {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (loginError) {
      alert(loginError.message);
      return;
    }

    const { data: roleData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", loginData.user.id)
      .single();

    navigateBasedOnRole(roleData?.role);
  };

  const navigateBasedOnRole = (role?: string) => {
    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "commander") {
      navigate("/officer/dashboard");
    } else {
      navigate("/officer/my-duties");
    }
  };

  const roleOptions = [
    { label: "Officer", icon: <ShieldCheck size={40} />, value: "officer" },
    { label: "Commander", icon: <Star size={40} />, value: "commander" },
    { label: "Admin", icon: <Settings size={40} />, value: "admin" },
  ];

  const isAdminOrCommander = loginType === "admin" || loginType === "commander";

  return (
    <div className="relative w-full min-h-screen pt-10 bg-[#010725] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg p-8">
        {/* Logo + Header */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img src="/assets/logo.svg" alt="logo" className="w-16 h-16" />
          <p className="text-2xl text-cyan-500 font-semibold uppercase tracking-widest">
            s.f.i.m.s
          </p>
          <p className="text-center text-cyan-400 text-sm uppercase font-medium px-6">
            security forces information management system
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {roleOptions.map((role) => (
            <div
              key={role.value}
              onClick={() => setLoginType(role.value as typeof loginType)}
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

        {/* Heading */}
        <div className="text-center my-6">
          <h2 className="text-[20px] font-bold">
            {authMode === "login" ? "Secure Access Portal" : "Create an Account"}
          </h2>
          <p className="text-[15px] text-gray-300 mt-1">
            {authMode === "login"
              ? "Enter your credentials to access the system."
              : "Fill in the details to register."}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          {isAdminOrCommander ? (
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              placeholder="Enter your Email"
            />
          ) : (
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
              placeholder={authMode === "login" ? "Enter your Security ID" : "Choose a Security ID"}
            />
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Password"
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg"
          >
            {loading
              ? "Processing..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </button>

          <p
            className="text-sm text-cyan-400 hover:underline text-center mt-2 cursor-pointer"
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          >
            {authMode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
