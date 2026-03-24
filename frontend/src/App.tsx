import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/home/HomePage";
import ReportPage from "./pages/report/ReportPage";
import AdminPage from "./pages/admin/AdminPage";
import "./i18n";
import "./styles/global.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "4rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                  }}
                >
                  404
                </h1>
                <p>Page not found.</p>
                <a href="/" className="btn btn--primary">
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
