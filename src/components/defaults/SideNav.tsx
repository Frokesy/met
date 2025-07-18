import { NavLink } from "react-router-dom";
import type { NavProps } from "./TopNav";
import { Home } from "lucide-react";

const SideNav = ({ active }: NavProps) => {
  const items = [
    { label: "Dashboard", route: "/dashboard", icon: <Home /> },
    { label: "Assignments", route: "/assignments" },
    { label: "Internal Marks", route: "/internal-marks" },
    { label: "Semester Results", route: "/semester-results" },
    { label: "Download Notes", route: "/notes" },
    { label: "Pay Dues", route: "/pay-dues" },
    { label: "Dues & Approvals", route: "/dues" },
    { label: "Time Table", route: "/timetable" },
    { label: "Circulars", route: "/circulars" },
    { label: "Events", route: "/events" },
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
            className={`p-4 rounded-md flex space-x-3 ${active === item.label.toLowerCase() ? "bg-[#16BBE5] cursor-pointer text-[#2E4765] font-semibold" : "hover:bg-[#2E4765]/10 hover:text-[#2E4765]"} text-[18px]`}
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
