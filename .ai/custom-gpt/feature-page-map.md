# Feature And Page Mapping Knowledge

Use this file as uploaded Knowledge for the HoReCa Web Art Work Custom GPT.

## Main Rule

Do not tell a coding agent to remove pages chaotically. First map the researched business
category to template feature/page groups. For every feature group, state whether to keep,
adapt, or remove it, with a short reason.

When removing a feature, tell the coding agent to remove or update connected routes, list/detail
pages, data files, i18n files, SEO keys, navigation links, and references as one group.

## Feature Groups

- `company`: core business profile for every site. It drives SEO metadata, structured data,
  contact details, logo, and social identity.
- `dish`: `menu`, `dish/:slug`, dish data, dish category data, dish i18n.
- `product`: `products`, `product/:slug`, product data, product i18n.
- `room`: `rooms`, `room/:slug`, room data, room i18n.
- `spa`: spa page and spa data/i18n.
- `event`: `events`, `event/:slug`, event data, event i18n.
- `discount` / `loyalty`: discounts, discount detail, loyalty, offer data/i18n.
- `article`: articles, article detail, article data/i18n.
- `review`: reviews, review detail, review data/i18n.
- `job` / `profile`: jobs, job detail, team, profile detail, related data/i18n.
- `quest` / `question` / `rule`: activity, FAQ, policy, or venue-rule pages.

## Category Defaults

Restaurants, cafes, bars with food, bakeries, catering, delivery food, and hotel restaurants:
- usually keep `dish` / menu pages
- usually keep home, about, gallery, reviews/socials, contact-oriented surfaces
- keep events/offers only when real or useful
- remove `room` unless the business sells accommodation or distinct bookable/private rooms

Hotels and accommodation:
- usually keep `room`
- keep gallery, about, reviews, contact-oriented surfaces
- keep spa only when real
- keep menu/dish only for a real restaurant, breakfast, room service, or food offer

Spa and wellness venues:
- usually keep `spa`
- keep gallery, about, reviews, contact-oriented surfaces
- keep products/offers only when real
- remove rooms unless accommodation or rentable rooms are real

Event venues, banquet halls, and catering:
- usually keep `event`
- keep gallery, about, reviews, contacts
- keep menu or products only if offers are concrete

Retail food, bakery shop, packaged goods, or purchasable services:
- usually keep `product` or `dish` depending on how items are presented
- keep gallery, about, socials, contacts, offers when real

Entertainment, quests, activities, FAQ-heavy venues, or venues with strict visitor rules:
- keep `quest`, `question`, or `rule` only when they fit the real business
- do not keep quest-style pages for a typical restaurant unless the business offers such activities

Articles, jobs, team, and profiles:
- keep only when news, stories, hiring, staff presentation, or people pages are useful.
- remove for a simple brochure site with no content plan.
