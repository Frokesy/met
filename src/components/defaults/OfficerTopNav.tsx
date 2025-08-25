import { BellIcon } from "lucide-react";
import { AvatarIcon, CaretDown, HamburgerIcon } from "../svgs/Icons";
import { useAuth } from "../../context/AuthContext";

export interface NavProps {
  active: string;
}

const OfficerTopNav = ({ active }: NavProps) => {
  const { officer } = useAuth();
  return (
    <div className="py-4 px-6 flex items-center justify-between border-b-2 border-[#ccc] shadow-md">
      <div className="flex items-center space-x-4">
        <HamburgerIcon />
        <h2 className="text-[24px] capitalize">{active}</h2>
      </div>
      <div className="flex items-center space-x-14">
        <div className="cursor-pointer">
          <BellIcon />
        </div>
        <div className="hidden lg:block relative">
          <div className="flex items-center space-x-3 bg-[#1B1B2F] cursor-pointer text-[#fff] py-2 px-6 rounded-full">
            <AvatarIcon size={42} />
            <span className="ml-2">{officer?.full_name}</span>
            <CaretDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerTopNav;
