# Geaux Auto Glass · store setup and assets

Everything the live store still needs, in the order to do it.
Store: `geaux-auto-glass-merch.myshopify.com`. The theme never touches products, collections, apps or the live theme.

## 1. Add the theme (unpublished)

**Zip:** Shopify admin → Online Store → Themes → Add theme → **Upload zip file** → `_dev/geaux-auto-glass-theme.zip`.

**Or GitHub:** push this repo to GitHub, then Add theme → **Connect from GitHub** → `geaux-auto-glass-theme`, branch `main`.
Once connected the branch is two-way: the theme editor commits to `main`. Pull before any new work, never force-push.

Preview it. Publish only when the checks in section 7 pass.

Rebuild the zip from the repo root:

```bash
zip -r _dev/geaux-auto-glass-theme.zip assets config layout locales sections snippets templates -x "*.DS_Store"
```

## 2. Create the seven pages

Online Store → Pages → Add page. The handle (URL) must match, because the footer, the home page and the
page heads link to these addresses. Leave the content empty; the template carries the page.

| Page title | Handle | Theme template | SEO title | SEO description |
|---|---|---|---|---|
| Services | `services` | `page.services` | Auto glass services · Geaux Auto Glass | Windshield replacement, chip repair, back glass, ADAS recalibration, door glass and commercial vehicles. Shops in Lafayette and New Orleans, serving all of Louisiana. |
| Insurance | `insurance` | `page.insurance` | Insurance policy claims · Geaux Auto Glass | File a glass claim with Geaux Auto Glass. We work with all insurance providers. Four steps, then we handle the rest and set you up for scheduling. |
| Enterprise claims | `enterprise-claims` | `page.enterprise` | Enterprise claims · Geaux Auto Glass | Geaux Auto Glass is an approved vendor for Enterprise Rent-A-Car. Submit your claim by form, photo, text or email and our team handles the rest. |
| Student discount | `student-discount` | `page.student-discount` | Student discount · Geaux Auto Glass | 10% off all services for college students at University of Louisiana at Lafayette or South Louisiana Community College. All car, SUV and truck glass. |
| Google reviews | `reviews` | `page.reviews` | Google reviews · Geaux Auto Glass | Geaux Auto Glass holds a 4.8 Google rating in Lafayette across 174 reviews and a 5.0 rating in Kenner. Read what customers say. |
| New Orleans | `new-orleans` | `page.location` | Auto glass in New Orleans and Kenner · Geaux Auto Glass | Geaux Auto Glass New Orleans. 2837 Tifton St Unit B, Kenner, LA 70062. Windshield replacements, chip repairs, door glass and ADAS recalibration. Call (504) 920-3065. |
| Lafayette | `lafayette` | `page.location-lafayette` | Auto glass in Lafayette · Geaux Auto Glass | Geaux Auto Glass Lafayette. 409A Mecca Street, Lafayette, LA 70508. Windshield replacements, chip repairs, door glass and ADAS recalibration. Call (337) 295-2874. |

Until a page exists its links return "page not found". The home page, the merchandise grid and the cart work without them.

## 3. Store settings the theme relies on

| Where in admin | What | Why |
|---|---|---|
| Online Store → Preferences | Home page title and meta description | Optional. Empty: the theme uses Theme settings → Search and local SEO. |
| Settings → Policies | Refund, privacy, terms, shipping | Linked in the footer bumper once they exist. |
| Settings → Payments, Shipping | Already set up by the printer (Printify) | Checkout. Not changed by the theme. |
| Online Store → Domains | Connect geauxautoglass.net | Manual step, outside the theme. |
| Settings → Notifications → Sender email | The shop inbox | Only if the Contact form section is used. |

## 4. Theme settings to know (Customize → Theme settings)

| Group | What lives there |
|---|---|
| Business | Both phone numbers, the email, the Enterprise email, the quote form link, both Enterprise form links, both Google links, the footer line. Every button on the site reads these. |
| Search and local SEO | Home page title and description, the Lafayette address and areas served (structured data). |
| Branding | Logo for dark grounds, compact logo (phones), logo for white grounds, favicon. Empty: the bundled files. |
| Colors | The design tokens. Defaults are the approved colours. |
| Social media | Instagram, TikTok, Facebook links and the three counts. |
| Motion | One switch for all scroll motion. |
| Cart | Drawer or page. |

**Pending client confirmation** (kept as settings, change in one place): Enterprise email (`erac1120@gmail.com` in the build, `erack1120@gmail.com` in call notes) and Enterprise phone.

## 5. Social counts (optional automation)

The counts show from Theme settings → Social media. To let a scheduled job keep them current, create three shop metafields
(Settings → Custom data → Shop → Add definition, Single line text). When set, they win over the theme settings.

| Namespace and key | Example |
|---|---|
| `custom.instagram_followers` | 6,145 |
| `custom.tiktok_likes` | 122.2K |
| `custom.facebook_followers` | 575 |

## 6. Photos and video

Every slot is an image picker in Customize; the bundled photo shows until one is picked.
Upload originals (Content → Files) so Shopify serves them resized.

| Page · section | Slot | Bundled file | Shape | Upload at least | Note |
|---|---|---|---|---|---|
| Home · Hero | Photo | `hero.jpg` | Landscape | 2000 px wide | Client is sending the full fleet photo. Subject in the right half. |
| Home · Photo and checklist | Photo | `trust.jpg` | Portrait 4:5 | 1320 px wide | |
| Home · Services grid | Windshield | `svc-windshield.jpg` | Square | 1200 px | Second client photo due. |
| Home · Services grid | Chip repair | `svc-chip.jpg` | Square | 1200 px | Client photo due. |
| Home · Services grid | Back glass | `svc-back.jpg` | Square | 1200 px | |
| Home · Services grid | ADAS | `svc-adas.jpg` | Square | 1200 px | Reads as a rendered graphic. Client photo due. |
| Home · Services grid | Door glass | `svc-door.jpg` | Square | 1200 px | Client photo due. |
| Home · Services grid | Commercial | `svc-fleet.jpg` | Square crop | 1200 px | |
| Home · Services grid band | Photo | `svc-mobile.jpg` | Landscape | 1420 px wide | Roller shot of the van due. |
| Home · Insurance | Photo | `bleed-insurance.jpg` | Portrait | 1320 px wide | Confirm the red SUV photo with the client. |
| Home · Before and after | Before, After | `ba-before.jpg`, `ba-after.jpg` | 16:9, same framing | 1456 px wide | |
| Home · Before and after | Video | none | mp4 | | The client's "glass out, glass in" video. When set it replaces the wipe, muted and looping. |
| Home · Reviews and story | Story photo | `story.jpg` | Wide landscape | 1800 px wide | |
| Home · Locations | Lafayette | `loc-lafayette.jpg` | Landscape | 1240 px wide | |
| Home · Locations | New Orleans | `loc-kenner.jpg` | Landscape | 1240 px wide | 504 van photo after edits due. Update the description too. |
| Inner page heads | Photo | per page | Any | 1400 px wide | "Photo position" keeps the subject in view. |
| Services · Services grid | One per card | the six `svc-*.jpg` | Shown square | 1200 px | |
| New Orleans · Location detail | Shop photo (search engines) | `loc-kenner.jpg` | Landscape | 1200 px wide | |

Carrier logos: Home and Insurance → Insurer strip. Bundled SVGs for State Farm, Progressive, GEICO, Allstate, Liberty Mutual.

## 7. Menus

The header and footer work with no menus: the header uses its link blocks, the footer its three built-in lists.
To manage them as Shopify menus instead, create a menu in Content → Menus and pick it in Customize → Header, or in a footer Link column.

Header links, in order: Enterprise (claim form) · Services `/#services` · Insurance `/#insurance` · Merchandise (all products) · Locations `/#visit`.

## 8. Merchandise grid

`/collections/all` (and any collection) uses the Merch grid: all products on one page (50 per page), grouped by product type.
The mapping is five "Product type" blocks in Customize → Collection → Merch grid:

| Product type in Shopify | Card label | Chip label | Word dropped from names |
|---|---|---|---|
| T-Shirt | T-shirt | T-shirts | |
| Hoodie | Hoodie | Hoodies | Hoodie |
| Sweatshirt | Crewneck | Crewnecks | Crewneck |
| Hats | Hat | Hats | |
| Accessories | Air freshener | Air fresheners | |

A product with any other type shows last under its own type name with an "Other" chip. Past 50 products the grid paginates
and the chips only filter the page in view.

## 9. Before launch: check on the live store

- [ ] The seven pages exist with the right handles and templates; every footer and header link resolves.
- [ ] `/collections/all` shows all 41 products, with the right labels, names and "From" prices.
- [ ] Buy a product on a phone and on desktop through to the order confirmation (Printify order appears).
- [ ] Edit the hero photo, a service card, a review and a location's hours in Customize; scroll the preview: pinned sections still pin.
- [ ] Each Get a quote button opens the JotForm; each Call button dials the right shop.
- [ ] PageSpeed Insights (mobile) on `/`, a product and the cart.

## Fonts

Self-hosted in `assets/`, both SIL Open Font License:
`display-400.woff2` Archivo Black 400 · `text-var.woff2` Inter variable (500 to 700 used).
