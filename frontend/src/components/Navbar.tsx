import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("vi") ? "en" : "vi";
    i18n.changeLanguage(next);
  };

  const isVi = i18n.language.startsWith("vi");

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <img
            src="https://cdn.prod.website-files.com/5e8e816d43060d752609918c/63ed220900f57b617b668c0c_brix-templates-logo.svg"
            alt="Logo"
          />
        </Link>
        <div className="navbar__actions">
          <button
            className="lang-toggle"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <span className="lang-toggle__flag">{isVi ? "🇺🇸" : "🇻🇳"}</span>
            <span>{isVi ? "EN" : "VI"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
