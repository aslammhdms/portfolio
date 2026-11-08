import { StrictMode } from 'react';
import { profile, sections } from './content';
import { Wordmark } from './components/TopBar';

const BASE = import.meta.env.BASE_URL;
/** What the prerendered page says until the script below fills in the real address. */
export const NOT_FOUND_FALLBACK = 'this address';

/**
 * The 404 page (dist/404.html, prerendered; scripts/prerender.mjs adds the one line
 * of script that writes the visitor's real path into #nf-path). The same top bar
 * wordmark, one terminal-styled line, and links to the four sections. No JavaScript
 * bundle: it is plain HTML and the site's stylesheet. Cloudflare serves it (with a
 * 404 status) through not_found_handling = "404-page"; GitHub Pages does the same.
 */
export default function NotFound() {
  return (
    <StrictMode>
      <header className="topbar nf-bar" data-scrolled="">
        <div className="shell topbar-inner">
          <Wordmark href={BASE} />
          <nav aria-label="Sections">
            <ul className="nf-nav">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="topbar-link" href={`${BASE}#${s.id}`}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="shell nf">
        <h1 className="nf-line">
          <span className="nf-prompt" aria-hidden="true">
            ${' '}
          </span>
          command not found: <span id="nf-path">{NOT_FOUND_FALLBACK}</span>
        </h1>
        <p className="nf-note">
          There is no page at that address. {profile.name}&rsquo;s site is one page; these are its four sections.
        </p>
        <ul className="nf-links" role="list">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`${BASE}#${s.id}`}>
                <span className="nf-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="nf-label">{s.label}</span>
                <span className="nf-path">{s.path}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="pill pill-primary nf-home" href={BASE}>
          Back to the start
        </a>
      </main>
    </StrictMode>
  );
}
