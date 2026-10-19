/**
 * Turns a path inside /public into a URL that works under the site's base path
 * (the GitHub Pages repository folder). Full URLs are returned unchanged.
 *
 * withBase('/cv/Abigail-Sadom-CV.pdf') → '/Abigail-digital-portfolio/cv/Abigail-Sadom-CV.pdf'
 */
export function withBase(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}
