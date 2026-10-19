import { Placeholder, SHOW_PLACEHOLDERS } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { SkillCategory } from '../data/types';
import './Skills.css';

interface SkillsProps {
  categories: SkillCategory[];
}

export function Skills({ categories }: SkillsProps) {
  return (
    <Section id="skills" index="04" title="Skills" tone="tinted">
      <ul className="skills" role="list">
        {categories
          .filter((category) => category.items.length > 0 || SHOW_PLACEHOLDERS)
          .map((category) => (
            <li key={category.id} className="skills__group" data-reveal>
              <h3 className="subheading">{category.title}</h3>
              {category.items.length > 0 ? (
                <ul className="skills__list" role="list">
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <Placeholder label={`Add ${category.title.toLowerCase()} you have used`} />
              )}
            </li>
          ))}
      </ul>
    </Section>
  );
}
