import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import type { Profile, Project } from '../data/types';
import './Hero.css';

interface HeroProps {
  profile: Profile;
  projects: Project[];
}

export function Hero({ profile, projects }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Container className="hero__grid">
        <div className="hero__main">
          <p className="eyebrow hero__eyebrow">{profile.role}</p>
          <h1 id="hero-heading" className="hero__name">
            {profile.name}
          </h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__intro">{profile.intro}</p>

          <div className="hero__actions">
            <ButtonLink href="#work" icon={ArrowDown}>
              View projects
            </ButtonLink>
            <ButtonLink
              href={profile.cvUrl}
              variant="secondary"
              icon={Download}
              download="Abigail-Sadom-CV.pdf"
              unavailableNote="CV coming soon"
            >
              Download CV
            </ButtonLink>
          </div>
        </div>

        <aside className="hero__index" aria-labelledby="hero-index-heading">
          <h2 id="hero-index-heading" className="eyebrow hero__index-title">
            Selected work
          </h2>
          <ol className="hero__index-list" role="list">
            {projects.map((project, i) => (
              <li key={project.id}>
                <a className="hero__index-link" href={`#${project.id}`}>
                  <span className="hero__index-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hero__index-text">
                    <span className="hero__index-name">{project.title}</span>
                    <span className="hero__index-context">{project.context}</span>
                  </span>
                  <ArrowUpRight className="hero__index-arrow" size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </Container>

      <Container>
        <dl className="hero__facts">
          <div>
            <dt>Studying</dt>
            <dd>{profile.degree}</dd>
          </div>
          <div>
            <dt>University</dt>
            <dd>{profile.university}</dd>
          </div>
          <div>
            <dt>Expected graduation</dt>
            <dd>{profile.expectedGraduation}</dd>
          </div>
          <div>
            <dt>Interests</dt>
            <dd>{profile.interests.join(' · ')}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
