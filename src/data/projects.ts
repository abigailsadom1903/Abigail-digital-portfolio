import type { Project } from './types';

/*
 * Content is taken from Abigail's resume and cover letter (October 2026).
 * Anything still `null` or `[]` renders as a labelled placeholder — fill it with
 * real, verified details only.
 *
 * Screenshots: export them to public/images/projects/ and set `src` with withBase,
 * e.g. src: withBase('images/projects/church-dashboard.webp').
 * For the church system, use sample/demo data only — never real parishioner records.
 */
export const projects: Project[] = [
  {
    id: 'church-management-system',
    title: 'Web-Based Church Management System',
    context: 'Archdiocese of Kota Kinabalu · Final Year Project',
    summary:
      'A web-based management system that centralises church information, digital bulletins, announcements, ' +
      'sacramental services, donation management and catechesis for the 23 churches in Kota Kinabalu.',
    featured: true,
    year: '2026',
    role: 'Full-stack developer',
    problem:
      'Church information, bulletins, announcements and services across the 23 churches in Kota Kinabalu ' +
      'needed a single, central web platform.',
    approach:
      'Following the Waterfall methodology, the project covers system analysis, database design, implementation ' +
      'and software testing, with three distinct user roles.',
    features: [
      'Church information',
      'Digital bulletins and announcements',
      'Sacramental services',
      'Donation management',
      'Catechesis',
      'AI chatbot',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Laravel', 'MySQL'],
    testing: ['System testing', 'User Acceptance Testing (UAT)', 'Usability evaluation'],
    outcome: 'Currently in development as my Final Year Project.',
    links: [],
    media: [
      { src: null, alt: 'Church Management System main screen', caption: 'Main screen (sample data)' },
      { src: null, alt: 'Church Management System secondary screen', caption: 'Secondary screen (sample data)' },
    ],
    privacyNote:
      'Screenshots use sample data only. No real parishioner records, credentials or internal church information are shown.',
  },
  {
    id: 'schoolfam',
    title: 'SchoolFam',
    context: 'Parent–teacher communication application',
    summary:
      'A collaborative project: a parent–teacher communication application designed to improve information sharing ' +
      'between parents and teachers.',
    year: '2025',
    role: 'Team member (collaborative project)',
    problem: null,
    approach: null,
    features: [],
    stack: ['Google AI Studio'],
    testing: [],
    outcome:
      'Received Overall Best Project recognition and achieved first runner-up in a Technopreneurship Business ' +
      'Idea Pitching competition.',
    links: [],
    media: [{ src: null, alt: 'SchoolFam application screen', caption: 'Application screen' }],
  },
  {
    // Not on the October 2026 resume; details still to be supplied.
    id: 'studyusia',
    title: 'StudyUsia',
    context: 'College study-room booking management system',
    summary: 'A system for managing study-room bookings in a college.',
    year: null,
    role: null,
    problem: null,
    approach: null,
    features: [],
    stack: [],
    testing: [],
    outcome: null,
    links: [],
    media: [{ src: null, alt: 'StudyUsia booking screen', caption: 'Booking screen' }],
  },
];
