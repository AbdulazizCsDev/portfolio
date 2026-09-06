import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import Link from '../lib/Link';
import { projectPath } from '../lib/router';
import { ArrowIcon } from '../lib/icons';
import './Projects.css';

export default function Projects() {
  const { t } = useLanguage();
  const gridRef = useRef(null);

  // A light that follows the cursor across the grid: JS writes only the pointer
  // position into two custom properties, and CSS draws a soft gold wash there.
  // Mouse only, like the particle field — a finger has no hover state, so a tap
  // would strand the light where it landed.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    let frame = 0;
    let pending = null;

    // Coalesced to one write per frame: pointermove fires far more often than
    // the screen repaints, and each write invalidates the gradient.
    const flush = () => {
      frame = 0;
      if (!pending) return;
      grid.style.setProperty('--chroma-x', `${pending.x}px`);
      grid.style.setProperty('--chroma-y', `${pending.y}px`);
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = grid.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      grid.classList.add('is-lit');
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onLeave = (e) => {
      if (e.pointerType !== 'mouse') return;
      grid.classList.remove('is-lit');
    };

    grid.addEventListener('pointermove', onMove);
    grid.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      grid.removeEventListener('pointermove', onMove);
      grid.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="projects">
      <div className="section-inner">
        <h2 className="section-title">
          <Bidi>{t.projects.title}</Bidi>
        </h2>

        <div className="projects-grid" ref={gridRef}>
          {t.projects.items.map((project, i) => (
            // The whole card is the link — the target is the project page that
            // already exists, unchanged.
            <Link
              key={project.id}
              to={projectPath(project.id)}
              className="project-card"
              data-target-id={project.id}
            >
              {/* Image slot. `image` is null on every project until real files
                  are dropped in; the frame holds the same aspect either way so
                  adding one later does not reflow the grid. */}
              <div className="project-media">
                {project.image ? (
                  <img src={project.image} alt="" loading="lazy" />
                ) : (
                  <span className="project-media-index" dir="ltr">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>

              <div className="project-card-body">
                <h3 className="project-card-name"><Bidi>{project.name}</Bidi></h3>

                {/* The headline figure and its note live on the project page,
                    not here — the card is for grasping what the thing is. */}
                <p className="project-card-summary"><Bidi>{project.summary}</Bidi></p>

                <span className="project-card-cta">
                  <span>{t.projects.open}</span>
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
