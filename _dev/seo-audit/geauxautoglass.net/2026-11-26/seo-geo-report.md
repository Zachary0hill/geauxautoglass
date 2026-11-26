# SEO + GEO Report: geauxautoglass.net (second pass)

2026-11-26 · Stack: Shopify theme · Pages crawled: 57 · Compared with the 2026-11-21 verification crawl

## Result

| | Nov 21 | Nov 26 |
|---|---|---|
| Crawl score (rough) | 89 | 92 |
| Critical | 0 | 0 |
| High | 1 (no Google tag) | 0 |
| Medium | 7 | 6 (all Shopify-managed or intended) |
| Low | 3 | 59 (57 are one false positive, below) |

Technical SEO is in good shape and stays that way: one canonical origin, valid sitemap
and robots.txt, unique titles and descriptions, self-canonicals, OG images on every page,
valid JSON-LD everywhere, FAQ schema on Services and Insurance, all 17 search and AI
crawlers allowed, content in raw HTML, `/llms.txt` present. Since the last pass, GA4 and
Search Console verification went live.

## Status

| Item | Status | Evidence |
|---|---|---|
| GA4 page views | verified | Browser: exactly one `page_view` per load to `G-JEP7GETPE7` on `/` and `/pages/services` |
| Phone-tap conversions | verified | Tapping the header number sent `call_click` (placement header, shop lafayette) to GA4 |
| Quote-click conversions | not tested | Same code path as `call_click` |
| Search Console verification tag | fixed (since last pass) | `gsc-verification-missing` closed |
| Home title length | fixed and verified | 75 → 68 characters: "Windshield replacement in Lafayette & New Orleans · Geaux Auto Glass" |
| Business schema: services | fixed and verified | `hasOfferCatalog` with the six services from the Services page |
| Business schema: map, photo | fixed and verified | `hasMap` to the Lafayette Google link; `image` is now a photo, the logo stays as `logo` |
| Kenner shop linked to the business | fixed and verified | Kenner `AutoRepair` gets `@id …/pages/new-orleans#location` and `parentOrganization` by `@id` |
| Core Web Vitals, Rich Results Test | not verified | Not run this pass |

## Findings that need no code

- **`tag-gtm-noscript` x57 is a false positive.** The theme loads the Google tag through
  gtag.js with Shopify consent, not a GTM container. A `<noscript>` iframe would bypass
  consent and adds nothing for a gtag install.
- **Two Google tag loaders on every page.** The theme's `snippets/google-analytics.liquid`
  (consent-aware, sends the lead events) and an app embed, "AB : Google Analytics"
  (`analytics-integration.onrender.com`), both configure `G-JEP7GETPE7`. Google
  de-duplicates today, so page views are not doubled, but the app copy ignores the
  ad-signals settings and any change to either can start double counting. Keep one:
  turn the app embed off in Theme editor > App embeds (recommended, since the theme copy
  carries the conversions), or remove the theme snippet and connect
  `_dev/analytics/ga4-lead-pixel.js`.
- Still open from last pass, unchanged: `/collections/frontpage` and `/blogs/news` are
  orphaned thin pages; `/collections/all` and the privacy policy are left out of
  Shopify's sitemap by design; `http://www` takes two hops (Shopify-managed); `/cart`
  is `noindex` on purpose.

## Changes (commit `5decd29`, merged to `main` and live)

- `config/settings_schema.json`, `config/settings_data.json`: home title setting
  shortened; new **Services offered** setting under Search and local SEO.
- `snippets/structured-data.liquid`: `hasOfferCatalog`, `hasMap`, photo `image`.
- `sections/location-detail.liquid`: `@id`, `hasMap` and `parentOrganization` by `@id`
  on the Kenner block.

Checks run: Theme Check 0 errors; `validate.py` OK; local render of home and the
location template with valid JSON-LD.

## Service pages (added the same day, live and verified)

| Page | Title | Words | FAQ | Schema |
|---|---|---|---|---|
| `/pages/windshield-replacement` | Windshield replacement in Lafayette & New Orleans · Geaux Auto Glass | 668 | 6 | AutoRepair, Service, BreadcrumbList, FAQPage |
| `/pages/chip-repair` | Windshield chip repair in Lafayette & New Orleans · Geaux Auto Glass | 637 | 5 | same |
| `/pages/adas-recalibration` | ADAS recalibration in Lafayette & New Orleans · Geaux Auto Glass | 574 | 5 | same |
| `/pages/back-glass-replacement` | Back glass replacement in Lafayette & New Orleans · Geaux Auto Glass | 641 | 5 | same |
| `/pages/door-glass-replacement` | Door glass replacement in Lafayette & New Orleans · Geaux Auto Glass | 631 | 5 | same |

- Templates `templates/page.service-{windshield,chip,adas}.json`: answer-first intro,
  how it works, insurers, FAQ, links to the other services, quote and call buttons.
  Copy uses only facts the site already states, plus general explanations of chip
  repair and ADAS. No prices, durations or warranties.
- Linked from the Services and home service cards (whole card clickable), the footer
  Services column, and the service lists on the Lafayette and New Orleans pages.
- Home title moved to "Auto glass repair in Lafayette & New Orleans · Geaux Auto Glass"
  (63 characters) so it no longer competes with the windshield replacement page.
- Pages created in Shopify admin with their own SEO title, description and template.
- Back glass and door glass pages added later the same day (`page.service-back-glass.json`,
  `page.service-door-glass.json`), linked the same way; verification crawl `glass-pages/`
  shows the same expected open items and nothing new.
- Verification crawl `service-pages/`: 0 broken links, 0 redirects. Expected open
  items: the three pages are not in Shopify's sitemap yet (it regenerates on its own,
  as it did for Lafayette); two titles are 68 characters.

## Proposed content changes (biggest remaining wins)

| # | Page | Change | Why |
|---|---|---|---|
| 1 (done) | New pages | Windshield replacement, chip repair, ADAS recalibration, back glass and door glass pages (above) | Nothing could rank for a single service beyond the homepage |
| 2 | `/pages/services` | H1 "Auto glass repair and replacement in Lafayette and New Orleans." (now "Repairs and replacements.") | Names the service and place (carried over) |
| 3 (done) | Lafayette, New Orleans, Locations | Local FAQs with FAQPage schema: 7 on Lafayette (address, hours, mobile service, timing, services, student discount, insurance), 6 on New Orleans, 4 on Locations (which shop, weekend hours, areas outside the two cities, appointments). Phone numbers are tap-to-call and tracked as `call_click` | These pages had no question headings |
| 4 | FAQ | Answer the two open questions: typical replacement cost range, and how long before the car can be driven | The most-asked questions in this category; AI answers quote numbers |
| 5 | Shopify admin | Unpublish the "Home page" collection from the Online Store, or rename it | Removes a thin orphan page from the sitemap |

## Your to-do list

1. ~~**App embed**: turn off "AB : Google Analytics".~~ Done in the theme editor on 2026-11-26.
2. **GA4**: Admin > Events > star `call_click` and `quote_click` as key events.
3. **Search Console**: submit `https://geauxautoglass.net/sitemap.xml` if not done, then
   URL inspection > Request indexing for `/`, `/pages/windshield-replacement`,
   `/pages/chip-repair`, `/pages/adas-recalibration`, `/pages/back-glass-replacement`
   and `/pages/door-glass-replacement`.
4. **Bing Webmaster Tools**: import from Search Console. Bing feeds Copilot and ChatGPT search.
5. **Google Business Profile**: put the real profile URL (the `g.page` or
   `maps.app.goo.gl` share link) in Theme settings > Google link, Lafayette, so
   `hasMap` points at the listing instead of a maps search. Same for Kenner.
6. **Reviews**: keep asking for Google reviews at both shops; review count and recency are
   the strongest local ranking signal the site cannot provide.

## Files

- `crawl.json`, `summary.md`: this crawl (baseline: `../after/crawl.json`)
- `after/crawl.json`, `after/summary.md`: verification crawl after deploy: 0 new issues; schema checked live on `/` and `/pages/new-orleans`. The 68-character title still trips the crawler's 60-character guideline (low); Google's cut-off is by width and this title fits
