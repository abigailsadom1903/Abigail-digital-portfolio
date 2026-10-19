import { ArrowUpRight, Expand, FileText, GraduationCap, Trophy, Users, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ImageLightbox, type LightboxImage } from '../components/ImageLightbox';
import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { Achievement, Activity } from '../data/types';
import './Recognition.css';

interface RecognitionProps {
  achievements: Achievement[];
  training: Achievement[];
  activities: Activity[];
}

/** One entry in any of the three groups, in a common shape. */
interface Entry {
  key: string;
  title: string;
  meta: string | null;
  date: string | null;
  description?: string;
  /** Small label above the title, e.g. "Science and Technology". */
  area?: string;
  highlights?: string[];
  credentialUrl?: string;
  certificate?: string;
  certificateLabel?: string;
  photo?: string;
}

const fromAchievement = (a: Achievement, group: string): Entry => ({
  key: `${group}:${a.title}`,
  title: a.title,
  meta: a.issuer,
  date: a.date,
  description: a.description,
  credentialUrl: a.credentialUrl,
  certificate: a.certificate,
  certificateLabel: a.certificateLabel,
  photo: a.photo,
});

const fromActivity = (a: Activity): Entry => ({
  key: `activity:${a.role}:${a.organisation}`,
  title: a.role,
  meta: a.organisation || null,
  date: a.period || null,
  area: a.area,
  highlights: a.highlights,
  certificate: a.certificate,
  certificateLabel: a.certificateLabel,
  photo: a.photo,
});

function FileLinks({ entry }: { entry: Entry }) {
  if (!entry.certificate && !entry.credentialUrl) return null;
  return (
    <p className="rec-links">
      {entry.certificate && (
        <a
          className="rec-link"
          href={entry.certificate}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${entry.certificateLabel ?? 'Certificate'} for ${entry.title} (opens in a new tab)`}
        >
          <FileText size={14} aria-hidden="true" />
          {entry.certificateLabel ?? 'Certificate'}
        </a>
      )}
      {entry.credentialUrl && (
        <a
          className="rec-link"
          href={entry.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Credential for ${entry.title} (opens in a new tab)`}
        >
          <ArrowUpRight size={14} aria-hidden="true" />
          Credential
        </a>
      )}
    </p>
  );
}

/** A photo that opens the section's lightbox, or an icon tile when there is no photo. */
function Visual({
  entry,
  icon: Icon,
  onOpen,
  className,
}: {
  entry: Entry;
  icon: LucideIcon;
  onOpen: () => void;
  className: string;
}) {
  if (!entry.photo) {
    return (
      <span className={`${className} rec-visual--icon`} aria-hidden="true">
        <Icon size={22} strokeWidth={1.6} />
      </span>
    );
  }
  return (
    <button type="button" className={`${className} rec-visual--photo`} onClick={onOpen}>
      <img src={entry.photo} alt="" loading="lazy" decoding="async" />
      <span className="rec-visual__zoom" aria-hidden="true">
        <Expand size={14} />
      </span>
      <span className="visually-hidden">View photo: {entry.title}</span>
    </button>
  );
}

function GroupHeading({ icon: Icon, title, count, id }: { icon: LucideIcon; title: string; count: number; id: string }) {
  return (
    <h3 id={id} className="rec-heading">
      <span className="rec-heading__icon" aria-hidden="true">
        <Icon size={16} strokeWidth={1.8} />
      </span>
      {title}
      <span className="rec-heading__count">{count}</span>
    </h3>
  );
}

export function Recognition({ achievements, training, activities }: RecognitionProps) {
  const awards = achievements.map((a) => fromAchievement(a, 'award'));
  const programmes = training.map((t) => fromAchievement(t, 'training'));
  const roles = activities.map(fromActivity);

  // Every photo in the section, so the lightbox can step through them all.
  const withPhotos = [...awards, ...programmes, ...roles].filter((e) => e.photo);
  const images: LightboxImage[] = withPhotos.map((e) => ({ src: e.photo!, alt: `Photo: ${e.title}`, caption: e.title }));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const open = (entry: Entry) => setLightbox(withPhotos.findIndex((e) => e.key === entry.key));

  const summary = [
    awards.length && `${awards.length} honours`,
    programmes.length && `${programmes.length} programmes`,
    roles.length && `${roles.length} roles`,
  ]
    .filter(Boolean)
    .join(' · ');

  const list = (entries: Entry[], icon: LucideIcon, labelledBy: string): ReactNode => (
    <ul className="rec-list" role="list" aria-labelledby={labelledBy}>
      {entries.map((entry) => (
        <li key={entry.key} className="rec-item">
          <Visual entry={entry} icon={icon} onOpen={() => open(entry)} className="rec-item__visual" />
          <div className="rec-item__body">
            {entry.area && <p className="rec-item__area">{entry.area}</p>}
            <div className="rec-item__top">
              <p className="rec-item__title">{entry.title}</p>
              {entry.date && <span className="rec-date">{entry.date}</span>}
            </div>
            {entry.meta && <p className="rec-item__meta">{entry.meta}</p>}
            {entry.description && <p className="rec-item__desc">{entry.description}</p>}
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="rec-item__points">
                {entry.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
            <FileLinks entry={entry} />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Section id="awards" index="05" title="Awards & activities" aside={summary || undefined}>
      {(awards.length > 0 || SHOW_PLACEHOLDERS) && (
        <div className="rec-awards" data-reveal>
          <GroupHeading icon={Trophy} title="Honours & awards" count={awards.length} id="awards-honours" />
          {awards.length > 0 ? (
            <ul className="rec-award-grid" role="list" aria-labelledby="awards-honours">
              {awards.map((entry) => (
                <li key={entry.key} className="rec-award">
                  <Visual entry={entry} icon={Trophy} onOpen={() => open(entry)} className="rec-award__visual" />
                  <div className="rec-award__body">
                    {entry.date && <span className="rec-date">{entry.date}</span>}
                    <p className="rec-award__title">{entry.title}</p>
                    {entry.meta && <p className="rec-item__meta">{entry.meta}</p>}
                    {entry.description && <p className="rec-item__desc">{entry.description}</p>}
                    <FileLinks entry={entry} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder label="Add verified awards or competition results, with issuer and date" />
          )}
        </div>
      )}

      <div className="rec-columns">
        {programmes.length > 0 && (
          <div className="rec-group" data-reveal>
            <GroupHeading icon={GraduationCap} title="Training & programmes" count={programmes.length} id="awards-training" />
            {list(programmes, GraduationCap, 'awards-training')}
          </div>
        )}
        {roles.length > 0 && (
          <div className="rec-group" data-reveal>
            <GroupHeading icon={Users} title="Leadership & activities" count={roles.length} id="awards-activities" />
            {list(roles, Users, 'awards-activities')}
          </div>
        )}
      </div>

      <ImageLightbox images={images} index={lightbox !== null && lightbox >= 0 ? lightbox : null} onChange={setLightbox} />
    </Section>
  );
}
