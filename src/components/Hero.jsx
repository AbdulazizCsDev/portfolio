import { useEffect, useState } from 'react';
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
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTitleIndex((i) => (i + 1) % titles.length);
      }, 80);
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

  const openAime = () =>
    document.dispatchEvent(new CustomEvent('openAime'));

  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
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

          <div className="hero-stats" data-reveal data-reveal-delay="4">
            <span className="hero-stat">
              <strong className="stat-num">5</strong>
              <span>{lang === 'ar' ? 'مشاريع' : 'Projects'}</span>
            </span>
            <span className="stat-sep" aria-hidden="true">·</span>
            <span className="hero-stat">
              <strong className="stat-num">4.01</strong>
              <span>GPA</span>
            </span>
            <span className="stat-sep" aria-hidden="true">·</span>
            <span className="hero-stat">
              <strong className="stat-num">3</strong>
              <span>{lang === 'ar' ? 'شهادات' : 'Certs'}</span>
            </span>
          </div>

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
