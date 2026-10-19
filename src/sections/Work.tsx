import { ProjectList } from '../components/ProjectList';
import { Section } from '../components/Section';
import type { Project } from '../data/types';

interface WorkProps {
  projects: Project[];
}

export function Work({ projects }: WorkProps) {
  return (
    <Section id="work" index="01" title="Selected work" aside={`${projects.length} projects`}>
      <ProjectList projects={projects} />
    </Section>
  );
}
