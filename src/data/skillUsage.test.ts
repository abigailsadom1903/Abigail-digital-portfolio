import { describe, expect, it } from 'vitest';
import { projectsUsing, shortTitle, unlistedProjectTech } from './skillUsage';
import { toProject } from './projects';

const projects = [
  toProject({ title: 'Web-Based Church Management System For The Archdiocese of Kota Kinabalu', stack: ['PHP', 'MySQL'] }, 0),
  toProject({ title: 'UniFest', stack: ['php', 'MySQL', 'XAMPP'] }, 1),
  toProject({ title: 'SchoolFam', stack: ['React', 'TypeScript'] }, 2),
];

describe('skillUsage', () => {
  it('shortens long project titles', () => {
    expect(shortTitle('Web-Based Church Management System For The Archdiocese of Kota Kinabalu')).toBe(
      'Web-Based Church Management System',
    );
    expect(shortTitle('SchoolFam')).toBe('SchoolFam');
  });

  it('finds the projects that used a skill, ignoring case', () => {
    expect(projectsUsing('PHP', projects)).toEqual(['Web-Based Church Management System', 'UniFest']);
    expect(projectsUsing(' mysql ', projects)).toHaveLength(2);
    expect(projectsUsing('Figma', projects)).toEqual([]);
  });

  it('lists project technologies missing from the skills, most used first', () => {
    const extras = unlistedProjectTech(['PHP', 'MySQL'], projects);
    expect(extras.map((e) => e.name)).toEqual(['React', 'TypeScript', 'XAMPP']);
    expect(extras.find((e) => e.name === 'XAMPP')?.usedIn).toEqual(['UniFest']);
  });
});
