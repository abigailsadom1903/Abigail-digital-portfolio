import data from '../content/education.json';
import { records, text, texts } from './normalize';
import type { Achievement, Activity, Attachment, EducationEntry, Experience } from './types';
import { withBase } from './withBase';

const raw: Record<string, unknown> = data;

// Content is edited in src/content/education.json (or through Pages CMS).

/** Uploaded file path → site URL, or undefined when no file. */
const upload = (value: unknown) => {
  const path = text(value);
  return path ? withBase(path) : undefined;
};

const toAchievement = (a: Record<string, unknown>): Achievement[] => {
  const title = text(a.title);
  if (!title) return [];
  return [
    {
      title,
      issuer: text(a.issuer),
      date: text(a.date),
      description: text(a.description) ?? undefined,
      credentialUrl: text(a.credentialUrl) ?? undefined,
      certificate: upload(a.certificate),
      certificateLabel: text(a.certificateLabel) ?? undefined,
      photo: upload(a.photo),
    },
  ];
};

const toActivity = (a: Record<string, unknown>): Activity[] => {
  const role = text(a.role);
  if (!role) return [];

  // `photo`, `certificate` and `certificateLabel` are the older single-upload fields; still read so old entries keep working.
  const photos = [...texts([a.photo]), ...texts(a.photos)].map(withBase);
  const legacyFile = upload(a.certificate);
  const files: Attachment[] = [
    ...(legacyFile ? [{ href: legacyFile, label: text(a.certificateLabel) ?? 'Certificate' }] : []),
    ...records(a.files).flatMap((f) => {
      const href = upload(f.file);
      return href ? [{ href, label: text(f.label) ?? 'Document' }] : [];
    }),
  ];

  return [
    {
      role,
      organisation: text(a.organisation) ?? '',
      period: text(a.period) ?? '',
      area: text(a.area) ?? undefined,
      highlights: texts(a.highlights),
      photos,
      files,
    },
  ];
};

export const education: EducationEntry[] = records(raw.education).flatMap((e) => {
  const qualification = text(e.qualification);
  if (!qualification) return [];
  return [
    {
      qualification,
      institution: text(e.institution) ?? '',
      period: text(e.period) ?? '',
      details: texts(e.details),
    },
  ];
});

export const experience: Experience[] = records(raw.experience).flatMap((e) =>
  toActivity(e).map(({ role, organisation, period }) => ({
    role,
    organisation,
    period,
    description: text(e.description),
  })),
);

export const achievements: Achievement[] = records(raw.achievements).flatMap(toAchievement);

export const training: Achievement[] = records(raw.training).flatMap(toAchievement);

export const activities: Activity[] = records(raw.activities).flatMap(toActivity);

/** First "CGPA x.xx" found in the education details, e.g. "3.58". */
export function cgpaFrom(education: EducationEntry[]): string | null {
  for (const entry of education) {
    for (const detail of entry.details) {
      const match = detail.match(/CGPA\s*([\d.]+)/i);
      if (match) return match[1];
    }
  }
  return null;
}
