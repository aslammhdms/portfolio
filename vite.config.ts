import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react()],
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
