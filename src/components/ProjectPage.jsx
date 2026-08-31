import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Link from '../lib/Link';
import Bidi from '../lib/Bidi';
import { ArrowIcon, GithubIcon } from '../lib/icons';
import './ProjectPage.css';

// Section bodies are authored as one long string each. Rendered as a single
// paragraph they read as an essay; broken every couple of sentences they read
// as documentation, which is what they are.
//
// Splits on a period followed by whitespace, so decimals (0.015), versions
// (gpt-4o-mini) and identifiers (max_tokens) are untouched — they carry no
// space after the dot. Arabic uses the same full stop, so one rule covers both
// languages. A body with no sentence breaks simply comes back whole.
const SENTENCES_PER_PARAGRAPH = 2;

function toParagraphs(body) {
  const sentences = String(body).split(/(?<=\.)\s+/).filter(Boolean);
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(sentences.slice(i, i + SENTENCES_PER_PARAGRAPH).join(' '));
  }
  return paragraphs;
}

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

          <div className="project-figure">
            <p className="project-number"><Bidi>{project.number}</Bidi></p>
            <p className="project-number-note"><Bidi>{project.numberNote}</Bidi></p>
          </div>

          <div className="project-field">
            <p className="project-field-label">{t.projects.summaryLabel}</p>
            <p className="project-page-summary"><Bidi>{project.summary}</Bidi></p>
          </div>

          <div className="project-field">
            <p className="project-field-label">{t.projects.brokeLabel}</p>
            <p className="project-broke"><Bidi>{project.broke}</Bidi></p>
          </div>

          {project.repo && (
            <a
              className="project-repo"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
              <span>{t.projects.repoLabel}</span>
              <ArrowIcon />
            </a>
          )}
        </header>

        {/* Edited, not stacked — the same rule the card follows, with room. */}
        {project.detail.sections.map((section, i) => (
          <section className="project-section" key={section.heading}>
            <h2 className="project-section-heading">
              <span className="project-section-index" dir="ltr">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Bidi>{section.heading}</Bidi>
            </h2>
            {toParagraphs(section.body).map((para, j) => (
              <p className="project-section-body" key={j}><Bidi>{para}</Bidi></p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
