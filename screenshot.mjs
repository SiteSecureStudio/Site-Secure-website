import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);

// Try multiple possible puppeteer locations
const puppeteerPaths = [
  'C:/Users/nateh/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer',
  'C:/Users/navin/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer',
  'puppeteer',
];

let puppeteer;
for (const p of puppeteerPaths) {
  try {
    puppeteer = require(p);
    break;
  } catch {}
}

if (!puppeteer) {
  console.error('Puppeteer not found. Tried:', puppeteerPaths);
  process.exit(1);
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filepath = join(dir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

// Force all scroll-reveal elements visible instantly + fill counters
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    el.classList.add('in');
  });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    el.textContent = el.dataset.target;
  });
});
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
