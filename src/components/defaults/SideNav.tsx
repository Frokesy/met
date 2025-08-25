import { NavLink, useNavigate } from "react-router-dom";
import type { NavProps } from "./TopNav";
import {
  BookOpen,
  CheckCircle,
  History,
  Home,
  LogOut,
  Menu,
  Settings,
  ShieldUser,
} from "lucide-react";

const SideNav = ({ active }: NavProps) => {
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", route: "/dashboard", icon: <Home /> },
    { label: "Personnel", route: "/personnel", icon: <ShieldUser /> },
    { label: "Duty Roaster", route: "/duty-roaster", icon: <Menu /> },
    { label: "Attendance", route: "/attendance", icon: <BookOpen /> },
    { label: "Verifications", route: "/verifications", icon: <CheckCircle /> },
    { label: "Activity Logs", route: "/activity-logs", icon: <History /> },
    { label: "System Settings", route: "/system-settings", icon: <Settings /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    navigate("/admin/auth", { replace: true });
  };
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
            className={`p-4 rounded-md flex space-x-3 ${
              active === item.label.toLowerCase()
                ? "bg-[#16BBE5] cursor-pointer text-[#2E4765] font-semibold"
                : "hover:bg-[#2E4765]/10 hover:text-gray-400"
            } text-[18px]`}
          >
            {item.icon && item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-6 p-3 cursor-pointer rounded-md bg-red-600 hover:bg-red-500 text-white"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
