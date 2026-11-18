// Shared: a headless Chrome page. CHROME_PATH overrides the macOS default.
import puppeteer from 'puppeteer-core';
export const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export async function launch() { return puppeteer.launch({ executablePath: CHROME, headless: 'new' }); }
