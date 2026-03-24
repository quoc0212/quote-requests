import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const AdminLogin: React.FC = () => {
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

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          Quote Requerst Admin<span></span>
        </div>
        <p className="login-card__subtitle">{t("admin.loginTitle")}</p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-2">
            <label className="form-label" htmlFor="admin-email">
              {t("admin.email")} <span className="form-label__required">*</span>
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group mb-2">
            <label className="form-label" htmlFor="admin-password">
              {t("admin.password")}{" "}
              <span className="form-label__required">*</span>
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full mt-2"
            disabled={loading || !email || !password}
          >
            {loading ? t("admin.signingIn") : t("admin.loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
