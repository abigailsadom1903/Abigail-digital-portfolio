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
const whatsapp = whatsappNumber(text(raw.whatsapp));
const photo = text(raw.photo);
const cv = text(raw.cv);

/**
 * WhatsApp number in international digits, e.g. "010-937 7570" → "60109377570".
 * A Malaysian local number (leading 0) gets the 60 country code.
 */
export function whatsappNumber(value: string | null): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 8) return null;
  return digits.startsWith('0') ? '60' + digits.slice(1) : digits;
}

/** "60109377570" → "+60 10-937 7570" */
const displayPhone = (digits: string) =>
  digits.startsWith('60') ? '+60 ' + digits.slice(2, 4) + '-' + digits.slice(4, -4) + ' ' + digits.slice(-4) : '+' + digits;

/** "https://www.github.com/name/" → "github.com/name" */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const contact: ContactLink[] = [
  { kind: 'email', label: 'Email', href: email && `mailto:${email}`, display: email },
  { kind: 'linkedin', label: 'LinkedIn', href: linkedin, display: linkedin && displayUrl(linkedin) },
  { kind: 'github', label: 'GitHub', href: github, display: github && displayUrl(github) },
  { kind: 'whatsapp', label: 'WhatsApp', href: whatsapp && `https://wa.me/${whatsapp}`, display: whatsapp && displayPhone(whatsapp) },
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
  availability: text(raw.availability),
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
