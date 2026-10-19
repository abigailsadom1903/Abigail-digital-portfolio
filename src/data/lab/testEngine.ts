import type { NavItemRule, RegistrationFixtures, Schema, SchemaTable, TestRule, TestScenario } from './types';

/*
 * Evaluates Testing Playground scenarios against an in-memory model of a
 * project's real rules: allowed values, unique keys and delete rules from a
 * database schema or type definitions, role-based navigation, and sign-up
 * checks. With `regression` on, the model "forgets" those rules, which is how
 * the playground demonstrates tests catching a defect.
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

export interface EngineContext {
  schema: Schema;
  navigation?: NavItemRule[];
}

export interface EngineOptions {
  regression?: boolean;
}

function findTable(schema: Schema, name: string): SchemaTable {
  const table = schema.tables.find((t) => t.name === name);
  if (!table) throw new Error(`Unknown table "${name}" in test scenario`);
  return table;
}

/**
 * Allowed values of a column or field type:
 * SQL "ENUM('a','b')" or TypeScript "'a' | 'b'" (optionally wrapped as "Alias ('a' | 'b')").
 */
export function enumValues(type: string): string[] {
  const isSqlEnum = /^ENUM\(/i.test(type);
  const isUnion = /'[^']*'\s*\|/.test(type);
  return isSqlEnum || isUnion ? [...type.matchAll(/'([^']*)'/g)].map((v) => v[1]) : [];
}

/** Every set of columns that must be unique: primary keys, UNIQUE columns and UNIQUE KEYs. */
export function uniqueColumnSets(table: SchemaTable): string[][] {
  const pk = table.columns.filter((c) => c.primaryKey).map((c) => c.name);
  return [
    ...(pk.length > 0 ? [pk] : []),
    ...table.columns.filter((c) => c.unique).map((c) => [c.name]),
    ...table.uniqueKeys.map((k) => k.columns),
  ];
}

/** Whether a role sees a navigation item. */
export function canSee(navigation: NavItemRule[], role: string, view: string): boolean {
  const item = navigation.find((n) => n.id === view);
  if (!item) throw new Error(`Unknown navigation item "${view}"`);
  return item.roles.includes('all') || item.roles.includes(role);
}

/**
 * SchoolFam's sign-up checks (App.tsx handleLogin):
 * teachers need a staff ID (case-insensitive) or an active invite for the teacher role;
 * parents need a student access code that exists on the roster.
 */
export function registrationAllowed(role: 'TEACHER' | 'PARENT', rawCode: string, f: RegistrationFixtures): boolean {
  const code = rawCode.trim();
  if (!code) return false;
  if (role === 'TEACHER') {
    if (f.teacherIds.some((id) => id.toUpperCase() === code.toUpperCase())) return true;
    return f.referralCodes.some((rc) => rc.code === code && rc.status === 'active' && rc.forRole === role);
  }
  return f.accessCodes.includes(code);
}

/** Human-readable text for an outcome code. */
export function describeOutcome(rule: TestRule, code: string): string {
  switch (rule.kind) {
    case 'enum':
      return code === 'accepted' ? `'${rule.value}' is accepted` : `'${rule.value}' is rejected (not an allowed value)`;
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
    case 'navAccess':
      return code === 'visible' ? `${rule.role.toLowerCase()} sees "${rule.view}"` : `"${rule.view}" is hidden from ${rule.role.toLowerCase()}`;
    case 'registration':
      return code === 'accepted' ? 'Sign-up is allowed' : 'Sign-up is refused';
  }
}

function evaluateRule(ctx: EngineContext, rule: TestRule, regression: boolean): string {
  switch (rule.kind) {
    case 'enum': {
      const column = findTable(ctx.schema, rule.table).columns.find((c) => c.name === rule.column);
      if (!column) throw new Error(`Unknown column ${rule.table}.${rule.column}`);
      return regression || enumValues(column.type).includes(rule.value) ? 'accepted' : 'rejected';
    }
    case 'unique': {
      if (regression) return 'accepted';
      const clash = uniqueColumnSets(findTable(ctx.schema, rule.table)).some(
        (cols) =>
          cols.every((c) => c in rule.existing && c in rule.candidate) &&
          cols.every((c) => String(rule.existing[c]) === String(rule.candidate[c])),
      );
      return clash ? 'rejected' : 'accepted';
    }
    case 'onDelete': {
      const fk = findTable(ctx.schema, rule.table).foreignKeys.find((f) => f.column === rule.column);
      if (!fk?.onDelete) throw new Error(`No foreign key with a delete rule on ${rule.table}.${rule.column}`);
      return regression ? 'CASCADE' : fk.onDelete;
    }
    case 'column': {
      const column = findTable(ctx.schema, rule.table).columns.find((c) => c.name === rule.column);
      if (!column) throw new Error(`Unknown column ${rule.table}.${rule.column}`);
      return column.unique && !regression ? `${column.type} unique` : column.type;
    }
    case 'navAccess': {
      if (!ctx.navigation) throw new Error('navAccess scenarios need a navigation list');
      return regression || canSee(ctx.navigation, rule.role, rule.view) ? 'visible' : 'hidden';
    }
    case 'registration':
      return regression || registrationAllowed(rule.role, rule.code, rule.fixtures) ? 'accepted' : 'rejected';
  }
}

export function runScenario(ctx: EngineContext, scenario: TestScenario, options: EngineOptions = {}): TestResult {
  const actualCode = evaluateRule(ctx, scenario.rule, options.regression ?? false);
  return {
    status: actualCode === scenario.expect ? 'passed' : 'failed',
    expected: { code: scenario.expect, text: describeOutcome(scenario.rule, scenario.expect) },
    actual: { code: actualCode, text: describeOutcome(scenario.rule, actualCode) },
  };
}
