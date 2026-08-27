import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import './Experience.css';

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section id="experience">
      <div className="section-inner">
        <div data-reveal>
          <h2 className="section-title">{t.experience.title}</h2>
          <div className="title-line" />
        </div>

        <div className="exp-timeline">
          {t.experience.items.map((item, i) => (
            <div
              key={item.role}
              className="exp-item"
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
            >
              <div className="exp-marker">
                <span className={`exp-dot ${item.current ? 'current' : ''}`} />
                {i < t.experience.items.length - 1 && <span className="exp-line" />}
              </div>

              <div className="exp-card card-glass">
                <div className="exp-head">
                  <h3 className="exp-role"><Bidi>{item.role}</Bidi></h3>
                  {item.current && (
                    <span className="exp-current-badge">{t.experience.current}</span>
                  )}
                </div>
                <p className="exp-org"><Bidi>{item.org}</Bidi></p>
                <span className="exp-period"><Bidi>{item.period}</Bidi></span>
                <ul className="exp-points">
                  {item.points.map((p) => (
                    <li key={p}><Bidi>{p}</Bidi></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
