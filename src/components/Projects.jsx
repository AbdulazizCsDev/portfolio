import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import Link from '../lib/Link';
import { projectPath } from '../lib/router';
import { ArrowIcon } from '../lib/icons';
import './Projects.css';

export default function Projects() {
  const { t } = useLanguage();
  const listRef = useRef(null);

  // A light that follows the cursor across the project rows: the pointer
  // position is written to two custom properties and CSS draws a soft gold
  // wash there. Deliberately not a card grid — no package, no borders, no
  // per-item colour, so the ink-and-gold palette and the "space, not boxes"
  // rule both hold.
  //
  // Mouse only, like the particle field: a finger has no hover state, so on a
  // touchscreen a tap would strand the light wherever it landed.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    let frame = 0;
    let pending = null;

    // Coalesced to one write per frame — pointermove fires far more often
    // than the screen repaints, and each write invalidates the gradient.
    const flush = () => {
      frame = 0;
      if (!pending) return;
      list.style.setProperty('--chroma-x', `${pending.x}px`);
      list.style.setProperty('--chroma-y', `${pending.y}px`);
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = list.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      list.classList.add('is-lit');
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onLeave = (e) => {
      if (e.pointerType !== 'mouse') return;
      list.classList.remove('is-lit');
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="projects">
      <div className="section-inner">
        <h2 className="section-title">
          <Bidi>{t.projects.title}</Bidi>
        </h2>

        <div className="projects-list" ref={listRef}>
          {t.projects.items.map((project, i) => (
            <article
              className="project-row"
              key={project.id}
              data-target-id={project.id}
            >
              <div>
                <p className="project-index" dir="ltr">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="project-name"><Bidi>{project.name}</Bidi></h3>
                <p className="project-number"><Bidi>{project.number}</Bidi></p>
                <p className="project-number-note"><Bidi>{project.numberNote}</Bidi></p>
              </div>

              <div>
                <div className="project-field">
                  <p className="project-field-label">{t.projects.summaryLabel}</p>
                  <p className="project-summary"><Bidi>{project.summary}</Bidi></p>
                </div>

                {/* What broke. The most valuable line on the page, so it is
                    never the faint layer. */}
                <div className="project-field">
                  <p className="project-field-label">{t.projects.brokeLabel}</p>
                  <p className="project-broke"><Bidi>{project.broke}</Bidi></p>
                </div>

                <Link to={projectPath(project.id)} className="project-open">
                  <span>{t.projects.open}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
