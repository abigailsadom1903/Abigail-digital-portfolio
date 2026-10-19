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

**Easiest: Pages CMS.** Sign in at https://app.pagescms.org with GitHub, open this repository,
and edit with forms: Profile & About, Projects, Skills, Education, Experience & Awards.
Upload buttons handle the profile photo, CV (PDF), project screenshots, and a certificate
and photo for each award, training programme or activity. Each save publishes automatically.
The forms are defined in `.pages.yml`.

**By hand:** the same content lives in JSON files in `src/content/`
(`profile.json`, `projects.json`, `skills.json`, `education.json`).
Uploaded files go in `public/images/`, `public/cv/` and `public/certificates/`; reference them as `/images/...`, `/cv/...` or `/certificates/...`.

Blank fields are hidden on the published site; when running locally (`npm run dev`) they show
as clearly labelled **Placeholders**. Fill in real, verified details only.
**Church Management System screenshots must use sample data only.**

## Structure

```
src/
  styles/     tokens.css (design tokens), global.css (reset, base, focus, motion)
  content/    editable content (JSON, used by Pages CMS)
  data/       loaders that turn content into typed data
  components/ reusable UI: Container, Section, ButtonLink, Placeholder, ProjectList, Navbar
  sections/   page sections: Hero, Work, About, Skills, Recognition (awards), Contact, Footer
  hooks/      useActiveSection, useHideOnScroll, useReveal
```
