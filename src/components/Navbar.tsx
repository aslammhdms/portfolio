import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import useActiveSection from '../hooks/useActiveSection';

const navItems = [
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Stack', href: '#skills', id: 'skills' },
  { name: 'Work', href: '#projects', id: 'projects' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

interface NavbarProps {
  onOpenPalette: () => void;
}

export default function Navbar({ onOpenPalette }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ThemeButton = (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
    >
      {theme === 'dark' ? <HiSun size={18} /> : <HiMoon size={18} />}
    </button>
  );

  const PaletteButton = (
    <button
      onClick={onOpenPalette}
      aria-label="Open command palette"
      className="flex h-9 items-center gap-1 rounded-lg border border-line px-2.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-fg"
    >
      {isMac ? '⌘K' : 'Ctrl K'}
    </button>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-canvas/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between" aria-label="Primary">
        <a href="#home" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-sm font-semibold text-accent transition-colors group-hover:border-accent/50">
            A
          </span>
          <span className="font-mono text-sm text-muted transition-colors group-hover:text-fg">
            aslam<span className="text-accent">.dev</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                active === item.id ? 'text-accent' : 'text-muted hover:text-fg'
              }`}
            >
              {item.name}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-line" aria-hidden="true" />
          {PaletteButton}
          {ThemeButton}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          {PaletteButton}
          {ThemeButton}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-fg"
          >
            {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-line bg-canvas md:hidden"
          >
            <div className="shell flex flex-col py-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 py-3 font-mono text-sm transition-colors ${
                    active === item.id ? 'text-accent' : 'text-muted hover:text-fg'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
