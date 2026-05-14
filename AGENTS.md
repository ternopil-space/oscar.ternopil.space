# Agent Guide

This repository contains a single Angular 21 website for a HoReCa business. It is a static, prerender-first marketing website with a few simple pages such as home, menu, about, contacts, gallery, reservation, delivery, or events.

## Quick Reference

- Stack: Angular 21, TypeScript 5, Angular SSR/prerender, Tailwind CSS, SCSS
- Package manager: `npm`
- Main goal: fast, clean, SEO-friendly HoReCa landing pages
- Primary output: prerendered static site from `dist/app/browser`

## Universal Rules

- Treat this repo as a marketing website first, not as a complex application shell.
- Prefer simple, static, content-first pages over heavy abstractions.
- Preserve prerender compatibility by default.
- Keep changes small, clear, and easy to review.
- Prefer Tailwind for layout, spacing, typography, sizing, responsive behavior, and utility styling.
- Use local page content/config over new services unless reuse is real and repeated.
- Do not introduce CMS, API fetching, dashboards, or heavy state management unless explicitly requested.

## Default Technical Stance

Use these as defaults unless the local code or the task gives a concrete reason to do otherwise:

- Angular 21 modern patterns only.
- Standalone components are the default. Do not add NgModules for new work.
- Use `changeDetection: ChangeDetectionStrategy.OnPush` on new or touched components.
- Use signals for local UI state and derived state.
- Prefer native control flow (`@if`, `@for`, `@switch`) in templates.
- Use Angular bindings instead of manual DOM work.
- Use `NgOptimizedImage` for static images when feasible.
- Keep browser-only code guarded so prerender remains safe.

## Asset Paths

- Do not assume Angular assets are served from `/assets`.
- Treat `src/assets` as a source folder, not a runtime URL.
- Check `angular.json` before answering questions or editing templates that reference static files.
- In this repo, files from `src/assets` are published from the site root, so `src/assets/logo.webp` is referenced as `/logo.webp` or `logo.webp`, not `assets/logo.webp`.

## Decision Memory

Durable repo-wide rules belong in `.ai/decisions/`, not duplicated ad hoc across docs or task notes.

Read `.ai/decisions/index.md` when:

- a task changes a long-lived repo convention
- a task resolves an ambiguity likely to come up again
- you are unsure whether a rule is temporary guidance or a durable policy

## Custom GPT Instructions Sync

`.ai/custom-gpt.md` is the paste-ready instruction source for the external Custom GPT used to
generate implementation prompts for this template. It must stay under the Custom GPT
Instructions field limit of 8000 characters.

Detailed Custom GPT knowledge files live in `.ai/custom-gpt/*.md` and are intended to be uploaded
to the Custom GPT Knowledge section.

When a task changes anything an external prompt-building GPT should know, update
`.ai/custom-gpt.md` and the relevant `.ai/custom-gpt/*.md` file in the same change. Examples include:
- routes, supported pages, feature/page mapping, or removal rules
- navigation, header, footer, layout, asset, SEO, domain, CNAME, or prerender behavior
- Angular, styling, i18n, media, company-profile, or verification expectations
- durable repo rules in `AGENTS.md`, `.ai/`, or `.ai/decisions/`

Keep `.ai/custom-gpt.md` as raw copy-paste content only. Do not wrap it in guide text,
Markdown fences, descriptions, or conversation starters. Put longer explanatory details in
`.ai/custom-gpt/*.md`.

## Read Only What You Need

Start here, then open only the one or two relevant files in `.ai/`:

- `.ai/onboarding.md`
- `.ai/architecture.md`
- `.ai/code-style.md`
- `.ai/content-pages.md`
- `.ai/seo.md`
- `.ai/media.md`
- `.ai/tooling.md`
- `.ai/task-execution.md`

Suggested loading order:

1. `AGENTS.md`
2. one or two relevant `.ai` guides
3. `.ai/decisions/index.md` only if the task may affect durable policy
