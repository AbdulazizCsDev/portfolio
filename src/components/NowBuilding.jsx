import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import './NowBuilding.css';

export default function NowBuilding() {
  const { t } = useLanguage();

  return (
    <section id="now">
      <div className="section-inner">
        <h2 className="section-title"><Bidi>{t.now.title}</Bidi></h2>
        <p className="section-subtitle"><Bidi>{t.now.subtitle}</Bidi></p>

        <div className="now-list">
          {t.now.items.map((item) => (
            <div className="now-row" key={item.id} data-target-id={item.id}>
              <p className="now-meta" dir="ltr"><Bidi>{item.started}</Bidi></p>
              <div>
                <h3 className="now-name"><Bidi>{item.name}</Bidi></h3>
                <p className="now-desc"><Bidi>{item.desc}</Bidi></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
