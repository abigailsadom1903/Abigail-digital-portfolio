import { ArrowUpRight, Expand, FileImage, FileText, GraduationCap, Trophy, Users, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ImageLightbox, type LightboxImage } from '../components/ImageLightbox';
import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { Achievement, Activity, Attachment } from '../data/types';
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
  files: Attachment[];
  /** The first photo is the cover; the rest show as thumbnails. */
  photos: string[];
}

const fromAchievement = (a: Achievement, group: string): Entry => ({
  key: `${group}:${a.title}`,
  title: a.title,
  meta: a.issuer,
  date: a.date,
  description: a.description,
  credentialUrl: a.credentialUrl,
  files: a.certificate ? [{ href: a.certificate, label: a.certificateLabel ?? 'Certificate' }] : [],
  photos: a.photo ? [a.photo] : [],
});

const fromActivity = (a: Activity): Entry => ({
  key: `activity:${a.role}:${a.organisation}`,
  title: a.role,
  meta: a.organisation || null,
  date: a.period || null,
  area: a.area,
  highlights: a.highlights,
  files: a.files ?? [],
  photos: a.photos ?? [],
});

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

/** File extension from a URL, e.g. "/files/report.pdf?v=2" → "pdf". */
const extensionOf = (href: string) => href.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase() ?? '';

function FileLinks({ entry }: { entry: Entry }) {
  if (entry.files.length === 0 && !entry.credentialUrl) return null;
  return (
    <p className="rec-links">
      {entry.files.map((file) => {
        const ext = extensionOf(file.href);
        const Icon = IMAGE_EXTENSIONS.includes(ext) ? FileImage : FileText;
        return (
          <a
            key={file.href}
            className="rec-link"
            href={file.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${file.label} for ${entry.title}${ext ? ` (${ext.toUpperCase()})` : ''} (opens in a new tab)`}
          >
            <Icon size={14} aria-hidden="true" />
            {file.label}
            {ext && (
              <span className="rec-link__type" aria-hidden="true">
                {ext}
              </span>
            )}
          </a>
        );
      })}
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

/** The cover photo, which opens the section's lightbox, or an icon tile when there is no photo. */
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
  const [cover] = entry.photos;
  if (!cover) {
    return (
      <span className={`${className} rec-visual--icon`} aria-hidden="true">
        <Icon size={22} strokeWidth={1.6} />
      </span>
    );
  }
  const more = entry.photos.length - 1;
  return (
    <button type="button" className={`${className} rec-visual--photo`} onClick={onOpen}>
      <img src={cover} alt="" loading="lazy" decoding="async" />
      {more > 0 && (
        <span className="rec-visual__count" aria-hidden="true">
          +{more}
        </span>
      )}
      <span className="rec-visual__zoom" aria-hidden="true">
        <Expand size={14} />
      </span>
      <span className="visually-hidden">
        View photo: {entry.title}
        {more > 0 && ` (1 of ${entry.photos.length})`}
      </span>
    </button>
  );
}

/** The photos after the cover, as a row of small thumbnails. */
function Thumbnails({ entry, onOpen }: { entry: Entry; onOpen: (photo: number) => void }) {
  if (entry.photos.length < 2) return null;
  return (
    <ul className="rec-thumbs" role="list" aria-label={`More photos: ${entry.title}`}>
      {entry.photos.slice(1).map((src, i) => (
        <li key={src}>
          <button type="button" className="rec-thumb rec-visual--photo" onClick={() => onOpen(i + 1)}>
            <img src={src} alt="" loading="lazy" decoding="async" />
            <span className="visually-hidden">
              View photo {i + 2} of {entry.photos.length}: {entry.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
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
  const all = [...awards, ...programmes, ...roles];
  const images: LightboxImage[] = all.flatMap((e) =>
    e.photos.map((src, i) => ({
      src,
      alt: `Photo: ${e.title}`,
      caption: e.photos.length > 1 ? `${e.title} (${i + 1}/${e.photos.length})` : e.title,
    })),
  );
  const [lightbox, setLightbox] = useState<number | null>(null);
  const open = (entry: Entry, photo = 0) => {
    const before = all.slice(0, all.findIndex((e) => e.key === entry.key));
    setLightbox(before.reduce((n, e) => n + e.photos.length, 0) + photo);
  };

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
            <Thumbnails entry={entry} onOpen={(photo) => open(entry, photo)} />
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

      <ImageLightbox images={images} index={lightbox} onChange={setLightbox} />
    </Section>
  );
}
