import data from '../content/education.json';
import { records, text, texts } from './normalize';
import type { Achievement, Activity, EducationEntry } from './types';

const raw: Record<string, unknown> = data;

// Content is edited in src/content/education.json (or through Pages CMS).

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

export const achievements: Achievement[] = records(raw.achievements).flatMap(toAchievement);

export const training: Achievement[] = records(raw.training).flatMap(toAchievement);

export const activities: Activity[] = records(raw.activities).flatMap((a) => {
  const role = text(a.role);
  if (!role) return [];
  return [{ role, organisation: text(a.organisation) ?? '', period: text(a.period) ?? '' }];
});
