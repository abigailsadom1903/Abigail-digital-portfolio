import { Navbar } from './components/Navbar';
import { achievements, activities, education, training } from './data/education';
import { navItems, profile } from './data/profile';
import { projects } from './data/projects';
import { skillCategories } from './data/skills';
import { useReveal } from './hooks/useReveal';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Education } from './sections/Education';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
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
        <Hero profile={profile} projects={projects} />
        <About profile={profile} />
        <Work projects={projects} />
        <Skills categories={skillCategories} />
        <Education education={education} achievements={achievements} training={training} activities={activities} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
