import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language.startsWith('vi') ? 'en' : 'vi';
    i18n.changeLanguage(next);
  };

  const isVi = i18n.language.startsWith('vi');

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Quotify<span>.</span>
        </Link>
        <div className="navbar__actions">
          <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            <span className="lang-toggle__flag">{isVi ? '🇺🇸' : '🇻🇳'}</span>
            <span>{isVi ? 'EN' : 'VI'}</span>
          </button>
          <Link to="/admin" className="btn btn--outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            {t('nav.admin')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
