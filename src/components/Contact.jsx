import { useLanguage } from '../context/LanguageContext';
import Bidi from '../lib/Bidi';
import './Contact.css';




export default function Contact() {
  const { t } = useLanguage();

  const links = [
    {
      label: t.contact.email,
      value: t.contact.emailVal,
      href: `mailto:${t.contact.emailVal}`,
    },
    {
      label: t.contact.linkedin,
      value: t.contact.linkedinVal,
      href: `https://${t.contact.linkedinVal}`,
    },
    {
      label: t.contact.github,
      value: t.contact.githubVal,
      href: `https://${t.contact.githubVal}`,
    },
  ];

  return (
    <section id="contact">
      <div className="section-inner">
        <h2 className="section-title"><Bidi>{t.contact.title}</Bidi></h2>
        <p className="section-subtitle"><Bidi>{t.contact.subtitle}</Bidi></p>

        <ul className="contact-list">
          {links.map(({ label, value, href }) => (
            <li className="contact-row" key={label}>
              <span className="contact-label">{label}</span>
              <a
                className="contact-value"
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <Bidi>{value}</Bidi>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
