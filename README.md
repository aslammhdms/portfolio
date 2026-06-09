# Aslam Muhammed — Portfolio

> Portfolio of Aslam Muhammed — .NET Developer & IT Systems Engineer, Abu Dhabi.

A fast, accessible single-page portfolio built with React, TypeScript, Vite and Tailwind CSS.

## Design — "Terminal Ink"

A dark-first, developer-leaning aesthetic:

- **Palette:** near-black ink canvas, hairline borders, a single electric-indigo accent (`#7C6CFF`) plus a teal signal colour. Light theme available via toggle.
- **Type:** Space Grotesk (display) · Inter (body) · JetBrains Mono (labels & code motifs).
- **System:** semantic CSS-variable tokens, 4px spacing scale, tight radii, elevation by hairline rather than heavy shadow.
- **Motion:** restrained fade-and-rise reveals; fully honours `prefers-reduced-motion`.

## Sections

Hero (positioning) → About (bio, experience timeline, education) → Stack → Featured Projects (case-study depth) → Contact.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · React Icons.

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint     # ESLint (max-warnings 0)
```

## Deployment

Configured for **GitHub Pages** under the `/portfolio/` base path (see `vite.config.ts`).

```bash
npm run deploy   # builds and publishes dist/ to the gh-pages branch
```

> Public assets (profile image, résumé) live in `public/` and are referenced via
> `import.meta.env.BASE_URL` so they resolve correctly under the Pages base path.

## Contact

- **Email:** aslammhdms@gmail.com
- **LinkedIn:** [linkedin.com/in/aslammhdms](https://www.linkedin.com/in/aslammhdms)
- **Location:** Abu Dhabi, UAE
