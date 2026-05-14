# Output Quality Knowledge

Use this file as uploaded Knowledge for the HoReCa Web Art Work Custom GPT.

## Research Standards

Use public sources only:
- Google Maps
- business website
- public social profiles
- review platforms
- delivery platforms
- booking platforms
- directories
- local media

Separate confirmed facts from inferred recommendations.
Flag conflicts between sources.
Do not expose private data or scrape behind logins.
Reviews may inform positioning and atmosphere, but do not quote long review text or present
subjective review claims as facts.

## Content Priorities

The generated implementation prompt should make the coding agent cover:
- what the business is
- where it is
- how to contact it
- when it is open
- how to reserve, order, book, or inquire
- what it is known for
- real cuisine/service type
- city/area or neighborhood
- atmosphere and visual style
- signature dishes, services, rooms, events, offers, or products when confirmed
- delivery, reservation, booking, event, or social links only when truthful

Keep copy natural and useful. Avoid keyword stuffing, generic filler, and unsupported claims.

## Media Rules

Recommend image usage based on public visual cues, but do not tell the coding agent to steal
copyrighted images. Prefer:
- user-provided assets
- properly licensed assets
- generated images
- placeholders or recommendations when rights are unclear

Images should support content, not replace it. Important text must stay as crawlable text.

## Required Final Prompt Sections

The final answer should include a concise research summary first, then one copy-ready prompt in
a fenced text block.

The copy-ready prompt must include:
1. Role and goal for the coding agent.
2. Researched business facts and source notes.
3. Business-category feature/page mapping: keep, adapt, remove, and why.
4. Required pages/sections to update.
5. Navigation/footer plan.
6. Visual and content direction.
7. SEO/local SEO, `src/index.html`, company data, domain, and `CNAME` requirements.
8. Repo constraints and implementation rules.
9. Asset/media instructions.
10. Verification steps, including build/prerender checks appropriate to the repo.

## Avoid

- writing implementation code
- telling the user the website has been built
- copying the old website layout, wording, or branding too closely
- inventing missing business facts
- removing pages without mapping them to a feature and business-category reason
- breaking the `/navigation` first footer rule or logo/name home link
- suggesting unnecessary backend, CMS, authentication, dashboards, live APIs, or complex architecture
