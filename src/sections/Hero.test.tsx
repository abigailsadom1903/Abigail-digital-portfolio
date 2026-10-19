import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '../data/profile';
import { Hero } from './Hero';

describe('Hero', () => {
  it('links LinkedIn and GitHub at the top, opening in a new tab', () => {
    render(<Hero profile={profile} />);
    const profiles = screen.getByRole('list', { name: 'Profiles' });
    const linkedin = screen.getByRole('link', { name: 'LinkedIn (opens in a new tab)' });
    const github = screen.getByRole('link', { name: 'GitHub (opens in a new tab)' });
    expect(profiles).toContainElement(linkedin);
    expect(linkedin).toHaveAttribute('href', expect.stringMatching(/^https:\/\/www\.linkedin\.com\/in\/[^?#]+$/));
    expect(github).toHaveAttribute('href', 'https://github.com/abigailsadom1903');
    expect(github).toHaveAttribute('target', '_blank');
  });
});
