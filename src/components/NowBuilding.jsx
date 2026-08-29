import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
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
              key={item.id}
              className="now-card"
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
              data-target-id={item.id}
            >
              <div className="now-card-top">
                <span className="now-status">
                  <span className="now-status-dot" />
                  {item.status}
                </span>
                <span className="now-started">
                  {t.now.startedLabel} <Bidi>{item.started}</Bidi>
                </span>
              </div>

              <h3 className="now-name"><Bidi>{item.name}</Bidi></h3>
              <p className="now-desc"><Bidi>{item.desc}</Bidi></p>

              <div className="now-focus">
                {item.focus.map((f) => (
                  <span key={f} className="tag">
                    <Bidi>{f}</Bidi>
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
