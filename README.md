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
and edit with forms: Profile & About, Projects, Skills, Education & Achievements.
Upload buttons handle the profile photo, CV (PDF) and project screenshots. Each save
publishes automatically. The forms are defined in `.pages.yml`.

**By hand:** the same content lives in JSON files in `src/content/`
(`profile.json`, `projects.json`, `skills.json`, `education.json`).
Uploaded files go in `public/images/` and `public/cv/`; reference them as `/images/...` or `/cv/...`.

Blank fields render as a clearly labelled **Placeholder**, so fill in real, verified details only.
**Church Management System screenshots must use sample data only.**

## Structure

```
src/
  styles/     tokens.css (design tokens), global.css (reset, base, focus, motion)
  content/    editable content (JSON, used by Pages CMS)
  data/       loaders that turn content into typed data
  components/ reusable UI: Container, Section, ButtonLink, Placeholder, TagList, CaseStudy, Navbar
  sections/   page sections: Hero, About, Work, Skills, Education, Contact, Footer
  hooks/      useActiveSection, useHideOnScroll, useReveal
```
