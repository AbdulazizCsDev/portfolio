import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { navigate } from '../lib/router';
import { SunIcon, MoonIcon } from '../lib/icons';
import './Navbar.css';

export default function Navbar() {
  const { lang, toggle, t } = useLanguage();
  const { mode, toggle: toggleMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (window.location.pathname !== '/') return;
      const sections = ['hero', 'projects', 'now', 'contact'];
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

  // Section ids only exist on the home page, so from a project page the nav
  // routes home first and scrolls once the section has mounted.
  const scrollTo = (id) => {
    setMenuOpen(false);
    const target = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (window.location.pathname === '/') { target(); return; }
    navigate('/');
    requestAnimationFrame(() => requestAnimationFrame(target));
  };

  const navItems = [
    { id: 'projects', label: t.nav.projects },
    { id: 'now', label: t.nav.now },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner">
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
          {/* The icon shows the mode you'd switch *to*, and carries no title
              attribute — the browser tooltip named the two modes, which meant
              nothing to a visitor who has not read the design brief. The
              aria-label stays for screen readers. */}
          <button
            className="mode-btn"
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
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
