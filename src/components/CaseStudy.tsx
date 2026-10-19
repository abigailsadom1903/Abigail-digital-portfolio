import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Project, ProjectMedia } from '../data/types';
import { ButtonLink } from './Button';
import { Placeholder, SHOW_PLACEHOLDERS } from './Placeholder';
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

function List({ items }: { items: string[] }) {
  return (
    <ul className="case__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * A block is shown when it has content. When it doesn't, it shows a placeholder
 * locally and is left out of the published site.
 */
interface BlockSpec {
  title: string;
  content: ReactNode | null;
  placeholder: string;
}

export function CaseStudy({ project, index }: CaseStudyProps) {
  const headingId = `${project.id}-title`;
  const number = String(index + 1).padStart(2, '0');
  const variant = project.featured ? 'featured' : 'standard';

  const metaRows: { label: string; value: ReactNode | null }[] = [
    { label: 'Year', value: project.year },
    { label: 'My role', value: project.role },
    {
      label: 'Stack',
      value:
        project.stack.length > 0 ? <TagList items={project.stack} label={`${project.title} technology stack`} /> : null,
    },
  ];
  const visibleMeta = metaRows.filter((row) => row.value !== null || SHOW_PLACEHOLDERS);

  const media = project.media.filter((m) => m.src !== null || SHOW_PLACEHOLDERS);

  const blocks: BlockSpec[] = [
    {
      title: 'The problem',
      content: project.problem && <p>{project.problem}</p>,
      placeholder: 'Describe the problem or need this project addressed',
    },
    {
      title: 'Approach',
      content: project.approach && <p>{project.approach}</p>,
      placeholder: 'Explain how you approached the design and build',
    },
    {
      title: 'Key features',
      content: project.features.length > 0 ? <List items={project.features} /> : null,
      placeholder: 'List the main features you built',
    },
    {
      title: 'Testing & quality',
      content: project.testing.length > 0 ? <List items={project.testing} /> : null,
      placeholder: 'Describe testing you actually carried out (e.g. test cases written, types of testing)',
    },
    {
      title: 'Outcome',
      content: project.outcome && <p>{project.outcome}</p>,
      placeholder: 'Summarise the result, using only verifiable facts',
    },
    {
      title: 'Links',
      content:
        project.links.length > 0 ? (
          <div className="case__links">
            {project.links.map((link) => (
              <ButtonLink key={link.href} href={link.href} variant="text" icon={ArrowUpRight} external>
                {link.label}
              </ButtonLink>
            ))}
          </div>
        ) : null,
      placeholder: 'Add links (live demo, repository or report) if they can be shared publicly',
    },
  ];
  const visibleBlocks = blocks.filter((b) => b.content || SHOW_PLACEHOLDERS);

  return (
    <article id={project.id} className={`case case--${variant}`} aria-labelledby={headingId}>
      <header className={`case__header${visibleMeta.length === 0 ? ' case__header--solo' : ''}`} data-reveal>
        <div className="case__heading">
          <p className="eyebrow case__label">
            <span className="case__num">{number}</span>
            {project.featured ? 'Featured case study' : 'Project'}
          </p>
          <h3 id={headingId} className="case__title">
            {project.title}
          </h3>
          {project.context && <p className="case__context">{project.context}</p>}
          {project.summary && <p className="case__summary">{project.summary}</p>}
        </div>

        {visibleMeta.length > 0 && (
          <dl className="case__meta">
            {visibleMeta.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value ?? <span className="case__pending">To be added</span>}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {media.length > 0 && (
        <>
          <div className={`case__gallery case__gallery--${Math.min(media.length, 2)}`} data-reveal>
            {media.map((m, i) => (
              <Media key={`${i}-${m.alt}`} media={m} />
            ))}
          </div>
          {project.privacyNote && (
            <p className="case__privacy">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{project.privacyNote}</span>
            </p>
          )}
        </>
      )}

      {visibleBlocks.length > 0 && (
        <div className="case__body" data-reveal>
          {visibleBlocks.map((block) => (
            <div key={block.title} className="case__block">
              <h4 className="case__block-title">{block.title}</h4>
              {block.content ?? <Placeholder label={block.placeholder} />}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
