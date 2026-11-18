// Local approximation of the storefront: renders layout/theme.liquid and a JSON
// template with liquidjs and stub Shopify objects into _dev/preview/.
// It cannot prove checkout, real products, Shopify fonts or app blocks.
//   node preview.mjs [template=index] [--design-mode]
import { Liquid, Tag } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const out = path.join(root, '_dev/preview');
const templateName = process.argv.slice(2).find((a) => !a.startsWith('-')) || 'index';
const designMode = process.argv.includes('--design-mode');

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\/\*[\s\S]*?\*\//, ''));
const locale = readJSON(path.join(root, 'locales/en.default.json'));
const settings = { ...readJSON(path.join(root, 'config/settings_data.json')).current };
if (process.argv.includes('--motion-off')) settings.scroll_motion = false;
if (process.argv.includes('--no-worksheet')) settings.worksheet_enabled = false;
const strip = (src) => src.replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '').replace(/posted_successfully\?/g, 'posted_successfully');
const schemaOf = (src) => { const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); return m ? JSON.parse(m[1]) : {}; };
const postedArg = (process.argv.find((a) => a.startsWith('--posted=')) || '').split('=')[1] || '';

const engine = new Liquid({ root: [path.join(root, 'snippets')], extname: '.liquid', strictFilters: false, strictVariables: false, jsTruthy: false });

// ---- filters
const bust = Date.now(); engine.registerFilter('asset_url', (f) => `/assets/${f}?v=${bust}`);
// Stands in for Shopify's CDN resizing of theme assets: real resized copies.
engine.registerFilter('asset_img_url', (f, size) => {
  const w = parseInt(size, 10) || 800;
  const dir = path.join(out, 'resized', String(w));
  const dest = path.join(dir, f);
  if (!fs.existsSync(dest)) { fs.mkdirSync(dir, { recursive: true }); execFileSync('sips', ['-Z', String(w), path.join(root, 'assets', f), '--out', dest], { stdio: 'ignore' }); }
  return `/resized/${w}/${f}`;
});
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('preload_tag', (u, ...args) => `<link rel="preload" href="${u}" as="font" crossorigin>`);
engine.registerFilter('t', (key, ...args) => {
  let v = key.split('.').reduce((o, k) => (o ? o[k] : undefined), locale);
  const named = {};
  for (const a of args) if (Array.isArray(a)) named[a[0]] = a[1];
  if (v && typeof v === 'object' && 'other' in v) v = Number(named.count) === 1 ? v.one : v.other;
  if (typeof v !== 'string') v = `[missing: ${key}]`;
  return v.replace(/{{\s*(\w+)\s*}}/g, (_, k) => named[k] ?? '');
});
engine.registerFilter('handle', (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
engine.registerFilter('money', (c) => `$${(Number(c || 0) / 100).toFixed(2)}`);
engine.registerFilter('json', (v) => JSON.stringify(v ?? null));
engine.registerFilter('image_url', (img, ...args) => {
  const src = (img && img.src) || '';
  const w = (Object.fromEntries(args.filter(Array.isArray)).width) || 0;
  const m = src.match(/^\/product-photos\/([^/]+)$/);
  if (!m || !w || w >= img.width) return src;
  const dir = path.join(out, 'resized', String(w));
  const dest = path.join(dir, m[1]);
  if (!fs.existsSync(dest)) { fs.mkdirSync(dir, { recursive: true }); execFileSync('sips', ['-Z', String(w), path.join(root, '_dev/product-photos', m[1]), '--out', dest], { stdio: 'ignore' }); }
  return `/resized/${w}/${m[1]}`;
});
engine.registerFilter('image_tag', (u, ...args) => {
  const a = Object.fromEntries(args.filter(Array.isArray));
  const attrs = ['class', 'alt', 'loading', 'width', 'height', 'sizes'].filter((k) => a[k] != null && a[k] !== '').map((k) => `${k}="${a[k]}"`).join(' ');
  return `<img src="${u}" ${attrs}>`;
});
for (const f of ['payment_button', 'payment_terms', 'payment_type_svg_tag', 'external_video_tag', 'external_video_url', 'video_tag', 'model_viewer_tag', 'default_pagination', 'highlight']) engine.registerFilter(f, (v) => (f === 'highlight' ? v : ''));
engine.registerFilter('money_without_currency', (c) => (Number(c || 0) / 100).toFixed(2));
engine.registerFilter('money_with_currency', (c) => `$${(Number(c || 0) / 100).toFixed(2)} USD`);
engine.registerFilter('time_tag', (d) => `<time>${d}</time>`);
engine.registerFilter('placeholder_svg_tag', () => '<svg></svg>');
engine.registerFilter('font_face', () => '');
engine.registerFilter('font_modify', (f) => f);
engine.registerFilter('font_url', () => '');

// ---- tags
const ctx = { sections: {} };
async function renderSection(id, data) {
  const file = path.join(root, 'sections', `${data.type}.liquid`);
  const src = strip(fs.readFileSync(file, 'utf8'));
  const blocks = (data.block_order || Object.keys(data.blocks || {})).map((bid) => ({ id: bid, ...data.blocks[bid], shopify_attributes: '' }));
  const settings = Object.fromEntries(Object.entries(data.settings || {}).map(([k, v]) => [k, typeof v === 'string' && v !== '' && /collection/.test(k) && ctx.globals.collections ? ctx.globals.collections[v] : v]));
  const section = { id, settings, blocks };
  const html = await engine.parseAndRender(src, { section }, { globals: ctx.globals });
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}
engine.registerTag('sections', class extends Tag {
  constructor(t, r, l) { super(t, r, l); this.group = t.args.replace(/['"]/g, '').trim(); }
  async render() {
    const g = readJSON(path.join(root, 'sections', `${this.group}.json`));
    let html = '';
    for (const id of g.order) html += await renderSection(id, g.sections[id]);
    return html;
  }
});
engine.registerTag('section', class extends Tag {
  constructor(t, r, l) { super(t, r, l); this.name = t.args.replace(/['"]/g, '').trim(); }
  async render() {
    const src = fs.readFileSync(path.join(root, 'sections', `${this.name}.liquid`), 'utf8');
    const settings = Object.fromEntries((schemaOf(src).settings || []).filter((x) => x.id).map((x) => [x.id, x.default ?? '']));
    return renderSection(this.name, { type: this.name, settings });
  }
});
engine.registerTag('paginate', class extends Tag {
  constructor(token, remainTokens, liquid, parser) {
    super(token, remainTokens, liquid);
    this.tpls = [];
    const stream = parser.parseStream(remainTokens).on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('paginate not closed'); });
    stream.start();
  }
  * render(ctx, emitter) {
    ctx.push({ paginate: { pages: 1, current_page: 1, parts: [], items: 3 } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
  }
});
engine.registerTag('form', class extends Tag {
  constructor(token, remainTokens, liquid, parser) {
    super(token, remainTokens, liquid);
    this.args = token.args; this.tpls = [];
    const stream = parser.parseStream(remainTokens)
      .on('tag:endform', () => stream.stop())
      .on('template', (tpl) => this.tpls.push(tpl))
      .on('end', () => { throw new Error('form tag not closed'); });
    stream.start();
  }
  * render(ctx, emitter) {
    const type = (this.args.match(/^\s*'([^']+)'/) || [])[1] || 'contact';
    const attrs = {};
    for (const m of this.args.matchAll(/([\w-]+):\s*'([^']*)'/g)) attrs[m[1]] = m[2];
    const id = attrs.id || `${type}_form`;
    const action = { product: '/cart/add', contact: `/contact#${id}`, customer_login: '/account/login' }[type] || '/';
    const extra = Object.entries(attrs).filter(([k]) => k !== 'id').map(([k, v]) => (v === '' ? k : `${k}="${v}"`)).join(' ');
    emitter.write(`<form method="post" action="${action}" id="${id}" accept-charset="UTF-8" ${extra}><input type="hidden" name="form_type" value="${type}"><input type="hidden" name="utf8" value="✓">`);
    ctx.push({ form: { posted_successfully: postedArg === 'sent', errors: postedArg === 'error' ? { messages: { email: 'is invalid' } } : null } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
    emitter.write('</form>');
  }
});

// ---- stub shop data
// Products, collection, cart and pages come from _dev/tools/stubs.json when it
// exists (see stubs.example.json); photos live in _dev/product-photos/.
const stubFile = path.join(root, '_dev/tools/stubs.json');
const S = fs.existsSync(stubFile) ? JSON.parse(fs.readFileSync(stubFile, 'utf8')) : JSON.parse(fs.readFileSync(path.join(root, '_dev/tools/stubs.example.json'), 'utf8'));
const photo = (p) => (p && p.file ? { src: `/product-photos/${p.file}`, width: p.width, height: p.height, alt: p.alt || '', aspect_ratio: p.width / p.height } : null);
const media = (img, id) => ({ ...img, id, media_type: 'image', preview_image: img });
const products = S.products.map((d, n) => {
  const img = photo(d.photo);
  const opts = d.options || [];
  const variants = opts.length ? opts[0].values.map((v, k) => ({ id: 100 * (n + 1) + k, title: v, price: d.price, compare_at_price: d.compare_at_price || null, available: true, options: [v], url: `/products/${d.handle}?variant=${100 * (n + 1) + k}` }))
    : [{ id: 100 * (n + 1), title: 'Default Title', price: d.price, compare_at_price: d.compare_at_price || null, available: true, options: ['Default Title'], url: `/products/${d.handle}` }];
  return { id: n + 1, title: d.title, handle: d.handle, url: `/products/${d.handle}`, price: d.price, price_min: d.price, compare_at_price: d.compare_at_price || null, available: true, vendor: S.shop_name,
    description: `<p>${d.note || ''}</p><p>${d.description || ''}</p>`, featured_image: img, featured_media: img ? media(img, n + 1) : null, media: img ? [media(img, n + 1)] : [],
    has_only_default_variant: !opts.length, options_with_values: opts, variants, selected_or_first_available_variant: variants[0], metafields: { custom: { card_note: { value: d.note || '' } } } };
});
const board = products[0];
const stubCollection = { title: S.collection_title || 'Shop', handle: 'shop', url: '/collections/shop', description: '', products, products_count: products.length, all_products_count: products.length, filters: [], sort_options: [{ value: 'manual', name: 'Featured' }], sort_by: 'manual', default_sort_by: 'manual', image: null };
// Every collection handle resolves to the stub collection, as a picked collection would.
const reserved = new Set(['toLiquid', 'then', 'constructor', 'valueOf', 'toString', 'toJSON', 'liquidMethodMissing']);
const anyCollection = new Proxy({}, {
  get(t, k) {
    if (k === Symbol.iterator) return function* () { yield stubCollection; };
    if (k === 'hasOwnProperty') return () => true;
    if (k === 'size') return 1;
    if (typeof k !== 'string' || reserved.has(k)) return undefined;
    return stubCollection;
  },
  has: () => true,
});
const line = (p, q) => ({ product: p, variant: p.variants[0], title: p.title, image: p.featured_image, url: p.url, quantity: q, final_price: p.price, original_price: p.price, final_line_price: p.price * q, original_line_price: p.price * q, options_with_values: [], properties: {}, line_level_discount_allocations: [], key: p.handle });
const cartItems = products.slice(0, 2).map((p, n) => line(p, n + 1));
const article = { title: 'Sample article', url: '/blogs/news/sample', author: S.shop_name, published_at: '2026-01-01', created_at: '2026-01-01', excerpt: '<p>Sample excerpt.</p>', excerpt_or_content: '<p>Sample excerpt.</p>', content: '<p>Sample article body.</p><h2>Heading</h2><p>More text.</p>', image: products[0] && products[0].featured_image, comments: [], comments_count: 0, tags: [] };
const T = templateName.split('.')[0].replace('customers/', '');
const stubs = {
  product: { product: board, recommendations: { performed: false } },
  collection: { collection: stubCollection },
  'list-collections': {},
  cart: {},
  page: { page: { title: 'About', content: '<p>Sample page content.</p>' } },
  blog: { blog: { title: 'News', url: '/blogs/news', articles: [article, { ...article, title: 'Sealing a deck before winter', url: '/blogs/news/sealing' }], comments_enabled: false } },
  article: { article, blog: { title: 'News', url: '/blogs/news', comments_enabled: false } },
  search: { search: { performed: true, terms: 'sample', results: products.slice(0, 2).map((p) => ({ ...p, object_type: 'product' })), results_count: 2, filters: [], sort_options: [], types: ['product'] } },
  '404': {},
};

// ---- globals
const tplFile = templateName === 'cart-empty' ? 'cart' : templateName;
const tpl = readJSON(path.join(root, 'templates', `${tplFile}.json`));
ctx.globals = {
  settings,
  shop: { name: S.shop_name, policies: [], money_format: '${{amount}}' },
  cart: templateName === 'cart' || templateName === 'cart-empty' ? (templateName === 'cart' ? { item_count: 3, items: cartItems, total_price: cartItems.reduce((a, l) => a + l.final_line_price, 0), items_subtotal_price: cartItems.reduce((a, l) => a + l.final_line_price, 0), note: '', currency: { iso_code: 'USD' }, cart_level_discount_applications: [], taxes_included: false } : { item_count: 0, items: [] }) : { item_count: 0, items: [] },
  collections: anyCollection,
  blogs: { news: { url: '/blogs/news' } },
  routes: { root_url: '/', all_products_collection_url: '/collections/all', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_update_url: '/cart/update', predictive_search_url: '/search/suggest', search_url: '/search' },
  ...(stubs[T] || {}),
  request: { locale: { iso_code: 'en' }, page_type: T, design_mode: designMode, origin: 'http://localhost' },
  template: { name: T, suffix: templateName.includes('.') ? templateName.split('.')[1] : null },
  page_title: S.shop_name,
  canonical_url: 'http://localhost/',
  content_for_header: designMode ? '<script>window.Shopify = { designMode: true };</script>' : '',
};

let body = '';
for (const id of tpl.order) body += await renderSection(id, tpl.sections[id]);
const layout = strip(fs.readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8'));
const html = await engine.parseAndRender(layout, { content_for_layout: body }, { globals: ctx.globals });

fs.mkdirSync(out, { recursive: true });
{
  // A filled cart-drawer render, for mocking Shopify's Section Rendering API in the browser.
  const src = fs.readFileSync(path.join(root, 'sections', 'cart-drawer.liquid'), 'utf8');
  const filled = { item_count: 1, items: [cartItems[0]], total_price: cartItems[0].final_line_price, items_subtotal_price: cartItems[0].final_line_price, note: '', currency: { iso_code: 'USD' }, cart_level_discount_applications: [], taxes_included: false };
  const drawer = await engine.parseAndRender(strip(src), { section: { id: 'cart-drawer', settings: {}, blocks: [] } }, { globals: { ...ctx.globals, cart: filled } });
  fs.writeFileSync(path.join(out, 'drawer-filled.html'), `<div id="shopify-section-cart-drawer" class="shopify-section">${drawer}</div>`);
}
const suffix = (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6);
fs.writeFileSync(path.join(out, `${suffix || templateName.replace('/', '-')}.html`), html);
for (const [name, target] of [['assets', 'assets'], ['product-photos', '_dev/product-photos']]) {
  const link = path.join(out, name);
  if (!fs.existsSync(link)) fs.symlinkSync(path.join(root, target), link);
}
const missing = html.match(/\[missing: [^\]]+\]/g);
console.log(`wrote _dev/preview/${templateName.replace('/', '-')}.html${missing ? `\nmissing translations: ${[...new Set(missing)].join(', ')}` : ''}`);
