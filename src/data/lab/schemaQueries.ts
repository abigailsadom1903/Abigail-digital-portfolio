import type { Schema, SchemaForeignKey, SchemaTable } from './types';

export interface TableMatch {
  table: SchemaTable;
  /** Columns whose name matched the query (empty when only the table name matched). */
  matchedColumns: string[];
}

/** Distinct feature areas, in the order they first appear. */
export function modulesOf(schema: Schema): string[] {
  return [...new Set(schema.tables.map((t) => t.module))];
}

/**
 * Tables whose name, or any column name, contains the query (case-insensitive),
 * optionally limited to one feature area.
 */
export function searchTables(schema: Schema, query: string, module: string | null = null): TableMatch[] {
  const q = query.trim().toLowerCase();
  return schema.tables
    .filter((t) => module === null || t.module === module)
    .flatMap((table) => {
      if (q === '') return [{ table, matchedColumns: [] }];
      const matchedColumns = table.columns.filter((c) => c.name.toLowerCase().includes(q)).map((c) => c.name);
      return table.name.toLowerCase().includes(q) || matchedColumns.length > 0 ? [{ table, matchedColumns }] : [];
    });
}

export interface IncomingRelation {
  /** The table that holds the foreign key. */
  table: string;
  foreignKey: SchemaForeignKey;
}

/** Foreign keys in other tables that point at this table. */
export function incomingRelations(schema: Schema, tableName: string): IncomingRelation[] {
  return schema.tables.flatMap((t) =>
    t.foreignKeys.filter((fk) => fk.table === tableName).map((foreignKey) => ({ table: t.name, foreignKey })),
  );
}

/** Plain-language meaning of a delete rule, from the parent's point of view. */
export function describeDeleteRule(rule: string): string {
  switch (rule) {
    case 'CASCADE':
      return 'Deleted together with the parent';
    case 'SET NULL':
      return 'Kept; the reference is cleared';
    default:
      return 'Parent cannot be deleted while rows exist';
  }
}
