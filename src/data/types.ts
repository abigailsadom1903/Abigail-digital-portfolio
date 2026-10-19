/**
 * Content types for the portfolio.
 *
 * Convention: a value of `null` (or an empty array) means "not supplied yet".
 * Components render a clearly labelled placeholder in that case, so nothing
 * is ever invented to fill a gap.
 */

export interface NavItem {
  id: string;
  label: string;
}

export type ContactKind = 'email' | 'linkedin' | 'github' | 'other';

export interface ContactLink {
  kind: ContactKind;
  label: string;
  /** Full URL, or `mailto:` address. `null` until supplied. */
  href: string | null;
  /** Human-readable text shown in place of the raw URL, e.g. "linkedin.com/in/…". */
  display: string | null;
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  headline: string;
  intro: string;
  degree: string;
  university: string;
  expectedGraduation: string;
  interests: string[];
  /** About section paragraphs; the first is shown as the lead. */
  about: string[];
  lookingFor: string | null;
  /** Portrait shown in the hero. `null` hides it. */
  photo: { src: string; alt: string } | null;
  /** Path to the CV inside /public, e.g. "/cv/Abigail-Sadom-CV.pdf". `null` until supplied. */
  cvUrl: string | null;
  contact: ContactLink[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMedia {
  /** Path inside /public, e.g. "/images/projects/church-dashboard.webp". `null` shows a placeholder. */
  src: string | null;
  /** Describes the screenshot for screen readers. Required even for placeholders. */
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  /** Short label shown in the project list, e.g. "Web application" or "IoT". */
  category: string | null;
  /** Short descriptor shown under the title, e.g. the organisation or project type. */
  context: string;
  summary: string;
  featured?: boolean;
  /** Supplied by Abigail; `null` until confirmed. */
  year: string | null;
  role: string | null;
  problem: string | null;
  approach: string | null;
  features: string[];
  stack: string[];
  /** Testing / QA work done on the project. Only verified activities belong here. */
  testing: string[];
  outcome: string | null;
  links: ProjectLink[];
  media: ProjectMedia[];
  /** Shown prominently, e.g. to state that screenshots contain only sample data. */
  privacyNote?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  /** Only skills Abigail has actually used. Empty renders a placeholder. */
  items: string[];
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  period: string;
  details: string[];
}

export interface Achievement {
  title: string;
  /** Awarding body or organiser, when known. */
  issuer: string | null;
  date: string | null;
  description?: string;
  /** Link to a verifiable record, e.g. a certificate URL. */
  credentialUrl?: string;
  /** Uploaded certificate (PDF or image), resolved URL. */
  certificate?: string;
  /** Uploaded photo, resolved URL. */
  photo?: string;
}

export interface Activity {
  role: string;
  organisation: string;
  period: string;
  certificate?: string;
  photo?: string;
}

export interface Experience extends Activity {
  description: string | null;
}
