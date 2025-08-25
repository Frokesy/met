import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";

const OfficerProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { officer } = useAuth();

  if (!officer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OfficerProtectedRoute;
