import { useLanguage } from '../context/LanguageContext';
import './Skills.css';

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
                <span className="skill-cat-icon">{cat.icon}</span>
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
