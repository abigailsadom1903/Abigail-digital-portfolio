import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Project } from '../data/types';
import { ButtonLink } from './Button';
import { Placeholder, SHOW_PLACEHOLDERS } from './Placeholder';
import './ProjectList.css';

interface ProjectListProps {
  projects: Project[];
}

/** Comma-separated list, or null when empty. */
const joined = (items: string[]) => (items.length > 0 ? items.join(', ') : null);

function ProjectPanel({ project }: { project: Project }) {
  const facts: { label: string; value: ReactNode | null }[] = [
    { label: 'Role', value: project.role },
    { label: 'Stack', value: joined(project.stack) },
    { label: 'Problem', value: project.problem },
    { label: 'Approach', value: project.approach },
    { label: 'Testing', value: joined(project.testing) },
    { label: 'Outcome', value: project.outcome },
  ];
  const visibleFacts = facts.filter((f) => f.value !== null || SHOW_PLACEHOLDERS);
  const media = project.media.filter((m) => m.src !== null || SHOW_PLACEHOLDERS);

  return (
    <div className={`project__panel${media.length > 0 ? ' project__panel--media' : ''}`}>
      <div className="project__body">
        {project.summary && <p className="project__summary">{project.summary}</p>}

        {project.features.length > 0 ? (
          <ul className="project__features">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : (
          <Placeholder label="List the main features you built" />
        )}

        {visibleFacts.length > 0 && (
          <dl className="project__facts">
            {visibleFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value ?? <span className="project__pending">To be added</span>}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.links.length > 0 ? (
          <div className="project__links">
            {project.links.map((link) => (
              <ButtonLink key={link.href} href={link.href} variant="secondary" icon={ArrowUpRight} external>
                {link.label}
              </ButtonLink>
            ))}
          </div>
        ) : (
          <Placeholder label="Add links (live demo, repository or report) if they can be shared publicly" />
        )}
      </div>

      {media.length > 0 && (
        <div className="project__media">
          {media.map((m, i) => (
            <figure key={`${i}-${m.alt}`} className="project__figure">
              {m.src ? (
                <img src={m.src} alt={m.alt} loading="lazy" decoding="async" width={1600} height={1000} />
              ) : (
                <Placeholder variant="media" label={`Screenshot: ${m.caption ?? m.alt}`} />
              )}
              {m.caption && <figcaption>{m.caption}</figcaption>}
            </figure>
          ))}
          {project.privacyNote && (
            <p className="project__privacy">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>{project.privacyNote}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Numbered, collapsible project list. The featured project starts open;
 * the rest show a single tidy row until expanded.
 */
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ol className="projects" role="list">
      {projects.map((project, i) => (
        <li key={project.id} id={project.id} className="project" data-reveal>
          <details open={project.featured}>
            <summary className="project__row">
              <span className="project__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="project__heading">
                <span className="project__title">{project.title}</span>
                {project.context && <span className="project__context">{project.context}</span>}
              </span>
              <span className="project__tags">
                {project.category && <span className="project__category">{project.category}</span>}
                {project.year && <span className="project__year">{project.year}</span>}
              </span>
              <Plus className="project__toggle" size={20} aria-hidden="true" />
            </summary>
            <ProjectPanel project={project} />
          </details>
        </li>
      ))}
    </ol>
  );
}
