# Geaux Auto Glass site · build handoff

Generated 2026-11-17 from the finished static build "GeauxAutoGlass-site-rev-2026-11-17" (8 pages, 53 captures).
Target: Shopify Online Store 2.0 theme (Liquid, JSON templates, plain CSS and JS, no framework) for the client's existing store `geaux-auto-glass-merch.myshopify.com`.

## What this is
The marketing site for Geaux Auto Glass, a mobile auto glass company with shops in Lafayette and Kenner (New Orleans), Louisiana. Visitors are drivers with broken glass. The one job: get them to tap "Get a quote" or call, from any section, on a phone.

The design is done and approved as a working static site in `site/`. Your job is a port: turn that static site into a merchant-editable Shopify theme that renders the same pixels. The store already sells 41 merch products. The theme replaces the store's current theme and adds the service site around the catalog.

## How to read this package
- START-HERE.md: the kickoff prompt.
- HANDOFF.md: this spec. Read fully before writing code.
- screenshots/: look at every PNG before building its screen. The picture is the source of truth when prose and picture disagree.
  - `<page>--desktop-full.png` and `<page>--phone-full.png`: whole page at 1440 and 390 wide, captured with reduced motion so every reveal sits at rest.
  - `home-NN-<act>--desktop.png` and `--phone.png`: the homepage act by act with motion on. Copy inside the three pinned acts (hero, signature, locations) is scroll-cued and is missing from the full page captures. Use these for those acts.
  - `merchandise--filter-hoodies--desktop.png`: the filter in its pressed state.
- site/: the working static build. This replaces the usual `html/` and `source/` folders. Open `site/index.html` in a browser and scroll it. The CSS and JS here are production code: port them as theme assets, do not rewrite them. The HTML is the markup each section must output.
- tokens.json: every design token from the stylesheets, merged and grouped, plus breakpoints and control heights.
- pages.json: each page with its regions in order, the images it uses and its screenshot files.
- render-report.json: every capture with viewport, state and notes.
- data/merch-catalog-2026-11-17.json: snapshot of the store catalog used for the static merch grid. Reference only. The theme reads live products.
- spec/: REVISION-NOTES.md (asset drop-ins, open client questions) and the link to the client to-do list. HANDOFF.md wins where they differ.

## Target stack and conventions
- Shopify OS 2.0 theme. `layout/theme.liquid`, JSON templates, sections with schema and blocks, section groups for header and footer, `config/settings_schema.json`, `locales/en.default.json`.
- No build step. No framework. No new UI library. Plain CSS and vanilla JS as theme assets.
- Repo: none exists yet. Assumed name `geaux-auto-glass-theme`, theme files at the repo root so Shopify "Connect from GitHub" works on `main`.
- If `~/dev/zz-shopify-base` (ZZ Base) exists on the machine, take the commerce plumbing from it: product, cart, search, customers, gift card, password, 404. ZZ Base ships light motion only, so the scroll engine from this package is added on top. If ZZ Base is absent, write those templates fresh in this design's visual system.
- Port, do not parallel:
  - `site/scrollcraft.css` → `assets/scrollcraft.css` unchanged.
  - `site/styles.css` → `assets/theme.css` unchanged, then replace the hard-coded brand hexes in `:root` with theme settings (see Design tokens).
  - `site/scrollcraft.js`, `site/phone.js`, `site/main.js` → `assets/` unchanged except the two edits named under Interactions and motion.
  - `site/social-counts.js` is replaced by Liquid (see SocialBar).
- Class names stay exactly as in `site/`. The CSS depends on them.
- Every image has a section setting of type `image_picker`. When the setting is blank, fall back to the bundled file with `asset_url`, so a fresh install matches the screenshots with zero setup. Copy `site/assets/*` into `assets/` flat (Shopify has no asset subfolders): `carriers/geico.svg` → `carrier-geico.svg`, `illus/mark.svg` → `mark.svg`. Do not copy `assets/merch/`.
- Every string a merchant would edit is a setting with the approved copy as its default. Every repeated item is a block.
- `shopify theme check` passes with zero errors before each phase report.

## Screens and routes

| Source file | Screen | Route in the theme | Template | Kind | Captures |
|---|---|---|---|---|---|
| site/index.html | Home | `/` | `templates/index.json` | page, fluid, three pinned acts | `index--*-full.png`, `home-01` to `home-12` |
| site/services.html | Services | `/pages/services` | `templates/page.services.json` | page, fluid | `services--*-full.png` |
| site/insurance.html | Insurance policy claims | `/pages/insurance` | `templates/page.insurance.json` | page, fluid | `insurance--*-full.png` |
| site/enterprise.html | Enterprise claims | `/pages/enterprise-claims` | `templates/page.enterprise.json` | page, fluid | `enterprise--*-full.png` |
| site/student-discount.html | Student discount | `/pages/student-discount` | `templates/page.student-discount.json` | page, fluid | `student-discount--*-full.png` |
| site/reviews.html | Google reviews | `/pages/reviews` | `templates/page.reviews.json` | page, fluid | `reviews--*-full.png` |
| site/new-orleans.html | New Orleans location | `/pages/new-orleans` | `templates/page.location.json` | page, fluid | `new-orleans--*-full.png` |
| site/merchandise.html | Merchandise grid | `/collections/all` | `templates/collection.json` | page, fluid, product grid | `merchandise--*-full.png`, `merchandise--filter-hoodies--desktop.png` |
| not designed | Product | `/products/<handle>` | `templates/product.json` | page | none |
| not designed | Cart | `/cart` | `templates/cart.json` | page | none |

Link rewrites from the static build:

| Static href | Theme URL |
|---|---|
| `index.html`, `#top` | `{{ routes.root_url }}` |
| `index.html#services`, `#insurance`, `#visit` | `{{ routes.root_url }}#services` and so on. On the home template keep the bare `#id` so the smooth scroll in main.js runs |
| `services.html#windshield` and the five other anchors | `/pages/services#windshield`, `#chip`, `#back-glass`, `#adas`, `#door-glass`, `#commercial` |
| `insurance.html`, `enterprise.html`, `student-discount.html`, `reviews.html`, `new-orleans.html` | the page routes above |
| `merchandise.html` | `{{ routes.all_products_collection_url }}` |
| `https://geaux-auto-glass-merch.myshopify.com/` ("Shop apparel", "Shop the full store") | `{{ routes.all_products_collection_url }}`, same tab |
| `https://geaux-auto-glass-merch.myshopify.com/products/<handle>` | `{{ product.url }}`, same tab |

External URLs. Store each once in theme settings, never inline in sections:

| Setting id | Value |
|---|---|
| `quote_url` | `https://form.jotform.com/261553371340148` (cash customers. Every "Get a quote" control uses this) |
| `enterprise_form_url` | `https://form.jotform.com/262147078498166` |
| `enterprise_photo_url` | `https://form.jotform.com/262147742087158` |
| `phone_lafayette` | `(337) 295-2874`, `tel:+13372952874`, van format `337.295.2874` |
| `phone_new_orleans` | `(504) 920-3065`, `tel:+15049203065`, van format `504.920.3065` |
| `email` | `geauxautoglass@gmail.com` |
| `enterprise_email` | `erac1120@gmail.com` |
| `facebook_url` | `https://www.facebook.com/people/Geaux-Auto-Glass/61556908207858` |
| `instagram_url` | `https://www.instagram.com/geauxautoglass` |
| `tiktok_url` | `https://www.tiktok.com/@geauxautoglass` |
| `google_lafayette_url` | `https://www.google.com/maps/search/?api=1&query=Geaux+Auto+Glass+409A+Mecca+St+Lafayette+LA+70508` |
| `google_new_orleans_url` | `https://www.google.com/maps/search/?api=1&query=Geaux+Auto+Glass+2837+Tifton+St+Kenner+LA+70062` |

External links keep `target="_blank" rel="noopener"`.

## Design tokens
Full list in tokens.json. The ones to wire to `config/settings_schema.json` (color settings, defaults as shown) and output as CSS variables in `theme.liquid`:

- Surfaces: page `--sc-canvas #0a0a0b` · raised `--sc-surface #17171a` · white act `--gx-paper #ffffff` · off-white act `--gx-paper-2 #f7f7f7` · dark card on white `--gx-ink-dark #101012`.
- Text on dark: primary `--sc-ink #f7f7f7` · secondary `--sc-ink-soft #bdb7b7`.
- Text on white (`.paper` scope remaps the same variables): primary `#101012` · secondary `--gx-ink-mid #494949`.
- Accent: fill `--sc-accent #e20000` with `--sc-accent-ink #ffffff` on it · hover fill `--gx-red-deep #c90000` · red text on dark `--sc-accent-text #ff4545` · red text on white `#c90000`. Logo red `#ff0000` lives in the logo files only.
- Hairlines: `--sc-hairline` 12% ink, `--sc-hairline-strong` 22% ink (24% on white), via `color-mix`.
- Type: display "Archivo Black" 400, uppercase, tight leading (hero 0.92, headings 1.02 to 1.08). Text "Inter" 500 body, 700 bold. Fluid ramp `--sc-t-xs` to `--sc-t-4xl` in scrollcraft.css. Body 1rem to 1.125rem at 1.62 leading.
- Radii: 4px controls, 8px cards and photos, 14px glass panes and the before/after frame, 999px chips.
- Spacing: 4px base, `--sc-1` 0.25rem to `--sc-11` 12rem. Section rhythm `--sc-section clamp(4.5rem, 9vw, 11rem)`. Gutter `clamp(1.25rem, 5vw, 5.5rem)`. Max width 82rem.
- Control heights: buttons 50px min, every tap target 44px min, header 76px (64px phone, 56px compact phone), phone tab bar items 4.2rem.
- Motion: `--sc-ease-out cubic-bezier(0.23, 1, 0.32, 1)`, 160 / 240 / 420ms.

Fonts load from Google Fonts in the static build: `Archivo+Black` and `Inter:wght@500;700`. Keep that link in `theme.liquid` with the two preconnects. One rule asks for weight 600 (`.soc__label`) and only 500 and 700 load. Leave it.

Thin weights are banned in this brand. Nothing under 500 for text.

## Component inventory
Each entry is a section or snippet. "Markup" names where to copy the HTML from.

### layout/theme.liquid
- Purpose: shell. Head, progress bar, header group, main, footer group, scripts.
- Anatomy: `<span data-sc-progress>` first in body, `{% sections 'header-group' %}`, `<main id="top">{{ content_for_layout }}</main>`, `{% sections 'footer-group' %}`, then scripts in this exact order: `scrollcraft.js`, `phone.js`, inline `ScrollCraft.mount(document.body);`, `main.js`. All non-deferred at the end of body. phone.js must run before mount.
- Variants: `<body class="page-sub">` on every template except `index`. That class gives the header a solid ground from the top of the page.
- Markup: `site/index.html` head and body frame.

### Header (`sections/header.liquid`, in header-group)
- Purpose: fixed top bar on desktop, fixed bottom tab bar on phones.
- Anatomy desktop, left to right: logo (`logo.png`, 38px tall) · nav · phone number · "Get a quote" button. Phone: compact logo only at top (`logo-compact.png`, 26px), plus `.tabbar` at the bottom with Call · Get a quote (red, 1.5fr) · Visit.
- Settings: logo images, menu (`link_list`, default handle `main-menu`), phone, CTA label and url.
- Nav items, in order: Enterprise (Enterprise form, new tab) · Services (`/#services`) · Insurance (`/#insurance`) · Merchandise (all products) · Locations (`/#visit`). Create this menu in the store.
- States: transparent over the hero at rest. `.bar--solid` after 55% of a screen scrolled (94% canvas with 12px blur). `.bar--compact` after 72px on phones. Current page link takes `aria-current="page"` and turns `--sc-accent-text`. Phone number hides under 1180px. Tab bar slides away after 28px of downward scroll and returns after 14px upward, always shown within 80px of the top and 40px of the end. The header CTA appears on phones only while the tab bar is hidden.
- Built from: `.bar`, `.tabbar` in styles.css. Behavior in main.js `chrome()`.
- Reference: `home-01-hero--desktop.png`, `home-01-hero--phone.png`, `site/index.html`, the `<header class="bar">` and `<nav class="tabbar">` blocks.

### Footer (`sections/footer.liquid`, in footer-group)
- Purpose: the "van side" footer.
- Anatomy top to bottom: red ticker of van lettering · white body with wordmark, both phone numbers in van format, "Get a quote", three link columns · large diamond mark at the right · dark bumper with copyright and "Back to top".
- Blocks: `phrase` (ticker items, five defaults: Insurance claims, ADAS recalibration, Free mobile service, Fast and affordable, Serving all of Louisiana. Output the set four times in a row), `column` (title + `link_list`).
- Columns: Services (six service anchors) · Customers (Insurance policy claims, Enterprise claims, Enterprise claim form, Student discount, Google reviews, New Orleans location) · Find us on (Facebook, Instagram, TikTok, Google Lafayette, Google New Orleans, Shop apparel).
- States: ticker translates with `--fp` (0 to 1 as the footer enters). The mark drives in from the right and straightens with the same variable. Static under reduced motion. Mark steps down to 24vw under 1340px and 18vw under 1100px so it never covers the third column.
- Built from: `.vanfoot`, `.ticker` in styles.css. main.js `footer()`.
- Reference: `home-12-footer--desktop.png`, `home-12-footer--phone.png`.

### Hero (`sections/hero.liquid`)
- Purpose: first screen. Promise, two actions, proof line.
- Anatomy: full-bleed photo with parallax · top and lead scrims · tag "Serving all of Louisiana" · h1 in two parts: red kicker bar "Mobile auto glass." and display "We come to you." · lede · buttons Get a quote and Call · stars with "4.8 on Google · 174 reviews · Locally owned and operated".
- Settings: image, alt, tag, kicker, headline (two lines), lede, rating, review count, proof suffix.
- States: pinned act, `data-sc-span="1.7"`, `data-phone-span="1.4"`. Photo scales 1 to 1.12 with scroll. Copy holds through the pin via `data-sc-cue="0 1.5 0"`. Phone: photo becomes a band across the top, its height measured by main.js `heroBand()`.
- Reference: `home-01-hero*.png`, `site/index.html`, `<section class="act-hero">`.

### InsurerStrip (`sections/insurer-strip.liquid`)
- Purpose: carrier logos in glass panes.
- Blocks: `carrier` (svg image, name, size class `w`, `m` or `t`). Defaults: State Farm, Progressive, GEICO, Allstate, Liberty Mutual.
- States: glare band on each pane travels with `--rv`. Hover lifts 3px. Phone: two columns, fifth pane spans both.
- Reference: `home-02-insurer-strip*.png`, `insurance--desktop-full.png`. Reused on the insurance page.

### Trust (`sections/trust.liquid`)
- Purpose: "We fix all types of auto glass" split with checklist and four counters.
- Anatomy: photo with offset red block (`.shot--block`) · tag, h2 with highlighted words (`.hl`), body, six ticks · row of four stats over a 3px rule.
- Blocks: `tick`, `stat` (value, label, optional metafield source).
- States: photo reveals from the left with `--rv`. Stats count up via `data-sc-count`.
- Reference: `home-03-trust*.png`, `home-03-stats*.png`.

### ServicesGrid (`sections/services-grid.liquid`)
- Purpose: six service cards plus the full-width "We come to you" band.
- Anatomy: head (tag, h2 "Repairs and replacements.", lede, Get a quote, "All services" link) · 3 by 2 grid of cards (square photo, number, title, one line) · band: copy left on the grid, photo right behind a slanted edge with a white and a red stripe, four city chips, two buttons.
- Blocks: `service` (image, title, text, reveal direction `left|up|right|iris`). Band fields are section settings with a show toggle.
- States: each card photo reveals in its own direction and tilts toward the pointer (`data-sc-tilt="4"`). Phone: two columns, band photo on top with a slanted foot.
- The grid stays at six cards. An odd count breaks the layout.
- Reference: `home-04-services-*.png`, `home-05-mobile-band*.png`.

### Insurance (`sections/insurance.liquid`)
- Purpose: claim steps beside a sticky full-height photo, then the two program cards.
- Anatomy: left column copy, four numbered steps, two buttons · right column photo, `position: sticky`, 100vh · below: Enterprise card (dark, red left border, five links) and Student card.
- Blocks: `step` (title, text).
- Student card is its own snippet, see StudentCard.
- Phone: photo on top at 4:3, steps stacked, cards stacked.
- Reference: `home-06-insurance*.png`, `home-07-programs*.png`.

### StudentCard (`snippets/student-card.liquid`) and VarsityHead
- Purpose: the college-themed student discount. The client asked for it to stand out.
- Anatomy: solid red ground · two white sleeve stripes across the top · dashed white stitched inset border · tonal pennant SVG in the bottom right corner · round "10% OFF" patch top right, white with a dark ring, rotated 10deg · tag · h3 with a hard dark offset shadow · bold body · two white school chips "UL Lafayette" and "SLCC" · links.
- Full-width variant on the student page head (`.phead--varsity`): same parts, pennant with black hoist and three white stars, `.offer` patch.
- Rules: type only. No university logos or marks.
- Markup: `site/index.html` (search `program--student`), `site/student-discount.html` (search `phead--varsity`). The pennant is inline SVG. Move it to `snippets/varsity-pennant.liquid`.
- Reference: `home-07-programs*.png`, `student-discount--*-full.png`.

### Signature (`sections/signature.liquid`)
- Purpose: the signature move. One back glass, wiped from "before" to "after" by the scroll.
- Anatomy: copy left (tag, h2 "Glass out. Glass in.", body) · 16:9 frame right with two stacked photos, a white divider line, a round knob carrying the diamond mark, "Before" and "After" chips.
- Settings: before image, after image, video (type `video`), copy.
- States: pinned, `data-sc-span="2.6"`, phone `2.4`. `--w` runs 0.06 to 1.0 across the pin. Reduced motion fixes `--w` at 0.5.
- Video variant: when the video setting is filled, output `data-video="{{ video url }}"` on the `.ba` figure. phone.js then shortens the pin to 1.3 and main.js swaps in a muted, looping, inline video that plays only while on screen. No sound, no controls (controls appear under reduced motion). The client asked for this video. The file has not arrived, so the default is the wipe.
- Reference: `home-08-signature-start|mid|end*.png`.

### Proof (`sections/proof.liquid`)
- Purpose: Google rating, four review quotes, the story, the social bar. One section, because the story block sits inside the same white act.
- Blocks: `rating` (value, two label lines), `review` (quote, name, source, month).
- Phone: reviews become a swipe row with four dot indicators that follow the scroll. This is the only sideways motion on the site and it is a contained row.
- Links: "Read the reviews on Google" and "All reviews".
- Reference: `home-09-reviews*.png`, `home-10-story-social*.png`.

### SocialBar (`snippets/social-bar.liquid`)
- Purpose: three linked counts: Instagram followers, TikTok likes, Facebook followers.
- Data: read `shop.metafields.custom.instagram_followers`, `tiktok_likes`, `facebook_followers` (single line text). Fall back to section settings with defaults `6,145`, `122.2K`, `575`. The Instagram count also feeds the fourth stat in Trust. This replaces `social-counts.js`.
- Automatic refresh is a later job outside the theme: a scheduled task writes the three metafields.
- Markup: `site/index.html` (search `soc__bar`).

### Locations (`sections/locations.liquid`)
- Purpose: closing act. Heading, two actions, one card per shop.
- Blocks: `location` (photo, name, two address lines, phone, hours lines, directions url, map embed url, optional page link).
- Defaults: Lafayette · 409A Mecca Street, Lafayette, LA 70508 · (337) 295-2874 · Monday to Friday 8 AM to 4:30 PM · Saturday and Sunday closed. New Orleans · 2837 Tifton St Unit B, Kenner, LA 70062 · (504) 920-3065 · Monday to Friday 8 AM to 5 PM · Saturday 8 AM to 2 PM · Sunday closed · page link to `/pages/new-orleans`.
- States: pinned on desktop (`data-sc-span="1.25"`), plain flow on phones (`data-phone-flow`). "Show map" is a real button with `aria-pressed`. First press creates a Google Maps iframe over the photo from `data-map`. Press again and the label reads "Show photo" and the map hides.
- Reference: `home-11-locations*.png`.

### PageHead (`sections/page-head.liquid`)
- Purpose: head of every inner page.
- Anatomy: breadcrumbs with red diamond separators · red tag · h1 with an optional highlighted phrase · lede · up to two buttons · optional photo in the right 48% behind the slanted edge.
- Settings: crumbs (up to two parents), tag, heading, highlight, lede, two button label and url pairs, image, focal position (outputs `--pos`), style `default|plain|varsity`.
- Phone: photo moves on top at 14.5rem with a slanted foot.
- Reference: top of every `<page>--desktop-full.png`.

### ServiceRows (`sections/service-rows.liquid`)
- Purpose: one row per service on the services page. Photo and copy alternate sides.
- Blocks: `row` (anchor id, image, title, text). Each row shows Get a quote and Call.
- The anchor ids are fixed: `windshield`, `chip`, `back-glass`, `adas`, `door-glass`, `commercial`. Footer links target them.
- Reference: `services--*-full.png`.

### Steps, Tiles, MiniServices, ReviewsGrid, LocationDetail, CtaBand
- Steps (`.steps`): boxed numbered steps, two columns. Insurance page.
- Tiles (`.tiles`): dark linked tiles with a number or label, title, one line and a round arrow. Hover turns the tile red and rotates the arrow 45deg. Enterprise page (four claim routes: form, photo upload, text `sms:+13372952874`, email) and insurance page (two program links).
- MiniServices (`.mini`): six square thumbnails with titles linking to the service anchors. Student page.
- ReviewsGrid (`.revs--2`): ratings row, four quotes in two columns, two Google buttons. Reviews page.
- LocationDetail (`.locd`): address, phone, hours as a definition list beside a live Google map that is always on. Outputs `AutoRepair` JSON-LD. Copy the JSON-LD from `site/new-orleans.html` and fill it from the block settings.
- CtaBand (`.cta`): dark closing band with a heading and two buttons. Every inner page ends with it.
- Reference: the inner page captures.

### MerchGrid (`sections/main-collection.liquid`)
- Purpose: every store item on one page.
- Anatomy: PageHead (plain) "Shop apparel." · filter chips with counts · grid, 5 columns (4 under 1180px, 2 on phones) · note line · CtaBand.
- Data per product: `title`, `type`, `price_min`, `price_varies`, `featured_image`, `url`. Paginate at 50 so all 41 show on one page.
- Display rules, matching the static grid:
  - Group order: T-Shirt, Hoodie, Sweatshirt, Hats, Accessories.
  - Type label: T-Shirt → "T-shirt", Hoodie → "Hoodie", Sweatshirt → "Crewneck", Hats → "Hat", Accessories → "Air freshener". Chip labels are the plurals.
  - Name: strip a leading "Geaux Auto Glass", then a leading "Hoodie" or "Crewneck", then turn " - " into a space. "Geaux Auto Glass Hoodie - Web Edition" shows as "Web Edition".
  - Price: "From $30.00" when `price_varies`, otherwise "$30.00".
- States: chips are buttons with `aria-pressed`. Pressing one hides other types with the `hidden` attribute. No page reload. Image scales 1.05 on hover. Empty collection: show the note line "No items yet." in place of the grid.
- Markup and the 14-line filter script: `site/merchandise.html`.
- Reference: `merchandise--*-full.png`, `merchandise--filter-hoodies--desktop.png`.

### Product and Cart (not designed)
- No artboard exists. Build them from the same parts: PageHead (plain) with breadcrumbs back to Merchandise, a white `.paper` section, `.btn--accent` for Add to cart, Archivo Black headings, CtaBand at the end. Variant picker as chips (`.chip`). See Open questions 1 and 2.

## Screen by screen

### Home (`/`)
- Layout, top to bottom: Hero (pin) → InsurerStrip → Trust (white) → ServicesGrid with band (dark) → Insurance with programs (off-white) → Signature (pin, dark) → Proof (white) → Locations (pin, dark) → Footer (white).
- Every section keeps `data-sc-act` and `data-sc-drift="#0a0a0b"` from the static markup.
- Section ids used by the nav: `services`, `insurance`, `reviews`, `visit`, `footer`, and `top` on main.
- Data needed: section settings only, plus the three social metafields.
- Edge states: blank image settings fall back to bundled assets. Blank video keeps the wipe.

### Services (`/pages/services`)
- PageHead (photo `trust.jpg`, focal 50% 34%) → ServiceRows on white → "We fix all types" heading with six ticks in three columns on off-white → CtaBand.
- Copy per row, approved by the client. Do not extend it:
  1. Windshield replacement: "Mobile service at home or work, or in-shop installation."
  2. Chip repair: "Minor chip repair."
  3. Back glass: "All vehicle types."
  4. ADAS recalibration: "ADAS calibration for cars, SUVs and trucks."
  5. Door glass: "Door glass replacements. Domestic and foreign."
  6. Commercial vehicles: "Both personal and commercial vehicles."

### Insurance (`/pages/insurance`)
- PageHead (photo `bleed-insurance.jpg`, focal 50% 62%) → Steps on white → InsurerStrip → Tiles (Enterprise, Student) on off-white → CtaBand.

### Enterprise claims (`/pages/enterprise-claims`)
- PageHead (photo `svc-fleet.jpg`, buttons "Fill out the claim form" and "Text 337.295.2874") → four Tiles → CtaBand "Submit your Enterprise claim." with the claim form as the primary button.
- The primary action on this page is the Enterprise form, not the quote form.

### Student discount (`/pages/student-discount`)
- VarsityHead → MiniServices under "All car, SUV and truck glass." → CtaBand.

### Google reviews (`/pages/reviews`)
- PageHead (photo `story.jpg`, focal 22% 50%, primary button to Google) → ReviewsGrid → SocialBar on off-white → CtaBand.

### New Orleans (`/pages/new-orleans`)
- PageHead (photo `loc-nola-van.jpg`, call button uses the 504 number) → LocationDetail → split with the storefront photo and a six-item service checklist → CtaBand with the 504 number.
- Title tag: "Auto glass in New Orleans and Kenner · Geaux Auto Glass". Set page SEO title and description from `site/new-orleans.html`.

### Merchandise (`/collections/all`)
- See MerchGrid.

Create the six pages in the store admin with the handles above and assign the templates. List this as a manual step in your Phase 3 report.

## Interactions and motion
Everything is already implemented in `site/`. Port it. Do not rebuild it.

- Engine: `scrollcraft.js` reads `data-sc-*` attributes and drives them from one scroll value on one rAF loop. Attributes in use: `data-sc-act` (`pin` or `flow`), `data-sc-span`, `data-sc-stage`, `data-sc-cue`, `data-sc-parallax`, `data-sc-in` with `data-sc-stagger`, `data-sc-count` with `data-sc-count-at`, `data-sc-tilt`, `data-sc-drift`, `data-sc-progress`. Keep every attribute exactly as in the static markup.
- phone.js runs before mount. Under 860px it rewrites acts from `data-phone-*` attributes. Under reduced motion it caps pins at 1.25 screens and removes counters. It also applies the Signature video span.
- main.js owns: smooth anchor scroll, header and tab bar chrome, image reveals (`.slide` and `.glint` get `--rv` 0 to 1, starting 12% of a screen below the fold, complete at 62% of the screen), the wipe (`--w`), the footer (`--fp`), the phone hero band, the map toggle, the Signature video.
- Two edits to the JS for Shopify, and no others:
  1. Remove the `social-counts.js` reads from phone.js and main.js. Liquid outputs the numbers.
  2. Theme editor: when `Shopify.designMode` is true, turn every `data-sc-act="pin"` into `flow` before mount (same pattern phone.js uses for `data-phone-flow`), and on `shopify:section:load` add `sc-in` to every `[data-sc-in]` inside the new section so content is visible. The engine has no unmount. Never call `ScrollCraft.mount` twice.
- Reduced motion: page is complete at rest. `--rv` unset equals 1. Ticker is static. Hero photo does not scale.
- Nothing else animates. No carousels, no autoplay beyond the muted Signature video.

## Responsive rules
- 1340px and down: footer mark 24vw.
- 1180px and down: header phone number hides, nav tightens, merch grid 4 columns, mini grid 3 columns.
- 1100px and down: footer mark 18vw, footer links 0.8rem, footer phone numbers 1.6rem.
- 980px and down: nav font 0.7rem, logo 28px.
- 860px and down is the phone layout: header nav hides, bottom tab bar appears, body gets bottom padding for it, every split stacks, services grid 2 columns, carriers 2 columns, reviews become a swipe row, Locations runs as flow, footer stacks with two link columns, merch grid 2 columns.
- 860px wide and under 620px tall: hero proof line hides, hero headline 2.6rem.
- No page scrolls sideways at any width. Verified at 1440, 1280, 1024, 900 and 390.
- Phone captures are 390 by 844. Build and check that size first, then desktop.

## Accessibility requirements
- Real elements: `a` for links, `button` for the map toggle and filter chips. No clickable divs.
- Every tap target is 44px or taller. Buttons 50px.
- `aria-pressed` on map toggles and filter chips. `aria-current="page"` on the current nav item and the last breadcrumb. `aria-label` on both navs, the logo link, the tab bar and the before/after figure. Decorative marks and the ticker carry `aria-hidden="true"`.
- Every content image has alt text as a setting next to its image picker, defaulting to the alt in `site/`.
- One h1 per page. Heading order h1 → h2 → h3 with no skips.
- Focus ring: 2px `--sc-accent` outline, 3px offset. Do not remove it.
- White on `#e20000` and `#f7f7f7` on `#0a0a0b` are the two text pairings. Red text on white uses `#c90000`, never `#ff4545`.
- `prefers-reduced-motion` respected as described above.
- Map iframes carry a `title`.

## Open questions and assumptions
1. Product and cart pages have no design. Assumption: build them from existing parts as described under "Product and Cart". If the client wants a designed product page, stop after Phase 3 and ask.
2. Header has no cart control. Assumption: add a cart link with item count between the phone number and the CTA on `collection`, `product` and `cart` templates only, styled as `.bar__call`. On phones, add it to the right of the compact logo on those templates.
3. Store access is not granted yet. The shirt printer set the store up. Assumption: develop with `shopify theme check` and a local preview against a development store until access arrives. Never publish. Push as an unpublished theme.
4. The store keeps its 41 products and its Printify connection. Do not touch products, collections, apps or the live theme.
5. Domain connection (geauxautoglass.net to Shopify) is a manual admin step outside the theme.
6. Signature video file has not arrived. Default is the before/after wipe.
7. Photos the client is still sending: see spec/REVISION-NOTES.md. Bundled files are the defaults until then. The ADAS card image reads as a rendered graphic and is due to be replaced.
8. Enterprise contact details await client confirmation: phone, email (`erac1120@gmail.com` in the build, `erack1120@gmail.com` in call notes), and whether a logo appears. Keep them as settings.
9. Baton Rouge location block: unconfirmed. Locations is block-based so a third card is a block add. The pinned desktop layout fits two cards. With three, switch the act to `flow`.
10. Story copy says "serving all of Acadiana" while the hero says "Serving all of Louisiana". Client approved both. Leave as is.
11. Social counts update on their own only once a job writes the three shop metafields. Out of scope for the theme.
12. "Other sites that promote the brand" for the footer: none confirmed. The Find us on column is a menu, so the merchant adds them.
13. A Tesla video swap was mentioned on the call. No video exists in the design. Ignore until the client names the section.
14. Later phase, not in this build: multistep quote form, JotForm tracking, visitor analytics.
15. Google map embeds use the keyless `maps?q=...&output=embed` URL per shop. Assumption: acceptable for launch. Swap to each Business Profile's own embed code when the client supplies it.

## Build order
1. Phase 1 · Shell plus the top of Home. `layout/theme.liquid`, ported CSS and JS assets, `settings_schema.json` with colors, contact and URL settings, header and footer section groups, Hero and InsurerStrip in `index.json`. Done when: `shopify theme check` reports zero errors, and the preview at 1440 and 390 matches `home-01-hero`, `home-02-insurer-strip` and `home-12-footer` captures, including the hero pin, the bar turning solid, and the phone tab bar hiding on scroll.
2. Phase 2 · Rest of Home. Trust, ServicesGrid, Insurance with StudentCard, Signature (wipe and video variant), Proof with SocialBar, Locations. Done when: a full scroll of Home matches `home-03` to `home-11` at both widths, the wipe tracks the scroll, "Show map" toggles, and reduced motion shows every section complete.
3. Phase 3 · Inner pages. PageHead, ServiceRows, Steps, Tiles, MiniServices, ReviewsGrid, LocationDetail, CtaBand, the six page templates. Done when: each page matches its two full page captures, every footer and nav link resolves, and the six service anchors land on their rows.
4. Phase 4 · Commerce. MerchGrid on `collection.json`, product, cart, and the remaining templates Shopify requires (404, search, list-collections, blog, article, password, gift card, customers). Done when: `/collections/all` shows every product with the display rules, filters work without reload, a product goes from grid to cart to checkout.
5. Phase 5 · Editor quality. Section presets, block limits, sensible setting labels and info text, design mode handling, metafield definitions for the social counts, JSON-LD on the location template, SEO titles and descriptions from `site/`. Done when: a merchant changes the hero photo, a service card, a review and a location's hours in the theme editor with no code, and the page stays intact.
6. Phase 6 · QA and delivery. Capture all eight screens at 1440 and 390 and compare to `screenshots/`. Zero console errors. No sideways scroll. Lighthouse accessibility 95 or higher. Done when: the repo is on `main`, connected to the store as an unpublished theme, with a report of every difference from the captures and why.
