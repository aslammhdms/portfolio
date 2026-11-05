import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/mona-sans/wght.css';
import '@fontsource-variable/cascadia-mono/wght.css';
import './index.css';
import './styles/chrome.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/work.css';
import Root from './Root';

const container = document.getElementById('root')!;

// The production build prerenders the page into #root (scripts/prerender.mjs), so
// React hydrates it. The dev server serves an empty #root and renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, <Root />);
} else {
  createRoot(container).render(<Root />);
}
