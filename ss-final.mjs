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
await new Promise(r => setTimeout(r, 1800));
// Freeze 3 lightning bolts in visible state
await page.evaluate(() => window.freezeLightning());
await new Promise(r => setTimeout(r, 150));
await page.screenshot({ path: join(dir, 'screenshot-18-final-hero.png') });
await browser.close();
console.log('Done');
