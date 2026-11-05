// Build-time prerender: renders the app with the SSR bundle (dist-ssr/entry-server.js)
// and writes the HTML into dist/index.html's #root, so the first paint is real
// content and React hydrates it. Also preloads the latin Mona Sans file (the body
// face), whose hashed name is only known after the client build.
//
// Run by `npm run build` after `vite build` and `vite build --ssr`.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const ROOT_MARKER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

let html = await readFile(htmlPath, 'utf8');
if (!html.includes(ROOT_MARKER)) {
  throw new Error(`prerender: ${ROOT_MARKER} not found in dist/index.html (was it already prerendered?)`);
}

const appHtml = render();
if (!appHtml.includes('Aslam')) throw new Error('prerender: the rendered app does not contain the name');
// A replacer function, not a string: '$&', "$'" and '$$' in the content stay literal.
const rootHtml = `<div id="root">${appHtml}</div>`;
html = html.replace(ROOT_MARKER, () => rootHtml);
if (!html.includes(rootHtml)) throw new Error('prerender: #root does not hold the rendered app');

// The deploy base ('/' or '/portfolio/') is whatever Vite used for the stylesheet link.
const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*>/)?.[0] ?? '';
const cssHref = stylesheet.match(/href="([^"]+)"/)?.[1] ?? '/assets/';
const base = cssHref.slice(0, cssHref.indexOf('assets/'));

const assets = await readdir(path.join(root, 'dist', 'assets'));
const monaLatin = assets.find((file) => /^mona-sans-latin-wght-normal-[\w-]+\.woff2$/.test(file));
if (monaLatin) {
  const preload = `<link rel="preload" href="${base}assets/${monaLatin}" as="font" type="font/woff2" crossorigin />`;
  html = html.replace('</title>', () => `</title>\n    ${preload}`);
}

await writeFile(htmlPath, html);
console.log(
  `prerender: dist/index.html now holds ${(appHtml.length / 1024).toFixed(1)} KB of prerendered markup` +
    (monaLatin ? ` and preloads ${monaLatin}` : ' (Mona Sans latin file not found, no preload)')
);
