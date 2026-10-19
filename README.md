# Abigail Sadom: Portfolio

Personal portfolio built with Vite, React and TypeScript. Static site: no backend.

## Commands

```bash
npm install       # once
npm run dev       # local dev server at http://localhost:5173
npm run build     # type-check (tsc) + production build into dist/
npm run preview   # serve the production build at http://localhost:4173
npm run lint      # oxlint
npm test          # unit + component tests (Vitest, React Testing Library)
npm run test:e2e  # browser tests (Playwright, uses your installed Google Chrome)
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

### Netlify (optional)

The site can also be hosted on Netlify, which serves it at the root of its own address.
`netlify.toml` already holds the build settings. In Netlify: **Add new site → Import an existing
project → GitHub → Abigail-digital-portfolio**, keep the detected settings, and deploy. Netlify then
rebuilds on every push to `main`, including Pages CMS saves.

The URL path is set by the `BASE_PATH` environment variable (default `/`). The GitHub Pages
workflow sets it to `/Abigail-digital-portfolio/`; Netlify and local development use `/`.

## Editing content

**Easiest: Pages CMS.** Sign in at https://app.pagescms.org with GitHub, open this repository,
and edit with forms: Profile & About, Projects, Skills, Education, Experience & Awards.
Upload buttons handle the profile photo, CV (PDF), project screenshots and reports (PDF), and a certificate
and photo for each award, training programme or activity. Each save publishes automatically.
The forms are defined in `.pages.yml`.

**By hand:** the same content lives in JSON files in `src/content/`
(`profile.json`, `projects.json`, `skills.json`, `education.json`).
Uploaded files go in `public/images/`, `public/cv/`, `public/certificates/` and `public/reports/`; reference them as `/images/...`, `/cv/...`, `/certificates/...` or `/reports/...`.

Blank fields are hidden on the published site; when running locally (`npm run dev`) they show
as clearly labelled **Placeholders**. Fill in real, verified details only.
**Church Management System screenshots must use sample data only.**

## Engineering Lab

Interactive modules (architecture, data model, testing, decisions) for each project, with data in
`src/content/lab/<project>/`:

| File | What it holds |
| --- | --- |
| `architecture.json` | Components, layers and request flows |
| `model.json` | Generated data model (do not edit by hand) |
| `testing.json` | Test scenarios; each must pass against the real rules (checked by `npm test`) |
| `decisions.json` | Decision Journal entries; fill in `lessons` yourself |

`src/content/lab/portfolio-decisions.json` holds decisions about this site, shown for every project.

Regenerate the data models when the source changes (structure only; no data is copied):

```bash
npm run lab:schema -- ../../church-management-system/database/schema.sql
node scripts/types-to-json.mjs path/to/SchoolFam/types.ts
```

StudyUsia's model (`src/content/lab/studyusia/model.json`) comes from the `CREATE TABLE` statements in its
`DatabaseHelper.kt`. Its foreign keys carry no delete rule because the app's SQLite database does not enable them.

The Testing Playground runs scenarios in the browser against these rules and is labelled as a
simulation; it never connects to the real systems.

## Structure

```
src/
  styles/         tokens.css (design tokens), global.css (reset, base, focus, motion)
  content/        editable content (JSON, used by Pages CMS)
  content/lab/    Engineering Lab data per project
  data/           loaders that turn content into typed data
  data/lab/       Lab loaders, schema queries and the test engine
  components/     reusable UI: Container, Section, ButtonLink, Placeholder, ProjectList, ImageLightbox, Navbar
  components/lab/ Engineering Lab modules
  sections/       page sections: Hero, Work, Lab, About, Skills, Recognition (awards), Contact, Footer
  hooks/          useActiveSection, useHideOnScroll, useReveal
scripts/          generators for the Lab data models
e2e/              Playwright browser tests
```
