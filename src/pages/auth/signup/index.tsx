const OfficerSignup = () => {
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
          <h2 className="text-[20px] font-bold">Officer Signup</h2>
          <p className="text-[15px] text-gray-300 mt-1">
            Register to access the system.
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Full Name"
          />
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Security ID"
          />
          <input
            type="email"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Email Address"
          />
          <input
            type="password"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Password"
          />
          <input
            type="password"
            className="w-full p-4 rounded-lg border border-cyan-500 bg-gray-800 placeholder:text-gray-400 text-white outline-none"
            placeholder="Confirm Password"
          />

          <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 transition text-gray-900 rounded-lg font-semibold text-lg">
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login/officer" className="text-cyan-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerSignup;
