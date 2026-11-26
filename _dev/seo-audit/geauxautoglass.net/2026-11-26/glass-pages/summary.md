# SEO + GEO crawl: https://geauxautoglass.net

Audited 2026-11-26 11:42:32. Score **92/100** (rough, for before/after only). Platform: Shopify.

Crawled 64 URLs: 62 HTML pages (200), 61 indexable, 1 redirects, 0 errors, 0 blocked by robots.txt.

| Severity | Issues |
|---|---|
| critical | 0 |
| high | 0 |
| medium | 11 |
| low | 67 |

## Compared with baseline (2026-11-26 11:20:15, score 92)

Fixed: **0**. Still open: **72**. New: **6**.

### New since baseline
- `sitemap-missing-page` x2
- `tag-gtm-noscript` x2
- `title-length` x2

## Site-level

| Item | Result |
|---|---|
| Canonical origin | https://geauxautoglass.net |
| http://geauxautoglass.net/ | [301] -> https://geauxautoglass.net/ |
| http://www.geauxautoglass.net/ | [301, 301] -> https://geauxautoglass.net/ |
| https://www.geauxautoglass.net/ | [301] -> https://geauxautoglass.net/ |
| robots.txt | ok; sitemaps declared: https://geauxautoglass.net/sitemap.xml |
| Sitemap | 55 URL(s) in 6 file(s) |
| Unknown URL status | 404 |
| llms.txt | present |
| Google tags in source | GA4: none; GTM: GTM-K9DMCLC8; Ads: none |
| Other tag loaders | Shopify web pixels |

### Crawler access (robots.txt, homepage)

| Crawler | Feeds | Access | Rule |
|---|---|---|---|
| Googlebot | Google Search and AI Overviews | allowed | inherits * |
| Bingbot | Bing, Copilot, and the index ChatGPT search leans on | allowed | inherits * |
| OAI-SearchBot | ChatGPT search results | allowed | inherits * |
| ChatGPT-User | ChatGPT fetching a page for a live question | allowed | inherits * |
| GPTBot | OpenAI model training | allowed | inherits * |
| Claude-SearchBot | Claude search results | allowed | inherits * |
| Claude-User | Claude fetching a page for a live question | allowed | inherits * |
| ClaudeBot | Anthropic model training | allowed | inherits * |
| PerplexityBot | Perplexity index | allowed | inherits * |
| Perplexity-User | Perplexity fetching a page for a live question | allowed | inherits * |
| Google-Extended | Gemini training/grounding control (no effect on Search) | allowed | inherits * |
| Applebot | Siri and Spotlight | allowed | inherits * |
| Applebot-Extended | Apple model training | allowed | inherits * |
| CCBot | Common Crawl, reused by many models | allowed | inherits * |
| meta-externalagent | Meta AI | allowed | inherits * |
| Amazonbot | Alexa / Amazon answers | allowed | inherits * |
| DuckAssistBot | DuckDuckGo AI answers | allowed | inherits * |

## Issues by check

### Medium

**`noindex`** x1: Page is noindex (verify this is intended). *Fix:* Remove if the page should rank.
- https://geauxautoglass.net/cart : noindex, follow

**`orphan-page`** x2: Sitemap URL has no internal links pointing to it. *Fix:* Link it from a relevant page or nav.
- https://geauxautoglass.net/collections/frontpage
- https://geauxautoglass.net/blogs/news

**`redirect-chain`** x1: A host variant takes more than one hop to reach the canonical origin. *Fix:* Collapse to a single 301.
- http://www.geauxautoglass.net/ : http://www.geauxautoglass.net/ -> https://www.geauxautoglass.net/ -> https://geauxautoglass.net/

**`sitemap-missing-page`** x7: Indexable page is not in the sitemap. *Fix:* Add it, or noindex/canonicalize it if it should not rank.
- https://geauxautoglass.net/collections/all
- https://geauxautoglass.net/pages/adas-recalibration
- https://geauxautoglass.net/pages/back-glass-replacement
- https://geauxautoglass.net/pages/chip-repair
- https://geauxautoglass.net/pages/door-glass-replacement
- https://geauxautoglass.net/pages/windshield-replacement
- https://geauxautoglass.net/policies/privacy-policy

### Low

**`link-generic-text`** x1: Links with generic anchor text (click here, read more). *Fix:* Say where the link goes.
- https://geauxautoglass.net/policies/privacy-policy : 3 link(s)

**`tag-gtm-noscript`** x62: GTM is missing its <noscript> iframe. *Fix:* Add the body snippet right after <body>.
- https://geauxautoglass.net/
- https://geauxautoglass.net/blogs/news
- https://geauxautoglass.net/cart
- https://geauxautoglass.net/collections/all
- https://geauxautoglass.net/collections/frontpage
- https://geauxautoglass.net/pages/adas-recalibration
- https://geauxautoglass.net/pages/back-glass-replacement
- https://geauxautoglass.net/pages/chip-repair
- https://geauxautoglass.net/pages/contact
- https://geauxautoglass.net/pages/data-sharing-opt-out
- https://geauxautoglass.net/pages/door-glass-replacement
- https://geauxautoglass.net/pages/enterprise-claims
- ...and 50 more (see crawl.json)

**`title-length`** x4: Title is very short or likely truncated. *Fix:* Aim for roughly 30-60 characters.
- https://geauxautoglass.net/pages/back-glass-replacement : 68 chars: Back glass replacement in Lafayette & New Orleans · Geaux Auto Glass
- https://geauxautoglass.net/pages/chip-repair : 68 chars: Windshield chip repair in Lafayette & New Orleans · Geaux Auto Glass
- https://geauxautoglass.net/pages/door-glass-replacement : 68 chars: Door glass replacement in Lafayette & New Orleans · Geaux Auto Glass
- https://geauxautoglass.net/pages/windshield-replacement : 68 chars: Windshield replacement in Lafayette & New Orleans · Geaux Auto Glass

## Pages

| URL | Title (len) | Desc len | H1 | Canonical | Schema | Words | Q-headings |
|---|---|---|---|---|---|---|---|
| / | Auto glass repair in Lafayette & New Orleans · Gea (63) | 157 | 1 | self | AdministrativeArea, AutoRepair, Offer, OfferCatalog, PostalA | 816 | 0 |
| /blogs/news | News · Geaux Auto Glass (23) | 128 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 194 | 0 |
| /cart | Your Shopping Cart · Geaux Auto Glass (37) | 157 | 1 | self, noindex | AdministrativeArea, AutoRepair, Offer, OfferCatalog, PostalA | 214 | 0 |
| /collections/all | Products · Geaux Auto Glass (27) | 113 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 428 | 0 |
| /collections/frontpage | Home page · Geaux Auto Glass (28) | 73 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 224 | 0 |
| /pages/adas-recalibration | ADAS recalibration in Lafayette & New Orleans · Ge (64) | 145 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 574 | 5 |
| /pages/back-glass-replacement | Back glass replacement in Lafayette & New Orleans  (68) | 149 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 641 | 5 |
| /pages/chip-repair | Windshield chip repair in Lafayette & New Orleans  (68) | 145 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 637 | 5 |
| /pages/contact | Contact · Geaux Auto Glass (26) | 157 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 217 | 0 |
| /pages/data-sharing-opt-out | Your Privacy Choices · Geaux Auto Glass (39) | 160 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 379 | 0 |
| /pages/door-glass-replacement | Door glass replacement in Lafayette & New Orleans  (68) | 145 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 631 | 5 |
| /pages/enterprise-claims | Enterprise claims · Geaux Auto Glass (36) | 144 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 248 | 0 |
| /pages/insurance | Insurance policy claims · Geaux Auto Glass (42) | 146 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 478 | 5 |
| /pages/lafayette | Auto glass in Lafayette · Geaux Auto Glass (42) | 160 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 267 | 0 |
| /pages/locations | Locations in Lafayette and New Orleans · Geaux Aut (57) | 154 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 273 | 0 |
| /pages/new-orleans | Auto glass in New Orleans and Kenner · Geaux Auto  (55) | 160 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 276 | 0 |
| /pages/reviews | Google reviews · Geaux Auto Glass (33) | 127 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 294 | 0 |
| /pages/services | Auto glass services · Geaux Auto Glass (38) | 160 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 537 | 8 |
| /pages/student-discount | Student discount · Geaux Auto Glass (35) | 149 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 236 | 0 |
| /pages/windshield-replacement | Windshield replacement in Lafayette & New Orleans  (68) | 147 | 1 | self | AdministrativeArea, Answer, AutoRepair, BreadcrumbList, FAQP | 668 | 6 |
| /policies/privacy-policy | Privacy policy · Geaux Auto Glass (33) | 115 | 1 | self | AdministrativeArea, AutoRepair, BreadcrumbList, ListItem, Of | 2756 | 0 |
| /products/cracked | Cracked · Geaux Auto Glass (26) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 404 | 0 |
| /products/geaux-auto-glass-block-edition | Geaux Auto Glass - Block Edition (32) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 541 | 0 |
| /products/geaux-auto-glass-checkered-edition | Geaux Auto Glass - Checkered Edition (36) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 548 | 0 |
| /products/geaux-auto-glass-collegiate-edition | Geaux Auto Glass - Collegiate Edition (37) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 548 | 0 |
| /products/geaux-auto-glass-collegiate-pink | Geaux Auto Glass - Collegiate Pink (34) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 508 | 0 |
| /products/geaux-auto-glass-cracked-edition | Geaux Auto Glass - Cracked Edition (34) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 601 | 0 |
| /products/geaux-auto-glass-crewneck-block-edition | Geaux Auto Glass Crewneck - Block Edition (41) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 508 | 0 |
| /products/geaux-auto-glass-crewneck-collegiate-edition | Geaux Auto Glass Crewneck - Collegiate Edition (46) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-crewneck-cracked-edition | Geaux Auto Glass Crewneck - Cracked Edition (43) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 503 | 0 |
| /products/geaux-auto-glass-crewneck-geometry-edition | Geaux Auto Glass Crewneck - Geometry Edition (44) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 508 | 0 |
| /products/geaux-auto-glass-crewneck-shop-edition | Geaux Auto Glass Crewneck - Shop Edition (40) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 508 | 0 |
| /products/geaux-auto-glass-crewneck-sports-car-edition | Geaux Auto Glass Crewneck - Sports Car Edition (46) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 509 | 0 |
| /products/geaux-auto-glass-crewneck-vintage-edition | Geaux Auto Glass Crewneck - Vintage Edition (43) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 501 | 0 |
| /products/geaux-auto-glass-crewneck-web-edition | Geaux Auto Glass Crewneck - Web Edition (39) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 503 | 0 |
| /products/geaux-auto-glass-drawing-edition | Geaux Auto Glass - Drawing Edition (34) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 548 | 0 |
| /products/geaux-auto-glass-geometry-edition | Geaux Auto Glass - Geometry Edition (35) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 548 | 0 |
| /products/geaux-auto-glass-grim-reaper-edition | Geaux Auto Glass - Grim Reaper Edition (38) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 563 | 0 |
| /products/geaux-auto-glass-hoodie-block-edition | Geaux Auto Glass Hoodie - Block Edition (39) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 505 | 0 |
| /products/geaux-auto-glass-hoodie-checkered-edition | Geaux Auto Glass Hoodie - Checkered Edition (43) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 510 | 0 |
| /products/geaux-auto-glass-hoodie-collegiate-edition | Geaux Auto Glass Hoodie - Collegiate Edition (44) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 507 | 0 |
| /products/geaux-auto-glass-hoodie-cracked-edition | Geaux Auto Glass Hoodie - Cracked Edition (41) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 505 | 0 |
| /products/geaux-auto-glass-hoodie-drawing-edition | Geaux Auto Glass Hoodie - Drawing Edition (41) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-hoodie-geometry-edition | Geaux Auto Glass Hoodie - Geometry Edition (42) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-hoodie-script-edition | Geaux Auto Glass Hoodie - Script Edition (40) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-hoodie-shop-edition | Geaux Auto Glass Hoodie - Shop Edition (38) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 510 | 0 |
| /products/geaux-auto-glass-hoodie-sports-car-edition | Geaux Auto Glass Hoodie - Sports Car Edition (44) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-hoodie-vintage-edition | Geaux Auto Glass Hoodie - Vintage Edition (41) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 506 | 0 |
| /products/geaux-auto-glass-hoodie-web-edition | Geaux Auto Glass Hoodie - Web Edition (37) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 510 | 0 |
| /products/geaux-auto-glass-palm-tree-edition | Geaux Auto Glass - Palm Tree Edition (36) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 559 | 0 |
| /products/geaux-auto-glass-palm-tree-edition-v2 | Geaux Auto Glass - Palm Tree Edition v2 (39) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 549 | 0 |
| /products/geaux-auto-glass-rope-hat | Geaux Auto Glass - Rope Hat (27) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 391 | 0 |
| /products/geaux-auto-glass-script-edition | Geaux Auto Glass - Script Edition (33) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 541 | 0 |
| /products/geaux-auto-glass-shop-edition | Geaux Auto Glass - Shop Edition (31) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 651 | 0 |
| /products/geaux-auto-glass-sports-car-edition | Geaux Auto Glass - Sports Car Edition (37) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 542 | 0 |
| /products/geaux-auto-glass-vintage-edition | Geaux Auto Glass - Vintage Edition (34) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 539 | 0 |
| /products/geaux-auto-glass-web-edition | Geaux Auto Glass - Web Edition (30) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 548 | 0 |
| /products/stay-fresh | Stay Fresh · Geaux Auto Glass (29) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 405 | 0 |
| /products/stay-fresh-block | Stay Fresh - Block · Geaux Auto Glass (37) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 407 | 0 |
| /products/stay-fresh-geometric | Stay Fresh - Geometric · Geaux Auto Glass (41) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 407 | 0 |
| /products/stay-fresh-sport | Stay Fresh - Sport · Geaux Auto Glass (37) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 407 | 0 |
| /products/stay-fresh-vintage | Stay Fresh - Vintage · Geaux Auto Glass (39) | 160 | 1 | self | AdministrativeArea, AutoRepair, Brand, BreadcrumbList, ListI | 405 | 0 |
