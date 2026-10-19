import { ArrowDown, Download } from 'lucide-react';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import type { Profile } from '../data/types';
import './Hero.css';

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  const email = profile.contact.find((c) => c.kind === 'email' && c.href);

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
