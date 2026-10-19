import { ArrowDown, Download, FolderGit2, GraduationCap } from 'lucide-react';
import type { CSSProperties } from 'react';
import { BrandIcon, type Brand } from '../components/BrandIcon';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import type { Profile } from '../data/types';
import './Hero.css';

interface HeroStats {
  cgpa: string | null;
  projects: number;
  honours: number;
}

interface HeroProps {
  profile: Profile;
  /** Figures for the cards beside the portrait; worked out from the content. */
  stats?: HeroStats;
}

export function Hero({ profile, stats }: HeroProps) {
  // LinkedIn first, then GitHub, whichever have links in Pages CMS.
  const socials = (['linkedin', 'github'] as const)
    .map((kind) => profile.contact.find((c) => c.kind === kind && c.href))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const workLine = stats
    ? [stats.projects > 0 && `${stats.projects} projects`, stats.honours > 0 && `${stats.honours} honours`]
        .filter(Boolean)
        .join(' · ')
    : '';

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__backdrop" aria-hidden="true" />
      <Container className="hero__grid">
        <div className="hero__main">
          {profile.availability && (
            <p className="hero__badge hero__reveal" style={{ '--d': 0 } as CSSProperties}>
              <span className="hero__pulse" aria-hidden="true" />
              <span>
                Available for a {profile.availability.charAt(0).toLowerCase() + profile.availability.slice(1)}
              </span>
            </p>
          )}
          <p className="hero__eyebrow hero__reveal" style={{ '--d': 1 } as CSSProperties}>
            <span className="hero__role">{profile.role}</span>
            <span aria-hidden="true"> · </span>
            {profile.university}
          </p>
          <h1 id="hero-heading" className="hero__name hero__reveal" style={{ '--d': 2 } as CSSProperties}>
            {profile.name}
          </h1>
          <p className="hero__headline hero__reveal" style={{ '--d': 3 } as CSSProperties}>
            {profile.headline}
          </p>
          <p className="hero__intro hero__reveal" style={{ '--d': 4 } as CSSProperties}>
            {profile.intro}
          </p>

          <div className="hero__actions hero__reveal" style={{ '--d': 5 } as CSSProperties}>
            <ButtonLink href="#work" icon={ArrowDown}>
              View projects
            </ButtonLink>
            <ButtonLink href={profile.cvUrl} variant="secondary" icon={Download} download unavailableNote="CV coming soon">
              Download CV
            </ButtonLink>
          </div>

          {socials.length > 0 && (
            <ul className="hero__social hero__reveal" role="list" aria-label="Profiles" style={{ '--d': 6 } as CSSProperties}>
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
        </div>

        {profile.photo && (
          <div className="hero__visual hero__reveal" style={{ '--d': 2 } as CSSProperties}>
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
            {stats?.cgpa && (
              <p className="hero__card hero__card--cgpa">
                <span className="hero__card-icon" aria-hidden="true">
                  <GraduationCap size={18} strokeWidth={1.8} />
                </span>
                <span>
                  <strong>{stats.cgpa}</strong>
                  <span className="hero__card-label">CGPA · Software Engineering</span>
                </span>
              </p>
            )}
            {workLine && (
              <p className="hero__card hero__card--work">
                <span className="hero__card-icon" aria-hidden="true">
                  <FolderGit2 size={18} strokeWidth={1.8} />
                </span>
                <span>
                  <strong>{workLine}</strong>
                  <span className="hero__card-label">Built and recognised</span>
                </span>
              </p>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
