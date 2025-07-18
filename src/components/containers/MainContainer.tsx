import SideNav from "../defaults/SideNav";
import TopNav from "../defaults/TopNav";

interface Props {
  children: React.ReactNode;
  active: string;
}

const MainContainer = ({ children, active }: Props) => {
  return (
    <div className="h-[100vh] bg-[#010725] text-[#ffffff] overflow-y-hidden flex">
      <div className="w-[20%]">
        <SideNav active={active} />
      </div>
      <div className=" w-[80%]">
        <TopNav active={active} />
        <div className="px-6 pt-10">{children}</div>
      </div>
    </div>
  );
};

export default MainContainer;
