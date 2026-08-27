import { useEffect, useState } from 'react';
import './Calibration.css';

// §5 — the page arrives complete and readable, then settles. The inline script
// in index.html has already decided whether this session calibrates and stamped
// data-calibrating before first paint, so nothing jumps on mount.
const SETTLE_MS = 2200;
const STABLE_HOLD_MS = 1000;

export default function Calibration() {
  const [phase, setPhase] = useState(() =>
    document.documentElement.hasAttribute('data-calibrating') ? 'calibrating' : 'off'
  );

  useEffect(() => {
    if (phase !== 'calibrating') return;
    const toStable = setTimeout(() => {
      document.documentElement.removeAttribute('data-calibrating');
      setPhase('stable');
    }, SETTLE_MS);
    return () => clearTimeout(toStable);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'stable') return;
    const toOff = setTimeout(() => setPhase('off'), STABLE_HOLD_MS);
    return () => clearTimeout(toOff);
  }, [phase]);

  if (phase === 'off') return null;

  // The indicator is the safety valve: without it the drift reads as a bug.
  // dir stays with the page — <bdi> isolates the Latin readout without
  // flipping the box itself, which would drop it on the wrong edge in RTL.
  return (
    <output className={`calibration ${phase}`} aria-live="polite">
      <bdi>{phase === 'calibrating' ? 'calibrating' : 'stable'}</bdi>
    </output>
  );
}
