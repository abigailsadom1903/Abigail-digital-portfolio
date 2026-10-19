import { Placeholder } from '../components/Placeholder';
import { Section } from '../components/Section';
import { TagList } from '../components/Tag';
import type { SkillCategory } from '../data/types';
import './Skills.css';

interface SkillsProps {
  categories: SkillCategory[];
}

export function Skills({ categories }: SkillsProps) {
  return (
    <Section id="skills" index="03" eyebrow="Skills" title="Technical skills" tone="tinted">
      <ul className="skills" role="list">
        {categories.map((category) => (
          <li key={category.id} className="skills__group" data-reveal>
            <h3 className="skills__title">{category.title}</h3>
            <p className="skills__description">{category.description}</p>
            {category.items.length > 0 ? (
              <TagList items={category.items} label={category.title} />
            ) : (
              <Placeholder label={`Add ${category.title.toLowerCase()} you have used`} />
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
