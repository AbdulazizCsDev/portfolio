import { useEffect, useState } from 'react';

// A router small enough to read in one sitting. §1 forbids new packages, and
// real paths need nothing beyond the History API plus the rewrite in
// vercel.json that hands index.html to every path.

// Reads the current pathname and re-renders whenever it changes — whether the
// change came from navigate() below or from the browser's back button.
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    window.addEventListener('routechange', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('routechange', onChange);
    };
  }, []);
  return path;
}

// pushState does not fire popstate, so the event is dispatched by hand for
// listeners mounted through useRoute.
export function navigate(to) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, '', to);
  window.dispatchEvent(new Event('routechange'));
}

export const projectPath = (id) => `/project/${id}`;

// Returns the project id for /project/<id>, or null for the home page.
export function matchProject(path) {
  const m = /^\/project\/([\w-]+)\/?$/.exec(path);
  return m ? m[1] : null;
}
