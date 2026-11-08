// Writes the contact card (dist/aslam-muhammed.vcf) from src/content, through the SSR
// bundle, so the .vcf can never drift from the page. There is no hand-written copy in
// public/. Run by `npm run build` and `npm run build:pages` after `vite build --ssr`.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { vcard } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

const card = vcard();
if (!card.text.startsWith('BEGIN:VCARD\r\n') || !card.text.includes('FN:')) {
  throw new Error('build-vcard: the generated card is malformed');
}
const out = path.join(root, 'dist', card.path);
await writeFile(out, card.text, 'utf8');
console.log(`build-vcard: wrote dist/${card.path} (${Buffer.byteLength(card.text)} B)`);
