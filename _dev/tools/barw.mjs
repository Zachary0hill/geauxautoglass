import { launch } from './chrome.mjs';
const browser = await launch(); const page = await browser.newPage();
for (const url of process.argv.slice(2)) for (const w of [981, 1001, 1101, 1181, 1201, 1221, 1241, 1281, 1321, 1341]) {
  await page.setViewport({ width: w, height: 800 }); await page.goto(url, { waitUntil: 'load' });
  console.log(url.split('/').pop(), w, await page.evaluate(() => { const c = document.querySelector('.bar__cta').getBoundingClientRect(); const g = parseFloat(getComputedStyle(document.querySelector('.bar')).paddingRight); return `cta.right ${Math.round(c.right)} limit ${Math.round(innerWidth - g)} over ${Math.round(c.right - (innerWidth - g))}`; }));
}
await browser.close();
