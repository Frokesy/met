import { NavLink } from "react-router-dom";
import type { NavProps } from "./TopNav";

const SideNav = ({ active }: NavProps) => {
  const items = [
    { label: "Overview", route: "/overview" },
    { label: "Assignments", route: "/assignments" },
    { label: "Internal Marks", route: "/internal-marks" },
    { label: "Semester Results", route: "/semester-results" },
    { label: "Download Notes", route: "/notes" },
    { label: "Pay Dues", route: "/pay-dues" },
    { label: "Dues & Approvals", route: "/dues" },
    { label: "Time Table", route: "/timetable" },
    { label: "Circular", route: "/circular" },
    { label: "Events", route: "/events" },
  ];
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <img src="/assets/logo.svg" alt="logo" className="w-[72px] h-[74px]" />
        <p className="text-[40px] text-[#2E4765] font-medium uppercase">met</p>
      </div>
      <div className="mt-10 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`py-2 px-4 rounded-md ${active === item.label.toLowerCase() ? "bg-[#16BBE5] cursor-pointer text-[#2E4765] font-semibold" : "hover:bg-[#2E4765]/10 hover:text-[#2E4765]"} text-[18px]`}
          >
            <NavLink to={item.route}>{item.label}</NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
