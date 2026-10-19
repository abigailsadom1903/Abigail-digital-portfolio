import type { ReactNode } from 'react';
import { Container } from './Container';
import './Section.css';

interface SectionProps {
  id: string;
  /** Section number shown before the title, e.g. "01". */
  index: string;
  title: string;
  /** Optional element aligned to the right of the heading, e.g. a count or a link. */
  aside?: ReactNode;
  tone?: 'plain' | 'tinted';
  children: ReactNode;
}

/** Page section with a compact numbered heading ("01 Selected work") and a labelled landmark. */
export function Section({ id, index, title, aside, tone = 'plain', children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={headingId}>
      <Container>
        <header className="section__header" data-reveal>
          <h2 id={headingId} className="section__title">
            <span className="section__index">{index}</span>
            {title}
          </h2>
          {aside && <div className="section__aside">{aside}</div>}
        </header>
        {children}
      </Container>
    </section>
  );
}
