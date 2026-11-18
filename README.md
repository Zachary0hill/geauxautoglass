# Geaux Auto Glass · Shopify theme

Online Store 2.0 theme built from a design handoff.

## Install

Shopify admin → Online Store → Themes → Add theme → **Connect from GitHub**, pick this
repository and `main`. Theme folders sit at the root; Shopify ignores `_dev/`.
Once connected the branch is two-way: pull before working, never force-push.

## Checks

```bash
cd _dev/tools && npm install
node check.mjs ../..
node preview.mjs index      # or product, collection, cart, page, blog, article, search, 404, customers/login
```
