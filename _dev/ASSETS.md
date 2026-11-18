# Geaux Auto Glass · store setup and assets

Everything the live store still needs, in the order to do it. Make it specific
to this build: only the sections actually on the home page, the real collection
names, the real image slots and sizes. Delete rows that do not apply.

## 1. Connect the theme

1. Shopify admin → Online Store → Themes → Add theme → **Connect from GitHub**.
2. Pick `geaux-auto-glass-theme`, branch `main`.
3. Preview it, then **Publish** when the checks below pass.

Fallback: Add theme → Upload zip file, with a zip built from the repo root:

```bash
zip -r _dev/geaux-auto-glass-theme-theme.zip assets config layout locales sections snippets templates -x "*.DS_Store"
```

## 2. Store settings the theme relies on

| Where in admin | What | Why |
|---|---|---|
| Settings → Notifications → Sender email | The owner's inbox | Contact and form submissions arrive here. |
| Online Store → Preferences | Home page title and meta description | The theme prints these; Lighthouse SEO flags a missing description. |
| Settings → Policies | Refund, privacy, terms, shipping | Linked in the footer. |
| Settings → Shipping and delivery | Rates, local pickup if wanted | Product page shows pickup availability when on. |
| Settings → Payments | A payment provider | Needed for checkout. |
| Online Store → Domains | Point the domain here when ready | |

## 3. Products and collections

1. Settings → Custom data → Products → Add definition: `custom.card_note`, Single line text (the short line under each product name on cards).
2. Products: | Product | Price | Card note | Photo |
3. Collections: | Handle | Used by |
4. URL Redirects from the old site: | Old path | New path |

## 4. Photos

Every slot is an image picker in Customize; the bundled photo shows until one is
picked. Upload originals (Content → Files) so Shopify serves them resized in WebP/AVIF.

| Section | Slot | Bundled file | Shape | Upload at least |
|---|---|---|---|---|

Logo: Theme settings → Branding (transparent PNG, 600 px wide). Favicon: square, 96 × 96.

## 5. Menus

Header links: as section blocks or a Shopify menu picked in Customize → Header. Six links or fewer.

## 6. Before launch: check on the live store

- [ ] Submit each form once; the email lands in the sender inbox.
- [ ] Buy a product on a phone and on desktop through to the order confirmation.
- [ ] Edit a home page section in Customize and scroll the preview: pinned sections still pin.
- [ ] PageSpeed Insights (mobile) on `/`, a product and the cart.

## Fonts

List the bundled fonts and their licence here.
