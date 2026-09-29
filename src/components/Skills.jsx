import { useLanguage } from '../context/LanguageContext';
import './Skills.css';

// Category icons, keyed by the `icon` field in t.skills.categories. Inline SVG
// rather than emoji: they take the theme colour and render the same on every OS.
const CATEGORY_ICONS = {
  bot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 13h.01M15 13h.01M9.5 17h5" />
    </>
  ),
  network: (
    <>
      <circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" /><circle cx="12" cy="12" r="2" />
      <path d="M7 6.8l3.2 4M7 17.2l3.2-4M14 12h3" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3.5 2 5 5.5 5 9l-2.5 3h-5L7 12c0-3.5 1.5-7 5-9z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M9.5 15l-1.5 4 3-1.5M14.5 15l1.5 4-3-1.5" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
};

function CategoryIcon({ name }) {
  const glyph = CATEGORY_ICONS[name];
  if (!glyph) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyph}
    </svg>
  );
}

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills">
      <div className="section-inner">
        <div data-reveal>
          <h2 className="section-title">{t.skills.title}</h2>
          <div className="title-line" />
        </div>

        <div className="skills-grid">
          {t.skills.categories.map((cat, i) => (
            <div
              key={cat.name}
              className="skill-category card-glass"
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
            >
              <div className="skill-cat-header">
                <span className="skill-cat-icon"><CategoryIcon name={cat.icon} /></span>
                <h3 className="skill-cat-name">{cat.name}</h3>
              </div>
              <div className="skill-tags">
                {cat.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
