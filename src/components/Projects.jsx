import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import Link from '../lib/Link';
import { projectPath } from '../lib/router';
import './Projects.css';

export default function Projects() {
  const { t } = useLanguage();

  return (
    <section id="projects">
      <div className="section-inner">
        <div data-reveal>
          <h2 className="section-title">{t.projects.title}</h2>
          <div className="title-line" />
        </div>

        <div className="projects-grid">
          {t.projects.items.map((project, i) => (
            <article
              key={project.id}
              className="project-card card-glass"
              data-reveal
              data-reveal-delay={String(i + 1)}
              data-target-id={project.id}
            >
              <h3 className="project-name"><Bidi>{project.name}</Bidi></h3>

              {/* The one number: hardest or strangest, never largest. Bidi
                  isolates the figure so it holds its order in Arabic — §8. */}
              <p className="project-number"><Bidi>{project.number}</Bidi></p>
              <p className="project-number-note"><Bidi>{project.numberNote}</Bidi></p>

              <p className="project-summary"><Bidi>{project.summary}</Bidi></p>

              <p className="project-broke"><Bidi>{project.broke}</Bidi></p>

              <Link to={projectPath(project.id)} className="project-open">
                {t.projects.open} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
