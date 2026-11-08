import { useEffect, useRef, useState } from 'react';
import { isApplePlatform } from '../lib/platform';
import { setPref, usePrefs } from '../lib/prefs';
import { CloseIcon } from './icons';

interface ShortcutsSheetProps {
  open: boolean;
  onClose: () => void;
}

const K = ({ children }: { children: string }) => <kbd>{children}</kbd>;

/**
 * The '?' sheet: every shortcut on one page. A native modal <dialog> (the page goes
 * inert, Esc closes). It holds the off switch for '?' itself (WCAG 2.1.4: a
 * single-character shortcut can be turned off) and, as its last row, the Konami code.
 */
export default function ShortcutsSheet({ open, onClose }: ShortcutsSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { questionKey } = usePrefs();
  const [apple, setApple] = useState(false);
  useEffect(() => setApple(isApplePlatform()), []);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const mod = apple ? '⌘' : 'Ctrl';

  return (
    <dialog
      ref={ref}
      className="keys-sheet"
      aria-labelledby="keys-title"
      onClose={() => {
        onClose();
        if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="keys-head">
        <h2 id="keys-title" className="keys-title">
          Keyboard shortcuts
        </h2>
        <button type="button" className="keys-close" onClick={() => ref.current?.close()}>
          Close
          <CloseIcon />
        </button>
      </div>
      <ul className="keys-list" role="list">
        <li>
          Search and jump
          <span className="keys-combo" data-keycap="palette">
            <K>{mod}</K>
            <K>K</K>
          </span>
        </li>
        <li>
          Terminal drawer
          <span className="keys-combo" data-keycap="terminal">
            <K>Ctrl</K>
            <K>`</K>
          </span>
        </li>
        <li>
          This sheet
          <span className="keys-combo" data-keycap="help">
            <K>?</K>
          </span>
        </li>
        <li>
          Close a panel
          <span className="keys-combo">
            <K>Esc</K>
          </span>
        </li>
        <li>
          Terminal: earlier and later commands
          <span className="keys-combo">
            <K>↑</K>
            <K>↓</K>
          </span>
        </li>
        <li>
          Terminal: complete a command
          <span className="keys-combo">
            <K>Tab</K>
          </span>
        </li>
        <li>
          Terminal: clear the screen
          <span className="keys-combo">
            <K>Ctrl</K>
            <K>L</K>
          </span>
        </li>
        <li className="keys-secret">
          <span>You know what to do</span>
          <span className="keys-combo" data-keycap="konami" aria-label="Up, up, down, down, left, right, left, right, B, A">
            <K>↑</K>
            <K>↑</K>
            <K>↓</K>
            <K>↓</K>
            <K>←</K>
            <K>→</K>
            <K>←</K>
            <K>→</K>
            <K>B</K>
            <K>A</K>
          </span>
        </li>
      </ul>
      <div className="keys-switch">
        <button
          type="button"
          role="switch"
          aria-checked={questionKey}
          className="switch-row"
          onClick={() => setPref('questionKey', !questionKey)}
        >
          <span>Open this sheet with the ? key</span>
          <span className="switch-track" aria-hidden="true" />
        </button>
        <p className="switch-note">A single-key shortcut. Turn it off if it gets in your way; the other shortcuts use a modifier key.</p>
      </div>
    </dialog>
  );
}
