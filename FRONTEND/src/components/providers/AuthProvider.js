import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = React.createContext();

const AuthProvider = ({ children, value: initialValue }) => {
  const [value] = useLocalStorage("auth", initialValue);
  return (
    <AuthContext.Provider value={{ token: value }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { useAuth, AuthProvider };
