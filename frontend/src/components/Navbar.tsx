import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const Navbar: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentIndex = LANGUAGES.findIndex((l) =>
    i18n.language.startsWith(l.code),
  );
  const current = LANGUAGES[currentIndex] ?? LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="lang-dropdown" ref={ref}>
            <button
              className="lang-toggle"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="lang-toggle__flag">{current.flag}</span>
              <span>{current.label}</span>
              <span
                className={`lang-toggle__chevron${open ? " lang-toggle__chevron--open" : ""}`}
              >
                ▾
              </span>
            </button>
            {open && (
              <ul className="lang-dropdown__menu" role="listbox">
                {LANGUAGES.map((lang) => (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={lang.code === current.code}
                    className={`lang-dropdown__item${lang.code === current.code ? " lang-dropdown__item--active" : ""}`}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setOpen(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
