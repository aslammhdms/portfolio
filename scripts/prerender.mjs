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

const { render, render404 } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

let html = await readFile(htmlPath, 'utf8');
const template = html; // the untouched shell, for the 404 page
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

// ---------- 404.html ----------
// The same shell (stylesheet, fonts, theme script) with the 404 body and no app bundle: it is
// plain HTML plus one line of script that writes the visitor's real path into the page.
// Cloudflare (not_found_handling = "404-page") and GitHub Pages both serve it for unknown paths.
const notFoundBody = render404();
if (!notFoundBody.includes('command not found')) throw new Error('prerender: the 404 page did not render');
let page = template.replace(ROOT_MARKER, () => `<div id="root">${notFoundBody}</div>`);
page = page
  .replace(/<script type="module"[^>]*><\/script>\s*/g, '')
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
  .replace(/<title>[\s\S]*?<\/title>/, () => '<title>Not found — Aslam Muhammed</title>')
  .replace('</head>', () => '  <meta name="robots" content="noindex" />\n  </head>');
if (monaLatin) {
  page = page.replace('</title>', () => `</title>\n    <link rel="preload" href="${base}assets/${monaLatin}" as="font" type="font/woff2" crossorigin />`);
}
// textContent, not innerHTML: the path is the visitor's, so it is never parsed as markup.
const script =
  '<script>try{var e=document.getElementById("nf-path");if(e)e.textContent=decodeURIComponent(location.pathname).slice(0,80)}catch(x){}</script>';
page = page.replace('</body>', () => `${script}\n  </body>`);
await writeFile(path.join(root, 'dist', '404.html'), page);
console.log('prerender: dist/404.html written');
