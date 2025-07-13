import { BgAttachment } from "../svgs/Icons";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="relative w-[100%]">
      <div className="h-[100vh] overflow-hidden">
        <BgAttachment />
      </div>
      <div className="w-[100%] absolute top-30">
        <div className="w-[85%] mx-auto bg-[#fff] h-[75vh] rounded-4xl flex items-center justify-between pl-20 space-x-10">
          <div className="w-[60%] flex items-center space-x-6">
            <img src="/assets/logo.svg" alt="logo" />
            <div>
              <p className="text-[32px] text-[#2E4765] font-medium uppercase">
                c.s.e department
              </p>
              <p className="text-[32px] text-[#2E4765] font-medium uppercase">
                met engineering college
              </p>
            </div>
          </div>

          <div className="w-[40%]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
