import { useEffect, useState } from 'react';
import './SplashScreen.css';

const PATH =
  'M50,2 L94,60 L50,118 L6,60 Z M50,14 L27,57 L73,57 Z M50,106 L73,63 L27,63 Z';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('draw'); // draw → reveal → out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 1100);
    const t2 = setTimeout(() => setPhase('out'), 2400);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`splash ${phase}`}>
      <div className="splash-inner">
        <svg
          className="splash-svg"
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="splash-grad"
              x1="50" y1="2" x2="50" y2="118"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#7b2fff" />
            </linearGradient>
          </defs>

          {/* Stroke draw-in layer */}
          <path
            className="s-stroke"
            stroke="url(#splash-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="500"
            d={PATH}
          />

          {/* Filled layer — fades in after stroke finishes */}
          <path
            className="s-fill"
            fillRule="evenodd"
            fill="url(#splash-grad)"
            d={PATH}
          />
        </svg>

        <span className="splash-name">Abdulaziz Alhaidan</span>
      </div>
    </div>
  );
}
