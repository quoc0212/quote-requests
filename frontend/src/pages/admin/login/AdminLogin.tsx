import React from "react";
import { useAdminLogin } from "./useAdminLogin";

const AdminLogin: React.FC = () => {
  const {
    t,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useAdminLogin();

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
