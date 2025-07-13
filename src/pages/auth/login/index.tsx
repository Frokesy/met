import AuthContainer from "../../../components/containers/AuthContainer";

const Login = () => {
  return (
    <AuthContainer>
      <div>
        <div className="flex flex-col space-y-6">
          <input
            type="number"
            className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none placeholder:text-[#000]"
            placeholder="Enter your Roll No"
          />
          <input
            type="date"
            className="border-3 border-[#16BBE5] w-[450px] max-w-[450px] p-4 rounded-xl outline-none"
          />
          <button className="bg-[#16BBE5] text-[#2E4765] text-[20px] w-[100%] rounded-xl py-4">
            Login
          </button>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Login;
