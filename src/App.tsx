import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import ScrollScene from './components/scroll/ScrollScene';
import { useEngineMode } from './hooks/useEngineMode';
import { clips } from './scenes/clips';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const mode = useEngineMode();

  // ⌘K / Ctrl+K toggles the command palette.
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

  // Easter eggs: a note for devs who open the console, and the Konami code.
  useEffect(() => {
    console.log(
      '%c$ whoami\n%cHey, fellow dev 👋 — this site is hand-built with React, TypeScript & Tailwind.\nTry the Konami code, or type `sudo hire-me` in the hero terminal.\n%c→ aslammhdms@gmail.com',
      'color:#39E0C8;font-family:monospace;font-size:13px',
      'color:#9099A8;font-family:monospace',
      'color:#7C6CFF;font-family:monospace'
    );

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        document.body.classList.add('konami');
        console.log('%c▲ konami unlocked — nice.', 'color:#7C6CFF;font-family:monospace');
        window.setTimeout(() => document.body.classList.remove('konami'), 1100);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main">
        <ScrollScene clip={clips.hero} mode={mode} pin>
          <Hero />
        </ScrollScene>
        <ScrollScene clip={clips.about} mode={mode}>
          <About />
        </ScrollScene>
        <ScrollScene clip={clips.skills} mode={mode}>
          <Skills />
        </ScrollScene>
        <ScrollScene clip={clips.projects} mode={mode}>
          <Projects />
        </ScrollScene>
        <ScrollScene clip={clips.contact} mode={mode}>
          <Contact />
        </ScrollScene>
      </main>
      <Footer />
      <StatusBar />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

export default App;
