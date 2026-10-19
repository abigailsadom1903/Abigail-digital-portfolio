import {
  Braces,
  Database,
  FlaskConical,
  Layers,
  Palette,
  Sparkles,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import { projectsUsing, unlistedProjectTech } from '../data/skillUsage';
import type { Project, SkillCategory } from '../data/types';
import type { CSSProperties } from 'react';
import './Skills.css';

interface SkillsProps {
  categories: SkillCategory[];
  projects: Project[];
}

/** Picks an icon from words in the category title; categories are edited in Pages CMS. */
function iconFor(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (/test|qa|quality/.test(t)) return FlaskConical;
  // Checked before "code" so that "low-code" gets the AI icon.
  if (/\bai\b|ai-|low-code|no-code/.test(t)) return Sparkles;
  if (/language|code|programming/.test(t)) return Braces;
  if (/data|sql/.test(t)) return Database;
  if (/ui|ux|design/.test(t)) return Palette;
  if (/engineering|process|method/.test(t)) return Workflow;
  if (/tool|framework/.test(t)) return Wrench;
  return Layers;
}

function SkillChip({ name, usedIn }: { name: string; usedIn: string[] }) {
  if (usedIn.length === 0) return <li className="chip-skill">{name}</li>;
  const where = usedIn.join(', ');
  return (
    // Focusable so keyboard users can reveal the same "used in" note as mouse users.
    <li className="chip-skill chip-skill--used" tabIndex={0} data-used={`Used in ${where}`}>
      <span className="chip-skill__dot" aria-hidden="true" />
      {name}
      <span className="visually-hidden">, used in {where}</span>
    </li>
  );
}

export function Skills({ categories, projects }: SkillsProps) {
  const visible = categories.filter((c) => c.items.length > 0 || SHOW_PLACEHOLDERS);
  const allSkills = categories.flatMap((c) => c.items);
  const usedCount = allSkills.filter((s) => projectsUsing(s, projects).length > 0).length;
  const extras = unlistedProjectTech(allSkills, projects);

  return (
    <Section
      id="skills"
      index="04"
      title="Skills"
      tone="tinted"
      aside={`${visible.length} areas · ${allSkills.length} skills`}
    >
      <p className="skills__legend" data-reveal>
        <span className="chip-skill__dot" aria-hidden="true" />
        <span>
          <strong>{usedCount}</strong> of these are used in my projects. Hover or focus one to see where.
        </span>
      </p>

      <ul className="skills" role="list">
        {visible.map((category) => {
          const Icon = iconFor(category.title);
          return (
            <li key={category.id} className="skill-card" data-reveal>
              <div className="skill-card__head">
                <span className="skill-card__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="skill-card__title">{category.title}</h3>
                  {category.description && <p className="skill-card__desc">{category.description}</p>}
                </div>
                <span className="skill-card__count">{category.items.length}</span>
              </div>
              {category.items.length > 0 ? (
                <ul className="skill-card__chips" role="list" aria-label={category.title}>
                  {category.items.map((item) => (
                    <SkillChip key={item} name={item} usedIn={projectsUsing(item, projects)} />
                  ))}
                </ul>
              ) : (
                <Placeholder label={`Add ${category.title.toLowerCase()} you have used`} />
              )}
            </li>
          );
        })}

        {extras.length > 0 && (
          <li
            className="skill-card skill-card--wide"
            data-reveal
            // Fill the rest of the last row in the 2- and 3-column layouts.
            style={
              {
                '--span-2': visible.length % 2 === 1 ? 1 : 2,
                '--span-3': visible.length % 3 === 0 ? 3 : 3 - (visible.length % 3),
              } as CSSProperties
            }
          >
            <div className="skill-card__head">
              <span className="skill-card__icon skill-card__icon--solid" aria-hidden="true">
                <Layers size={20} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="skill-card__title">Also used in my projects</h3>
                <p className="skill-card__desc">Technologies from the projects above, gathered automatically.</p>
              </div>
              <span className="skill-card__count">{extras.length}</span>
            </div>
            <ul className="skill-card__chips" role="list" aria-label="Also used in my projects">
              {extras.map((tech) => (
                <SkillChip key={tech.name} name={tech.name} usedIn={tech.usedIn} />
              ))}
            </ul>
          </li>
        )}
      </ul>
    </Section>
  );
}
