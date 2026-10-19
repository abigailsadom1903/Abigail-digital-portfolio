import { ArrowDown, Download } from 'lucide-react';
import { BrandIcon, type Brand } from '../components/BrandIcon';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import type { Profile } from '../data/types';
import './Hero.css';

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  const email = profile.contact.find((c) => c.kind === 'email' && c.href);
  // LinkedIn first, then GitHub, whichever have links in Pages CMS.
  const socials = (['linkedin', 'github'] as const)
    .map((kind) => profile.contact.find((c) => c.kind === kind && c.href))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Container className="hero__grid">
        <div className="hero__main">
          <p className="hero__eyebrow">
            <span className="hero__role">{profile.role}</span>
            <span aria-hidden="true"> · </span>
            {profile.university}
          </p>
          <h1 id="hero-heading" className="hero__name">
            {profile.name}
          </h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__intro">{profile.intro}</p>

          <div className="hero__actions">
            <ButtonLink href="#work" icon={ArrowDown}>
              View projects
            </ButtonLink>
            <ButtonLink href={profile.cvUrl} variant="secondary" icon={Download} download unavailableNote="CV coming soon">
              Download CV
            </ButtonLink>
          </div>

          {socials.length > 0 && (
            <ul className="hero__social" role="list" aria-label="Profiles">
              {socials.map((link) => (
                <li key={link.kind}>
                  <a
                    className="hero__social-link"
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                  >
                    <BrandIcon brand={link.kind as Brand} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {profile.lookingFor && (
            <p className="hero__status">
              <span className="hero__status-dot" aria-hidden="true" />
              <span>
                Open to {profile.lookingFor.charAt(0).toLowerCase() + profile.lookingFor.slice(1)}.
                {email?.href && (
                  <>
                    {' '}
                    <a href={email.href}>{email.display}</a>
                  </>
                )}
              </span>
            </p>
          )}
        </div>

        {profile.photo && (
          <figure className="hero__portrait">
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={640}
              height={831}
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        )}
      </Container>
    </section>
  );
}
