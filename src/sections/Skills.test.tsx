import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toProject } from '../data/projects';
import { Skills } from './Skills';

const categories = [
  { id: 'languages', title: 'Languages', description: 'Programming languages.', items: ['PHP', 'Java'] },
  { id: 'testing', title: 'Software testing & QA', description: 'Testing.', items: ['System testing'] },
];
const projects = [toProject({ title: 'UniFest', stack: ['PHP', 'MySQL'] }, 0)];

describe('Skills', () => {
  it('shows a card per category with its skill count', () => {
    render(<Skills categories={categories} projects={projects} />);
    expect(screen.getByRole('heading', { name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByText('3 skills', { exact: false })).toBeInTheDocument();
  });

  it('marks skills used in projects and says where', () => {
    render(<Skills categories={categories} projects={projects} />);
    const languages = screen.getByRole('list', { name: 'Languages' });
    const php = within(languages).getByText('PHP').closest('li')!;
    expect(php).toHaveClass('chip-skill--used');
    expect(php).toHaveAttribute('data-used', 'Used in UniFest');
    expect(php).toHaveAttribute('tabindex', '0');
    expect(within(languages).getByText('Java').closest('li')).not.toHaveClass('chip-skill--used');
    expect(screen.getByText(/of these are used in my projects/)).toHaveTextContent('1 of these');
  });

  it('collects project technologies that are not listed as skills', () => {
    render(<Skills categories={categories} projects={projects} />);
    const extras = screen.getByRole('list', { name: 'Also used in my projects' });
    expect(within(extras).getByText('MySQL')).toBeInTheDocument();
    expect(within(extras).queryByText('PHP')).not.toBeInTheDocument();
  });
});
