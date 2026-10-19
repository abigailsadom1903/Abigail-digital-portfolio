import data from '../content/skills.json';
import { records, slugify, text, texts } from './normalize';
import type { SkillCategory } from './types';

const raw: Record<string, unknown> = data;

// Content is edited in src/content/skills.json (or through Pages CMS).
export const skillCategories: SkillCategory[] = records(raw.categories).map((c, i) => {
  const title = text(c.title) ?? `Category ${i + 1}`;
  return {
    id: slugify(title) || `category-${i + 1}`,
    title,
    description: text(c.description) ?? '',
    items: texts(c.items),
  };
});
