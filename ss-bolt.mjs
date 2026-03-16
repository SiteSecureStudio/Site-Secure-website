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

// Trigger 3 bolts simultaneously and freeze them ON
await page.evaluate(() => {
  window.triggerLightning();
  window.triggerLightning();
  window.triggerLightning();
  // Freeze all bolts in visible "on" state
  setTimeout(() => {
    window._boltsFrozen = true;
  }, 20);
});

await new Promise(r => setTimeout(r, 50));
await page.screenshot({ path: join(dir, 'screenshot-16-bolt-frozen.png') });
await browser.close();
console.log('Done');
