import { useEffect, useRef, useState } from 'react';
import { TOP_ID, profile, resumeHref, sections } from '../content';
import useActiveSection from '../hooks/useActiveSection';
import { isApplePlatform } from '../lib/platform';
import MenuSheet from './MenuSheet';
import { CommandIcon, DownloadIcon, SearchIcon } from './icons';

interface TopBarProps {
  onOpenPalette: () => void;
}

/** The mini lockup: the same two widths as the hero name, at 16px. */
export function Wordmark({ className = 'wordmark' }: { className?: string }) {
  return (
    <a href={`#${TOP_ID}`} className={className}>
      <span className="a">{profile.givenName}</span> <span className="m">{profile.familyName}</span>
    </a>
  );
}

/**
 * Sticky, opaque top bar. A hairline appears after 24px of scroll (no blur).
 * At 1100px and wider: section links with aria-current, a visible Search pill
 * that opens the command palette, and the résumé download. Below 1100px:
 * wordmark + Search + Menu (a plain sheet with the links and the two actions).
 */
export default function TopBar({ onOpenPalette }: TopBarProps) {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [apple, setApple] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rendered as 'Ctrl K' on the server; Apple visitors get '⌘ K' after mount.
  useEffect(() => setApple(isApplePlatform()), []);

  return (
    <header className="topbar" data-scrolled={scrolled ? '' : undefined}>
      <div className="shell topbar-inner">
        <Wordmark />

        <div className="topbar-right">
          <nav className="topbar-nav" aria-label="Sections">
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="topbar-link"
                    aria-current={active === s.id ? 'location' : undefined}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="search-pill"
            onClick={onOpenPalette}
            aria-haspopup="dialog"
            aria-keyshortcuts={apple ? 'Meta+K' : 'Control+K'}
          >
            <SearchIcon />
            Search
            <kbd className="keycap">
              {apple ? (
                <>
                  <CommandIcon />
                  <span>K</span>
                </>
              ) : (
                'Ctrl K'
              )}
            </kbd>
          </button>

          <a href={resumeHref} download={profile.resume.fileName} className="topbar-resume">
            Resume
            <DownloadIcon />
          </a>

          <button
            type="button"
            className="topbar-pill topbar-pill-search"
            onClick={onOpenPalette}
            aria-haspopup="dialog"
            aria-label="Search"
          >
            <SearchIcon />
            <span className="topbar-pill-label">Search</span>
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="topbar-pill"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu-sheet"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      <MenuSheet
        id="menu-sheet"
        open={menuOpen}
        active={active}
        onClose={() => setMenuOpen(false)}
        returnFocusTo={menuButtonRef}
      />
    </header>
  );
}
