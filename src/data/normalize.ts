/*
 * Helpers for reading the JSON in src/content/, which is edited through Pages CMS.
 * The editor saves untouched fields as empty strings (or may omit them), so every
 * value is read defensively and blanks become `null` / `[]`, which the components
 * render as labelled placeholders.
 */

/** Trimmed text, or `null` when blank or missing. */
export function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

/** Non-blank strings from a list. */
export function texts(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter((v): v is string => v !== null) : [];
}

/** Items of a list that are objects. */
export function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null)
    : [];
}

/** URL-safe id from a title, e.g. "Web-Based Church System" → "web-based-church-system". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
