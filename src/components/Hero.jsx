import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import NeuralTree from './NeuralTree';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();

  const openAime = () => document.dispatchEvent(new CustomEvent('openAime'));

  return (
    <section id="hero" className="hero">
      <div className="hero-text">
        <h1 className="hero-name" data-calibrate style={{ '--cal-i': 0 }}>
          <Bidi>{t.hero.name}</Bidi>
        </h1>

        {/* "About" is one line now, not a section. */}
        <p className="hero-line" data-calibrate style={{ '--cal-i': 1 }}>
          <Bidi>{t.hero.line}</Bidi>
        </p>

        <div className="hero-cta" data-calibrate style={{ '--cal-i': 2 }}>
          <button className="btn btn-primary" onClick={openAime}>
            {t.hero.cta1}
          </button>
          <a href="/Abdulaziz-Alhaidan-CV.pdf" download className="btn btn-quiet">
            {t.hero.cta3}
          </a>
        </div>
      </div>
      <NeuralTree />
    </section>
  );
}
