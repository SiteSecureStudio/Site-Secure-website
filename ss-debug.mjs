import { createRequire } from 'module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require('./node_modules/puppeteer');
const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));

const info = await page.evaluate(() => {
  const lc = document.getElementById('lightning-canvas');
  const hc = document.getElementById('hero-canvas');
  return {
    lc: { w: lc.width, h: lc.height, offW: lc.offsetWidth, offH: lc.offsetHeight },
    hc: { w: hc.width, h: hc.height },
    anchors: window.getCardAnchors ? JSON.stringify(window.getCardAnchors()) : 'not exposed'
  };
});
console.log('Canvas info:', JSON.stringify(info, null, 2));

await browser.close();
