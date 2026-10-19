import { Placeholder } from '../components/Placeholder';
import { Section } from '../components/Section';
import type { EducationEntry, Experience, Profile } from '../data/types';
import './About.css';

interface AboutProps {
  profile: Profile;
  education: EducationEntry[];
  experience: Experience[];
}

export function About({ profile, education, experience }: AboutProps) {
  return (
    <Section id="about" index="02" title="About">
      <div className="split">
        <div className="about__prose" data-reveal>
          {profile.about.length > 0 ? (
            profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <Placeholder label="Add an About paragraph" />
          )}

          {profile.interests.length > 0 && (
            <dl className="about__facts">
              <div>
                <dt>Interests</dt>
                <dd>{profile.interests.join(' · ')}</dd>
              </div>
              {profile.lookingFor && (
                <div>
                  <dt>Looking for</dt>
                  <dd>{profile.lookingFor}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="about__timeline" data-reveal>
          <h3 className="subheading">Education</h3>
          <ol className="rows" role="list">
            {education.map((entry) => (
              <li key={entry.qualification} className="row">
                <p className="row__date">{entry.period}</p>
                <div>
                  <h4 className="row__title">{entry.qualification}</h4>
                  <p className="row__meta">{entry.institution}</p>
                  {entry.details.length > 0 && <p className="row__text">{entry.details.join(' · ')}</p>}
                </div>
              </li>
            ))}
          </ol>

          {experience.length > 0 && (
            <>
              <h3 className="subheading about__subheading">Experience</h3>
              <ol className="rows" role="list">
                {experience.map((job) => (
                  <li key={`${job.role}-${job.organisation}`} className="row">
                    <p className="row__date">{job.period}</p>
                    <div>
                      <h4 className="row__title">{job.role}</h4>
                      <p className="row__meta">{job.organisation}</p>
                      {job.description && <p className="row__text">{job.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
