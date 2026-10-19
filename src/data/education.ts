import data from '../content/education.json';
import { records, text, texts } from './normalize';
import type { Achievement, Activity, EducationEntry, Experience } from './types';
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
      photo: upload(a.photo),
    },
  ];
};

const toActivity = (a: Record<string, unknown>): Activity[] => {
  const role = text(a.role);
  if (!role) return [];
  return [
    {
      role,
      organisation: text(a.organisation) ?? '',
      period: text(a.period) ?? '',
      certificate: upload(a.certificate),
      photo: upload(a.photo),
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
