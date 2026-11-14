// Renders the downloadable résumé public/doc/Aslam_Muhammed_Resume.pdf (A4, two pages)
// from src/content, so the PDF and the page always say the same thing. Committed output,
// like og.png: the site build never needs a browser. Re-run after changing the content:
//
//   npm i --no-save playwright && node scripts/build-resume.mjs
//
// Then copy the printed byte count into profile.resume (src/content/profile.ts).
import { readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Playwright is not a dependency; PLAYWRIGHT_DIR may point at a global install's node_modules.
let playwright;
try {
  playwright = await import('playwright');
} catch {
  if (!process.env.PLAYWRIGHT_DIR) throw new Error('build-resume: playwright not found (set PLAYWRIGHT_DIR or npm i --no-save playwright)');
  playwright = createRequire(path.join(process.env.PLAYWRIGHT_DIR, 'x.js'))('playwright');
}
const { chromium } = playwright;

// The content layer is TypeScript: bundle it once to a module Node can import.
const bundle = path.join(root, 'scripts', 'resume', '.content.mjs');
await build({
  entryPoints: [path.join(root, 'src', 'content', 'index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  define: { 'import.meta.env.BASE_URL': '"/"' },
  logLevel: 'silent',
});
const c = await import(pathToFileURL(bundle).href);
await rm(bundle);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const { profile } = c;
const site = c.SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

const jobs = c.experience
  .flatMap((job) =>
    job.roles.map((role) => {
      const bullets = [...role.highlights];
      if (job.onsite && job.onsite.duringRole === role.title) {
        const o = job.onsite;
        bullets.push(
          `Spent ${o.months} months onsite in ${o.location} (${c.formatRange(o.start, o.end)}) supporting ${o.client}’s live system: fixing issues, correcting data and working directly with the client`,
        );
      }
      return `<section class="job">
  <h3><span><strong>${esc(role.title)}</strong>, ${esc(job.company)} · ${esc(job.location)}</span><span class="dates">${esc(c.formatRange(role.start, role.end))}</span></h3>
  <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
</section>`;
    }),
  )
  .join('\n');

const projects = c.projects
  .map(
    (p) => `<section class="project">
  <p class="row"><span><strong>${esc(p.name)}</strong>, ${esc(p.org)}</span><span class="dates">${esc(c.STATUS_LABEL[p.status])}</span></p>
  <p>${esc(p.summary)}</p>
  <p class="stack">${esc(p.stack.join(' · '))}</p>
</section>`,
  )
  .join('\n');

const skills = [...c.skillGroups.map((g) => [g.title, g.skills]), ['Tools', c.toolbox]]
  .map(([title, list]) => `<li><strong>${esc(title)}:</strong> ${esc(list.join(', '))}</li>`)
  .join('');

const education = c.education
  .map((e) => `<p class="row"><span><strong>${esc(e.degree)}</strong>, ${esc(e.school)}</span><span class="dates">${esc(e.start)} – ${esc(e.end)}</span></p>`)
  .join('');

const body = `
<header>
  <h1>${esc(profile.name)}</h1>
  <p class="title">${esc(profile.title)}</p>
  <p class="contact">${esc(profile.location.short)} (${esc(profile.residency)}) · <a href="tel:${esc(profile.phone.tel)}">${esc(profile.phone.display)}</a> · <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a><br />
  <a href="${esc(profile.linkedin.url)}">${esc(profile.linkedin.label)}</a> · <a href="${esc(c.SITE_URL)}">${esc(site)}</a></p>
</header>
<h2>Summary</h2>
<p>${esc(c.resumeSummary)}</p>
<h2>Experience</h2>
${jobs}
<h2>Selected projects</h2>
${projects}
<h2>Skills</h2>
<ul class="skills">${skills}</ul>
<h2>Education</h2>
${education}
<h2>Languages</h2>
<p>${esc(profile.languages.join(', '))}</p>`;

const mona = pathToFileURL(path.join(root, 'node_modules', '@fontsource-variable', 'mona-sans', 'files', 'mona-sans-latin-wght-normal.woff2')).href;
let html = await readFile(path.join(root, 'scripts', 'resume', 'resume.html'), 'utf8');
html = html
  .replace('/*MONA*/', () => mona)
  .replace('<!--TITLE-->', () => esc(`${profile.name} — ${profile.title}`))
  .replace('<!--BODY-->', () => body);

const tmp = path.join(root, 'scripts', 'resume', '.render.html');
await writeFile(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
const out = path.join(root, 'public', profile.resume.path);
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true });
await browser.close();
await rm(tmp);

const { size } = await stat(out);
console.log(`build-resume: wrote public/${profile.resume.path} — ${size} B (${Math.round(size / 1024)} KB)`);
if (size !== profile.resume.bytes) console.log(`build-resume: update profile.resume.bytes to ${size} and sizeLabel to '${Math.round(size / 1024)} KB'`);
