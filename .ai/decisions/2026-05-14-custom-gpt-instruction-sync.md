# Custom GPT Instruction Sync

- Status: accepted
- Date: 2026-05-14
- Area: agent workflow
- Owners: team
- Related tasks: keeping external Custom GPT prompts aligned with this Angular HoReCa template
- Related files: AGENTS.md, .ai/custom-gpt.md, .ai/custom-gpt/*.md, .ai/task-execution.md, .ai/onboarding.md
- Supersedes:
- Superseded by:

## Context

This repo uses `.ai/custom-gpt.md` as the paste-ready instruction source for an external Custom
GPT. The Custom GPT Instructions field has a strict character limit, so detailed supporting
context lives in `.ai/custom-gpt/*.md` files intended for upload to the Custom GPT Knowledge
section.

That GPT researches real HoReCa businesses and produces implementation prompts for coding
agents. If the Angular template changes but the Custom GPT instructions and Knowledge files do
not, future generated prompts can become stale and cause repeated implementation mistakes.

## Decision

Update `.ai/custom-gpt.md` and the relevant `.ai/custom-gpt/*.md` Knowledge file in the same
change whenever template behavior changes in a way the external Custom GPT should know.

Examples that require a sync:
- routes, supported page types, feature/page mapping, or page removal rules
- navigation, header, footer, layout, or asset conventions
- SEO, `src/index.html`, company profile, domain, `CNAME`, or prerender behavior
- Angular, Tailwind, i18n, media, or verification expectations
- durable repo guidance in `AGENTS.md`, `.ai/`, or `.ai/decisions/`

Do not update the Custom GPT instruction or Knowledge files for one-off business content, copy,
data, or styling changes that do not affect how future business-adaptation prompts should be
generated.

Keep `.ai/custom-gpt.md` as raw content for the Custom GPT Instructions field only. It must stay
below 8000 characters and should not include guide headings, Markdown fences, description text,
or conversation starters. Put longer details in `.ai/custom-gpt/*.md`.

## Consequences

- template-level changes require a quick Custom GPT instruction review before completion
- agents should mention in their final summary whether `.ai/custom-gpt.md` and the Knowledge files
  were updated when the task changed template behavior
- Custom GPT UI fields such as description and conversation starters can be managed separately,
  but `.ai/custom-gpt.md` remains the source for the Instructions field

## Alternatives Considered

Keeping Custom GPT instructions as a guide document was rejected because the user needs a file
that can be copied directly into the Custom GPT configuration UI.

Only relying on `AGENTS.md` was rejected because external GPT configuration is a separate
surface and needs an explicit sync rule.
