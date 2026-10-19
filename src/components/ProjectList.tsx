import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, FileText, Plus, ShieldCheck } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { Project, ProjectMedia } from '../data/types';
import { ButtonLink } from './Button';
import { ImageLightbox, type LightboxImage } from './ImageLightbox';
import { Placeholder, SHOW_PLACEHOLDERS } from './Placeholder';
import './ProjectList.css';

interface ProjectListProps {
  projects: Project[];
}

/** Comma-separated list, or null when empty. */
const joined = (items: string[]) => (items.length > 0 ? items.join(', ') : null);

/** Opens a project's row, scrolls it into view and moves focus to it. */
function openProject(id: string) {
  const details = document.getElementById(id)?.querySelector('details');
  if (!details) return;
  details.open = true;
  details.scrollIntoView({ block: 'start' });
  details.querySelector('summary')?.focus({ preventScroll: true });
}

/** Screenshot thumbnail that shows a soft placeholder until the image has loaded. */
function Shot({ media, onOpen }: { media: ProjectMedia & { src: string }; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button type="button" className={`project__shot${loaded ? ' is-loaded' : ''}`} onClick={onOpen}>
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        width={1600}
        height={1000}
        onLoad={() => setLoaded(true)}
      />
      <span className="project__shot-hint" aria-hidden="true">
        <Expand size={14} /> View larger
      </span>
      <span className="visually-hidden"> (opens larger view)</span>
    </button>
  );
}

interface PanelProps {
  project: Project;
  previous: Project | null;
  next: Project | null;
}

function ProjectPanel({ project, previous, next }: PanelProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const facts: { label: string; value: ReactNode | null }[] = [
    { label: 'Role', value: project.role },
    { label: 'Stack', value: joined(project.stack) },
    { label: 'Problem', value: project.problem },
    { label: 'Approach', value: project.approach },
    { label: 'Testing', value: joined(project.testing) },
    { label: 'Outcome', value: project.outcome },
  ];
  const visibleFacts = facts.filter((f) => f.value !== null || SHOW_PLACEHOLDERS);

  const images = project.media.filter((m): m is ProjectMedia & { src: string } => m.src !== null);
  const missingShots = project.media.filter((m) => m.src === null);
  const showMedia = images.length > 0 || (SHOW_PLACEHOLDERS && missingShots.length > 0);
  const lightboxImages: LightboxImage[] = images.map((m) => ({ src: m.src, alt: m.alt, caption: m.caption }));

  return (
    <div className={`project__panel${showMedia ? ' project__panel--media' : ''}`}>
      <div className="project__body">
        {project.summary && <p className="project__summary">{project.summary}</p>}

        {project.features.length > 0 ? (
          <div>
            <h4 className="project__label">Key features</h4>
            <ul className="project__features">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ) : (
          <Placeholder label="TODO: list the main features you built" />
        )}

        {visibleFacts.length > 0 && (
          <dl className="project__facts">
            {visibleFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value ?? <span className="project__pending">TODO</span>}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.links.length > 0 || project.report ? (
          <div className="project__links">
            {project.report && (
              <a className="btn btn--primary project__report" href={project.report.href} target="_blank" rel="noopener noreferrer">
                <FileText className="btn__icon" size={18} aria-hidden="true" />
                <span>{project.report.label}</span>
                <span className="project__report-type">PDF</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
            {project.links.map((link) =>
              link.href.startsWith('#') ? (
                <ButtonLink key={link.href} href={link.href} variant="secondary" icon={ArrowRight}>
                  {link.label}
                </ButtonLink>
              ) : (
                <ButtonLink key={link.href} href={link.href} variant="secondary" icon={ArrowUpRight} external>
                  {link.label}
                </ButtonLink>
              ),
            )}
          </div>
        ) : (
          <Placeholder label="TODO: upload the project report (PDF) or add links (demo, repository) that can be shared publicly" />
        )}
      </div>

      {showMedia && (
        <div className="project__media">
          {images.map((m, i) => (
            <figure key={`${i}-${m.alt}`} className="project__figure">
              <Shot media={m} onOpen={() => setLightbox(i)} />
              {m.caption && <figcaption>{m.caption}</figcaption>}
            </figure>
          ))}
          {SHOW_PLACEHOLDERS &&
            missingShots.map((m, i) => (
              <Placeholder key={`missing-${i}`} variant="media" label={`TODO screenshot: ${m.caption ?? m.alt}`} />
            ))}
          {project.privacyNote && images.length > 0 && (
            <p className="project__privacy">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>{project.privacyNote}</span>
            </p>
          )}
          <ImageLightbox images={lightboxImages} index={lightbox} onChange={setLightbox} />
        </div>
      )}

      {(previous || next) && (
        <nav className="project__pager" aria-label={`More projects after ${project.title}`}>
          {previous ? (
            <button type="button" className="project__pager-btn" onClick={() => openProject(previous.id)}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>
                <span className="project__pager-label">Previous</span>
                {previous.title}
              </span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              type="button"
              className="project__pager-btn project__pager-btn--next"
              onClick={() => openProject(next.id)}
            >
              <span>
                <span className="project__pager-label">Next</span>
                {next.title}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}

/**
 * Numbered, collapsible project list. The featured project starts open;
 * the rest show a single tidy row until expanded.
 */
export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p className="project__empty">Projects will appear here soon.</p>;
  }

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
            <ProjectPanel project={project} previous={projects[i - 1] ?? null} next={projects[i + 1] ?? null} />
          </details>
        </li>
      ))}
    </ol>
  );
}
