import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { profile } from '../data/profile';
import { Contact } from './Contact';

const setup = () => {
  const openMailto = vi.fn();
  const user = userEvent.setup();
  render(<Contact profile={profile} openMailto={openMailto} />);
  return { user, openMailto };
};

describe('Contact', () => {
  it('shows the email address, resume and profile links', () => {
    setup();
    expect(screen.getByRole('link', { name: 'abigailsadom1903@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:abigailsadom1903@gmail.com',
    );
    expect(screen.getByRole('link', { name: /Resume \(PDF\)/ })).toHaveAttribute('href', profile.cvUrl!);
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank');
  });

  it('copies the email address and confirms it', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Copy email address' }));
    expect(await navigator.clipboard.readText()).toBe('abigailsadom1903@gmail.com');
    expect(screen.getByText('Email address copied.')).toBeInTheDocument();
  });

  it('shows errors, marks fields invalid and focuses the first one', async () => {
    const { user, openMailto } = setup();
    await user.click(screen.getByRole('button', { name: /Send message/ }));
    expect(openMailto).not.toHaveBeenCalled();
    const name = screen.getByLabelText('Name');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
    expect(name).toHaveAccessibleDescription('Please enter your name.');
    expect(screen.getByText('Please write a short message.')).toBeInTheDocument();
  });

  it('counts characters and opens a pre-filled email for the chosen topic', async () => {
    const { user, openMailto } = setup();
    await user.click(screen.getByRole('radio', { name: 'Project or collaboration' }));
    await user.type(screen.getByLabelText('Name'), 'Ali');
    await user.type(screen.getByLabelText('Email'), 'ali@example.com');
    await user.type(screen.getByLabelText('Message'), 'Hello there');
    expect(screen.getByText('11/1500')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Send message/ }));
    expect(openMailto).toHaveBeenCalledTimes(1);
    const url = openMailto.mock.calls[0][0] as string;
    expect(url).toContain('mailto:abigailsadom1903@gmail.com');
    expect(decodeURIComponent(url)).toContain('Project or collaboration: message from Ali');
    expect(screen.getByRole('status')).toHaveTextContent(/email app should now open/);
  });

  it('clears a field error once the visitor starts fixing it', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /Send message/ }));
    await user.type(screen.getByLabelText('Name'), 'A');
    expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument();
  });
});
