import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import Overview from "./pages/overview";
import Assignments from "./pages/assignments";
import InternalMarks from "./pages/internal_marks";
import SemesterResults from "./pages/semester_results";
import Notes from "./pages/notes";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Auth /> },
    { path: "/overview", element: <Overview /> },
    { path: "/assignments", element: <Assignments /> },
    { path: "/internal-marks", element: <InternalMarks /> },
    { path: "/semester-results", element: <SemesterResults /> },
    { path: "/notes", element: <Notes /> },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
