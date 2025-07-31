import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import SemesterResults from "./pages/semester_results";
import Notes from "./pages/notes";
import Dashboard from "./pages/dashboard";
import Personnel from "./pages/personnel";
import DutyRoaster from "./pages/duty_roaster";
import Attendance from "./pages/attendance";
import Verifications from "./pages/verifications";
import UserAccounts from "./pages/user_accounts";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Auth /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/personnel", element: <Personnel /> },
    { path: "/duty-roaster", element: <DutyRoaster /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/verifications", element: <Verifications /> },
    { path: "/semester-results", element: <SemesterResults /> },
    { path: "/notes", element: <Notes /> },
    { path: "/user-accounts", element: <UserAccounts /> }
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
