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
// Force reveals
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none';
  });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => { el.textContent = el.dataset.target; });
});
await new Promise(r => setTimeout(r, 400));

// Screenshot services section
await page.evaluate(() => window.scrollTo(0, document.getElementById('services').offsetTop));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(dir, 'screenshot-6-services.png'), fullPage: false });

// Screenshot why section
await page.evaluate(() => window.scrollTo(0, document.getElementById('why').offsetTop));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(dir, 'screenshot-7-why.png'), fullPage: false });

// Screenshot contact section  
await page.evaluate(() => window.scrollTo(0, document.getElementById('contact').offsetTop));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: join(dir, 'screenshot-8-cta.png'), fullPage: false });

await browser.close();
console.log('Section screenshots saved');
