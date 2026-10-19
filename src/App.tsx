import { Navbar } from './components/Navbar';
import { achievements, activities, education, experience, training } from './data/education';
import { navItems, profile } from './data/profile';
import { projects } from './data/projects';
import { skillCategories } from './data/skills';
import { useReveal } from './hooks/useReveal';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Lab } from './sections/Lab';
import { Recognition } from './sections/Recognition';
import { Skills } from './sections/Skills';
import { Work } from './sections/Work';

export default function App() {
  useReveal();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navbar items={navItems} brand={profile.shortName} initials={profile.initials} />
      <main id="main" tabIndex={-1}>
        <Hero profile={profile} />
        <Work projects={projects} />
        <Lab />
        <About
          profile={profile}
          education={education}
          experience={experience}
          projectCount={projects.length}
          honoursCount={achievements.length}
        />
        <Skills categories={skillCategories} projects={projects} />
        <Recognition achievements={achievements} training={training} activities={activities} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
