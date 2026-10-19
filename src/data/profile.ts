import type { NavItem, Profile } from './types';
import { withBase } from './withBase';

export const profile: Profile = {
  name: 'Abigail Alau R. Sadom',
  shortName: 'Abigail Sadom',
  initials: 'AS',
  role: 'Software Engineering Intern',
  headline: 'Building clear, dependable web software, and testing it properly.',
  intro:
    'I am a Software Engineering undergraduate at Universiti Malaysia Sabah, building web applications with ' +
    'Laravel, PHP and MySQL, and looking for an internship in software engineering, web development or software testing.',
  degree: 'Bachelor of Computer Science (Hons.), Software Engineering',
  university: 'Universiti Malaysia Sabah',
  expectedGraduation: '2027',
  interests: ['Web development', 'Software testing & QA'],

  cvUrl: withBase('cv/Abigail-Sadom-CV.pdf'),

  contact: [
    {
      kind: 'email',
      label: 'Email',
      href: 'mailto:abigailsadom1903@gmail.com',
      display: 'abigailsadom1903@gmail.com',
    },
    // TODO: the resume lists "linkedin.com/in/abigail", which looks incomplete. Add the full profile URL.
    { kind: 'linkedin', label: 'LinkedIn', href: null, display: null },
    {
      kind: 'github',
      label: 'GitHub',
      href: 'https://github.com/abigailsadom1903',
      display: 'github.com/abigailsadom1903',
    },
  ],
};

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
