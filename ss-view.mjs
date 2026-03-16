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
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: join(dir, 'screenshot-10-hero-purple.png') });

// CTA section
await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => { el.style.transition='none'; el.style.opacity='1'; el.style.transform='none'; }); });
await page.evaluate(() => window.scrollTo(0, document.getElementById('contact').offsetTop));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: join(dir, 'screenshot-11-cta-purple.png') });

await browser.close();
console.log('Done');
