# SEO Guide

## Purpose

This website should be easy for search engines to understand and useful for local business discovery.

## Core SEO Rules

- every page should have a clear unique title
- every page should have a meaningful description
- keep headings structured and readable
- use semantic HTML where possible
- keep important business information in crawlable text, not only in images

## Local SEO

Where relevant, include:
- business name
- city / area
- address
- phone
- hours
- cuisine / service type
- reservation, delivery, or event keywords only when truthful

## Content Rules

- write naturally for users first
- avoid keyword stuffing
- keep page copy specific to the business
- make sure core selling points appear in real text
- do not bury important content below decorative sections

## Technical Direction

- keep routes clean
- preserve prerender compatibility
- avoid content that appears only after unnecessary client-side logic
- ensure internal links are easy to follow
- update `src/index.html` static metadata when adapting the site to a real business
- keep `src/data/company.json` `siteUrl`, canonical URLs, Open Graph URLs, and `CNAME` aligned with the target domain
- write `CNAME` as the bare domain only, without `https://` or a path

## Static Metadata

The runtime SEO services use company/page data, but crawlers and link previews may still read
the static shell before Angular runs. When the business changes, update:
- `<html lang>`
- `<title>`
- meta description, keywords, author, robots
- itemprop name, description, image
- Open Graph site name, locale, URL, title, description, image
- Twitter title, description, image
- canonical link
- favicon/logo references if the asset changes

## Page Intent

Each page should serve one clear search/user intent:
- home -> brand and overview
- menu -> dishes and categories
- contacts -> reach and location
- events -> private events / catering / banquet information
