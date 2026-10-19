import { ArrowRight, Briefcase, CalendarDays, Download, GraduationCap, type LucideIcon } from 'lucide-react';
import { ButtonLink } from '../components/Button';
import { Placeholder } from '../components/Placeholder';
import { Section } from '../components/Section';
import { cgpaFrom } from '../data/education';
import type { EducationEntry, Experience, Profile } from '../data/types';
import './About.css';

interface AboutProps {
  profile: Profile;
  education: EducationEntry[];
  experience: Experience[];
  projectCount: number;
  honoursCount: number;
}

interface TimelineItem {
  key: string;
  period: string;
  title: string;
  place: string;
  note: string | null;
}

function Timeline({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: TimelineItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="timeline">
      <h3 className="timeline__heading">
        <span className="timeline__heading-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={1.8} />
        </span>
        {title}
      </h3>
      <ol className="timeline__list" role="list">
        {items.map((item) => (
          <li key={item.key} className="timeline__item">
            <span className="timeline__dot" aria-hidden="true" />
            <p className="timeline__period">{item.period}</p>
            <h4 className="timeline__title">{item.title}</h4>
            <p className="timeline__place">{item.place}</p>
            {item.note && <p className="timeline__note">{item.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function About({ profile, education, experience, projectCount, honoursCount }: AboutProps) {
  const [lead, ...rest] = profile.about;
  const cgpa = cgpaFrom(education);

  const stats = [
    cgpa && { value: cgpa, label: 'CGPA' },
    projectCount > 0 && { value: String(projectCount), label: 'Projects' },
    honoursCount > 0 && { value: String(honoursCount), label: 'Honours' },
    profile.expectedGraduation && { value: profile.expectedGraduation, label: 'Graduating' },
  ].filter((s): s is { value: string; label: string } => Boolean(s));

  const educationItems: TimelineItem[] = education.map((e) => ({
    key: e.qualification,
    period: e.period,
    title: e.qualification,
    place: e.institution,
    note: e.details.length > 0 ? e.details.join(' · ') : null,
  }));
  const experienceItems: TimelineItem[] = experience.map((x) => ({
    key: `${x.role}-${x.organisation}`,
    period: x.period,
    title: x.role,
    place: x.organisation,
    note: x.description,
  }));

  return (
    <Section id="about" index="03" title="About">
      <div className="about">
        <div className="about__main" data-reveal>
          {lead ? <p className="about__lead">{lead}</p> : <Placeholder label="Add an About paragraph" />}
          {rest.map((paragraph) => (
            <p key={paragraph} className="about__text">
              {paragraph}
            </p>
          ))}

          {stats.length > 0 && (
            <dl className="about__stats">
              {stats.map((s) => (
                <div key={s.label} className="about__stat">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {profile.interests.length > 0 && (
            <div className="about__interests">
              <h3 className="about__label">Interests</h3>
              <ul role="list">
                {profile.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="about__side" data-reveal>
          {(profile.availability || profile.lookingFor) && (
            <aside className="availability" aria-labelledby="availability-title">
              <p className="availability__kicker">
                <CalendarDays size={16} aria-hidden="true" />
                Available for internship
              </p>
              {profile.availability && (
                <p id="availability-title" className="availability__dates">
                  {profile.availability}
                </p>
              )}
              {profile.lookingFor && (
                <p className="availability__text" id={profile.availability ? undefined : 'availability-title'}>
                  {profile.lookingFor}
                </p>
              )}
              <div className="availability__actions">
                <a className="availability__btn availability__btn--light" href="#contact">
                  Get in touch
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <ButtonLink href={profile.cvUrl} variant="secondary" icon={Download} download className="availability__cv">
                  Download CV
                </ButtonLink>
              </div>
            </aside>
          )}

          <Timeline icon={GraduationCap} title="Education" items={educationItems} />
          <Timeline icon={Briefcase} title="Experience" items={experienceItems} />
        </div>
      </div>
    </Section>
  );
}
