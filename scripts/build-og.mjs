// Renders the link-preview image public/og.png (1200x630) from scripts/og/og.html.
// Committed output, so the site build never needs a browser. Re-run after changing the
// template, the portrait or the title:
//
//   npx playwright install chromium   # once; Playwright is not a dependency of the site
//   npm i --no-save playwright && node scripts/build-og.mjs
//
// The AM Display face is read from the inline block in index.html, so the card always
// uses the same cut as the hero. The PNG is then reduced to a 256-colour palette with
// Pillow (pip install pillow).
import { readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Playwright is not a dependency; PLAYWRIGHT_DIR may point at a global install's node_modules.
let playwright;
try {
  playwright = await import('playwright');
} catch {
  if (!process.env.PLAYWRIGHT_DIR) throw new Error('build-og: playwright not found (set PLAYWRIGHT_DIR or npm i --no-save playwright)');
  playwright = createRequire(path.join(process.env.PLAYWRIGHT_DIR, 'x.js'))('playwright');
}
const { chromium } = playwright;

const index = await readFile(path.join(root, 'index.html'), 'utf8');
const amDisplay = index.match(/<!-- am-display:start -->\s*([\s\S]*?)\s*<!-- am-display:end -->/)?.[1];
if (!amDisplay) throw new Error('build-og: AM Display block not found in index.html');

const fontFile = (pkg, name) => pathToFileURL(path.join(root, 'node_modules', '@fontsource-variable', pkg, 'files', name)).href;
let html = await readFile(path.join(root, 'scripts', 'og', 'og.html'), 'utf8');
html = html
  .replace('/*AM_DISPLAY*/', () => amDisplay.replace(/<\/?style>/g, ''))
  .replace('/*MONA*/', () => fontFile('mona-sans', 'mona-sans-latin-wght-normal.woff2'))
  .replace('/*CASCADIA*/', () => fontFile('cascadia-mono', 'cascadia-mono-latin-wght-normal.woff2'))
  .replace('/*PORTRAIT*/', () => pathToFileURL(path.join(root, 'public', 'images', 'aslam-1240.jpg')).href);

const tmp = path.join(root, 'scripts', 'og', '.render.html');
await writeFile(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
const out = path.join(root, 'public', 'og.png');
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
await rm(tmp);

// Quantise to a 256-colour palette: the card is flat colour plus one photo.
execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open(r"${out}").convert("RGB")
im.quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(r"${out}", optimize=True)
`]);
console.log(`build-og: wrote public/og.png`);
