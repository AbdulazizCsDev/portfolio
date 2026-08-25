import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function InkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.5c3.6 3.2 5.5 5.9 5.5 8.4a5.5 5.5 0 0 1-11 0c0-2.5 1.9-5.2 5.5-8.4z" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </svg>
  );
}

export default function Navbar() {
  const { lang, toggle, t } = useLanguage();
  const { mode, toggle: toggleMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ['hero', 'about', 'experience', 'projects', 'now', 'skills', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'now', label: t.nav.now },
    { id: 'skills', label: t.nav.skills },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => scrollTo('hero')} aria-label="Home">
          <svg width="20" height="24" viewBox="0 0 100 120" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="nav-grad" x1="50" y1="2" x2="50" y2="118" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="var(--mark)" />
                <stop offset="100%" stopColor="var(--mark)" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              fill="url(#nav-grad)"
              d="M50,2 L94,60 L50,118 L6,60 Z M50,14 L27,57 L73,57 Z M50,106 L73,63 L27,63 Z"
            />
          </svg>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`nav-link ${active === id ? 'active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className="mode-btn"
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            title={mode === 'dark' ? 'ورق' : 'حبر'}
          >
            {mode === 'dark' ? <PaperIcon /> : <InkIcon />}
          </button>
          <button className="lang-btn" onClick={toggle} title="Toggle language">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              className={`mobile-link ${active === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
