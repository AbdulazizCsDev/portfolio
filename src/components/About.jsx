import { useLanguage } from '../context/LanguageContext';
import './About.css';

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </svg>
  );
}

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about">
      <div className="section-inner">
        <div className="about-header" data-reveal>
          <h2 className="section-title">{t.about.title}</h2>
          <div className="title-line" />
        </div>

        <div className="about-grid">
          {/* Bio */}
          <div className="about-bio" data-reveal data-reveal-delay="1">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>

            {/* Education */}
            <div className="about-edu">
              <h3 className="about-sub-title">{t.about.education}</h3>
              <div className="edu-card card-glass">
                <div className="edu-icon"><GraduationIcon /></div>
                <div className="edu-info">
                  <h4>{t.about.university}</h4>
                  <p>{t.about.degree}</p>
                  <div className="edu-meta">
                    <span className="tag">{t.about.gpa}</span>
                    <span className="tag">{t.about.period}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="about-certs" data-reveal data-reveal-delay="2">
            <h3 className="about-sub-title">{t.about.certifications}</h3>
            <div className="certs-list">
              {t.about.certs.map((cert, i) => (
                <div
                  key={i}
                  className="cert-card card-glass"
                  data-reveal
                  data-reveal-delay={String(i + 2)}
                  data-cert-index={i}
                >
                  <div className="cert-badge">✓</div>
                  <div className="cert-info">
                    <h4>{cert.name}</h4>
                    <p>{cert.issuer}</p>
                    <span className="cert-year">{cert.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
