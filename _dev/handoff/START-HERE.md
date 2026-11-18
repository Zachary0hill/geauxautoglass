# Build: Geaux Auto Glass Shopify theme

You are porting a finished, client-approved static website into a Shopify Online Store 2.0 theme. The design is final. Match it. Do not redesign it.

## Read in this order
1. HANDOFF.md fully.
2. Open `site/index.html` in a browser and scroll it top to bottom at desktop and phone width. Then open the seven other pages.
3. Every file in screenshots/. Look at each PNG before building that screen. Use the `home-NN` captures for the three pinned acts.
4. `site/styles.css`, `site/main.js`, `site/phone.js`. These ship as theme assets.
5. tokens.json when you write `settings_schema.json`. pages.json for the region order of each page.
6. spec/REVISION-NOTES.md for pending client assets.

## Target
Shopify OS 2.0 theme: Liquid, JSON templates, sections with blocks, plain CSS and vanilla JS. No build step, no framework, no new UI library. New repo `geaux-auto-glass-theme`, theme files at the root. If `~/dev/zz-shopify-base` exists, take product, cart and the other commerce templates from it. Store: `geaux-auto-glass-merch.myshopify.com`. Never publish and never touch products, apps or the live theme.

## Rules
- The screenshot is the source of truth when text and picture disagree.
- Port the CSS and JS from `site/` unchanged. Keep every class name and every `data-sc-*` attribute. The only JS edits are the two named in HANDOFF.md § Interactions and motion.
- Colors, contact details and external URLs live in theme settings once. Never inline a hex, phone number or JotForm URL in a section.
- Every image is an `image_picker` setting that falls back to the bundled asset, so a fresh install matches the screenshots.
- Every merchant-editable string is a setting with the approved copy as default. Every repeated item is a block. Keep copy exactly as written.
- Build and check 390 by 844 first, then 1440. No sideways scroll at any width.
- Real elements for accessibility: button, a, labelled controls. 44px minimum tap targets.
- `shopify theme check` reports zero errors before each phase report.

## Start with Phase 1
Shell plus the top of Home: `layout/theme.liquid`, ported assets, `settings_schema.json`, header and footer section groups, Hero and InsurerStrip in `index.json`. Done when theme check is clean and the preview matches `home-01-hero`, `home-02-insurer-strip` and `home-12-footer` at 1440 and 390, including the hero pin, the solid header after scroll and the phone tab bar.

Stop after Phase 1 and report: what was built, which settings were added, what in the design did not match and why. Then continue phase by phase.

## When something is unclear
Check HANDOFF.md § Open questions and assumptions first. If still unclear, make the smallest reasonable choice, note it in your report, keep going.
