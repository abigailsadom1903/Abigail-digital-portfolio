import { Section } from '../components/Section';
import type { Profile } from '../data/types';
import './About.css';

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <Section id="about" index="01" eyebrow="About" title="Software engineering, with an eye for quality.">
      <div className="about" data-reveal>
        <div className="about__prose">
          <p className="about__lead">
            I am studying for a {profile.degree} at {profile.university}, with graduation expected in{' '}
            {profile.expectedGraduation}.
          </p>
          <p>
            My interests sit in two places that belong together: building web applications people can rely on, and
            the software testing and quality assurance that makes that reliability possible.
          </p>
          <p>
            My Final Year Project, a web-based church management system for the Archdiocese of Kota Kinabalu, is taking
            me through the full software development life cycle: system analysis, database design, implementation and
            testing. Academic team projects and part-time roles in customer service have also strengthened my
            communication, teamwork and time management.
          </p>
        </div>

        <aside className="about__aside" aria-labelledby="about-seeking">
          <h3 id="about-seeking" className="eyebrow">
            Looking for
          </h3>
          <p className="about__seeking">Software engineering, web development or software testing internships</p>
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
