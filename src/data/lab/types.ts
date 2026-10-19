/* Types for the Engineering Lab. Data lives in src/content/lab/*.json. */

// Architecture Explorer
export interface ArchLayer {
  id: string;
  label: string;
}

export interface ArchNode {
  id: string;
  layer: string;
  title: string;
  tech: string[];
  summary: string;
  details: string[];
  files: string[];
}

export interface ArchFlowStep {
  node: string;
  text: string;
}

export interface ArchFlow {
  id: string;
  title: string;
  steps: ArchFlowStep[];
}

export interface Architecture {
  system: string;
  note: string;
  layers: ArchLayer[];
  nodes: ArchNode[];
  flows: ArchFlow[];
}

// Data Model Explorer (generated from schema.sql by scripts/schema-to-json.mjs)
export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  autoIncrement: boolean;
}

export type DeleteRule = 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

export interface SchemaForeignKey {
  column: string;
  table: string;
  references: string;
  onDelete: DeleteRule;
}

export interface SchemaKey {
  name: string;
  columns: string[];
}

export interface SchemaTable {
  name: string;
  module: string;
  columns: SchemaColumn[];
  foreignKeys: SchemaForeignKey[];
  uniqueKeys: SchemaKey[];
  indexes: SchemaKey[];
}

export interface Schema {
  source: string;
  tables: SchemaTable[];
}

// Testing Playground
export type TestRule =
  | { kind: 'enum'; table: string; column: string; value: string }
  | { kind: 'unique'; table: string; existing: Record<string, string | number>; candidate: Record<string, string | number> }
  | { kind: 'onDelete'; table: string; column: string }
  | { kind: 'column'; table: string; column: string };

export interface TestScenario {
  id: string;
  title: string;
  area: string;
  type: string;
  steps: string[];
  rule: TestRule;
  /** Outcome code the test expects, e.g. "accepted", "RESTRICT" or "CHAR(64) unique". */
  expect: string;
}

export interface TestSuite {
  note: string;
  scenarios: TestScenario[];
}

// Engineering Decision Journal
export interface Decision {
  id: string;
  project: string;
  title: string;
  problem: string;
  alternatives: string[];
  decision: string;
  tradeoffs: string[];
  evidence: string[];
  /** Written by Abigail; blank until supplied. */
  lessons: string;
}
