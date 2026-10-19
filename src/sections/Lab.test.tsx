import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { labProjects } from '../data/lab';
import { Lab } from './Lab';

const renderLab = () => {
  const user = userEvent.setup();
  render(<Lab testRunDelay={0} />);
  return user;
};

/** The visible tab panel (hidden panels are excluded from role queries). */
const activePanel = () => within(screen.getByRole('tabpanel'));

const church = labProjects.find((p) => p.id === 'church')!;
const schoolfam = labProjects.find((p) => p.id === 'schoolfam')!;

describe('Engineering Lab: tabs and projects', () => {
  it('shows four module tabs with the Architecture tab selected', () => {
    renderLab();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual([
      expect.stringContaining('Architecture'),
      expect.stringContaining('Data model'),
      expect.stringContaining('Testing'),
      expect.stringContaining('Decisions'),
    ]);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toBeVisible();
  });

  it('moves between tabs with arrow keys, Home and End', async () => {
    const user = renderLab();
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveFocus();
    await user.keyboard('{End}');
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(tabs[3]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
  });

  it('switches project and shows that project’s components', async () => {
    const user = renderLab();
    expect(screen.getByRole('button', { name: /Church Management System/ })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: /SchoolFam/ }));
    expect(screen.getByRole('button', { name: /SchoolFam/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Role-based navigation/ })).toBeInTheDocument();
  });
});

describe('Architecture Explorer', () => {
  it('shows details for the selected component', async () => {
    const user = renderLab();
    await user.click(screen.getByRole('button', { name: /Data access \(PDO\)/ }));
    expect(screen.getByRole('heading', { name: 'Data access (PDO)' })).toBeInTheDocument();
    expect(activePanel().getByText(/295 prepare\(\) calls/)).toBeInTheDocument();
  });

  it('numbers the components in a traced flow', async () => {
    const user = renderLab();
    const flow = church.architecture.flows[1];
    await user.click(screen.getByRole('button', { name: flow.title }));
    expect(screen.getByRole('button', { name: flow.title })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: flow.title })).toBeInTheDocument();
    expect(screen.getAllByText(/Flow step/)).toHaveLength(new Set(flow.steps.map((s) => s.node)).size);
  });
});

describe('Data Model Explorer', () => {
  const openDataModel = async () => {
    const user = renderLab();
    await user.click(screen.getByRole('tab', { name: /Data model/ }));
    return user;
  };

  it('filters tables by table or column name', async () => {
    const user = await openDataModel();
    const search = screen.getByLabelText(/Search tables and columns/);
    await user.type(search, 'token_hash');
    expect(screen.getByText(/3 of 22 tables/)).toBeInTheDocument();
    expect(activePanel().getByRole('button', { name: /^password_resets/ })).toBeInTheDocument();
    await user.clear(search);
    await user.type(search, 'reject_reason');
    expect(screen.getByText(/1 of 22 tables/)).toBeInTheDocument();
  });

  it('shows an empty state and clears it', async () => {
    const user = await openDataModel();
    await user.type(screen.getByLabelText(/Search tables and columns/), 'zzz-nothing');
    expect(screen.getByText(/No tables or columns match/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByText(/22 of 22 tables/)).toBeInTheDocument();
  });

  it('limits results to a feature area', async () => {
    const user = await openDataModel();
    await user.selectOptions(screen.getByLabelText('Feature area'), 'Donations');
    expect(screen.getByText(/2 of 22 tables/)).toBeInTheDocument();
  });

  it('follows a relationship to the referenced table', async () => {
    const user = await openDataModel();
    await user.click(activePanel().getByRole('button', { name: /^donations\s*Donations/ }));
    expect(screen.getByRole('heading', { name: 'donations' })).toBeInTheDocument();
    expect(screen.getByText(/On delete: RESTRICT/)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'church_info' })[0]);
    expect(screen.getByRole('heading', { name: 'church_info' })).toBeInTheDocument();
  });

  it('uses entity and field wording for the SchoolFam model', async () => {
    const user = await openDataModel();
    await user.click(screen.getByRole('button', { name: /SchoolFam/ }));
    expect(screen.getByLabelText(/Search entities and fields/)).toBeInTheDocument();
    expect(screen.getByText(`${schoolfam.schema.tables.length} of ${schoolfam.schema.tables.length} entities`)).toBeInTheDocument();
  });
});

describe('Testing Playground', () => {
  const openTesting = async () => {
    const user = renderLab();
    await user.click(screen.getByRole('tab', { name: /Testing/ }));
    return user;
  };
  const total = church.testSuite.scenarios.length;

  it('is clearly labelled as a simulation', async () => {
    await openTesting();
    expect(screen.getByText('Simulation.')).toBeInTheDocument();
    expect(screen.getByText(`0 passed`)).toBeInTheDocument();
    expect(screen.getByText(`${total} not run`)).toBeInTheDocument();
  });

  it('runs a single test and shows expected and actual results', async () => {
    const user = await openTesting();
    const first = church.testSuite.scenarios[0];
    await user.click(screen.getByRole('button', { name: `Run test ${first.id}: ${first.title}` }));
    expect(screen.getByText('1 passed')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `Details for ${first.id}` }));
    const details = document.getElementById(`tp-details-${first.id}`)!;
    expect(details).toBeVisible();
    expect(within(details).getByText('Expected')).toBeInTheDocument();
    // When the test passes, expected and actual read the same.
    expect(within(details).getAllByText("'approved' is accepted", { selector: 'dd' })).toHaveLength(2);
  });

  it('runs all, resets, and catches a simulated regression', async () => {
    const user = await openTesting();
    await user.click(screen.getByRole('button', { name: 'Run all' }));
    expect(screen.getByText(`${total} passed`)).toBeInTheDocument();
    expect(screen.getByText('0 failed')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText(`${total} not run`)).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: /Simulate a regression/ }));
    await user.click(screen.getByRole('button', { name: 'Run all' }));
    expect(screen.queryByText('0 failed')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Status'), 'failed');
    expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);
    expect(screen.queryByText('Passed', { selector: '.tp__badge' })).not.toBeInTheDocument();
  });

  it('searches scenarios and shows an empty state', async () => {
    const user = await openTesting();
    await user.type(screen.getByLabelText('Search scenarios'), 'DEL-0');
    expect(screen.getAllByRole('button', { name: /^Run test DEL-0/ })).toHaveLength(3);
    await user.clear(screen.getByLabelText('Search scenarios'));
    await user.type(screen.getByLabelText('Search scenarios'), 'no such test');
    expect(screen.getByText(/No scenarios match/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show all scenarios' }));
    expect(screen.getAllByRole('button', { name: /^Run test / })).toHaveLength(total);
  });

  it('runs the SchoolFam suite against its own rules', async () => {
    const user = await openTesting();
    await user.click(screen.getByRole('button', { name: /SchoolFam/ }));
    await user.click(screen.getByRole('button', { name: 'Run all' }));
    expect(screen.getByText(`${schoolfam.testSuite.scenarios.length} passed`)).toBeInTheDocument();
  });
});

describe('Decision Journal', () => {
  it('filters by project and expands an entry', async () => {
    const user = renderLab();
    await user.click(screen.getByRole('tab', { name: /Decisions/ }));
    await user.click(screen.getByRole('button', { name: /^This portfolio/ }));
    expect(screen.queryByText(/prepared statements for every database query/)).not.toBeInTheDocument();
    const entry = screen.getByText(/Optimise images before publishing/);
    await user.click(entry);
    expect(screen.getByText(/970 KB to 39 KB/)).toBeVisible();
  });
});
