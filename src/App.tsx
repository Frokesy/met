import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import Assignments from "./pages/assignments";
import InternalMarks from "./pages/internal_marks";
import SemesterResults from "./pages/semester_results";
import Notes from "./pages/notes";
import Circulars from "./pages/circulars";
import Dashboard from "./pages/dashboard";
import Personnel from "./pages/personnel";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Auth /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/personnel", element: <Personnel /> },
    { path: "/assignments", element: <Assignments /> },
    { path: "/internal-marks", element: <InternalMarks /> },
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
