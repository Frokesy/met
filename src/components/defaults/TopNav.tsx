import { AvatarIcon, HamburgerIcon } from "../svgs/Icons";

export interface NavProps {
  active: string;
}

const TopNav = ({ active }: NavProps) => {
  return (
    <div className="py-4 px-6 flex items-center justify-between border-b-2 border-[#ccc] shadow-md">
      <div className="flex items-center space-x-4">
        <HamburgerIcon />
        <h2 className="text-[24px] capitalize">{active}</h2>
      </div>
      <div className="flex items-center space-x-14">
        <div className="flex items-center space-x-3">
          <AvatarIcon />
          <p className="text-[24px]">John</p>
        </div>
        <button className="py-2 px-6 rounded-xl bg-[#16BBE5] cursor-pointer text-[#2E4765] text-[20px]">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNav;
