// Pixel comparison of the design page and the theme preview at the same scroll positions.
//   node pixdiff.mjs <design-url> <theme-url> <width> [--step=0.8] [--save=../shots/diff]
// Prints the share of pixels that differ by more than 48/255 at each stop; saves both frames when over 1%.
import { launch } from './chrome.mjs';
import jpeg from 'jpeg-js';
import fs from 'node:fs';
const [design, theme, w, ...rest] = process.argv.slice(2);
const arg = (k, d) => ((rest.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1]) || d;
const width = Number(w), height = width < 861 ? 844 : 900, step = Number(arg('step', '0.8'));
const save = arg('save', '');
const browser = await launch();
async function open(url) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: width < 861, hasTouch: width < 861, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400)); });
  return page;
}
// One page at a time: a background tab does not decode images or run rAF, which fakes differences.
async function frames(url) {
  const page = await open(url);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const out = [];
  for (let y = 0; ; y += Math.round(step * height)) {
    const yy = Math.max(0, Math.min(y, total - height));
    await page.evaluate((v) => scrollTo(0, v), yy);
    await new Promise((r) => setTimeout(r, 1100));
    out.push([yy, await page.screenshot({ type: 'jpeg', quality: 92 })]);
    if (yy >= total - height) break;
  }
  await page.close();
  return { total, out };
}
const FA = await frames(design), FB = await frames(theme);
console.log(`page height design ${FA.total} theme ${FB.total}`);
let worst = 0;
for (let i = 0; i < Math.min(FA.out.length, FB.out.length); i++) {
  const yy = FA.out[i][0];
  const shots = [FA.out[i][1], FB.out[i][1]];
  const [A, B] = shots.map((s) => jpeg.decode(s, { useTArray: true }));
  let diff = 0; const n = A.width * A.height;
  for (let i = 0; i < n * 4; i += 4) { if (Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]) > 144) diff++; }
  const pct = (diff / n) * 100; worst = Math.max(worst, pct);
  console.log(`y=${yy} differing ${pct.toFixed(2)}%`);
  if (save && pct > 1) { fs.mkdirSync(save, { recursive: true }); fs.writeFileSync(`${save}/${width}-${yy}-design.jpg`, shots[0]); fs.writeFileSync(`${save}/${width}-${yy}-theme.jpg`, shots[1]); }
}
console.log(`worst ${worst.toFixed(2)}%`);
await browser.close();
