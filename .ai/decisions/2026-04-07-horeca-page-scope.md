# HoReCa Page Scope

- Status: accepted
- Date: 2026-04-07
- Area: content
- Owners: team
- Related tasks: reusable HoReCa page model for similar projects
- Related files: AGENTS.md, .ai/content-pages.md, src/app/app.routes.ts
- Supersedes:
- Superseded by:

## Context

This repository is not a generic company website. It targets HoReCa businesses, where visitors usually need to evaluate a place, its offers, its spaces, and its booking or contact options quickly. A reusable project template needs a durable decision about what page types these websites should normally cover.

## Decision

Treat this repository as a HoReCa website template and cover the business through a practical set of public-facing pages.

Typical page types for this category include:

- landing or home
- menu or catalog
- item detail pages such as a dish page
- gallery
- events, banquets, catering, or special formats
- sales, offers, or loyalty promotions
- articles, news, or stories
- reviews or testimonials
- jobs or careers
- socials or external community links
- contacts, reservation, delivery, or location pages when relevant
- rooms list and room detail pages when the business offers bookable or distinct rooms
- areas list and area detail pages when the business has named zones such as pools, terraces, bars, lounges, or kids areas

Use list and detail page pairs when a business entity needs both overview and individual presentation:

- menu -> dish
- rooms -> room
- areas -> area

Before deleting pages during a business adaptation, map the business category to feature/page groups:

- restaurants, cafes, bars, bakeries, catering, and delivery food usually need menu/dish pages
- hotels and accommodation usually need rooms/room detail pages
- normal restaurants, cafes, and bars do not need rooms/room detail pages unless they sell private rooms or distinct bookable spaces
- spa/wellness pages should stay only when the business has real spa or wellness services
- events pages should stay when the business hosts events, banquets, catering, workshops, tastings, or regular programming
- product pages should stay for retail-style catalogs, packaged goods, bakery shop items, merchandise, or purchasable services
- articles, jobs, team, quests, questions, and rules should stay only when they fit the real business and content plan

## Consequences

- new HoReCa projects based on this repo should start by mapping the business into these page types before inventing custom structures
- route planning should reflect real visitor questions such as what can I order, what spaces exist, what room fits my needs, and how do I book or contact the venue
- not every project needs every page type, but missing pages should be a product decision based on the business model, not an omission by default
- list and detail pages should stay content-first and prerender-friendly
- removing a feature means removing or updating its routes, page components, data, i18n, SEO metadata, and navigation links together

## Alternatives Considered

Using a generic small-business page model was rejected because it under-specifies common HoReCa needs such as menu detail, event formats, and physical spaces.

Treating pages like rooms and areas as ad hoc extras was rejected because they recur often enough in HoReCa projects to deserve first-class guidance.

## Notes

“Areas” means named business zones or experience spaces, for example pools, bars, terraces, halls, lounges, play zones, or spa sections.

This decision defines expected page coverage, not a strict sitemap. Each project should select the relevant subset based on the venue type.
