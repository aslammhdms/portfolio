import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The contact card is generated from src/content (scripts/build-vcard.mjs writes it
 * into dist/ at build time). In dev, serve the same generated text at the same path.
 */
function devVCard(): Plugin {
  return {
    name: 'dev-vcard',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.endsWith('.vcf')) return next();
        const { buildVCard } = await server.ssrLoadModule('/src/content/index.ts');
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.end(buildVCard());
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), devVCard()],
  // Cloudflare Workers serves the site at the domain root. The legacy GitHub Pages
  // deploy builds with `--mode pages` (npm run build:pages), which serves it under
  // /portfolio/. A BASE environment variable overrides both. The client and the SSR
  // build get the same value, so the prerendered URLs match the client's.
  base: process.env.BASE || (mode === 'pages' ? '/portfolio/' : '/'),
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: !isSsrBuild,
    // The SSR bundle only renders HTML at build time; it needs no copy of public/.
    copyPublicDir: !isSsrBuild,
  },
}));
