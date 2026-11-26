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
| Home title length | fixed, pending deploy | 75 → 68 characters: "Windshield replacement in Lafayette & New Orleans · Geaux Auto Glass" |
| Business schema: services | fixed, pending deploy | `hasOfferCatalog` with the six services from the Services page |
| Business schema: map, photo | fixed, pending deploy | `hasMap` to the Lafayette Google link; `image` is now a photo, the logo stays as `logo` |
| Kenner shop linked to the business | fixed, pending deploy | Kenner `AutoRepair` gets `@id …/pages/new-orleans#location` and `parentOrganization` by `@id` |
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

## Changes (branch `seo-geo-pass-2026-11-26`, commit `5decd29`, not deployed)

- `config/settings_schema.json`, `config/settings_data.json`: home title setting
  shortened; new **Services offered** setting under Search and local SEO.
- `snippets/structured-data.liquid`: `hasOfferCatalog`, `hasMap`, photo `image`.
- `sections/location-detail.liquid`: `@id`, `hasMap` and `parentOrganization` by `@id`
  on the Kenner block.

Checks run: Theme Check 0 errors; `validate.py` OK; local render of home and the
location template with valid JSON-LD.

## Proposed content changes (biggest remaining wins)

| # | Page | Change | Why |
|---|---|---|---|
| 1 | New pages | One page per core service: **Windshield replacement**, **Chip repair**, **ADAS recalibration** (later back glass, door glass). Each: an answer-first opening paragraph, the cities served, how insurance works, 3-5 FAQs, quote and call buttons | Today every service is a few words on one page, so nothing can rank for "windshield replacement Lafayette" or "ADAS calibration Lafayette" beyond the homepage. This is the largest gap |
| 2 | `/pages/services` | H1 "Auto glass repair and replacement in Lafayette and New Orleans." (now "Repairs and replacements.") | Names the service and place (carried over) |
| 3 | Lafayette, New Orleans, Locations | 3-4 local FAQs each (areas covered by mobile service, parking/drop-off, hours, same-day availability) | These pages have no question headings; AI answers about "auto glass near Kenner" pull from exactly this |
| 4 | FAQ | Answer the two open questions: typical replacement cost range, and how long before the car can be driven | The most-asked questions in this category; AI answers quote numbers |
| 5 | Shopify admin | Unpublish the "Home page" collection from the Online Store, or rename it | Removes a thin orphan page from the sitemap |

## Your to-do list

1. **App embed**: Theme editor > App embeds > turn off "AB : Google Analytics" (see above).
2. **GA4**: Admin > Events > mark `call_click` and `quote_click` as key events.
3. **Search Console**: submit `https://geauxautoglass.net/sitemap.xml` if not done; after
   this deploys, request indexing for `/`.
4. **Bing Webmaster Tools**: import from Search Console. Bing feeds Copilot and ChatGPT search.
5. **Google Business Profile**: put the real profile URL (the `g.page` or
   `maps.app.goo.gl` share link) in Theme settings > Google link, Lafayette, so
   `hasMap` points at the listing instead of a maps search. Same for Kenner.
6. **Reviews**: keep asking for Google reviews at both shops; review count and recency are
   the strongest local ranking signal the site cannot provide.

## Files

- `crawl.json`, `summary.md`: this crawl (baseline: `../after/crawl.json`)
