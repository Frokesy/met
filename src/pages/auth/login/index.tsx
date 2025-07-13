import { useState } from "react";
import AuthContainer from "../../../components/containers/AuthContainer";

const Login = () => {
  const [loginType, setLoginType] = useState("student");

  return (
    <AuthContainer>
      <div>
        <div className="flex flex-col space-y-6">
          {loginType === "student" ? (
            <input
              type="number"
              className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none placeholder:text-[#000]"
              placeholder="Enter your Roll No"
            />
          ) : (
            <input
              type="email"
              className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none placeholder:text-[#000]"
              placeholder="Enter your Email"
            />
          )}
          {loginType === "student" ? (
            <input
              type="date"
              className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none"
            />
          ) : (
            <input
              type="password"
              className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none placeholder:text-[#000]"
              placeholder="Password"
            />
          )}
          <button className="bg-[#16BBE5] cursor-pointer text-[#2E4765] text-[20px] w-[100%] rounded-xl py-4">
            Login
          </button>
          {loginType === "student" ? (
            <p
              className="text-[20px] font-bold text-[#2F7CF0] cursor-pointer"
              onClick={() => setLoginType("faculty")}
            >
              Login as Faculty?
            </p>
          ) : (
            <p
              className="text-[20px] font-bold text-[#2F7CF0] cursor-pointer"
              onClick={() => setLoginType("student")}
            >
              Login as Student?
            </p>
          )}
        </div>
      </div>
    </AuthContainer>
  );
};

export default Login;
