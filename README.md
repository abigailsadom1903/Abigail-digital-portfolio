# Abigail Sadom: Portfolio

Personal portfolio built with Vite, React and TypeScript. Static site: no backend.

## Commands

```bash
npm install       # once
npm run dev       # local dev server at http://localhost:5173
npm run build     # type-check (tsc) + production build into dist/
npm run preview   # serve the production build at http://localhost:4173
npm run lint      # oxlint
```

## Publishing

The site is hosted on GitHub Pages at https://abigailsadom1903.github.io/Abigail-digital-portfolio/
Every push to `main` rebuilds and republishes it automatically (see `.github/workflows/deploy.yml`).

To update the live site after editing:

```bash
git add -A
git commit -m "Describe what you changed"
git push
```

Progress is shown under the repository's **Actions** tab; the site updates about a minute later.

## Editing content

All content lives in typed files in `src/data/`. A `null` value or empty array renders a
clearly labelled **Placeholder** on the page, so fill in real, verified details only.

| What | File |
| --- | --- |
| Name, intro, CV link, contact links | `src/data/profile.ts` |
| Project case studies | `src/data/projects.ts` |
| Skills by category | `src/data/skills.ts` |
| Education and achievements | `src/data/education.ts` |

### CV
Put the PDF at `public/cv/Abigail-Sadom-CV.pdf`, then set `cvUrl: withBase('cv/Abigail-Sadom-CV.pdf')`.

### Screenshots
Export images (WebP or PNG, ~1600×1000) to `public/images/projects/`, then set each `media[].src` with `withBase`,
e.g. `withBase('images/projects/church-dashboard.webp')`, and write a meaningful `alt`.
**Church Management System screenshots must use sample data only.**

### Contact links
In `profile.ts`, set `href` (e.g. `'mailto:you@example.com'`, `'https://www.linkedin.com/in/…'`)
and an optional `display` text.

## Structure

```
src/
  styles/     tokens.css (design tokens), global.css (reset, base, focus, motion)
  data/       typed content
  components/ reusable UI: Container, Section, ButtonLink, Placeholder, TagList, CaseStudy, Navbar
  sections/   page sections: Hero, About, Work, Skills, Education, Contact, Footer
  hooks/      useActiveSection, useHideOnScroll, useReveal
```
