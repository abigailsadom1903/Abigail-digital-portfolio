// Usage: node scripts/types-to-json.mjs <path/to/SchoolFam/types.ts> [out.json]
// Converts SchoolFam's TypeScript interfaces into the Data Model Explorer format.
// Only type definitions are read; no application data.
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output = 'src/content/lab/schoolfam/model.json'] = process.argv.slice(2);
const src = readFileSync(input, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// SchoolFam naming conventions: an id field's name tells us which entity it points to.
const ID_REFERENCES = {
  studentId: 'Child',
  studentIds: 'Child',
  childId: 'Child',
  parentId: 'User',
  teacherId: 'User',
  userId: 'User',
  senderId: 'User',
  authorId: 'User',
  creatorId: 'User',
  assignedTo: 'User',
  participants: 'User',
  guardianId: 'Guardian',
  channelId: 'ChatChannel',
  classId: 'SchoolClass',
};

const MODULES = {
  'People & access': ['User', 'UserRole', 'ReferralCode', 'Guardian', 'Child', 'SimpleStudent'],
  Classroom: ['SchoolClass', 'Activity', 'Homework', 'AttendanceRecord', 'AbsenceRequest'],
  'Safety & health': ['PickupSession', 'HealthRecord', 'Incident'],
  Communication: ['ChatChannel', 'Message', 'Notification', 'Announcement', 'FeedbackTicket', 'FeedbackComment'],
  Calendar: ['SchoolEvent', 'EventAttendee'],
  'Payments & shop': ['Invoice', 'BankDetails', 'ShopItem', 'CartItem', 'ShopOrder'],
  Documents: ['SchoolDocument'],
};
const moduleOf = (n) => Object.entries(MODULES).find(([, names]) => names.includes(n))?.[0] ?? 'Other';

// Type aliases (e.g. type PickupStatus = 'pending' | ...) so field types can show their values.
const aliases = new Map();
for (const [, name, body] of src.matchAll(/export type (\w+)\s*=\s*([\s\S]*?);/g)) {
  aliases.set(name, body.replace(/\s+/g, ' ').replace(/^\| /, '').trim());
}
// Enums become entities whose fields are their members.
const enums = [...src.matchAll(/export enum (\w+)\s*\{([\s\S]*?)\}/g)].map(([, name, body]) => ({
  name,
  members: [...body.matchAll(/(\w+)\s*=\s*'([^']*)'/g)].map((m) => m[2]),
}));

const interfaceNames = [...src.matchAll(/export interface (\w+)/g)].map((m) => m[1]);
const knownTypes = new Set([...interfaceNames, ...enums.map((e) => e.name)]);

/** Body of an interface, respecting nested braces. */
function bodyAt(start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}' && --depth === 0) return src.slice(start + 1, i);
  }
  return '';
}

const tables = [];
for (const m of src.matchAll(/export interface (\w+)(?:\s+extends\s+(\w+))?\s*\{/g)) {
  const [, name, parent] = m;
  const body = bodyAt(m.index + m[0].length - 1);
  // Top-level fields only: drop nested object bodies after capturing them as "object".
  const flat = body.replace(/\{[^{}]*\}/g, 'object');
  const columns = [];
  const foreignKeys = [];
  for (const line of flat.split('\n')) {
    const f = line.match(/^\s*(\w+)(\?)?:\s*([^;]+);?/);
    if (!f) continue;
    const [, field, optional, rawType] = f;
    let type = rawType.replace(/\/\/.*$/, '').trim();
    const base = type.replace(/\[\]$/, '');
    if (aliases.has(base)) type = `${base} (${aliases.get(base)})${type.endsWith('[]') ? '[]' : ''}`;
    columns.push({ name: field, type, nullable: Boolean(optional), primaryKey: field === 'id', unique: false, autoIncrement: false });

    const target = ID_REFERENCES[field];
    if (target && target !== name) {
      foreignKeys.push({ column: field, table: target, references: 'id', relation: 'reference' });
    } else if (knownTypes.has(base) && base !== name) {
      foreignKeys.push({ column: field, table: base, references: '', relation: 'contains' });
    }
  }
  if (parent) foreignKeys.push({ column: '(extends)', table: parent, references: '', relation: 'extends' });
  tables.push({ name, module: moduleOf(name), columns, foreignKeys, uniqueKeys: [], indexes: [] });
}

for (const e of enums) {
  tables.push({
    name: e.name,
    module: moduleOf(e.name),
    columns: e.members.map((v) => ({ name: v, type: 'enum value', nullable: false, primaryKey: false, unique: true, autoIncrement: false })),
    foreignKeys: [],
    uniqueKeys: [],
    indexes: [],
  });
}

const order = Object.values(MODULES).flat();
tables.sort((a, b) => (order.indexOf(a.name) + 1 || 999) - (order.indexOf(b.name) + 1 || 999));

const result = {
  kind: 'typescript',
  source: 'types.ts (links are inferred from field names such as studentId)',
  tables,
};
writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log('entities', tables.length, 'fields', tables.reduce((n, t) => n + t.columns.length, 0),
  'links', tables.reduce((n, t) => n + t.foreignKeys.length, 0));
for (const t of tables) console.log(' ', t.module.padEnd(16), t.name.padEnd(16), t.columns.length, t.foreignKeys.map((f) => `${f.column}->${f.table}(${f.relation})`).join(' '));
