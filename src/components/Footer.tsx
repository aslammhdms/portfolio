import { useEffect, useState } from 'react';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { colophon } from '../content';
import { isApplePlatform } from '../lib/platform';
import { focusTerminal } from '../lib/terminal';
import { CommandIcon, PrintIcon } from './icons';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

/**
 * The colophon: one hairline row in ink-3. Copyright, how the page is made, the
 * shortcuts that exist, Print as CV and the Dark/Light switch. No icon wall. In
 * print, the row gives way to a single line saying where the CV came from.
 */
export default function Footer() {
  const { theme, setTheme } = useTheme();
  // 'Ctrl K' on the server; Apple visitors get '⌘ K' after mount.
  const [apple, setApple] = useState(false);
  useEffect(() => setApple(isApplePlatform()), []);

  return (
    <footer className="footer">
      <div className="shell footer-row">
        <p className="footer-copy">{colophon.copyright}</p>
        <p className="footer-colophon">{colophon.text}</p>
        <p className="footer-keys">
          <kbd className="keycap">
            {apple ? (
              <>
                <CommandIcon />
                <span>K</span>
              </>
            ) : (
              'Ctrl K'
            )}
          </kbd>{' '}
          search · type <code className="footer-code">help</code> in the{' '}
          <button type="button" className="footer-link" onClick={focusTerminal} aria-label="Open the terminal">
            terminal
          </button>
        </p>
        <div className="footer-actions">
          <button type="button" className="footer-print" onClick={() => window.print()}>
            <PrintIcon />
            Print as CV
          </button>
          {/* Dark is the default for everyone; light is only ever an explicit, saved choice. */}
          <div className="theme-switch" role="group" aria-label="Colour theme">
            {THEMES.map((t) => (
              <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="shell footer-printed">{colophon.printFooter}</p>
    </footer>
  );
}
