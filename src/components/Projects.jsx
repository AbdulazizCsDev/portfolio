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
        <h2 className="section-title">
          <Bidi>{t.projects.title}</Bidi>
        </h2>

        <div className="projects-list">
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
                <p className="project-summary"><Bidi>{project.summary}</Bidi></p>
                {/* What broke. The most valuable line on the page, so it is
                    never the faint layer. */}
                <p className="project-broke"><Bidi>{project.broke}</Bidi></p>
                <Link to={projectPath(project.id)} className="project-open">
                  {t.projects.open}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
