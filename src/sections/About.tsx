import { Placeholder } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { Profile } from '../data/types';
import './About.css';

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  const [lead, ...rest] = profile.about;

  return (
    <Section id="about" index="01" eyebrow="About" title="Software engineering, with an eye for quality.">
      <div className="about" data-reveal>
        <div className="about__prose">
          {lead ? <p className="about__lead">{lead}</p> : <Placeholder label="Add an About paragraph" />}
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside className="about__aside" aria-labelledby="about-seeking">
          <h3 id="about-seeking" className="eyebrow">
            Looking for
          </h3>
          <p className="about__seeking">{profile.lookingFor ?? 'Software engineering internship opportunities'}</p>
          <h3 className="eyebrow about__aside-heading">Areas of interest</h3>
          <ul className="about__interests" role="list">
            {profile.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
