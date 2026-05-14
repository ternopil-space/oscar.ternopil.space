# Content And Page Patterns

## Purpose

This repo is for HoReCa business pages. Content should support real visitor needs quickly.

## Typical Pages

Common page types:
- home
- menu
- about
- contacts
- gallery
- delivery
- reservation
- events / banquets / catering
- loyalty / special offers

## Business Category Feature Mapping

Before removing pages from this template, map the business category to feature/page groups.
Treat list and detail pages, data files, i18n files, SEO keys, and navigation links as one
connected feature group.

Common mappings:
- restaurant / cafe / bar / bakery / catering: usually keep menu, dish detail, gallery, about, reviews, socials, events/offers when real
- hotel / accommodation: usually keep rooms and room detail, gallery, about, reviews, contacts, events/offers when real, spa only when real
- spa / wellness: usually keep spa, gallery, about, reviews, products/offers only when real
- event venue / banquet hall / catering: usually keep events, gallery, about, menu or products if offers are concrete, reviews, contacts
- retail food / bakery shop: usually keep products or menu depending on how items are presented, gallery, about, socials, offers when real

Feature/page groups:
- `company`: core business profile for every site
- `dish`: `menu`, `dish/:slug`, dish data, dish category data, dish i18n
- `product`: `products`, `product/:slug`, product data, product i18n
- `room`: `rooms`, `room/:slug`, room data, room i18n
- `spa`: spa page and spa data/i18n
- `event`: `events`, `event/:slug`, event data, event i18n
- `discount` / `loyalty`: discounts, discount detail, loyalty, offer data/i18n
- `article`: articles, article detail, article data/i18n
- `review`: reviews, review detail, review data/i18n
- `job` / `profile`: jobs, job detail, team, profile detail, related data/i18n
- `quest` / `question` / `rule`: activity, FAQ, and policy/rule pages when they fit the business

For a normal restaurant, cafe, or bar that does not sell accommodation or private rooms,
remove the `room` feature group instead of leaving generic rooms pages in place. For a hotel,
rooms are usually primary and should stay.

When a page is removed, remove or update its route, page component references, page title keys,
navigation links, data, translations, and SEO metadata together.

## Navigation Page And Footer

Keep the footer/bottom navigation focused:
- first footer item stays `/navigation`
- four remaining footer slots are the highest-priority pages for the business
- all other relevant pages belong on the Navigation page
- if a footer page is removed, promote the most important remaining Navigation page item into the footer
- if a footer page is still relevant but no longer primary, move it to the Navigation page

The header logo or business name always links to `/`.

## Home Page Priorities

A good home page usually makes these clear fast:
- what the place is
- what makes it special
- where it is
- how to contact it
- how to reserve or order
- what key products or experiences are offered

## Menu Page Rules

- make categories easy to scan
- keep names and prices readable
- show highlights or signatures clearly
- do not overcomplicate filters unless needed
- keep mobile readability high

## Contacts Page Rules

Important information should be easy to find:
- address
- phone
- working hours
- map/location
- reservation or booking action
- delivery details if relevant

## Gallery Rules

- prefer a small number of strong images over many weak ones
- use images that help users understand atmosphere, dishes, and interior
- keep gallery useful, not decorative noise

## Events / Banquets / Catering

If such pages exist, they should answer:
- what kinds of events are supported
- capacity or format
- what is included
- how to inquire or book

## CTA Principles

Strong CTA examples for HoReCa:
- reserve a table
- view menu
- call now
- order delivery
- ask about events

Keep CTAs visible and clear without being aggressive.

## Feature-Backed Pages

When a page is connected to a specific feature such as team, reviews, events, dishes, or similar content:
- take page data from the API first
- if the API returns no items for that feature, use `src/data/{featureName}s.json`
- do not mix API items with local fallback items
- show a loading state before content has finished loading
- show the standard empty-state pattern only after loading has completed and the resolved list is still empty
