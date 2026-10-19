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
  /** SQL schemas only. */
  onDelete?: DeleteRule;
  /** TypeScript models: how the link was found (by id-field name, nested type or `extends`). */
  relation?: 'reference' | 'contains' | 'extends';
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
  /** 'sql' (tables/columns) by default; 'typescript' for interface-based models (entities/fields). */
  kind?: 'sql' | 'typescript';
  source: string;
  tables: SchemaTable[];
}

// Testing Playground
export interface NavItemRule {
  id: string;
  label: string;
  /** Role names allowed to see the item, or "all". */
  roles: string[];
}

export interface RegistrationFixtures {
  /** IDs of staff profiles an admin has pre-created. */
  teacherIds: string[];
  referralCodes: { code: string; status: 'active' | 'used'; forRole: string }[];
  /** Student access codes on the class roster. */
  accessCodes: string[];
}

/** A study room's bookable window and its existing bookings, for availability scenarios. */
export interface AvailabilityFixtures {
  /** Dates as YYYY-MM-DD, times as HH:MM; empty dates mean no date limit. */
  room: { startDate: string; endDate: string; openTime: string; closeTime: string };
  bookings: { date: string; startTime: string; endTime: string; status: string }[];
}

export interface BookingRequest {
  date: string;
  startTime: string;
  endTime: string;
}

export type TestRule =
  | { kind: 'enum'; table: string; column: string; value: string }
  | { kind: 'unique'; table: string; existing: Record<string, string | number>; candidate: Record<string, string | number> }
  | { kind: 'onDelete'; table: string; column: string }
  | { kind: 'column'; table: string; column: string }
  | { kind: 'navAccess'; table: string; role: string; view: string }
  | { kind: 'registration'; table: string; role: 'TEACHER' | 'PARENT'; code: string; fixtures: RegistrationFixtures }
  | { kind: 'availability'; table: string; request: BookingRequest; fixtures: AvailabilityFixtures };

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
  /** Role-based navigation rules, for navAccess scenarios. */
  navigation?: NavItemRule[];
  scenarios: TestScenario[];
}

/** Everything the Lab shows for one project. */
export interface LabProject {
  id: string;
  name: string;
  /** One line shown under the project switcher. */
  blurb: string;
  architecture: Architecture;
  schema: Schema;
  testSuite: TestSuite;
  decisions: Decision[];
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
