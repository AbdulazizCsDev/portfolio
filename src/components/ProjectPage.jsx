import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Link from '../lib/Link';
import Bidi from '../lib/Bidi';
import './ProjectPage.css';

export default function ProjectPage({ id }) {
  const { t } = useLanguage();
  const project = t.projects.items.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Restore whatever the document started with, rather than a guess at it.
  useEffect(() => {
    if (!project) return;
    const previous = document.title;
    document.title = `${project.name} — ${previous.split('|')[0].trim()}`;
    return () => { document.title = previous; };
  }, [project]);

  if (!project) {
    return (
      <main className="project-page">
        <div className="project-page-inner">
          <p className="project-page-missing">{t.projects.notFound}</p>
          <Link to="/" className="project-back">← {t.projects.backToProjects}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="project-page">
      <div className="project-page-inner">
        <Link to="/" className="project-back">← {t.projects.backToProjects}</Link>

        <header className="project-page-head">
          <h1 className="project-page-name"><Bidi>{project.name}</Bidi></h1>
          <p className="project-number"><Bidi>{project.number}</Bidi></p>
          <p className="project-number-note"><Bidi>{project.numberNote}</Bidi></p>
          <p className="project-page-summary"><Bidi>{project.summary}</Bidi></p>
          <p className="project-broke"><Bidi>{project.broke}</Bidi></p>
        </header>

        {/* Edited, not stacked — the same rule the card follows, with room. */}
        {project.detail.sections.map((section) => (
          <section className="project-section" key={section.heading}>
            <h2 className="project-section-heading"><Bidi>{section.heading}</Bidi></h2>
            <p className="project-section-body"><Bidi>{section.body}</Bidi></p>
          </section>
        ))}
      </div>
    </main>
  );
}
