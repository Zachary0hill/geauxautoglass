// Section tops on the design page vs the theme preview, at several widths.
//   node compare-positions.mjs <design-url> <theme-url> ".act-a,.act-b" [1440,1024,390]
// Both pages are scrolled to the bottom first so lazy and flow sections settle.
import { launch } from './chrome.mjs';
const [design, theme, sel, widthsArg] = process.argv.slice(2);
if (!design || !theme || !sel) { console.error('usage: node compare-positions.mjs <design-url> <theme-url> "<selectors>" [widths]'); process.exit(2); }
const widths = (widthsArg || '1440,1024,390').split(',').map(Number);
const selectors = sel.split(',').map((s) => s.trim());
const browser = await launch(); const page = await browser.newPage();
async function tops(url, w) {
  await page.setViewport({ width: w, height: w < 861 ? 844 : 900, isMobile: w < 861, hasTouch: w < 861 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  return page.evaluate(async (selectors) => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300));
    return selectors.map((s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; });
  }, selectors);
}
let worst = 0;
for (const w of widths) {
  const d = await tops(design, w), t = await tops(theme, w);
  const rows = selectors.map((s, i) => { const diff = d[i] == null || t[i] == null ? 'missing' : t[i] - d[i]; if (typeof diff === 'number') worst = Math.max(worst, Math.abs(diff)); return `${s} design ${d[i]} theme ${t[i]} diff ${diff}`; });
  console.log(`@${w}\n  ` + rows.join('\n  '));
}
console.log(`worst offset ${worst}px`);
await browser.close();
