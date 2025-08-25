import { AnimatePresence } from "framer-motion";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import SemesterResults from "./pages/admin/semester_results";
import Notes from "./pages/admin/notes";
import Dashboard from "./pages/admin/dashboard";
import Personnel from "./pages/admin/personnel";
import DutyRoaster from "./pages/admin/duty_roaster";
import Attendance from "./pages/admin/attendance";
import Verifications from "./pages/admin/verifications";
import ActivityLogs from "./pages/admin/activity_logs";
import SystemSettings from "./pages/admin/settings";
import OfficerDashboard from "./pages/officer/dashboard";
import MyDuties from "./pages/officer/duties";
import OfficerAttendance from "./pages/officer/attendance";
import Requests from "./pages/officer/requests";
import OfficerSettings from "./pages/officer/settings";
import OfficerLogin from "./pages/auth/login";
import AdminLogin from "./pages/admin/auth/login";
import OfficerSignup from "./pages/auth/signup";
import type { JSX } from "react";
import OfficerProtectedRoute from "./components/defaults/OfficerProectedRoutes";

const AdminRoute = ({ element }: { element: JSX.Element }) => {
  const isAdmin = localStorage.getItem("admin_session") === "true";
  return isAdmin ? element : <Navigate to="/admin/auth" replace />;
};

const App = () => {
  const router = createBrowserRouter([
    // admin auth
    { path: "/admin/auth", element: <AdminLogin /> },

    // 🔐 protected admin routes
    { path: "/dashboard", element: <AdminRoute element={<Dashboard />} /> },
    { path: "/personnel", element: <AdminRoute element={<Personnel />} /> },
    {
      path: "/duty-roaster",
      element: <AdminRoute element={<DutyRoaster />} />,
    },
    { path: "/attendance", element: <AdminRoute element={<Attendance />} /> },
    {
      path: "/verifications",
      element: <AdminRoute element={<Verifications />} />,
    },
    {
      path: "/semester-results",
      element: <AdminRoute element={<SemesterResults />} />,
    },
    { path: "/notes", element: <AdminRoute element={<Notes />} /> },
    {
      path: "/activity-logs",
      element: <AdminRoute element={<ActivityLogs />} />,
    },
    {
      path: "/system-settings",
      element: <AdminRoute element={<SystemSettings />} />,
    },

    // officer routes
    { path: "/", element: <OfficerLogin /> },
    { path: "/signup", element: <OfficerSignup /> },
    {
      path: "/officer/dashboard",
      element: (
        <OfficerProtectedRoute>
          <OfficerDashboard />
        </OfficerProtectedRoute>
      ),
    },
    {
      path: "/officer/my-duties",
      element: (
        <OfficerProtectedRoute>
          <MyDuties />
        </OfficerProtectedRoute>
      ),
    },
    {
      path: "/officer/attendance",
      element: (
        <OfficerProtectedRoute>
          <OfficerAttendance />
        </OfficerProtectedRoute>
      ),
    },
    {
      path: "/officer/requests",
      element: (
        <OfficerProtectedRoute>
          <Requests />
        </OfficerProtectedRoute>
      ),
    },
    {
      path: "/officer/settings",
      element: (
        <OfficerProtectedRoute>
          <OfficerSettings />
        </OfficerProtectedRoute>
      ),
    },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
