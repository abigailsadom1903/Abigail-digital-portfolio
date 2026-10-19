import type { Project } from './types';

/*
 * Connects the Skills section to the projects: which projects used a skill,
 * and which technologies appear in projects but are not yet listed as skills.
 * Matching is by name, ignoring case and surrounding spaces.
 */

const key = (name: string) => name.trim().toLowerCase();

/** Short project name for labels, e.g. "Web-Based Church Management System For The …" → "Web-Based Church Management System". */
export function shortTitle(title: string): string {
  return title.split(/\s+for\s+the\s+/i)[0].trim();
}

/** Project titles whose tech stack includes the skill. */
export function projectsUsing(skill: string, projects: Project[]): string[] {
  const k = key(skill);
  return projects.filter((p) => p.stack.some((s) => key(s) === k)).map((p) => shortTitle(p.title));
}

/** Technologies used in projects but missing from the skills list, most-used first. */
export function unlistedProjectTech(skills: string[], projects: Project[]): { name: string; usedIn: string[] }[] {
  const listed = new Set(skills.map(key));
  const found = new Map<string, { name: string; usedIn: string[] }>();
  for (const p of projects) {
    for (const tech of p.stack) {
      const k = key(tech);
      if (!k || listed.has(k)) continue;
      const entry = found.get(k) ?? { name: tech.trim(), usedIn: [] };
      const title = shortTitle(p.title);
      if (!entry.usedIn.includes(title)) entry.usedIn.push(title);
      found.set(k, entry);
    }
  }
  return [...found.values()].sort((a, b) => b.usedIn.length - a.usedIn.length || a.name.localeCompare(b.name));
}
