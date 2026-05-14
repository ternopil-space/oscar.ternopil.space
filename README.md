# Angular Landing HeRoCa industry Template (SSR + Prerender)

Modern Angular 21 starter template for building fast landing pages with **SSR prerendering**, **TailwindCSS**, and **GitHub Pages deployment**.

This template is optimized for static landing sites where pages are rendered at **build time** for SEO and performance.

---

# Acknowledge

- Angular **21**
- **SSR prerendering** during build
- **Zoneless Angular**
- State used in HTML class bindings should be exposed as **signals**
- Prefer **Angular Signal Forms** as the primary forms approach when building new forms
- **OnPush change detection by default**
- **TailwindCSS v4**
- Use shared **theme CSS variables** from `src/styles/_theme.scss` for colors, surfaces, spacing, radius, and motion
- **GitHub Pages deployment**
- **Prettier formatting**
- Clean minimal project structure

The project builds both:

```
dist/app/browser
dist/app/server
```

But deployment uses the **browser prerendered output**, making it perfect for static hosting.

---

# Create a new project from this template

Clone the default repository into a new folder with your project name (replace `PROJECT_NAME` with your project name):

```bash
git clone https://github.com/IT-Kamianets/HoReCa.git PROJECT_NAME
cd PROJECT_NAME
npm i
npm run start
```

## What these commands do

- `git clone https://github.com/IT-Kamianets/HoReCa.git PROJECT_NAME`
  Downloads the template repository and creates a local folder named `PROJECT_NAME`.
- `cd PROJECT_NAME`
  Opens the newly created project folder.
- `npm i`
  Installs all project dependencies from `package.json`.
- `npm run start`
  Starts the local development server.

After that, open the local URL shown in the terminal, usually [http://localhost:4200](http://localhost:4200)

## Initialize your own git repository

If you want to start fresh instead of keeping the template git history, remove the existing `.git` folder, initialize a new repository, and create the first commit.

Example:

```bash
rm -rf .git
git init
git remote add origin https://github.com/IT-Kamianets/PROJECT_NAME.git
git add .
git commit -m "chore(init): bootstrap project from HoReCa template"
```

`git remote add origin ...` connects your local repository to the remote GitHub repository so future `git push` and `git pull` commands know where your main project lives.

Use a Conventional Commit message for the first commit as well. A good default is:

```text
chore(init): bootstrap project from HoReCa template
```

# Project Structure

```
src/
  app/
    app.component.ts
    app.config.ts
    app.config.server.ts
    app.routes.ts
    app.routes.server.ts
    layouts/
    pages/
  assets/
  environments/
  i18n/
  styles/
  styles.scss
```

SSR configuration lives in:

```
app.config.server.ts
app.routes.server.ts
```

---

# Development

Start the development server:

```
npm start
```

or

```
ng serve
```

Application runs at [http://localhost:4200](http://localhost:4200)

Development mode runs as a normal Angular SPA.

---

# Feature Data Flow

Most pages in this repository are static marketing pages. Keep simple content close to the page
unless the content is reused or the feature is backed by bootstrap/API data.

Feature-backed pages, such as dishes, articles, team profiles, events, jobs, reviews, rooms,
products, quests, exhibits, sales, or similar list-like content, must follow the same source
priority and page-state model.

## Bootstrap And Page States

Before bootstrap data has resolved, the feature is in a loading state. Pages should show loading UI
and must not show an empty state yet.

After bootstrap has resolved, a feature has three possible content states:

1. API/bootstrap data exists.
   Use the API data as the source of truth.
2. API/bootstrap data is missing, `null`, `undefined`, or an empty array.
   Use the matching local fallback file from `src/data/{featureName}s.json`.
3. API/bootstrap data and local fallback data are both empty.
   Show the standard empty state.

Do not merge API records with local fallback records. A feature should render either API data or
local fallback data, never a mixed list. Normalize records for typing and rendering when needed, but
keep the source choice clear.

Feature services should expose resolved content using this API-first, fallback-second behavior. Page
components should track whether loading has completed so templates can distinguish loading from a
true zero-data state.

Example service pattern:

```ts
import fallbackItems from '../../../data/items.json';

readonly loading = signal(true);
readonly items = signal<Item[]>([]);

resolveItems(apiItems?: Item[] | null): void {
	const resolvedItems = Array.isArray(apiItems) && apiItems.length > 0 ? apiItems : fallbackItems;

	this.items.set(resolvedItems);
	this.loading.set(false);
}
```

Example template pattern:

```html
@if (feature.loading()) {
	<!-- Loading skeleton or loading section -->
} @else if (feature.items().length > 0) {
	<!-- Render feature content -->
} @else {
	<!-- Standard empty state -->
}
```

---

# Build

Build the project:

```
npm run build
```

This generates:

```
dist/app/browser
dist/app/server
```

Pages are **prerendered at build time** using Angular SSR.

---

# Running the SSR server (optional)

The template includes a Node server for SSR:

```
npm run serve:ssr:app
```

This runs:

```
node dist/app/server/server.mjs
```

For most landing pages this is **not required**, because prerendered HTML is already generated.

---

# Prerender Configuration

Static marketing pages should be prerendered by default. Keep prerender configuration in:

```
src/app/app.routes.server.ts
```

Use `RenderMode.Prerender` for regular routes and keep a wildcard prerender route as the default
fallback:

```ts
export const serverRoutes: ServerRoute[] = [
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
```

When a route has dynamic segments, such as `dish/:slug` or `article/:slug`, add a route-specific
`getPrerenderParams()` entry that returns the known static params from local feature data. This keeps
dynamic-looking pages compatible with static hosting.

---

# TailwindCSS

Tailwind is configured via:

```
.postcssrc.json
```

Tailwind should be used as much as possible for everyday UI work.

Prefer Tailwind utilities for:

- layout
- spacing
- typography
- colors
- borders
- sizing
- responsive behavior

Use SCSS only when Tailwind is not the right tool, for example:

- component-specific complex styling
- shared design tokens and mixins
- advanced states or selectors
- small amounts of global styling

Global styles live in:

```
src/styles.scss
```

---

# Icons

This template includes **Material Symbols Outlined** and those should be used as the default icon set across the project.

Loaded in:

```
src/index.html
```

Use icons directly in HTML like this:

```html
<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

For accessible buttons, keep the icon decorative and provide a text label or `aria-label` on the button itself:

```html
<button type="button" aria-label="Open menu">
	<span class="material-symbols-outlined" aria-hidden="true">menu</span>
</button>
```

---

# Translations And Languages

UI translations live in:

```text
src/i18n/interface/<code>.json
```

Language metadata lives in:

```text
src/environments/environment.prod.ts
```

Translation bootstrap starts in:

```text
src/app/app.config.ts
```

The app uses the `@wawjs/ngx-translate` translation stack:

- `provideTranslate(...)` registers the default interface bundle from `/i18n/interface/`
- `TranslateDirective` and `TranslateService` are the default translation primitives
- English source text is used as the translation key, including content that comes from `src/data`

When adding or updating translations:

- add or update the matching `src/i18n/interface/<code>.json` dictionary
- update `environment.languages` when adding or renaming a supported language
- keep English source text identical across templates, components, and `src/i18n/*`
- store translation text and language labels as real UTF-8 characters, not escaped or re-encoded mojibake
- remove unused translation keys when they are no longer referenced anywhere in the app
- keep fallback content in `src/data` as plain source data, not duplicated localized maps

Supported usage patterns:

- Use the `translate` directive for plain element text content
- Use `TranslateDirective` for text and translated attributes
- Use `[translate]="{ placeholder: 'Placeholder text' }"` for directive-managed translated attributes
- Use `TranslateService.translate('Key')()` in TypeScript when the translated value is needed inside `computed()` or composed strings
- For dynamic API or fallback content, pass the real value to the directive, such as `[translate]="dish.name"`

Do not use:

- `TranslatePipe`; it is not available in the current `@wawjs/ngx-translate` package
- feature-specific `*.translations.json` files
- code-side translation maps for page or feature text
- helper methods that turn slugs, IDs, or other generated values into translation keys unless a task explicitly requires that behavior

Examples:

```html
<span translate>Open language menu</span>
<button
	translate
	[translate]="{ ariaLabel: 'Go to homepage' }"
	aria-label="Go to homepage"
	type="button"
></button>
<span [translate]="dish.name">{{ dish.name }}</span>
```

```ts
private readonly _translateService = inject(TranslateService);

protected readonly toggleLabel = computed(() =>
	this._translateService.translate('Switch to dark mode')(),
);
```

---

# SCSS Conventions

Use SCSS in a way that matches modern Angular defaults:

- Keep most styles inside the component `.scss` file.
- Use `src/styles.scss` only for truly global styles like resets, tokens, typography, and utility layers.
- Prefer CSS variables for colors, spacing, and theming that may change at runtime.
- Use SCSS features like `@use`, mixins, and partials for authoring convenience and shared design tokens.
- Avoid deep selector nesting. Keep selectors simple and local to the component.
- Avoid `::ng-deep` and `ViewEncapsulation.None` unless there is a clear integration reason.
- Prefer class bindings in templates over heavy inline style bindings.

Recommended split:

```text
src/styles.scss           -> global entry point
src/app/**/**/*.scss      -> component-local styles
src/styles/_theme.scss    -> shared theme CSS variables
```

---

# Environments

This template includes Angular environment files and they can be used for different runtime setups such as local development and production builds.

Available files:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Typical use cases:

- API base URLs
- feature flags
- analytics toggles
- external service configuration

Production builds replace `environment.ts` with `environment.prod.ts` through Angular file replacements.

Keep environment files limited to public front-end configuration. Do not store secrets in them.

---

# Deployment

Deployment is handled automatically via **GitHub Actions**.

Workflow:

```
.github/workflows/deploy.yml
```

Steps:

1. Install dependencies
2. Build Angular app
3. Copy `CNAME`
4. Push build output to `gh-pages`

The deployed folder is:

```
dist/app/browser
```

---

# Domain

Custom domain which you should adjust to your own domain so it works properly, any subdomain of `*.itkamianets.com` in case it's not used before on our github org.

```
ngx.itkamianets.com
```

Configured via:

```
CNAME
```

---

# Code Style

Formatting is handled by:

- `.editorconfig`
- `.prettierrc`

Key conventions:

- **tabs**
- **single quotes**
- **100 character line width**

---

# AI Usage

If you use AI outside the IDE and it does not automatically read repository instructions, copy the
contents of `AGENTS.md` into the AI prompt/context first.

This ensures the AI follows the same project-specific rules that Codex uses inside the IDE.

For business research and implementation-prompt generation, use the HoReCa Web Art Work Custom GPT:

```
https://chatgpt.com/g/g-6a04779f2e2481918bde1f0801eb6ed4-horeca-web-art-work
```

---

# NPM Scripts

Start development:

```
npm start
```

Build project:

```
npm run build
```

Run SSR server:

```
npm run serve:ssr:app
```

---

# Requirements

Recommended environment:

```
Node.js 20+
npm 11+
```

---

# Code structure guide

## Pages

Application pages should be created inside:

```text
src/app/pages/
```

Each page should have its own folder and its own component file.

Example:

```text
src/app/pages/home/home.component.ts
src/app/pages/about/about.component.ts
```

Generate a page component with Angular CLI:

```bash
ng generate component pages/home
```

or shorter:

```bash
ng g c pages/home
```

Pages should be lazy loaded from `src/app/app.routes.ts`.

Example route config:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
	},
];
```

---

## Feature structure for back-end connected modules

If a part of the app needs its own business logic and back-end integration, create a dedicated feature folder inside:

```text
src/app/feature/
```

Each feature should keep its own internal structure.

Example:

```text
src/app/feature/user/
src/app/feature/user/components/
src/app/feature/user/directives/
src/app/feature/user/interfaces/
src/app/feature/user/pages/
src/app/feature/user/pipes/
src/app/feature/user/services/
```

Example service location:

```text
src/app/feature/user/services/user.service.ts
```

Suggested CLI commands:

Create feature page:

```bash
ng g c feature/user/pages/user-profile
```

Create feature component:

```bash
ng g c feature/user/components/user-card
```

Create feature directive:

```bash
ng g d feature/user/directives/user-focus
```

Create feature pipe:

```bash
ng g p feature/user/pipes/user-name
```

Create feature service:

```bash
ng g s feature/user/services/user
```

Interfaces are usually created manually:

```text
src/app/feature/user/interfaces/user.interface.ts
src/app/feature/user/interfaces/user-response.interface.ts
```

For small focused features, colocated feature files are also valid when that structure keeps the
feature simpler.

Feature-backed list pages should also keep their static fallback data in:

```text
src/data/{featureName}s.json
```

Use that file only when bootstrap/API data for the feature is missing or empty. Do not merge fallback
items into API-provided lists.

---

## Generic shared code

Generic reusable code that is not tied to one specific feature can live directly under `src/app`.

Example shared folders:

```text
src/app/components/
src/app/directives/
src/app/interfaces/
src/app/pipes/
src/app/services/
```

Example shared pipe location:

```text
src/app/pipes/phone.pipe.ts
```

Suggested CLI commands:

Create shared component:

```bash
ng g c components/page-header
```

Create shared directive:

```bash
ng g d directives/autofocus
```

Create shared pipe:

```bash
ng g p pipes/phone
```

Create shared service:

```bash
ng g s services/api
```

Interfaces are usually created manually:

```text
src/app/interfaces/api-response.interface.ts
src/app/interfaces/select-option.interface.ts
```

---

## Development summary

Use these locations by default:

- `src/app/pages` - app-level lazy loaded pages
- `src/app/feature/<name>` - feature-specific code with back-end/business logic
- `src/app/components`, `directives`, `pipes`, `services`, `interfaces` - generic shared code

# License

MIT
