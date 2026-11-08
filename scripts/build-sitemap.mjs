// Writes dist/sitemap.xml with <lastmod> taken from src/content/now.ts (updatedISO), so it
// moves with the footer's "Last updated" and the vCard instead of going stale in public/.
// Both builds write it (as the old static file did); the canonical URL comes from the page.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
{
  const now = await readFile(path.join(root, 'src', 'content', 'now.ts'), 'utf8');
  const lastmod = now.match(/updatedISO:\s*'([0-9-]+)'/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!lastmod || !canonical) throw new Error('build-sitemap: updatedISO or canonical URL not found');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n</urlset>\n`;
  await writeFile(path.join(root, 'dist', 'sitemap.xml'), xml);
  console.log(`build-sitemap: wrote dist/sitemap.xml (${lastmod})`);
}
