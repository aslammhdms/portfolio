// Fails when the built site is over its size budgets. Run after `npm run build`:
//
//   npm run check:budgets
//
// Not part of the Cloudflare build on purpose: a budget miss should be visible to the
// author, not block a content-only deploy. Sizes are gzip level 9, close to what the
// CDN sends (Cloudflare serves brotli, which is smaller still).
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const KB = 1024;
const budgets = {
  eagerJs: 90 * KB, // JS the HTML loads before the page is interactive
  totalJs: 130 * KB, // every JS file, lazy chunks included
  css: 20 * KB,
  html: 120 * KB, // dist/index.html, raw: it holds the prerendered page
};

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const gz = async (file) => gzipSync(await readFile(file), { level: 9 }).length;
const kb = (n) => `${(n / KB).toFixed(1)} KB`;

const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const assets = await readdir(path.join(dist, 'assets'));

// Eager = the module script plus its modulepreload links (what the browser fetches up front).
const eagerRefs = [...html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)="[^"]*?(assets\/[^"]+\.js)"/g)].map((m) => m[1]);
const eager = [...new Set(eagerRefs)];
if (eager.length === 0) throw new Error('check-budgets: no eager scripts found in dist/index.html');

let eagerJs = 0;
let totalJs = 0;
let css = 0;
const rows = [];
for (const name of assets.filter((f) => f.endsWith('.js'))) {
  const size = await gz(path.join(dist, 'assets', name));
  totalJs += size;
  const isEager = eager.includes(`assets/${name}`);
  if (isEager) eagerJs += size;
  rows.push(`  ${isEager ? 'eager' : 'lazy '}  ${kb(size).padStart(8)}  ${name}`);
}
for (const name of assets.filter((f) => f.endsWith('.css'))) css += await gz(path.join(dist, 'assets', name));
const htmlSize = Buffer.byteLength(html);

console.log(rows.join('\n'));
const results = [
  ['Eager JS (gzip)', eagerJs, budgets.eagerJs],
  ['Total JS (gzip)', totalJs, budgets.totalJs],
  ['CSS (gzip)', css, budgets.css],
  ['dist/index.html (raw)', htmlSize, budgets.html],
];
let failed = false;
console.log('');
for (const [label, value, limit] of results) {
  const ok = value <= limit;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label.padEnd(24)} ${kb(value).padStart(9)} of ${kb(limit)}`);
}
if (failed) {
  console.error('\ncheck-budgets: over budget');
  process.exit(1);
}
