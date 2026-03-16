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
// Trigger lightning strike
await page.evaluate(() => window.triggerLightning());
await new Promise(r => setTimeout(r, 80)); // Catch it while "on" flicker
await page.screenshot({ path: join(dir, 'screenshot-15-bolt.png') });
await browser.close();
console.log('Done');
