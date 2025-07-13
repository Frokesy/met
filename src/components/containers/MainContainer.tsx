import SideNav from "../defaults/SideNav";
import TopNav from "../defaults/TopNav";

interface Props {
  children: React.ReactNode;
  active: string;
}

const MainContainer = ({ children, active }: Props) => {
  console.log(active);
  return (
    <div className="h-[99vh] overflow-y-hidden flex">
      <div className="w-[20%]">
        <SideNav active={active} />
      </div>
      <div className="bg-[#EFF1F7] w-[80%]">
        <TopNav active={active} />
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
