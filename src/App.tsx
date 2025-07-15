import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth";
import Overview from "./pages/overview";
import Assignments from "./pages/assignments";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Auth /> },
    { path: "/overview", element: <Overview /> },
    { path: "/assignments", element: <Assignments /> },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
