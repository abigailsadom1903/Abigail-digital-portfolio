import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { Achievement, Activity } from '../data/types';
import './Recognition.css';

interface RecognitionProps {
  achievements: Achievement[];
  training: Achievement[];
  activities: Activity[];
}

interface ItemProps {
  title: string;
  meta?: string | null;
  date: string | null;
  description?: string;
  /** External credential link. */
  href?: string;
  certificate?: string;
  photo?: string;
}

function FileLink({ href, label, context }: { href: string; label: string; context: string }) {
  return (
    <a className="recognition__file" href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <ArrowUpRight size={13} aria-hidden="true" />
      <span className="visually-hidden">
        {' '}
        for {context} (opens in a new tab)
      </span>
    </a>
  );
}

function Item({ title, meta, date, description, href, certificate, photo }: ItemProps) {
  const hasFiles = Boolean(href || certificate || photo);
  return (
    <li className="recognition__item">
      <div>
        <p className="recognition__title">{title}</p>
        {meta && <p className="recognition__meta">{meta}</p>}
        {description && <p className="recognition__description">{description}</p>}
        {hasFiles && (
          <p className="recognition__files">
            {certificate && <FileLink href={certificate} label="Certificate" context={title} />}
            {photo && <FileLink href={photo} label="Photo" context={title} />}
            {href && <FileLink href={href} label="Credential" context={title} />}
          </p>
        )}
      </div>
      {date && <p className="recognition__date">{date}</p>}
    </li>
  );
}

function Group({ id, title, count, children }: { id: string; title: string; count: number; children: ReactNode }) {
  return (
    <div className="recognition__group" data-reveal>
      <h3 id={id} className="subheading recognition__heading">
        {title}
        <span className="recognition__count">{count}</span>
      </h3>
      {children}
    </div>
  );
}

export function Recognition({ achievements, training, activities }: RecognitionProps) {
  return (
    <Section id="awards" index="05" title="Awards & activities">
      <div className="recognition">
        {(achievements.length > 0 || SHOW_PLACEHOLDERS) && (
          <Group id="awards-honours" title="Honours & awards" count={achievements.length}>
            {achievements.length > 0 ? (
              <ul className="recognition__list" role="list" aria-labelledby="awards-honours">
                {achievements.map((a) => (
                  <Item key={a.title} title={a.title} meta={a.issuer} date={a.date} description={a.description} href={a.credentialUrl} certificate={a.certificate} photo={a.photo} />
                ))}
              </ul>
            ) : (
              <Placeholder label="Add verified awards or competition results, with issuer and date" />
            )}
          </Group>
        )}

        {training.length > 0 && (
          <Group id="awards-training" title="Training & programmes" count={training.length}>
            <ul className="recognition__list" role="list" aria-labelledby="awards-training">
              {training.map((t) => (
                <Item key={t.title} title={t.title} meta={t.issuer} date={t.date} description={t.description} href={t.credentialUrl} certificate={t.certificate} photo={t.photo} />
              ))}
            </ul>
          </Group>
        )}

        {activities.length > 0 && (
          <Group id="awards-activities" title="Leadership & activities" count={activities.length}>
            <ul className="recognition__list" role="list" aria-labelledby="awards-activities">
              {activities.map((a) => (
                <Item key={`${a.role}-${a.organisation}`} title={a.role} meta={a.organisation} date={a.period} certificate={a.certificate} photo={a.photo} />
              ))}
            </ul>
          </Group>
        )}
      </div>
    </Section>
  );
}
