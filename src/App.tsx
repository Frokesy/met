import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import SemesterResults from "./pages/admin/semester_results";
import Notes from "./pages/admin/notes";
import Dashboard from "./pages/admin/dashboard";
import Personnel from "./pages/admin/personnel";
import DutyRoaster from "./pages/admin/duty_roaster";
import Attendance from "./pages/admin/attendance";
import Verifications from "./pages/admin/verifications";
import UserAccounts from "./pages/admin/user_accounts";
import ActivityLogs from "./pages/admin/activity_logs";
import SystemSettings from "./pages/admin/settings";
import OfficerDashboard from "./pages/officer/dashboard";

const App = () => {
  const router = createBrowserRouter([
    // admin routes
    { path: "/", element: <Auth /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/personnel", element: <Personnel /> },
    { path: "/duty-roaster", element: <DutyRoaster /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/verifications", element: <Verifications /> },
    { path: "/semester-results", element: <SemesterResults /> },
    { path: "/notes", element: <Notes /> },
    { path: "/user-accounts", element: <UserAccounts /> },
    { path: "/activity-logs", element: <ActivityLogs /> },
    { path: "/system-settings", element: <SystemSettings /> },

    // officer routes
    { path: "/officer/dashboard", element: <OfficerDashboard /> },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
