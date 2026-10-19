import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cgpaFrom } from '../data/education';
import { profile } from '../data/profile';
import { About } from './About';

const education = [
  { qualification: 'Bachelor of Computer Science', institution: 'Universiti Malaysia Sabah', period: '2023 – 2027', details: ['CGPA 3.58', 'BKNS Scholar'] },
];
const experience = [
  { role: 'Part-Time Shop Assistant', organisation: 'Petronas Station, Sipitang', period: '2023', description: null },
];

describe('About', () => {
  it('reads the CGPA from the education details', () => {
    expect(cgpaFrom(education)).toBe('3.58');
    expect(cgpaFrom([{ ...education[0], details: ['BKNS Scholar'] }])).toBeNull();
  });

  it('shows figures, availability and the timeline', () => {
    render(
      <About
        profile={{ ...profile, availability: '6-month internship · 22 February – 6 August 2027' }}
        education={education}
        experience={experience}
        projectCount={7}
        honoursCount={3}
      />,
    );
    expect(screen.getByText('3.58')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('6-month internship · 22 February – 6 August 2027')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Get in touch/ })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('heading', { name: 'Part-Time Shop Assistant' })).toBeInTheDocument();
  });
});
