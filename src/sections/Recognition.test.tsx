import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Recognition } from './Recognition';

const achievements = [
  { title: 'Overall Best Project: SchoolFam', issuer: null, date: '2025', photo: '/images/award.jpg' },
  { title: "Dean's List", issuer: 'Universiti Malaysia Sabah', date: null },
];
const training = [
  {
    title: 'MITE Generative AI Tools Training',
    issuer: 'MITE Education Sdn. Bhd.',
    date: '2026',
    description: 'Two-day programme.',
    certificate: '/certificates/mite.pdf',
    photo: '/images/mite.jpg',
  },
];
const activities = [{ role: 'Treasurer', organisation: 'Program Kembara Jati Diri UMS', period: '2024' }];

const setup = () => {
  const user = userEvent.setup();
  render(<Recognition achievements={achievements} training={training} activities={activities} />);
  return user;
};

describe('Recognition', () => {
  it('summarises the groups and shows awards as highlight cards', () => {
    setup();
    expect(screen.getByText('2 honours · 1 programmes · 1 roles')).toBeInTheDocument();
    const awards = screen.getByRole('list', { name: /Honours & awards/ });
    expect(within(awards).getAllByRole('listitem')).toHaveLength(2);
    expect(within(awards).getByText("Dean's List")).toBeInTheDocument();
    expect(within(awards).getByText('2025')).toBeInTheDocument();
  });

  it('links certificates in a new tab', () => {
    setup();
    const cert = screen.getByRole('link', { name: /Certificate for MITE Generative AI Tools Training/ });
    expect(cert).toHaveAttribute('href', '/certificates/mite.pdf');
    expect(cert).toHaveAttribute('target', '_blank');
  });

  it('opens photos full size and steps through every photo in the section', async () => {
    const user = setup();
    // Items without a photo show an icon tile instead of a button.
    expect(screen.queryByRole('button', { name: /View photo: Treasurer/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'View photo: MITE Generative AI Tools Training' }));
    expect(screen.getByRole('img', { name: 'Photo: MITE Generative AI Tools Training', hidden: true })).toHaveAttribute(
      'src',
      '/images/mite.jpg',
    );
    await user.click(screen.getByRole('button', { name: 'Next image', hidden: true }));
    expect(screen.getByRole('img', { name: 'Photo: Overall Best Project: SchoolFam', hidden: true })).toBeInTheDocument();
  });
});
