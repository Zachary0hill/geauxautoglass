# Geaux Auto Glass · Shopify theme

Online Store 2.0 theme ported from the design handoff of 2026-11-17 (`_dev/handoff/`).
Home page, six service pages, the merchandise grid, product, cart and the rest of the store.

## Install

Upload `_dev/geaux-auto-glass-theme.zip` in Shopify admin → Online Store → Themes → Add theme → Upload zip file,
or connect this repository (branch `main`) with **Connect from GitHub**. Theme folders sit at the root; Shopify ignores `_dev/`.
Then follow `_dev/ASSETS.md`: create the six pages, check the settings, swap photos.

## Layout

- `assets/scrollcraft.*`, `phone.js`: the scroll engine from the handoff, unchanged (phone.js minus the social counts read).
- `assets/theme.css`: engine floor, then the design's `styles.css` unchanged, then what Shopify adds.
- `assets/theme.js`: the design's `main.js`, with editor re-mount and delegated clicks.
- `snippets/css-variables.liquid`: brand tokens from theme settings.
- `assets/gx-*`: the shop layer (product, cart, drawer, search, accounts), loaded on shop templates only.

## Checks

```bash
cd _dev/tools && npm install
node check.mjs ../..                 # Theme Check
python3 validate.py ../..            # import-safe schema
python3 expand-schema.py             # after adding "options": "@actions" or "@photos" to a section schema
python3 sync-settings.py             # after adding theme settings
node preview.mjs index               # or page.services, collection, product, cart, ...
./pixdiff-all.sh                     # pixel comparison with the design (serve _dev/preview on :8787 first)
```
