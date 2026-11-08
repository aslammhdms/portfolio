import { useCallback, useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/hero/Hero';
import Work from './components/work/Work';
import PromptBand from './components/PromptBand';
import Experience from './components/Experience';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import { profile } from './content';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // Ctrl+K / ⌘K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Easter eggs: a note for developers who open the console, and the Konami code.
  useEffect(() => {
    console.log(
      `%c$ whoami\n%c${profile.name} — ${profile.title}, ${profile.location.city}.\nThis site is hand-built with React, TypeScript and Tailwind. Try the Konami code, or type \`sudo hire-me\` in the terminal.\n%c→ ${profile.email}`,
      'color:#FF5AA5;font-family:monospace;font-size:13px',
      'color:#B7B7B5;font-family:monospace',
      'color:#FF5AA5;font-family:monospace'
    );

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        const root = document.documentElement;
        root.classList.add('konami-roll');
        document.body.classList.add('konami');
        console.log('%cKonami accepted.', 'color:#FF5AA5;font-family:monospace');
        window.setTimeout(() => {
          document.body.classList.remove('konami');
          root.classList.remove('konami-roll');
        }, 1100);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar onOpenPalette={openPalette} />
      <main id="main">
        <Hero />
        <Work />
        <PromptBand />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <StatusBar onOpenPalette={openPalette} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </>
  );
}

export default App;
