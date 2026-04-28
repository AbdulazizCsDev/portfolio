import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

function EmailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function Contact() {
  const { t } = useLanguage();

  const links = [
    {
      label: t.contact.email,
      value: t.contact.emailVal,
      href: `mailto:${t.contact.emailVal}`,
      icon: <EmailIcon />,
      color: 'var(--accent)',
    },
    {
      label: t.contact.linkedin,
      value: t.contact.linkedinVal,
      href: `https://${t.contact.linkedinVal}`,
      icon: <LinkedInIcon />,
      color: '#0a66c2',
    },
    {
      label: t.contact.github,
      value: t.contact.githubVal,
      href: `https://${t.contact.githubVal}`,
      icon: <GitHubIcon />,
      color: 'var(--text-primary)',
    },
  ];

  return (
    <section id="contact">
      <div className="section-inner">
        <div className="contact-header" data-reveal>
          <h2 className="section-title">{t.contact.title}</h2>
          <div className="title-line" />
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        <div className="contact-cards" data-reveal data-reveal-delay="1">
          {links.map(({ label, value, href, icon, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="contact-card card-glass"
              style={{ '--contact-color': color }}
            >
              <div className="contact-icon">{icon}</div>
              <div className="contact-info">
                <span className="contact-label">{label}</span>
                <span className="contact-value">{value}</span>
              </div>
              <div className="contact-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <footer className="site-footer" data-reveal data-reveal-delay="2">
          <p>
            Built with <span className="accent">React</span> &amp; pure CSS by{' '}
            <span className="accent">Abdulaziz Alhaidan</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
