import { Search } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { describeDeleteRule, incomingRelations, modulesOf, searchTables } from '../../data/lab/schemaQueries';
import type { Schema, SchemaForeignKey } from '../../data/lab/types';
import './DataModelExplorer.css';

interface DataModelExplorerProps {
  schema: Schema;
}

const SQL_TERMS = { things: 'tables', fields: 'columns', Field: 'Column', optional: 'Null', hint: 'e.g. status, email, donations' };
const TS_TERMS = { things: 'entities', fields: 'fields', Field: 'Field', optional: 'Optional', hint: 'e.g. status, studentId, Invoice' };

/** Short badge and explanation for a link between two tables or entities. */
function linkBadge(fk: SchemaForeignKey): { label: string; title: string } {
  switch (fk.relation) {
    case 'contains':
      return { label: 'HAS', title: `Contains ${fk.table} data` };
    case 'extends':
      return { label: 'EXT', title: `Extends ${fk.table}` };
    default:
      return { label: 'FK', title: `Refers to ${fk.table}` };
  }
}

function linkDescription(fk: SchemaForeignKey): string {
  if (fk.onDelete) return `On delete: ${fk.onDelete}. ${describeDeleteRule(fk.onDelete)}`;
  if (fk.relation === 'contains') return 'Nested data of this type';
  if (fk.relation === 'extends') return 'Inherits all of its fields';
  if (fk.relation === 'reference') return 'Refers by id (inferred from the field name)';
  return 'Foreign key with no delete rule';
}

/** Searchable view of a project's real data model with navigable relationships. */
export function DataModelExplorer({ schema }: DataModelExplorerProps) {
  const terms = schema.kind === 'typescript' ? TS_TERMS : SQL_TERMS;
  const [query, setQuery] = useState('');
  const [area, setArea] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState(schema.tables[0]?.name ?? '');
  const searchId = useId();
  const areaId = useId();

  const areas = useMemo(() => modulesOf(schema), [schema]);
  const matches = useMemo(() => searchTables(schema, query, area), [schema, query, area]);

  // Keep the detail view on a visible item: fall back to the first match.
  const selectedMatch = matches.find((m) => m.table.name === selectedName) ?? matches[0] ?? null;
  const selected = selectedMatch?.table ?? null;
  const incoming = selected ? incomingRelations(schema, selected.name) : [];
  const fkByColumn = new Map(selected?.foreignKeys.map((fk) => [fk.column, fk]));
  const uniqueCols = new Set(selected?.uniqueKeys.flatMap((k) => k.columns));

  const openTable = (name: string) => {
    // Relationships can point outside the current filter; clear it so the target is visible.
    if (!matches.some((m) => m.table.name === name)) {
      setQuery('');
      setArea(null);
    }
    setSelectedName(name);
  };

  const fieldCount = schema.tables.reduce((n, t) => n + t.columns.length, 0);

  return (
    <div className="dm">
      <div className="dm__controls">
        <div className="lab-field dm__search">
          <label htmlFor={searchId}>
            Search {terms.things} and {terms.fields}
          </label>
          <div className="lab-input-wrap">
            <Search size={16} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              value={query}
              placeholder={terms.hint}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="lab-field">
          <label htmlFor={areaId}>Feature area</label>
          <select id={areaId} value={area ?? ''} onChange={(e) => setArea(e.target.value || null)}>
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <p className="dm__count" aria-live="polite">
          {matches.length} of {schema.tables.length} {terms.things}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="lab-empty">
          <p>
            No {terms.things} or {terms.fields} match “{query}”{area ? ` in ${area}` : ''}.
          </p>
          <button
            type="button"
            className="lab-button"
            onClick={() => {
              setQuery('');
              setArea(null);
            }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="dm__layout">
          <ul className="dm__tables" role="list" aria-label={terms.things}>
            {matches.map(({ table, matchedColumns }) => (
              <li key={table.name}>
                <button
                  type="button"
                  className="dm__table-btn"
                  aria-pressed={table.name === selected?.name}
                  onClick={() => setSelectedName(table.name)}
                >
                  <span className="dm__table-name">{table.name}</span>
                  <span className="dm__table-meta">
                    {table.module} · {table.columns.length} {terms.fields}
                  </span>
                  {matchedColumns.length > 0 && (
                    <span className="dm__table-hit">Matches: {matchedColumns.join(', ')}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <article className="dm__detail" aria-labelledby="dm-table-title">
              <p className="lab-kicker">{selected.module}</p>
              <h4 id="dm-table-title" className="dm__title">
                {selected.name}
              </h4>

              <div className="dm__scroll" tabIndex={0} role="region" aria-label={`${terms.Field}s of ${selected.name}`}>
                <table className="dm__columns">
                  <thead>
                    <tr>
                      <th scope="col">{terms.Field}</th>
                      <th scope="col">Type</th>
                      <th scope="col">{terms.optional}</th>
                      <th scope="col">Keys</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.columns.map((col) => {
                      const fk = fkByColumn.get(col.name);
                      const badge = fk ? linkBadge(fk) : null;
                      const hit = selectedMatch?.matchedColumns.includes(col.name);
                      return (
                        <tr key={col.name} className={hit ? 'dm__row--hit' : undefined}>
                          <th scope="row">
                            <code>{col.name}</code>
                          </th>
                          <td>
                            <code className="dm__type">{col.type}</code>
                          </td>
                          <td>{col.nullable ? 'Yes' : 'No'}</td>
                          <td>
                            <span className="dm__keys">
                              {col.primaryKey && (
                                <abbr title={schema.kind === 'typescript' ? 'Identifier' : 'Primary key'} className="badge badge--pk">
                                  {schema.kind === 'typescript' ? 'ID' : 'PK'}
                                </abbr>
                              )}
                              {badge && (
                                <abbr title={badge.title} className="badge badge--fk">
                                  {badge.label}
                                </abbr>
                              )}
                              {schema.kind !== 'typescript' && (col.unique || uniqueCols.has(col.name)) && (
                                <abbr title="Unique, alone or with other columns" className="badge">
                                  UQ
                                </abbr>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="dm__relations">
                <div>
                  <h5 className="lab-subheading">References</h5>
                  {selected.foreignKeys.length === 0 ? (
                    <p className="dm__none">No outgoing relationships.</p>
                  ) : (
                    <ul className="dm__rel-list" role="list">
                      {selected.foreignKeys.map((fk) => (
                        <li key={fk.column}>
                          <code>{fk.column}</code> →{' '}
                          <button type="button" className="dm__link" onClick={() => openTable(fk.table)}>
                            {fk.table}
                          </button>
                          <span className="dm__rule">{linkDescription(fk)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h5 className="lab-subheading">Referenced by</h5>
                  {incoming.length === 0 ? (
                    <p className="dm__none">Nothing else points here.</p>
                  ) : (
                    <ul className="dm__rel-list" role="list">
                      {incoming.map(({ table, foreignKey }) => (
                        <li key={`${table}.${foreignKey.column}`}>
                          <button type="button" className="dm__link" onClick={() => openTable(table)}>
                            {table}
                          </button>
                          .<code>{foreignKey.column}</code>
                          {foreignKey.onDelete && <span className="dm__rule">On delete: {foreignKey.onDelete}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      )}

      <p className="lab-note">
        {schema.tables.length} {terms.things} and {fieldCount} {terms.fields}, generated from {schema.source}. Structure
        only: no records{schema.kind === 'typescript' ? '' : ', default values'} or credentials are included.
      </p>
    </div>
  );
}
