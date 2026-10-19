import { ArrowUpRight, Mail, Download } from 'lucide-react';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import { SHOW_PLACEHOLDERS } from '../components/Placeholder';
import type { ContactLink, Profile } from '../data/types';
import './Contact.css';

interface ContactProps {
  profile: Profile;
}

function ContactRow({ link }: { link: ContactLink }) {
  if (!link.href) {
    if (!SHOW_PLACEHOLDERS) return null;
    return (
      <li className="contact__row contact__row--pending">
        <span className="contact__label">{link.label}</span>
        <span className="contact__value">Link to be added</span>
      </li>
    );
  }

  const isEmail = link.href.startsWith('mailto:');
  const Icon = isEmail ? Mail : ArrowUpRight;

  return (
    <li>
      <a
        className="contact__row"
        href={link.href}
        {...(isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      >
        <span className="contact__label">{link.label}</span>
        <span className="contact__value">{link.display ?? link.href.replace(/^mailto:/, '')}</span>
        <Icon className="contact__icon" size={20} aria-hidden="true" />
        {!isEmail && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    </li>
  );
}

export function Contact({ profile }: ContactProps) {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <Container className="contact__grid">
        <div data-reveal>
          <p className="eyebrow contact__eyebrow">06 · Contact</p>
          <h2 id="contact-heading" className="contact__title">
            Open to software engineering internships.
          </h2>
          <p className="contact__intro">
            If you are hiring interns in web development or software testing, I would be glad to hear from you.
          </p>
          <div className="contact__cv">
            <ButtonLink
              href={profile.cvUrl}
              variant="secondary"
              icon={Download}
              download
              unavailableNote="CV coming soon"
            >
              Download CV
            </ButtonLink>
          </div>
        </div>

        <ul className="contact__list" role="list" data-reveal>
          {profile.contact.map((link) => (
            <ContactRow key={link.kind} link={link} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
