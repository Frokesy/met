import OfficerSideNav from "../defaults/OfficerSideNav";
import OfficerTopNav from "../defaults/OfficerTopNav";

interface Props {
  children: React.ReactNode;
  active: string;
}

const OfficerContainer = ({ children, active }: Props) => {
  return (
    <div className="h-[100vh] bg-[#010725] text-[#ffffff] overflow-y-hidden flex">
      <div className="w-[20%]">
        <OfficerSideNav active={active} />
      </div>
      <div className=" w-[80%]">
        <OfficerTopNav active={active} />
        <div className="px-6 pt-10">{children}</div>
      </div>
    </div>
  );
};

export default OfficerContainer;
