# Aslam Muhammed — Portfolio

> Portfolio of Aslam Muhammed — Software Engineer · .NET & IT Systems, Abu Dhabi.

A fast, accessible single-page portfolio built with React, TypeScript, Vite and Tailwind CSS,
prerendered at build time.

## Design — v4 "Equal Measure"

- **Palette:** neutral graphite (`#131313` canvas) with one Raspberry accent: `#C2387D` fills with
  white labels, `#FF5AA5` for small live marks and the focus ring. Dark for every visitor; an
  optional light theme is saved only when chosen. Tokens live in `src/styles/tokens.css` as RGB
  channels so Tailwind's `/alpha` modifiers work; `accent-wash` and `selection` are fixed colours.
- **Type:** Mona Sans (body and UI), Cascadia Mono (labels, terminal, status bar), and "AM Display",
  a 12-glyph renamed subset of Mona Sans for the equal-measure name lockup, inlined in `index.html`.
- **Structure:** hairlines and ledgers instead of cards, information square, actions round. Motion
  only in the name lock-in and the portrait's colour bloom on the first visit of a session.

## Content

Everything the hero, top bar, status bar, terminal and palette show comes from the typed modules in
`src/content/` (profile, now, availability, experience, projects, skills, history).

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:3000 (client-rendered)
npm run build    # type-check, client build, SSR build, prerender into dist/index.html
npm run preview  # preview the production build
npm run lint     # ESLint (max-warnings 0)
```

## Deployment

**Cloudflare Workers (primary).** Cloudflare runs `npm run build`, then `npx wrangler deploy`
serves `./dist` as static assets (see `wrangler.toml`). The site is built for the domain root.

**GitHub Pages (legacy).** `npm run deploy` runs `predeploy` → `npm run build:pages`, which builds
with `--mode pages` so every URL (scripts, fonts, images, the résumé) resolves under `/portfolio/`,
then publishes `dist/` to the `gh-pages` branch. A `BASE` environment variable overrides the base
for any other host, e.g. `BASE=/sub/ npm run build`.

## Maintenance scripts (not part of the build)

The build never needs Python; these outputs are committed.

- `scripts/subset-fonts.py` (fontTools + brotli) cuts AM Display and AM Figures from the pinned
  `@fontsource-variable/mona-sans@5.3.0`, renames them (the OFL reserves the name "Mona"), writes
  `public/fonts/am-figures.woff2` and `public/fonts/OFL.txt`, and updates the inline `@font-face`
  in `index.html`.
- `scripts/portrait-images.py` (Pillow) writes the portrait derivatives in `public/images/`.

## Contact

- **Email:** aslammhdms@gmail.com
- **LinkedIn:** [linkedin.com/in/aslammhdms](https://www.linkedin.com/in/aslammhdms)
- **Location:** Abu Dhabi, UAE
