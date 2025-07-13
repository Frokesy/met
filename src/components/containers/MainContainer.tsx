import TopNav from "../defaults/TopNav";

interface Props {
  children: React.ReactNode;
  active: string;
}

const MainContainer = ({ children, active }: Props) => {
  console.log(active);
  return (
    <div className="h-[99vh] overflow-y-hidden flex">
      {/* sidenav */}
      <div className="w-[15%]"></div>
      <div className="bg-[#EFF1F7] w-[85%]">
        <TopNav active={active} />
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
