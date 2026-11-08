import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/hero/Hero';
import Work from './components/work/Work';
import PromptBand from './components/PromptBand';
import Experience from './components/Experience';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import ShortcutsSheet from './components/ShortcutsSheet';
import Toaster from './components/Toaster';
import { useTheme } from './contexts/ThemeContext';
import useShortcuts from './hooks/useShortcuts';
import { profile } from './content';
import { initPrefs } from './lib/prefs';
import { registerSiteHandlers } from './lib/site';
import { useTerm } from './terminal/store';

// The palette and the terminal drawer are separate chunks, fetched when first wanted.
const loadPalette = () => import('./components/palette/Palette');
const Palette = lazy(loadPalette);
const TerminalDrawer = lazy(() => import('./terminal/TerminalDrawer'));

/** The note for people who open the console. No emoji; the key is written as the backquote character. */
function consoleNote() {
  console.log(
    `%c$ whoami\n%c${profile.name} — ${profile.title}, ${profile.location.city}.\nYou opened the console, so you'll like the terminal: press Ctrl+\` anywhere.\n%c→ ${profile.email}`,
    'color:#FF5AA5;font-family:monospace;font-size:13px',
    'color:#B7B7B5;font-family:monospace',
    'color:#FF5AA5;font-family:monospace'
  );
}

function App() {
  const { setTheme } = useTheme();
  const term = useTerm();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useShortcuts({ togglePalette, openShortcuts });

  // Saved preferences (reduced motion, status bar) are read after mount, so the prerendered page matches.
  useEffect(() => {
    initPrefs();
    consoleNote();
  }, []);

  // Fetch the palette once the browser is idle, so Ctrl+K opens it at once.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const handle = idle(() => void loadPalette());
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  // The lazy chunks reach the page's theme and overlays through lib/site.ts.
  const handlers = useMemo(
    () => ({
      openPalette,
      openShortcuts,
      getTheme: () => (document.documentElement.getAttribute('data-theme') === 'light' ? ('light' as const) : ('dark' as const)),
      setTheme,
    }),
    [openPalette, openShortcuts, setTheme]
  );
  useEffect(() => registerSiteHandlers(handlers), [handlers]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar onOpenPalette={openPalette} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Work />
        <PromptBand />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <StatusBar onOpenPalette={openPalette} />
      {term.drawerMounted && (
        <Suspense fallback={null}>
          <TerminalDrawer />
        </Suspense>
      )}
      {paletteOpen && (
        <Suspense fallback={null}>
          <Palette onClose={closePalette} />
        </Suspense>
      )}
      <ShortcutsSheet open={shortcutsOpen} onClose={closeShortcuts} />
      <Toaster />
    </>
  );
}

export default App;
