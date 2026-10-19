/**
 * Turns a path inside /public into a URL that works under the site's base path
 * (the GitHub Pages repository folder). Use it for every CV, image or file link.
 *
 * withBase('cv/Abigail-Sadom-CV.pdf') → '/Abigail-digital-portfolio/cv/Abigail-Sadom-CV.pdf'
 */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
