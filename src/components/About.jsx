import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import './About.css';

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
            <p><Bidi>{t.about.p1}</Bidi></p>
            <p><Bidi>{t.about.p2}</Bidi></p>

            {/* Education */}
            <div className="about-edu">
              <h3 className="about-sub-title">{t.about.education}</h3>
              <div className="edu-card card-glass">
                <div className="edu-icon">🎓</div>
                <div className="edu-info">
                  <h4><Bidi>{t.about.university}</Bidi></h4>
                  <p><Bidi>{t.about.degree}</Bidi></p>
                  <div className="edu-meta">
                    <span className="tag"><Bidi>{t.about.gpa}</Bidi></span>
                    <span className="tag"><Bidi>{t.about.period}</Bidi></span>
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
                    <h4><Bidi>{cert.name}</Bidi></h4>
                    <p><Bidi>{cert.issuer}</Bidi></p>
                    <span className="cert-year"><Bidi>{cert.year}</Bidi></span>
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
