import type { Achievement, Activity, EducationEntry } from './types';

/* Taken from Abigail's resume (October 2026). */

export const education: EducationEntry[] = [
  {
    institution: 'Universiti Malaysia Sabah',
    qualification: 'Bachelor of Computer Science (Hons.), Software Engineering',
    period: '2023 – 2027',
    details: ['CGPA 3.58', 'BKNS Scholar'],
  },
  {
    institution: 'Labuan Matriculation College',
    qualification: 'Module III, Science Technology',
    period: '2022 – 2023',
    details: ['CGPA 3.21', 'MUET Band 4.0'],
  },
];

export const achievements: Achievement[] = [
  {
    title: 'Overall Best Project: SchoolFam',
    issuer: null,
    date: '2025',
  },
  {
    title: 'First runner-up, Technopreneurship Business Idea Pitching competition (SchoolFam)',
    issuer: null,
    date: '2025',
  },
  {
    title: "Dean's List",
    issuer: 'Universiti Malaysia Sabah',
    // TODO: add the semester(s) awarded.
    date: null,
  },
];

export const training: Achievement[] = [
  {
    title: 'MITE Generative AI Tools Training for the Workplace',
    issuer: 'Sponsored by Yayasan Peneraju',
    date: '2026',
    description: 'Two-day programme on generative AI tools for workplace productivity and workflow optimisation.',
  },
  {
    title: 'Gemini No-Code Hackathon',
    issuer: null,
    date: '2026',
    description: 'Building a no-code application prototype with Google AppSheet and Gemini AI.',
  },
  {
    title: 'PETRONAS BeDigital Bootcamp',
    issuer: 'PETRONAS',
    date: '2025',
    description: 'Two-day bootcamp on digital innovation, technology applications and digital transformation.',
  },
];

export const activities: Activity[] = [
  { role: 'Committee Member', organisation: 'Anti-Drug Prevention Club', period: '2023 – present' },
  { role: 'AJK Food and Gift', organisation: 'SULAM Project at Masjid Al-Huda, Kg. Unggun Jaya', period: '2026' },
  { role: 'Treasurer', organisation: 'Program Kembara Jati Diri UMS', period: '2024' },
];
