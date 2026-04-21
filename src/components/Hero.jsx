import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const titles = t.hero.titles;
    const current = titles[titleIndex];
    let timeout;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setTitleIndex((i) => (i + 1) % titles.length);
    } else {
      const speed = isDeleting ? 55 : 90;
      timeout = setTimeout(() => {
        setDisplayed(
          isDeleting
            ? current.slice(0, displayed.length - 1)
            : current.slice(0, displayed.length + 1)
        );
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, titleIndex, t.hero.titles]);

  const canvasRef = useRef(null);

  // Interactive data-network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const size = canvas.offsetWidth;
    canvas.width = size;
    canvas.height = size;

    const CX = size / 2;
    const CY = size / 2;
    const CONNECT = 85;
    const N = 22;

    const particles = Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2;
      const r = 55 + Math.random() * 90;
      return {
        x: CX + Math.cos(angle) * r,
        y: CY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.8 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.5 ? 192 : 270, // cyan or purple
      };
    });

    let mouse = { x: CX, y: CY };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMove);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const now = Date.now() / 1000;

      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100 && d > 0) {
          p.vx += (dx / d) * 0.025;
          p.vy += (dy / d) * 0.025;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 10 || p.x > size - 10) p.vx *= -1;
        if (p.y < 10 || p.y > size - 10) p.vy *= -1;
      });

      // Connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.45;
            const grd = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grd.addColorStop(0, `hsla(${particles[i].hue},100%,65%,${alpha})`);
            grd.addColorStop(1, `hsla(${particles[j].hue},100%,65%,${alpha})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grd;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Nodes
      particles.forEach((p) => {
        const pulse = Math.sin(now * 2.2 + p.phase) * 0.5 + 0.5;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        glow.addColorStop(0, `hsla(${p.hue},100%,70%,${0.85 + pulse * 0.15})`);
        glow.addColorStop(1, `hsla(${p.hue},100%,70%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  const openAime = () =>
    document.dispatchEvent(new CustomEvent('openAime'));

  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        {/* Left: text */}
        <div className="hero-content">
          <div className="hero-badge" data-reveal>
            <span className="badge-pulse" />
            {t.hero.available}
          </div>

          <p className="hero-greeting" data-reveal data-reveal-delay="1">
            {t.hero.greeting}
          </p>

          <h1 className="hero-name" data-reveal data-reveal-delay="2">
            {t.hero.name}
          </h1>

          <div className="hero-title-wrap" data-reveal data-reveal-delay="3">
            <span className="hero-title-static">
              {displayed}
              <span className="cursor" />
            </span>
          </div>

          <p className="hero-bio" data-reveal data-reveal-delay="4">
            {t.hero.bio}
          </p>

          <div className="hero-cta" data-reveal data-reveal-delay="5">
            <button className="btn btn-primary" onClick={openAime}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              {t.hero.cta1}
            </button>
            <button className="btn btn-secondary" onClick={scrollToProjects}>
              {t.hero.cta2}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <a
              href="/Abdulaziz-Alhaidan-CV.pdf"
              download="Abdulaziz-Alhaidan-CV.pdf"
              className="btn btn-cv"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t.hero.cta3}
            </a>
          </div>
        </div>

        {/* Right: visual */}
        <div className="hero-visual" data-reveal data-reveal-delay="2">
          <div className="avatar-container">
            {/* Data-network canvas */}
            <canvas ref={canvasRef} className="avatar-canvas" />

            <div className="avatar-ring ring-3" />
            <div className="avatar-ring ring-2" />
            <div className="avatar-ring ring-1" />
            <div className="avatar-core">
              {/* New double-A diamond logo */}
              <svg viewBox="0 0 100 120" fill="none" className="avatar-logo" aria-hidden="true">
                <defs>
                  <linearGradient id="av-grad" x1="50" y1="2" x2="50" y2="118" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#7b2fff" />
                  </linearGradient>
                </defs>
                <path
                  fillRule="evenodd"
                  fill="url(#av-grad)"
                  d="M50,2 L94,60 L50,118 L6,60 Z M50,14 L27,57 L73,57 Z M50,106 L73,63 L27,63 Z"
                />
              </svg>
            </div>

            {/* Orbiting tech dots */}
            {['Python', 'React', 'AI', 'FastAPI', 'NLP', 'AWS'].map((label, i) => (
              <div
                key={label}
                className="orbit-tag"
                style={{ '--i': i, '--total': 6 }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>scroll</span>
      </div>
    </section>
  );
}
