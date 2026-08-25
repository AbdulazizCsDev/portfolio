import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const STORAGE_KEY = 'portfolio-mode';

// The inline script in index.html already stamped data-mode before first paint,
// so read it back instead of recomputing — that keeps React and the DOM in sync
// and avoids a flash on hydration.
function initialMode() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mode = mode;
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* حفظ معطّل — الوضع يبقى للجلسة فقط */ }
  }, [mode]);

  // Follow the OS only while the visitor has not chosen for themselves.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      let stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* تجاهل */ }
      if (!stored) setMode(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // §2 — only background-color/color/border-color may move during the switch.
  const toggle = () => {
    const root = document.documentElement;
    root.setAttribute('data-mode-switching', '');
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
    setTimeout(() => root.removeAttribute('data-mode-switching'), 360);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
