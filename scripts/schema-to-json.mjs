// Usage: npm run lab:schema -- <path/to/schema.sql>   (writes src/content/lab/schema.json)
// Extracts table structure only (names, types, nullability, keys, foreign keys).
// INSERT statements and DEFAULT values are ignored.
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output = 'src/content/lab/schema.json'] = process.argv.slice(2);
const sql = readFileSync(input, 'utf8')
  .replace(/--[^\n]*/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const modules = {
  'Accounts & access': ['admin', 'user', 'password_resets'],
  Churches: ['church_info', 'church_priests'],
  Communication: ['announcements', 'bulletins', 'newsletter_subscribers'],
  Events: ['events', 'event_registrations'],
  Sacraments: ['sacrament_applications', 'sacrament_schedules', 'confession_slots'],
  'Pastoral care': ['pastoral_requests', 'pastoral_services'],
  Catechesis: ['catechesis_programs', 'catechesis_enrolments', 'catechesis_attendance'],
  Donations: ['donations', 'weekly_collections'],
  'Site content': ['site_content', 'site_stats'],
};
const moduleOf = (t) => Object.entries(modules).find(([, ts]) => ts.includes(t))?.[0] ?? 'Other';

const tables = new Map();
const createRe = /CREATE TABLE(?: IF NOT EXISTS)?\s+`?(\w+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE[^;]*)?;/gi;
for (const [, name, body] of sql.matchAll(createRe)) {
  // Split on commas that are not inside parentheses.
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of body) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());

  const columns = [];
  const fks = [];
  const uniques = [];
  const indexes = [];
  let compositePk = null;
  for (const p of parts) {
    let m;
    if ((m = p.match(/^CONSTRAINT\s+\w+\s+FOREIGN KEY\s*\(\s*(\w+)\s*\)\s*REFERENCES\s+`?(\w+)`?\s*\(\s*(\w+)\s*\)(?:\s+ON DELETE\s+(CASCADE|SET NULL|RESTRICT|NO ACTION))?/i))) {
      fks.push({ column: m[1], table: m[2], references: m[3], onDelete: (m[4] ?? 'RESTRICT').toUpperCase() });
    } else if ((m = p.match(/^PRIMARY KEY\s*\(([^)]*)\)/i))) {
      compositePk = m[1].split(',').map((s) => s.trim().replace(/`/g, ''));
    } else if ((m = p.match(/^UNIQUE KEY\s+(\w+)\s*\(([^)]*)\)/i))) {
      uniques.push({ name: m[1], columns: m[2].split(',').map((s) => s.trim()) });
    } else if ((m = p.match(/^(?:INDEX|KEY)\s+(\w+)\s*\(([^)]*)\)/i))) {
      indexes.push({ name: m[1], columns: m[2].split(',').map((s) => s.trim()) });
    } else if ((m = p.match(/^`?(\w+)`?\s+(\w+(?:\([^)]*\))?(?:\s+UNSIGNED)?)(.*)$/is))) {
      const rest = m[3];
      columns.push({
        name: m[1],
        type: m[2].replace(/\s+/g, ' ').replace(/^\w+/, (w) => w.toUpperCase()).replace(/unsigned$/i, 'UNSIGNED'),
        nullable: !/NOT NULL/i.test(rest) && !/PRIMARY KEY/i.test(rest),
        primaryKey: /PRIMARY KEY/i.test(rest),
        unique: /\bUNIQUE\b/i.test(rest),
        autoIncrement: /AUTO_INCREMENT/i.test(rest),
      });
    }
  }
  if (compositePk) for (const c of columns) if (compositePk.includes(c.name)) c.primaryKey = true;
  tables.set(name, { name, module: moduleOf(name), columns, foreignKeys: fks, uniqueKeys: uniques, indexes });
}

// Foreign keys added later with ALTER TABLE ... ADD CONSTRAINT.
const alterFkRe = /ALTER TABLE\s+`?(\w+)`?\s+ADD CONSTRAINT\s+\w+\s+FOREIGN KEY\s*\(\s*(\w+)\s*\)\s*REFERENCES\s+`?(\w+)`?\s*\(\s*(\w+)\s*\)(?:\s+ON DELETE\s+(CASCADE|SET NULL|RESTRICT))?/gi;
for (const [, t, col, ref, refCol, del] of sql.matchAll(alterFkRe)) {
  tables.get(t)?.foreignKeys.push({ column: col, table: ref, references: refCol, onDelete: (del ?? 'RESTRICT').toUpperCase() });
}

const result = {
  source: 'database/schema.sql (structure only; no data, no default values)',
  tables: [...tables.values()],
};
writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log('tables', result.tables.length, 'columns', result.tables.reduce((n, t) => n + t.columns.length, 0),
  'fks', result.tables.reduce((n, t) => n + t.foreignKeys.length, 0));
for (const t of result.tables) console.log(' ', t.module.padEnd(18), t.name, t.columns.length, 'cols', t.foreignKeys.map((f) => `${f.column}->${f.table}`).join(' '));
