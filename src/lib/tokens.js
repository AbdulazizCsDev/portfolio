// Canvas and WebGL layers cannot use var(--…) — they need concrete values.
// These read the token off <html> at call time, so a drawing layer follows the
// active mode instead of freezing whatever was current when it mounted.

export function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// '#d9ad48' → [217, 173, 72]
export function tokenRgb(name, fallback = [217, 173, 72]) {
  const hex = readToken(name).replace('#', '');
  if (hex.length !== 6) return fallback;
  const n = parseInt(hex, 16);
  return Number.isNaN(n) ? fallback : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// '#d9ad48' → 0xd9ad48, the form three.js wants
export function tokenHexInt(name, fallback = 0xd9ad48) {
  const hex = readToken(name).replace('#', '');
  const n = parseInt(hex, 16);
  return hex.length === 6 && !Number.isNaN(n) ? n : fallback;
}

// Calls back whenever the mode flips. Returns an unsubscribe function.
export function onModeChange(fn) {
  const obs = new MutationObserver(fn);
  obs.observe(document.documentElement, { attributeFilter: ['data-mode'] });
  return () => obs.disconnect();
}
