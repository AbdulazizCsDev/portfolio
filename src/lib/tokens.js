// Canvas cannot use var(--…) — it needs a concrete value. This reads the token
// off <html> at call time, so the drawing layer follows the active mode instead
// of freezing whatever was current when it mounted.

export function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Calls back whenever the mode flips. Returns an unsubscribe function.
export function onModeChange(fn) {
  const obs = new MutationObserver(fn);
  obs.observe(document.documentElement, { attributeFilter: ['data-mode'] });
  return () => obs.disconnect();
}
