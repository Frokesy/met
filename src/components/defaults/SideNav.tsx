import { NavLink } from "react-router-dom";
import type { NavProps } from "./TopNav";
import {
  BookOpen,
  CheckCircle,
  History,
  Home,
  Menu,
  Settings,
  ShieldUser,
  Users2,
} from "lucide-react";

const SideNav = ({ active }: NavProps) => {
  const items = [
    { label: "Dashboard", route: "/dashboard", icon: <Home /> },
    { label: "Personnel", route: "/personnel", icon: <ShieldUser /> },
    { label: "Duty Roaster", route: "/duty-roaster", icon: <Menu /> },
    { label: "Attendance", route: "/attendance", icon: <BookOpen /> },
    { label: "Verifications", route: "/verifications", icon: <CheckCircle /> },
    { label: "User Accounts", route: "/user-accounts", icon: <Users2 /> },
    { label: "Activity Logs", route: "/activity-logs", icon: <History /> },
    { label: "System Settings", route: "/system-settings", icon: <Settings /> },
  ];
  return (
    <div className="p-4 border-r border-[#ccc] h-[100%]">
      <div className="flex items-center space-x-4">
        <img src="/assets/logo.svg" alt="logo" className="w-[62px] h-[64px]" />
        <p className="text-[32px] text-cyan-600 font-medium uppercase">
          s.f.i.m.s
        </p>
      </div>
      <div className="mt-10 space-y-4 flex flex-col">
        {items.map((item, index) => (
          <NavLink
            to={item.route}
            key={index}
            className={`p-4 rounded-md flex space-x-3 ${active === item.label.toLowerCase() ? "bg-[#16BBE5] cursor-pointer text-[#2E4765] font-semibold" : "hover:bg-[#2E4765]/10 hover:text-gray-400"} text-[18px]`}
          >
            {item.icon && item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
