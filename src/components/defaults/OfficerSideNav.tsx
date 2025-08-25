import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarCheck2,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import type { NavProps } from "./TopNav";
import { useAuth } from "../../context/AuthContext";

const OfficerSideNav = ({ active }: NavProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", route: "/officer/dashboard", icon: <Home /> },
    {
      label: "My Duties",
      route: "/officer/my-duties",
      icon: <ClipboardList />,
    },
    {
      label: "Attendance",
      route: "/officer/attendance",
      icon: <CalendarCheck2 />,
    },
    { label: "Requests", route: "/officer/requests", icon: <FileText /> },
    { label: "Settings", route: "/officer/settings", icon: <Settings /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-4 border-r border-[#ccc] h-full bg-gray-900 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-4">
          <img
            src="/assets/logo.svg"
            alt="logo"
            className="w-[62px] h-[64px]"
          />
          <p className="text-[28px] text-cyan-600 font-bold uppercase">
            s.f.i.m.s
          </p>
        </div>

        <div className="mt-10 flex flex-col space-y-3">
          {items.map((item, index) => (
            <NavLink
              to={item.route}
              key={index}
              className={`p-3 rounded-md flex items-center space-x-3 transition-colors ${
                active === item.label.toLowerCase()
                  ? "bg-cyan-500 text-gray-900 font-semibold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-6 p-3 cursor-pointer rounded-md bg-red-600 hover:bg-red-500 text-white"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default OfficerSideNav;
