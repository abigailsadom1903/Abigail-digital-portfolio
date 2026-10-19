import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { projects } from '../data/projects';
import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('lists every project, with only the featured one open', () => {
    const { container } = render(<ProjectList projects={projects} />);
    const details = container.querySelectorAll('details');
    expect(details).toHaveLength(projects.length);
    projects.forEach((p, i) => expect(details[i].open).toBe(Boolean(p.featured)));
  });

  it('opens the next project from the pager', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectList projects={projects} />);
    const [first, second] = projects;
    await user.click(screen.getAllByRole('button', { name: new RegExp(`Next\\s*${second.title}`) })[0]);
    const secondDetails = container.querySelector(`#${second.id} details`) as HTMLDetailsElement;
    expect(secondDetails.open).toBe(true);
    expect(container.querySelector(`#${first.id} details`)).toHaveProperty('open', true);
  });

  it('links internal Lab links in the same tab and external links in a new tab', () => {
    render(<ProjectList projects={projects} />);
    const lab = screen.getAllByRole('link', { name: /Explore it in the Engineering Lab/ })[0];
    expect(lab).toHaveAttribute('href', '#lab-church');
    expect(lab).not.toHaveAttribute('target');
    const github = screen.getByRole('link', { name: /View code on GitHub/ });
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows a report button that opens the PDF in a new tab', () => {
    const withReport = projects.map((p, i) =>
      i === 0 ? { ...p, report: { href: '/reports/fyp.pdf', label: 'Final Year Project report' } } : p,
    );
    render(<ProjectList projects={withReport} />);
    const report = screen.getByRole('link', { name: /Final Year Project report/ });
    expect(report).toHaveAttribute('href', '/reports/fyp.pdf');
    expect(report).toHaveAttribute('target', '_blank');
    expect(report).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows an empty state when there are no projects', () => {
    render(<ProjectList projects={[]} />);
    expect(screen.getByText(/Projects will appear here soon/)).toBeInTheDocument();
  });
});
