// Motion gates on the home preview: reduced motion, motion-off setting, no JS, design mode.
import { launch } from './chrome.mjs';
const base = 'http://localhost:8787/';
const browser = await launch();
async function run(name, file, { reduce = false, js = true, width = 1440 } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setJavaScriptEnabled(js);
  if (reduce) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width, height: width < 861 ? 844 : 900, isMobile: width < 861, hasTouch: width < 861 });
  await page.goto(base + file, { waitUntil: 'networkidle0' });
  if (js) await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } await new Promise((r) => setTimeout(r, 600)); });
  const r = await page.evaluate(() => {
    const vis = (el) => { const c = getComputedStyle(el); return Number(c.opacity) > 0.99 && c.visibility !== 'hidden'; };
    const all = (s) => [...document.querySelectorAll(s)];
    const hiddenIn = all('[data-sc-in]').filter((e) => !vis(e)).length;
    const hiddenStagger = all('[data-sc-stagger] > *').filter((e) => !vis(e)).length;
    const hiddenCue = all('[data-sc-cue]').filter((e) => !vis(e)).map((e) => e.className);
    const ba = document.querySelector('.ba');
    const hero = document.querySelector('.hero__photo');
    return {
      htmlClass: document.documentElement.className, hiddenIn, hiddenStagger, hiddenCue,
      w: ba ? getComputedStyle(ba).getPropertyValue('--w').trim() : null,
      heroScale: hero ? getComputedStyle(hero).scale : null,
      ticker: getComputedStyle(document.querySelector('.ticker__row')).transform,
      slidesClipped: all('.slide > *').filter((e) => getComputedStyle(e).clipPath !== 'none' && !/inset\(0(px|%)? /.test(getComputedStyle(e).clipPath) && !/circle\(75%/.test(getComputedStyle(e).clipPath)).length,
      stage: getComputedStyle(document.querySelector('.hero')).position,
      heroActH: Math.round(document.querySelector('.act-hero').getBoundingClientRect().height),
      sigActH: Math.round(document.querySelector('.act-sig').getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      imgs: [...document.images].filter((i) => i.loading !== 'lazy').map((i) => (i.className || i.parentNode.className) + (i.fetchPriority !== 'auto' ? ':' + i.fetchPriority : '')),
    };
  });
  console.log(`\n== ${name}\n`, JSON.stringify(r), errors.length ? `\n errors: ${errors.join(' | ')}` : '\n no console errors');
  await page.close();
}
await run('no JS', 'index.html', { js: false });
await run('design mode', 't-design.html');
await browser.close();
