import data from '../content/profile.json';
import { text, texts } from './normalize';
import type { ContactLink, NavItem, Profile } from './types';
import { withBase } from './withBase';

const raw: Record<string, unknown> = data;

// Content is edited in src/content/profile.json (or through Pages CMS).

/** Drops tracking parameters (e.g. LinkedIn's ?utm_source=…) and fragments from a profile URL. */
export const cleanProfileUrl = (url: string | null) => url && url.replace(/[?#].*$/, '');

const email = text(raw.email);
const linkedin = cleanProfileUrl(text(raw.linkedin));
const github = cleanProfileUrl(text(raw.github));
const photo = text(raw.photo);
const cv = text(raw.cv);

/** "https://www.github.com/name/" → "github.com/name" */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const contact: ContactLink[] = [
  { kind: 'email', label: 'Email', href: email && `mailto:${email}`, display: email },
  { kind: 'linkedin', label: 'LinkedIn', href: linkedin, display: linkedin && displayUrl(linkedin) },
  { kind: 'github', label: 'GitHub', href: github, display: github && displayUrl(github) },
];

export const profile: Profile = {
  name: text(raw.name) ?? '',
  shortName: text(raw.shortName) ?? text(raw.name) ?? '',
  initials: text(raw.initials) ?? '',
  role: text(raw.role) ?? '',
  headline: text(raw.headline) ?? '',
  intro: text(raw.intro) ?? '',
  degree: text(raw.degree) ?? '',
  university: text(raw.university) ?? '',
  expectedGraduation: text(raw.expectedGraduation) ?? '',
  interests: texts(raw.interests),
  about: texts(raw.about),
  lookingFor: text(raw.lookingFor),
  photo: photo ? { src: withBase(photo), alt: text(raw.photoAlt) ?? `Portrait of ${text(raw.name) ?? ''}` } : null,
  cvUrl: cv && withBase(cv),
  contact,
};

export const navItems: NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'lab', label: 'Lab' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
];
