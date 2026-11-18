// Screenshot a preview page.  node shot.mjs <url> <width> <out.png> [--full] [--y=1200] [--reduce] [--h=900]
import { launch } from './chrome.mjs';
const [url, w, out, ...rest] = process.argv.slice(2);
const width = Number(w);
const arg = (k) => (rest.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];
const browser = await launch(); const page = await browser.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
if (rest.includes('--reduce')) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width, height: Number(arg('h')) || (width < 861 ? 844 : 900), isMobile: width < 861, hasTouch: width < 861, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
if (rest.includes('--full')) {
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300)); });
}
const y = arg('y');
if (y) { await page.evaluate((y) => scrollTo(0, y), Number(y)); await new Promise((r) => setTimeout(r, 700)); }
await page.screenshot({ path: out, fullPage: rest.includes('--full') });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
console.log(`${out} overflowX=${overflow}${errors.length ? ' errors: ' + errors.slice(0, 5).join(' | ') : ''}`);
await browser.close();
