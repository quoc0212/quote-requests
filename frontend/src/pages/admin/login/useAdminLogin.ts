import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/api";

export function useAdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      login(res.token, res.email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("admin.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return { t, email, setEmail, password, setPassword, error, loading, handleSubmit };
}
