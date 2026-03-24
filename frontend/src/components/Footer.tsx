import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img
              src="https://cdn.prod.website-files.com/5e8e816d43060d752609918c/63ed220900f57b617b668c0c_brix-templates-logo.svg"
              alt="Logo"
            />
          </Link>
          <p className="footer__copyright">
            Copyright &copy; 2025 BRIX Templates | All Rights Reserved
          </p>
        </div>

        <form className="footer__subscribe" onSubmit={handleSubscribe}>
          <div className="footer__input-wrapper">
            <input
              type="email"
              className="footer__email-input"
              placeholder={t("footer.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn--primary footer__subscribe-btn"
            >
              {t("footer.subscribe")}
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
