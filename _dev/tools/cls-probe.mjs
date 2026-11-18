// Runs Lighthouse (mobile) through its Node API on a page we control, with a
// layout-shift observer injected first, so every shift is named by element.
// Lighthouse's own attribution can crash; this cannot hide the culprit.
//   node cls-probe.mjs http://localhost:8788/index
import lighthouse from 'lighthouse';
import { launch } from './chrome.mjs';
const url = process.argv[2];
const browser = await launch(); const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  window.__shifts = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__shifts.push({ v: +e.value.toFixed(3), t: Math.round(e.startTime), src: e.sources.map((s) => { const n = s.node; const d = n ? (n.nodeType === 1 ? n.tagName + '.' + String(n.className).slice(0, 40) + '#' + n.id : n.nodeName) + ' < ' + (n.parentElement ? (n.parentElement.id || String(n.parentElement.className).slice(0, 40) || n.parentElement.tagName) : '') : 'none'; return d + ' y/h ' + JSON.stringify([Math.round(s.previousRect.y), Math.round(s.previousRect.height), Math.round(s.currentRect.y), Math.round(s.currentRect.height)]); }) }); }).observe({ type: 'layout-shift', buffered: true });
});
const r = await lighthouse(url, { onlyCategories: ['performance'], logLevel: 'error' }, undefined, page);
const a = r.lhr.audits;
console.log('performance', Math.round(r.lhr.categories.performance.score * 100), 'CLS', a['cumulative-layout-shift'].displayValue, 'LCP', a['largest-contentful-paint'].displayValue);
// Shifts after ~3s come from Lighthouse's own viewport work, not the page load.
for (const s of await page.evaluate(() => window.__shifts)) if (s.v > 0.001 && s.t < 3000) console.log(JSON.stringify(s));
await browser.close();
