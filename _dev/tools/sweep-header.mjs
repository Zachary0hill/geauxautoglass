// Header bar sweep: overlap or overflow between the mark, nav and call button
// at every 20px from 861 to 1500. Run it on a page with an empty cart and one
// with items (the cart link changes the nav width).
//   node sweep-header.mjs http://localhost:8787/index.html http://localhost:8787/cart.html
import { launch } from './chrome.mjs';
const urls = process.argv.slice(2);
const browser = await launch(); const page = await browser.newPage();
let failed = false;
for (const url of urls) {
  const bad = [];
  for (let w = 861; w <= 1500; w += 20) {
    await page.setViewport({ width: w, height: 800 });
    await page.goto(url, { waitUntil: 'load' });
    const r = await page.evaluate(() => {
      const q = (s) => { const e = document.querySelector(s); return e && e.getBoundingClientRect(); };
      const m = q('.bar__mark'), n = q('.bar__nav'), c = q('.bar__cta'), nav = document.querySelector('.bar__nav');
      if (!m || !n) return { skip: true };
      const kids = [...nav.children].filter((a) => !a.hidden);
      return {
        overlap: n.left < m.right - 1 || (c && n.right > c.left + 1),
        ctaOffscreen: c ? c.right > innerWidth : false,
        navOverflow: nav.scrollWidth > nav.clientWidth + 1,
        firstUnderMark: kids.length ? kids[0].getBoundingClientRect().left < m.right - 1 : false,
      };
    });
    if (!r.skip && Object.values(r).some(Boolean)) bad.push(w + ' ' + JSON.stringify(r));
  }
  if (bad.length) failed = true;
  console.log(url, bad.length ? `PROBLEMS\n  ${bad.join('\n  ')}` : 'clean');
}
await browser.close();
process.exit(failed ? 1 : 0);
