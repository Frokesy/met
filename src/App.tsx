import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import SemesterResults from "./pages/semester_results";
import Notes from "./pages/notes";
import Circulars from "./pages/circulars";
import Dashboard from "./pages/dashboard";
import Personnel from "./pages/personnel";
import DutyRoaster from "./pages/duty_roaster";
import Attendance from "./pages/attendance";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Auth /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/personnel", element: <Personnel /> },
    { path: "/duty-roaster", element: <DutyRoaster /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/semester-results", element: <SemesterResults /> },
    { path: "/notes", element: <Notes /> },
    { path: "/circulars", element: <Circulars /> },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
