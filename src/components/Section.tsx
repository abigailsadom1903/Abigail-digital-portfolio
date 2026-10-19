import type { ReactNode } from 'react';
import { Container } from './Container';
import './Section.css';

interface SectionProps {
  id: string;
  /** Section number shown in the header, e.g. "01". */
  index?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  tone?: 'plain' | 'tinted';
  children: ReactNode;
}

/** Standard page section with an editorial header and a labelled landmark. */
export function Section({ id, index, eyebrow, title, intro, tone = 'plain', children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={headingId}>
      <Container>
        <header className="section__header" data-reveal>
          <p className="eyebrow section__eyebrow">
            {index && <span className="section__index">{index}</span>}
            {eyebrow}
          </p>
          <h2 id={headingId} className="section__title">
            {title}
          </h2>
          {intro && <div className="section__intro">{intro}</div>}
        </header>
        {children}
      </Container>
    </section>
  );
}
