# Aslam Muhammed — Portfolio

> Portfolio of Aslam Muhammed — Software Engineer · .NET & IT Systems, Abu Dhabi.
> Live at https://portfolio.aslammhdms.workers.dev/

A fast, accessible single-page portfolio built with React 18, TypeScript, Vite 5 and Tailwind CSS 3,
prerendered at build time and hydrated on load.

## Design — v4 "Equal Measure"

The name is set at equal measure: a heavy, wide "Aslam" over a light, condensed "Muhammed", both cut to
exactly the width of the column. The rest of the page follows the same idea: one grid, one rule weight,
no decoration that does not carry information.

- **Tokens** (`src/styles/tokens.css`): neutral graphite (`#131313` canvas) with one Raspberry accent.
  `#C2387D` fills carry white labels; `#FF5AA5` is for small live marks and the 2px focus ring. Colours are
  RGB channels so Tailwind's `/alpha` modifiers work. `accent-wash` and `selection` are fixed colours,
  because the contrast of text on them was checked against those exact values. Dark for every visitor; the
  light theme is saved only when chosen. Contrast ratios are noted beside each value: re-run them if one changes.
- **Type:** Mona Sans (body and UI) and Cascadia Mono (labels, terminal, status bar), both self-hosted
  through `@fontsource-variable`. Two tiny renamed subsets of Mona Sans: **AM Display** (12 glyphs, the
  name lockup, inlined in `index.html` so the LCP heading never waits for the network) and **AM Figures**
  (`public/fonts/am-figures.woff2`, condensed light numerals for report figures and Work indices).
- **Layout:** 12 columns; Work rows use a rail (columns 1–2), text (3–7) and visual (8–12). Hairlines
  instead of cards. Information is square, actions are round.
- **Signature moments:** the name lock-in and the portrait's colour bloom (first page view of a session
  only; never under reduced motion or Save-Data); the equal-measure lockup that refits to its column;
  Stack skills that link to the projects that used them; module-level diagrams for private systems;
  a live terminal band that types `whoami` when it scrolls into view.
- **Motion** is CSS-only and respects `prefers-reduced-motion` and the in-page *Reduce motion* preference.

## The terminal, palette and shortcuts

The Prompt band (after Work) and the drawer share one terminal session. Nothing is reachable only through
the terminal or the palette: every action also exists as a link or button on the page.

| Shortcut | Does |
| --- | --- |
| `Ctrl`/`⌘` + `K` | Search and jump (command palette) |
| `Ctrl` + `` ` `` | Terminal drawer (also the `>_` button in the status bar) |
| `?` | Shortcuts sheet (can be turned off) |
| `Esc` | Close a panel |
| `↑` `↓` / `Tab` / `Ctrl`+`L` | In the terminal: history, complete, clear |

Commands (`help` lists them): `whoami`, `now`, `work`, `open <name|n>`, `trace <helpdesk|tricore>`,
`stack [term]`, `experience`, `contact`, `copy email`, `resume`, `vcard`, `linkedin`, `call`,
`theme [dark|light]`, `motion [on|off]`, `history`, `clear`, `exit`, plus a few hidden ones.
The engine lives in `src/terminal/engine.ts`; the terminal, palette and shortcuts sheet are lazy chunks.

## Content

Everything the page shows comes from typed modules in `src/content/`. Components hold no copy.

| File | Holds |
| --- | --- |
| `profile.ts` | Name, title, contact details, résumé file, portrait, hero lede |
| `now.ts`, `availability.ts` | The NOW line and the one availability line (hero and Contact only) |
| `experience.ts`, `history.ts` | Jobs, education, certifications |
| `projects.ts`, `diagrams.ts` | Featured and compact projects; module-level diagrams with "Read as text" steps |
| `skills.ts`, `derive.ts` | Skill catalogue; evidence derived from projects (the prerender fails if a skill has no project) |
| `site.ts` | Section copy, colophon, `SITE_URL` |
| `seo.ts` | Person JSON-LD, generated into `dist/index.html` |

### How to update content

1. Edit the module above. Only claim numbers that are true (5 years, 19 branches, 100+ staff, ~90 data entities).
2. Bump `now.updated` / `now.updatedISO` in `now.ts` (drives the footer and the copyright year).
3. Replace the résumé PDF in `public/doc/` (keep the file name) and update `profile.resume.bytes` and `sizeLabel`.
4. `npm run build && npm run check:budgets`.

## Getting started

```bash
npm install
npm run dev            # dev server on http://localhost:3000 (client-rendered)
npm run build          # tsc, client build, SSR build, prerender, vCard
npm run preview        # preview the production build
npm run lint           # ESLint (max-warnings 0)
npm run check:budgets  # size budgets on the built dist/
```

## Scripts

Run by the build:

- `scripts/prerender.mjs` renders the app with the SSR bundle into `dist/index.html`, adds the Person
  JSON-LD and a preload for the body font, and writes `dist/404.html` (same shell, no app bundle).
- `scripts/build-vcard.mjs` writes `dist/aslam-muhammed.vcf` from `src/content`, so it cannot drift.

Run by hand (outputs are committed; the site build needs neither Python nor a browser):

- `scripts/subset-fonts.py` (fontTools + brotli) cuts AM Display and AM Figures from the pinned
  `@fontsource-variable/mona-sans@5.3.0`, renames them (the OFL reserves the name "Mona"), writes
  `public/fonts/am-figures.woff2` and `public/fonts/OFL.txt`, and updates the inline `@font-face` in `index.html`.
- `scripts/portrait-images.py` (Pillow) writes the portrait derivatives in `public/images/`.
- `scripts/build-og.mjs` renders `public/og.png` (1200×630 link preview) from `scripts/og/og.html` with
  Playwright (`npm i --no-save playwright`, then `node scripts/build-og.mjs`; Pillow shrinks the PNG).
  Re-run it if the title or portrait changes.
- `scripts/check-budgets.mjs` (`npm run check:budgets`) fails if eager JS is over 90 KB gzip, total JS over
  130 KB, CSS over 20 KB, or `dist/index.html` over 120 KB. It is not part of the Cloudflare build.

## Deployment

**Cloudflare Workers (primary).** Cloudflare runs `npm run build`, then `npx wrangler deploy` serves
`./dist` as static assets (see `wrangler.toml`; unknown paths get `404.html` with a 404 status). The site
is built for the domain root. The canonical URL, `og:url`, `sitemap.xml` and `robots.txt` all name
`https://portfolio.aslammhdms.workers.dev/`; change them (and `SITE_URL` in `src/content/site.ts`) if the
address ever changes.

**GitHub Pages (legacy).** `npm run deploy` runs `predeploy` → `npm run build:pages`, which builds with
`--mode pages` so every URL resolves under `/portfolio/`, then publishes `dist/` to the `gh-pages` branch.
A `BASE` environment variable overrides the base for any other host, e.g. `BASE=/sub/ npm run build`.

## Contact

- **Email:** aslammhdms@gmail.com
- **LinkedIn:** [linkedin.com/in/aslammhdms](https://www.linkedin.com/in/aslammhdms)
- **Location:** Abu Dhabi, UAE
