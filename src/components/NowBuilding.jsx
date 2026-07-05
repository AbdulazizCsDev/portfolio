import { useLanguage } from '../context/LanguageContext';
import './NowBuilding.css';

export default function NowBuilding() {
  const { t } = useLanguage();

  return (
    <section id="now">
      <div className="section-inner">
        <div data-reveal>
          <h2 className="section-title">{t.now.title}</h2>
          <div className="title-line" />
        </div>
        <p className="section-subtitle now-subtitle" data-reveal>
          {t.now.subtitle}
        </p>

        <div className="now-grid">
          {t.now.items.map((item, i) => (
            <div
              key={item.name}
              className="now-card card-glass"
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
            >
              <div className="now-card-top">
                <span className="now-status">
                  <span className="now-status-dot" />
                  {item.status}
                </span>
                <span className="now-started">
                  {t.now.startedLabel} {item.started}
                </span>
              </div>

              <h3 className="now-name">{item.name}</h3>
              <p className="now-desc">{item.desc}</p>

              <div className="now-focus">
                {item.focus.map((f) => (
                  <span key={f} className="tag">
                    {f}
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
