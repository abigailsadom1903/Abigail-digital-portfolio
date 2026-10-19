import data from '../content/projects.json';
import { records, slugify, text, texts } from './normalize';
import type { Project } from './types';
import { withBase } from './withBase';

const raw: Record<string, unknown> = data;

/*
 * Content is edited in src/content/projects.json (or through Pages CMS).
 * Blank fields render as labelled placeholders — fill them with verified details only.
 * Church Management System screenshots must use sample data only.
 */
export function toProject(p: Record<string, unknown>, i: number): Project {
  const title = text(p.title) ?? `Project ${i + 1}`;
  const image = (s: Record<string, unknown>) => text(s.image);
  const report = text(p.report);
  const cover = text(p.cover) ?? records(p.screenshots).map(image).find((src): src is string => src !== null) ?? null;

  return {
    id: slugify(title) || `project-${i + 1}`,
    title,
    category: text(p.category),
    context: text(p.context) ?? '',
    summary: text(p.summary) ?? '',
    featured: p.featured === true,
    year: text(p.year),
    role: text(p.role),
    problem: text(p.problem),
    approach: text(p.approach),
    features: texts(p.features),
    stack: texts(p.stack),
    testing: texts(p.testing),
    outcome: text(p.outcome),
    links: records(p.links).flatMap((l) => {
      const label = text(l.label);
      const href = text(l.url);
      return label && href ? [{ label, href }] : [];
    }),
    media: records(p.screenshots).map((s, n) => {
      const src = image(s);
      return {
        src: src && withBase(src),
        alt: text(s.alt) ?? `${title} screenshot ${n + 1}`,
        caption: text(s.caption) ?? undefined,
      };
    }),
    privacyNote: text(p.privacyNote) ?? undefined,
    report: report ? { href: withBase(report), label: text(p.reportLabel) ?? 'Read the report' } : null,
    cover: cover && withBase(cover),
  };
}

export const projects: Project[] = records(raw.projects).map(toProject);
