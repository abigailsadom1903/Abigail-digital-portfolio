import type { SkillCategory } from './types';

/* Taken from the Skills section of Abigail's resume (October 2026). */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    description: 'Programming and markup languages.',
    items: ['PHP', 'Java', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & tools',
    description: 'Frameworks, IDEs and local environments.',
    items: ['Laravel', 'Android Studio', 'Visual Studio Code', 'XAMPP', 'Git', 'GitHub'],
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Data modelling and storage.',
    items: ['MySQL', 'Database design', 'CRUD operations'],
  },
  {
    id: 'testing',
    title: 'Software testing & QA',
    description: 'Verifying software behaves as intended.',
    items: [
      'Functional testing',
      'System testing',
      'Integration testing',
      'Defect identification',
      'System Usability Scale (SUS) evaluation',
    ],
  },
  {
    id: 'engineering',
    title: 'Software engineering',
    description: 'Process, analysis and documentation.',
    items: ['SDLC', 'Waterfall methodology', 'Requirements analysis', 'Software documentation'],
  },
  {
    id: 'design',
    title: 'UI/UX design',
    description: 'Interface design and prototyping.',
    items: ['Figma', 'Canva', 'Google Stitch', 'Interface prototyping', 'Responsive web design'],
  },
  {
    id: 'ai-low-code',
    title: 'AI-assisted & low-code',
    description: 'Prototyping with AI and low-code platforms.',
    items: ['Claude', 'Google AI Studio', 'Lovable', 'Google AppSheet', 'Prompt-based prototyping'],
  },
];
