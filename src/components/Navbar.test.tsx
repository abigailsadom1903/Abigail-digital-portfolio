import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navItems } from '../data/profile';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('links to every section', () => {
    render(<Navbar items={navItems} brand="Abigail Sadom" initials="AS" />);
    for (const item of navItems) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
    }
    expect(screen.getByRole('link', { name: 'Lab' })).toBeInTheDocument();
  });

  it('opens the mobile menu, focuses the first link and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Navbar items={navItems} brand="Abigail Sadom" initials="AS" />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: navItems[0].label })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('closes the menu after choosing a link', async () => {
    const user = userEvent.setup();
    render(<Navbar items={navItems} brand="Abigail Sadom" initials="AS" />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
