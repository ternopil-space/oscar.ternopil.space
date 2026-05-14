# Task Execution Guide

## Purpose

This file helps agents and less experienced developers work consistently in this repo.

## Default Workflow

### 1. Understand The Request

Identify:
- which page or section is affected
- whether the task is content, layout, refactor, SEO, media, or structure
- whether the task is static-page work or truly needs logic

### 2. Load Only The Needed Guidance

Treat `AGENTS.md` as the source of repo-wide defaults, then load only the one or two `.ai` files that match the task.

Examples:
- page structure -> `content-pages.md`
- SEO task -> `seo.md`
- Tailwind or Angular structure -> `code-style.md` and `architecture.md`
- tool choice -> `tooling.md`

### 3. Inspect Before Editing

- inspect the nearest existing page or section
- check layout and route patterns
- check how Tailwind and SCSS are already used
- preserve existing visual language unless redesign is requested

### 4. Make The Smallest Effective Change

- keep the scope tight
- prefer page-local implementation
- do not add abstractions unless they clearly improve reuse
- keep prerender compatibility intact

### 5. Sync External Custom GPT Instructions

Check whether the task changed behavior that the external Custom GPT must know to generate
correct future implementation prompts.

Update `.ai/custom-gpt.md` and the relevant `.ai/custom-gpt/*.md` Knowledge file when the change affects:
- page or route inventory
- feature/page mapping rules
- navigation, header, footer, or layout rules
- SEO, `src/index.html`, company profile, domain, or `CNAME` behavior
- asset paths, media expectations, i18n behavior, Angular conventions, or verification steps
- durable guidance in `AGENTS.md`, `.ai/`, or `.ai/decisions/`

Keep `.ai/custom-gpt.md` below 8000 characters and put detailed context in `.ai/custom-gpt/*.md`.
Do not update the Custom GPT files for one-off content changes that do not affect how future
business-adaptation prompts should be generated.

### 6. Review The Result

Check that:
- the page stays simple and readable
- mobile layout still makes sense
- SEO-relevant content is still visible in text
- no unnecessary complexity was added
- `.ai/custom-gpt.md` and relevant `.ai/custom-gpt/*.md` files were updated when project behavior changed, or intentionally left alone for a task-specific change

### 7. Summarize Clearly

When done, summarize:
- what changed
- anything important to verify
- any follow-up worth noting
