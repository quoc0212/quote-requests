import { useAuth } from "../../contexts/AuthContext";

export function useAdminPage() {
  const { isAuthenticated } = useAuth();
  return { isAuthenticated };
}
