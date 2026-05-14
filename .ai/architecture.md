# Architecture Guide

Use this guide for code organization and data placement. Repo-wide defaults live in `AGENTS.md`.

## Project Direction

- prefer clear page composition over app-like architecture
- keep reuse practical, not abstract for its own sake

## Suggested Structure

Keep code predictable and easy to scan.

- pages: `src/app/pages/<page-name>/`
- layouts: `src/app/layouts/`
- shared UI/directives/pipes/interfaces/services: `src/app/<type>/`
- feature-specific logic only when truly needed: `src/app/feature/<feature-name>/`
- global theme tokens: `src/styles/_theme.scss`
- global styles entry: `src/styles.scss`

## Page Composition

Prefer section-based page composition.

Typical sections:
- hero
- highlights
- menu preview
- gallery
- about
- events or offers
- testimonials
- contact / map / CTA
- footer

Only extract shared sections when they are clearly reused across multiple pages.

## Routing And Prerender

- keep routes simple and crawlable
- do not assume browser-only APIs are available during build
- guard browser-specific code when necessary

## Data Strategy

For static business pages:
- prefer local constants or page-local configuration
- keep content close to the page unless reused
- avoid API/CMS integration unless explicitly required

## Company Profile And Static Shell

The `company` feature is the main source for business identity and SEO data:
- `src/data/company.json`
- `src/app/feature/company/company.data.ts`
- `src/app/feature/company/company.interface.ts`
- `src/app/feature/company/company.service.ts`

When adapting this template to a real business, update the company data before duplicating
business identity across pages.

`src/index.html` is still a static shell and is not fully derived from the company feature.
Update its static title, description, keywords, author, itemprop metadata, Open Graph metadata,
Twitter metadata, canonical URL, language, and image references when the business changes.

The root `CNAME` file belongs to deployment configuration and should contain the target domain
exactly, without protocol or path.

For feature-backed pages that do use bootstrap or API content:
- prefer API data first
- keep the local fallback in `src/data/{featureName}s.json`
- if the API field is missing or an empty array, use the local fallback data
- do not merge API items with fallback items unless a task explicitly asks for that behavior
