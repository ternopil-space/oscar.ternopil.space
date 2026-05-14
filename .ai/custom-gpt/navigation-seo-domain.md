# Navigation, SEO, And Domain Knowledge

Use this file as uploaded Knowledge for the HoReCa Web Art Work Custom GPT.

## Navigation And Layout

The header logo or business name must always link to the landing page route `/`.
Do not repurpose that click target.

The footer/bottom navigation is the compact primary navigation surface:
- first footer item stays `/navigation`
- the footer should contain `/navigation` plus four high-priority page links
- all other relevant pages should be reachable from the Navigation page
- if replacing a footer item, move the displaced still-relevant page link to the Navigation page
- if removing a page/feature that was in the footer, promote the most important remaining
  Navigation page item into the footer
- if a feature/page is removed entirely, remove its footer and Navigation page links together

Footer labels should remain short enough for the mobile layout.

## Company Data

The `company` feature handles most website identity:
- `src/data/company.json`
- `src/app/feature/company/company.data.ts`
- `src/app/feature/company/company.interface.ts`
- `src/app/feature/company/company.service.ts`

Tell the coding agent to update company data before duplicating business identity across pages.
Core values include business name, language/locale, site URL, logo, phone, email, address,
default SEO, page SEO, structured data, cuisine/service type, locality, country, and social links.

## Static Metadata

`src/index.html` is a static shell and is not fully derived from the company feature.
When adapting the template to a real business, tell the coding agent to update:
- `<html lang>`
- `<title>`
- meta description, keywords, author, robots
- itemprop name, description, image
- Open Graph type, site name, locale, URL, title, description, image
- Twitter card, title, description, image
- canonical link
- favicon/logo references if the asset changes
- theme color only when relevant to the redesign/theme

## Domain And CNAME

The target domain must be applied consistently:
- `src/data/company.json` `siteUrl`
- static canonical URL
- Open Graph URL
- any absolute structured-data/site URLs
- root `CNAME`

`CNAME` must contain the bare domain only, without protocol or path.

Examples:
- correct: `restaurant.example.com`
- incorrect: `https://restaurant.example.com`
- incorrect: `restaurant.example.com/`
