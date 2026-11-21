# SEO + GEO Report: geauxautoglass.net

2026-11-20 · Stack: Shopify theme (Online Store 2.0) · Pages crawled: 55 (55 indexable)

## Result

| | Before | After |
|---|---|---|
| Crawl score (rough, for comparison only) | 85 | pending deploy |
| Critical | 0 | pending deploy |
| High | 1 | pending deploy |
| Medium | 27 | pending deploy |
| Low | 86 | pending deploy |

The site launched in good technical shape: one canonical origin, valid sitemap and
robots.txt, self-referencing canonicals, server-rendered content, business schema on
every page, every image with alt text, no broken links, all 17 search and AI crawlers
allowed. The one serious gap is that **no Google Analytics or Tag Manager is installed
at all**. The theme fixes below are written and pass Theme Check, but are not committed
or deployed, so the After column is empty until they go live and the site is re-crawled.

## Status of the things that matter most

| Item | Status | Evidence |
|---|---|---|
| Indexable by Google (robots, noindex) | already fine | Googlebot allowed; no stray noindex |
| One canonical origin | already fine | http and www variants 301 to https://geauxautoglass.net. `http://www` takes two hops; Shopify controls this and it is harmless |
| Sitemap valid and declared in robots.txt | already fine | 53 URLs in 6 files, all 200 |
| Unique title on every indexable page | already fine | no duplicates; home title rewritten keyword-first |
| Description on every page | fixed, pending deploy | 6 pages had none; 39 product pages shared 6 descriptions; 44 were over length |
| Self-referencing canonicals | already fine | 55 of 55 |
| Open Graph image | fixed, pending deploy | 14 pages had no share image; product images were served over http |
| Structured data | fixed, pending deploy | AutoRepair + WebSite were valid; BreadcrumbList added to inner pages |
| Cart, search, account, 404 kept out of search | fixed, pending deploy | `/cart` was indexable |
| Internal links | already fine | 0 broken, 0 redirecting, 0 placeholders |
| GA4 / GTM | **needs owner** | Verified in a browser: no request to any Google domain; the store's pixel list holds only Shopify's two built-in pixels |
| Conversion events | needs owner | nothing to fire them until a tag exists |
| AI search crawlers allowed | already fine | all allowed; `/llms.txt` present (Shopify serves it) |
| Content present in raw HTML | already fine | home: 806 words raw vs 785 rendered |
| Core Web Vitals | not verified | PageSpeed Insights was not run in this pass |

## What was changed (uncommitted, on `main`)

- **Head template** `snippets/meta-tags.liquid`: every page now has `og:image` and
  `twitter:image`, from the page's own image, else a new **Share image** theme
  setting, else the bundled hero photo. Images are https.
- **Descriptions** `snippets/seo.liquid`: built from the page when the admin has
  none (contact, blog, collections, policies); products with no SEO description
  lead with their own name, type and price; everything is capped at 160 characters.
- **Indexability** `snippets/seo.liquid`: `noindex, follow` on cart, search, 404 and
  customer account templates.
- **Structured data** `snippets/structured-data.liquid`: BreadcrumbList on pages,
  products, collections, blog and articles, mirroring the visible crumbs.
- **Home metadata** `config/settings_schema.json`, `config/settings_data.json`:
  title is now "Mobile windshield replacement in Lafayette & New Orleans · Geaux Auto
  Glass" (the service and cities come first, where the old title spent them on the
  brand name); description cut from 211 to 157 characters.

Checks run: Theme Check 0 errors; local preview render of index, contact, cart,
product, collection and blog with valid JSON-LD on each. Full list per URL in
`metadata-map.md`.

## Still open

| Check | Pages | Why it is open | Next step |
|---|---|---|---|
| `tag-none` | site | No GA4 property ID is known | To-do 1 |
| `orphan-page` | `/pages/contact`, `/blogs/news`, `/collections/frontpage` | Nothing links to them | Proposals 1 and 6 |
| `description-duplicate` | 39 products | Theme fallback makes each one distinct, but the copy underneath is shared | Proposal 5 |
| `redirect-chain` | `http://www` | Shopify-managed | none |
| `sitemap-missing-page` | `/collections/all`, privacy policy | Shopify's sitemap omits them by design | none |

## Proposed content changes (not applied)

Visible copy is yours to approve. Answers below use only facts already on the site;
`[you]` marks what only the business can supply.

| # | Page | Change | Suggested text | Why |
|---|---|---|---|---|
| 1 | Footer | Add a **Contact** link | "Contact" to `/pages/contact` | The contact page is unreachable from any page |
| 2 | New page | Add a **Lafayette** location page from the existing location template | H1 "Mobile auto glass in Lafayette." with 409A Mecca Street, (337) 295-2874 and hours `[you]` | New Orleans has a location page with its own schema and hours; the main shop has none, so it has nothing to rank locally with |
| 3 | `/pages/services` | H1 | "Auto glass repair and replacement in Lafayette and New Orleans." | Current H1 "Repairs and replacements." names neither the service nor the place |
| 4 | `/pages/services`, `/pages/insurance` | Add an FAQ block (with FAQPage schema) | **Do you come to me?** Yes. Mobile service at your home or work is free, or we install in shop in Lafayette or Kenner. **How soon can you replace my windshield?** Same day or next day, by appointment. **Does insurance cover it?** Comprehensive coverage covers glass damage. We work with all insurance providers: call yours and give the name Geaux Auto Glass. **Do you recalibrate ADAS after a windshield replacement?** Yes, for cars, SUVs and trucks. **How much does a replacement cost?** `[you]` **How long until I can drive?** `[you]` | No page has a single question-shaped heading, and each service is described in about five words. This is the content AI answers and "people also ask" pull from |
| 5 | 14 tee products | Move the size chart below the product copy | n/a | The description Google shows starts "XS S M L XL 2XL Width, in 17.50…" |
| 6 | Shopify admin | Rename the collection titled "Home page" (or delete it), and title `/collections/all` "Merchandise" | n/a | Search results show "Home page · Geaux Auto Glass" and "Products · Geaux Auto Glass" |

## Your to-do list

1. **Google Analytics**: Shopify admin > Apps > install **Google & YouTube** and
   connect a GA4 property. It tracks storefront and checkout. Do not also paste a
   gtag snippet in the theme, which would double-count. Send me the `G-` ID
   afterwards and I will confirm one page view per load and add events for phone
   taps and quote-form clicks, which are the conversions that matter here.
2. **Search Console**: search.google.com/search-console > Add property > Domain >
   `geauxautoglass.net` > add the TXT record at the DNS provider. Then Sitemaps >
   submit `https://geauxautoglass.net/sitemap.xml`, and request indexing for `/`,
   `/pages/services`, `/pages/new-orleans`, `/pages/insurance`.
3. **Bing Webmaster Tools**: import from Search Console and submit the same sitemap.
   Bing's index feeds Copilot and ChatGPT search.
4. **Google Business Profile**: both listings should read exactly as the site does.
   Lafayette: Geaux Auto Glass, 409A Mecca Street, Lafayette, LA 70508, (337) 295-2874.
   Kenner: 2837 Tifton St Unit B, Kenner, LA 70062, (504) 920-3065.
5. **Share image**: Theme settings > Search and local SEO > Share image. Upload a
   1200 x 630 image with the logo; the hero photo is used until then.

## Not verified

- The fixes are not live. Nothing in the After column is claimed until deploy and re-crawl.
- Rich Results Test and PageSpeed Insights were not run.
- No form was submitted and no order placed; conversion tracking cannot be tested
  without a tag.

## Files

- `crawl.json`, `summary.md`: baseline crawl
- `metadata-map.md`: title, description and schema per URL after the fixes
