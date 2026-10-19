import type { Schema, SchemaTable, TestRule, TestScenario } from './types';

/*
 * Evaluates Testing Playground scenarios against an in-memory model of the
 * rules in the schema: ENUM values, unique keys and foreign-key delete rules.
 * With `regression` on, the model "forgets" those constraints, which is how the
 * playground demonstrates tests catching a defect.
 */

export interface Outcome {
  code: string;
  text: string;
}

export interface TestResult {
  status: 'passed' | 'failed';
  expected: Outcome;
  actual: Outcome;
}

export interface EngineOptions {
  regression?: boolean;
}

function findTable(schema: Schema, name: string): SchemaTable {
  const table = schema.tables.find((t) => t.name === name);
  if (!table) throw new Error(`Unknown table "${name}" in test scenario`);
  return table;
}

/** Values of an ENUM column type, e.g. "ENUM('a','b')" → ["a", "b"]. */
export function enumValues(type: string): string[] {
  const m = type.match(/^ENUM\((.*)\)$/i);
  return m ? [...m[1].matchAll(/'([^']*)'/g)].map((v) => v[1]) : [];
}

/** Every set of columns that must be unique: primary keys, UNIQUE columns and UNIQUE KEYs. */
export function uniqueColumnSets(table: SchemaTable): string[][] {
  const pk = table.columns.filter((c) => c.primaryKey).map((c) => c.name);
  const sets = [
    ...(pk.length > 0 ? [pk] : []),
    ...table.columns.filter((c) => c.unique).map((c) => [c.name]),
    ...table.uniqueKeys.map((k) => k.columns),
  ];
  return sets;
}

/** Human-readable text for an outcome code. */
export function describeOutcome(rule: TestRule, code: string): string {
  switch (rule.kind) {
    case 'enum':
      return code === 'accepted' ? `'${rule.value}' is accepted` : `'${rule.value}' is rejected (not an allowed status)`;
    case 'unique':
      return code === 'accepted' ? 'Row is accepted' : 'Row is rejected as a duplicate';
    case 'onDelete':
      return code === 'CASCADE'
        ? 'Related rows are deleted too (CASCADE)'
        : code === 'SET NULL'
          ? 'Related rows are kept; the reference is cleared (SET NULL)'
          : 'The delete is blocked (RESTRICT)';
    case 'column':
      return `Stored as ${code}`;
  }
}

function evaluateRule(schema: Schema, rule: TestRule, regression: boolean): string {
  const table = findTable(schema, rule.table);

  switch (rule.kind) {
    case 'enum': {
      const column = table.columns.find((c) => c.name === rule.column);
      const allowed = enumValues(column?.type ?? '');
      return regression || allowed.includes(rule.value) ? 'accepted' : 'rejected';
    }
    case 'unique': {
      if (regression) return 'accepted';
      const clash = uniqueColumnSets(table).some(
        (cols) =>
          cols.every((c) => c in rule.existing && c in rule.candidate) &&
          cols.every((c) => String(rule.existing[c]) === String(rule.candidate[c])),
      );
      return clash ? 'rejected' : 'accepted';
    }
    case 'onDelete': {
      const fk = table.foreignKeys.find((f) => f.column === rule.column);
      if (!fk) throw new Error(`No foreign key on ${rule.table}.${rule.column}`);
      return regression ? 'CASCADE' : fk.onDelete;
    }
    case 'column': {
      const column = table.columns.find((c) => c.name === rule.column);
      if (!column) throw new Error(`Unknown column ${rule.table}.${rule.column}`);
      return column.unique && !regression ? `${column.type} unique` : column.type;
    }
  }
}

export function runScenario(schema: Schema, scenario: TestScenario, options: EngineOptions = {}): TestResult {
  const actualCode = evaluateRule(schema, scenario.rule, options.regression ?? false);
  return {
    status: actualCode === scenario.expect ? 'passed' : 'failed',
    expected: { code: scenario.expect, text: describeOutcome(scenario.rule, scenario.expect) },
    actual: { code: actualCode, text: describeOutcome(scenario.rule, actualCode) },
  };
}
