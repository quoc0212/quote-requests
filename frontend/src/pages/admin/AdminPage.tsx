import React from "react";
import AdminLogin from "./login/AdminLogin";
import AdminDashboard from "./dashboard/AdminDashboard";
import { useAdminPage } from "./useAdminPage";

const AdminPage: React.FC = () => {
  const { isAuthenticated } = useAdminPage();
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminPage;
