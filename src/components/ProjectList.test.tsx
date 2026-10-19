import { render, screen, waitFor } from '@testing-library/react';
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
    expect(container.querySelector(`#${first.id} details`)).toHaveProperty('open', Boolean(first.featured));
  });

  it('links internal Lab links in the same tab and external links in a new tab', () => {
    render(<ProjectList projects={projects} />);
    const lab = screen.getAllByRole('link', { name: /Explore it in the Engineering Lab/ })[0];
    expect(lab).toHaveAttribute('href', '#lab-church');
    expect(lab).not.toHaveAttribute('target');
    const github = screen.getAllByRole('link', { name: /View code on GitHub/ })[0];
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

  it('shows cover thumbnails and a hover preview for closed projects', async () => {
    const user = userEvent.setup();
    const withCovers = projects.map((p, i) => ({ ...p, featured: false, cover: i === 1 ? '/images/schoolfam.jpg' : null }));
    const { container } = render(<ProjectList projects={withCovers} />);

    // Every row gets a thumbnail slot; rows without a photo show a lettered tile.
    expect(container.querySelectorAll('.project__thumb')).toHaveLength(withCovers.length);
    expect(container.querySelector(`#${withCovers[1].id} .project__thumb img`)).toHaveAttribute('src', '/images/schoolfam.jpg');

    const preview = screen.getByTestId('project-preview');
    const thumb = (id: string) => container.querySelector(`#${id} .project__thumb`)!;
    expect(preview).not.toHaveClass('is-visible');

    // Hovering the row's text does nothing; only resting on the photo opens the preview.
    await user.hover(container.querySelector(`#${withCovers[1].id} .project__title`)!);
    await new Promise((r) => setTimeout(r, 300));
    expect(preview).not.toHaveClass('is-visible');

    await user.hover(thumb(withCovers[1].id));
    expect(preview).not.toHaveClass('is-visible'); // short delay first
    await waitFor(() => expect(preview).toHaveClass('is-visible'));
    expect(preview.querySelector('img')).toHaveAttribute('src', '/images/schoolfam.jpg');
    await user.unhover(thumb(withCovers[1].id));
    expect(preview).not.toHaveClass('is-visible');

    // Passing quickly over a photo doesn't flash the preview.
    await user.hover(thumb(withCovers[1].id));
    await user.unhover(thumb(withCovers[1].id));
    await new Promise((r) => setTimeout(r, 300));
    expect(preview).not.toHaveClass('is-visible');

    // Lettered tiles (no photo) never show the preview.
    await user.hover(thumb(withCovers[0].id));
    await new Promise((r) => setTimeout(r, 300));
    expect(preview).not.toHaveClass('is-visible');
  });

  it('shows no thumbnails when no project has a photo', () => {
    const { container } = render(<ProjectList projects={projects.map((p) => ({ ...p, cover: null }))} />);
    expect(container.querySelector('.project__thumb')).toBeNull();
  });

  it('shows an empty state when there are no projects', () => {
    render(<ProjectList projects={[]} />);
    expect(screen.getByText(/Projects will appear here soon/)).toBeInTheDocument();
  });
});
