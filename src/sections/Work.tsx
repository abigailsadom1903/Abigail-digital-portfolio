import { CaseStudy } from '../components/CaseStudy';
import { Section } from '../components/Section';
import type { Project } from '../data/types';

interface WorkProps {
  projects: Project[];
}

export function Work({ projects }: WorkProps) {
  return (
    <Section
      id="work"
      index="02"
      eyebrow="Selected work"
      title="Projects and case studies"
      intro={<p>Systems I have worked on, from requirements through to a working product.</p>}
    >
      {projects.map((project, i) => (
        <CaseStudy key={project.id} project={project} index={i} />
      ))}
    </Section>
  );
}
