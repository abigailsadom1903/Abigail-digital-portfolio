import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from '../components/Button';
import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { Achievement, Activity, EducationEntry } from '../data/types';
import './Education.css';

interface EducationProps {
  education: EducationEntry[];
  achievements: Achievement[];
  training: Achievement[];
  activities: Activity[];
}

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="education__group" data-reveal>
      <h3 id={id} className="eyebrow education__heading">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface EntryProps {
  period: string | null;
  title: string;
  subtitle?: string | null;
  children?: ReactNode;
}

function Entry({ period, title, subtitle, children }: EntryProps) {
  return (
    <li className="education__item">
      <p className="education__period">
        {period ?? (SHOW_PLACEHOLDERS && <span className="education__pending">Date to be added</span>)}
      </p>
      <div>
        <h4 className="education__title">{title}</h4>
        {subtitle && <p className="education__subtitle">{subtitle}</p>}
        {children}
      </div>
    </li>
  );
}

function AchievementList({ items, labelledBy }: { items: Achievement[]; labelledBy: string }) {
  return (
    <ul className="education__list" role="list" aria-labelledby={labelledBy}>
      {items.map((item) => (
        <Entry key={item.title} period={item.date} title={item.title} subtitle={item.issuer}>
          {item.description && <p className="education__description">{item.description}</p>}
          {item.credentialUrl && (
            <ButtonLink href={item.credentialUrl} variant="text" icon={ArrowUpRight} external>
              View credential
            </ButtonLink>
          )}
        </Entry>
      ))}
    </ul>
  );
}

export function Education({ education, achievements, training, activities }: EducationProps) {
  return (
    <Section id="education" index="04" eyebrow="Education" title="Education and achievements">
      <div className="education">
        <Group id="education-studies" title="Education">
          <ol className="education__list" role="list" aria-labelledby="education-studies">
            {education.map((entry) => (
              <Entry key={entry.qualification} period={entry.period} title={entry.qualification} subtitle={entry.institution}>
                {entry.details.length > 0 && <p className="education__description">{entry.details.join(' · ')}</p>}
              </Entry>
            ))}
          </ol>
        </Group>

        {(achievements.length > 0 || SHOW_PLACEHOLDERS) && (
          <Group id="education-honours" title="Honours & achievements">
            {achievements.length > 0 ? (
              <AchievementList items={achievements} labelledBy="education-honours" />
            ) : (
              <Placeholder label="Add verified awards or competition results, with issuer and date" />
            )}
          </Group>
        )}

        {training.length > 0 && (
          <Group id="education-training" title="Training & programmes">
            <AchievementList items={training} labelledBy="education-training" />
          </Group>
        )}

        {activities.length > 0 && (
          <Group id="education-activities" title="Leadership & activities">
            <ul className="education__list" role="list" aria-labelledby="education-activities">
              {activities.map((activity) => (
                <Entry
                  key={`${activity.role}-${activity.organisation}`}
                  period={activity.period}
                  title={activity.role}
                  subtitle={activity.organisation}
                />
              ))}
            </ul>
          </Group>
        )}
      </div>
    </Section>
  );
}
