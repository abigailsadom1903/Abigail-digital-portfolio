import { describe, expect, it } from 'vitest';
import { schema, testSuite } from './index';
import { enumValues, runScenario, uniqueColumnSets } from './testEngine';
import type { TestScenario } from './types';

describe('testEngine', () => {
  it('parses ENUM values from a column type', () => {
    expect(enumValues("ENUM('pending','approved','rejected')")).toEqual(['pending', 'approved', 'rejected']);
    expect(enumValues('VARCHAR(30)')).toEqual([]);
  });

  it('collects composite and column-level unique keys', () => {
    const slots = schema.tables.find((t) => t.name === 'confession_slots')!;
    expect(uniqueColumnSets(slots)).toContainEqual(['church_id', 'slot_date', 'slot_time']);
    const admin = schema.tables.find((t) => t.name === 'admin')!;
    expect(uniqueColumnSets(admin)).toContainEqual(['admin_email']);
  });

  it.each(testSuite.scenarios.map((s) => [s.id, s] as const))('scenario %s passes against the real schema', (_, scenario) => {
    expect(runScenario(schema, scenario).status).toBe('passed');
  });

  it('fails constraint scenarios when a regression is simulated', () => {
    const results = testSuite.scenarios.map((s) => runScenario(schema, s, { regression: true }));
    const failed = results.filter((r) => r.status === 'failed');
    expect(failed.length).toBeGreaterThan(0);
    // Scenarios that expect a row to be accepted keep passing: the regression only removes protections.
    for (const [i, s] of testSuite.scenarios.entries()) {
      if (s.expect === 'accepted') expect(results[i].status).toBe('passed');
    }
  });

  it('reports expected and actual outcomes in plain language', () => {
    const scenario: TestScenario = {
      id: 'X',
      title: 'x',
      area: 'x',
      type: 'x',
      steps: [],
      rule: { kind: 'enum', table: 'donations', column: 'status', value: 'refunded' },
      expect: 'accepted',
    };
    const result = runScenario(schema, scenario);
    expect(result.status).toBe('failed');
    expect(result.actual.text).toMatch(/rejected/);
    expect(result.expected.text).toMatch(/accepted/);
  });

  it('throws for scenarios that reference unknown tables', () => {
    const scenario = { ...testSuite.scenarios[0], rule: { kind: 'enum', table: 'nope', column: 'x', value: 'y' } } as TestScenario;
    expect(() => runScenario(schema, scenario)).toThrow(/Unknown table/);
  });
});
