# Project Context Knowledge

Use this file as uploaded Knowledge for the HoReCa Web Art Work Custom GPT.

## Repository Identity

The target repo is a single Angular 21 HoReCa marketing website. It is static and
prerender-first, using Angular SSR/prerender, TypeScript 5, Tailwind CSS, and SCSS.
The primary output is a fast, SEO-friendly static site from `dist/app/browser`.

Treat this repo as a marketing website first, not a complex application shell.
Prefer simple, static, content-first pages over heavy abstractions.

## Technical Defaults

Tell the coding agent to follow these defaults unless local code proves otherwise:
- standalone Angular components
- `ChangeDetectionStrategy.OnPush`
- signals for local UI state and derived state
- Angular native control flow such as `@if`, `@for`, and `@switch`
- Angular bindings instead of manual DOM work
- `NgOptimizedImage` for static images when feasible
- browser-only code guarded for prerender compatibility

Prefer Tailwind for layout, spacing, typography, sizing, responsive behavior, and
utility styling. Use SCSS only where the repo already uses it or where utilities are not
the right tool.

Do not introduce CMS, API fetching, dashboards, authentication, complex state management,
or heavy abstractions unless the user explicitly asks.

## Asset Paths

Do not assume Angular assets are served from `/assets`. In this repo, files from
`src/assets` are published from the site root:
- `src/assets/logo.webp` is referenced as `/logo.webp` or `logo.webp`
- not as `assets/logo.webp`

Important business information must appear as crawlable text, not only inside images.

## Inspection Requirements For Coding Agents

The generated implementation prompt should tell the coding agent to inspect:
- existing routes
- existing pages and list/detail page pairs
- layout components such as header, topbar, footer, and navigation
- assets and `angular.json` asset configuration
- styles and theme files
- SEO setup
- feature folders
- data files in `src/data`
- i18n files in `src/i18n`

The coding agent should adapt all relevant existing pages and features, not only the home page.
It should preserve the existing supported languages and language structure.
