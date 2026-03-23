import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  adminEmail: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  adminEmail: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const TOKEN_KEY = "admin_token";
const EMAIL_KEY = "admin_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY),
  );

  const login = (newToken: string, email: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(EMAIL_KEY, email);
    setToken(newToken);
    setAdminEmail(email);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setAdminEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, adminEmail, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
