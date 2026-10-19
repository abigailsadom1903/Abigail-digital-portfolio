import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Project, ProjectMedia } from '../data/types';
import { ButtonLink } from './Button';
import { Placeholder } from './Placeholder';
import { TagList } from './Tag';
import './CaseStudy.css';

interface CaseStudyProps {
  project: Project;
  index: number;
}

function Media({ media }: { media: ProjectMedia }) {
  return (
    <figure className="case__figure">
      {media.src ? (
        <img src={media.src} alt={media.alt} loading="lazy" decoding="async" width={1600} height={1000} />
      ) : (
        <Placeholder variant="media" label={`Screenshot: ${media.caption ?? media.alt}`} />
      )}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="case__block">
      <h4 className="case__block-title">{title}</h4>
      {children}
    </div>
  );
}

/** Renders text when supplied, otherwise a labelled placeholder. */
function TextOr({ value, placeholder }: { value: string | null; placeholder: string }) {
  return value ? <p>{value}</p> : <Placeholder label={placeholder} />;
}

function ListOr({ items, placeholder }: { items: string[]; placeholder: string }) {
  if (items.length === 0) return <Placeholder label={placeholder} />;
  return (
    <ul className="case__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function CaseStudy({ project, index }: CaseStudyProps) {
  const headingId = `${project.id}-title`;
  const number = String(index + 1).padStart(2, '0');
  const variant = project.featured ? 'featured' : 'standard';

  const meta = (
    <dl className="case__meta">
      <div>
        <dt>Year</dt>
        <dd>{project.year ?? <span className="case__pending">To be added</span>}</dd>
      </div>
      <div>
        <dt>My role</dt>
        <dd>{project.role ?? <span className="case__pending">To be added</span>}</dd>
      </div>
      <div>
        <dt>Stack</dt>
        <dd>
          {project.stack.length > 0 ? (
            <TagList items={project.stack} label={`${project.title} technology stack`} />
          ) : (
            <span className="case__pending">To be added</span>
          )}
        </dd>
      </div>
    </dl>
  );

  const links =
    project.links.length > 0 ? (
      <div className="case__links">
        {project.links.map((link) => (
          <ButtonLink key={link.href} href={link.href} variant="text" icon={ArrowUpRight} external>
            {link.label}
          </ButtonLink>
        ))}
      </div>
    ) : (
      <Placeholder label="Add links (live demo, repository or report) if they can be shared publicly" />
    );

  return (
    <article id={project.id} className={`case case--${variant}`} aria-labelledby={headingId}>
      <header className="case__header" data-reveal>
        <div className="case__heading">
          <p className="eyebrow case__label">
            <span className="case__num">{number}</span>
            {project.featured ? 'Featured case study' : 'Project'}
          </p>
          <h3 id={headingId} className="case__title">
            {project.title}
          </h3>
          <p className="case__context">{project.context}</p>
          <p className="case__summary">{project.summary}</p>
        </div>
        {meta}
      </header>

      <div className="case__gallery" data-reveal>
        {project.media.map((media) => (
          <Media key={media.alt} media={media} />
        ))}
      </div>

      {project.privacyNote && (
        <p className="case__privacy">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>{project.privacyNote}</span>
        </p>
      )}

      <div className="case__body" data-reveal>
        <Block title="The problem">
          <TextOr value={project.problem} placeholder="Describe the problem or need this project addressed" />
        </Block>
        <Block title="Approach">
          <TextOr value={project.approach} placeholder="Explain how you approached the design and build" />
        </Block>
        <Block title="Key features">
          <ListOr items={project.features} placeholder="List the main features you built" />
        </Block>
        <Block title="Testing & quality">
          <ListOr
            items={project.testing}
            placeholder="Describe testing you actually carried out (e.g. test cases written, types of testing)"
          />
        </Block>
        <Block title="Outcome">
          <TextOr value={project.outcome} placeholder="Summarise the result, using only verifiable facts" />
        </Block>
        <Block title="Links">{links}</Block>
      </div>
    </article>
  );
}
