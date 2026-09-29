import { useEffect, useState } from 'react';
import './SplashScreen.css';

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

        <span className="splash-name">Abdulaziz Alhaidan</span>
      </div>
    </div>
  );
}
