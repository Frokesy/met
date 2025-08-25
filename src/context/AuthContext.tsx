/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Officer = {
  user_id: string;
  email: string;
  unit?: string;
  security_id: string;
  full_name: string;
};

type AuthContextType = {
  officer: Officer | null;
  setOfficer: (officer: Officer | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [officer, setOfficer] = useState<Officer | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("officer");
    if (stored) {
      setOfficer(JSON.parse(stored));
    }
  }, []);

  const saveOfficer = (officerData: Officer | null) => {
    if (officerData) {
      sessionStorage.setItem("officer", JSON.stringify(officerData));
    } else {
      sessionStorage.removeItem("officer");
    }
    setOfficer(officerData);
  };

  const logout = () => saveOfficer(null);

  return (
    <AuthContext.Provider value={{ officer, setOfficer: saveOfficer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
