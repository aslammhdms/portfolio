import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages sets CF_PAGES=1 and serves at the domain root;
  // GitHub Pages serves under /portfolio/. Auto-switch so both work.
  base: process.env.CF_PAGES ? '/' : '/portfolio/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
