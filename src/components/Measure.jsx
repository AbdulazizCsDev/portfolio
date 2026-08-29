import { useEffect, useRef, useState } from 'react';
import './Measure.css';

// The one visual element kept in place of the deleted background.
//
// It is a ruler down the start edge, and it measures something real: the gold
// tick tracks how far down the page you are. That keeps it structural rather
// than decorative — it is the only thing left when every word is covered, so
// it had to earn the space by doing a job.
//
// Ticks are unevenly spaced at the top and settle into an even rhythm further
// down, so the scale itself calibrates as you read.
const TICKS = 28;

export default function Measure({ ticks = TICKS }) {
  const [at, setAt] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      frame.current = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAt(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const marked = Math.round(at * (ticks - 1));

  return (
    <div className="measure" aria-hidden="true">
      {Array.from({ length: ticks }, (_, i) => (
        <span
          key={i}
          className={i === marked ? 'tick marked' : 'tick'}
          style={{ '--jitter': `${(1 - i / ticks) * ((i % 3) - 1) * 3}px` }}
        />
      ))}
    </div>
  );
}
