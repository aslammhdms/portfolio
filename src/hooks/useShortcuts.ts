import { useEffect } from 'react';
import { getPrefs } from '../lib/prefs';
import { konami, pressKey } from '../lib/site';
import { toggleDrawer } from '../terminal/store';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

/** True when the key press is going into something the visitor is typing in. */
function typingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName);
}

interface Handlers {
  togglePalette: () => void;
  openShortcuts: () => void;
}

/**
 * Global keys: Ctrl/⌘K (palette), Ctrl+` (terminal drawer, matched on event.code
 * 'Backquote' so it works on any keyboard layout), '?' (shortcuts sheet; can be
 * switched off) and the Konami code. Each fired shortcut presses its keycap.
 */
export default function useShortcuts({ togglePalette, openShortcuts }: Handlers) {
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        pressKey('palette');
        togglePalette();
        return;
      }
      if (e.ctrlKey && !e.metaKey && !e.altKey && e.code === 'Backquote') {
        e.preventDefault();
        // Not on top of another modal (the palette, the menu or the shortcuts sheet).
        if (document.querySelector('.pal, dialog[open]')) return;
        pressKey('terminal');
        toggleDrawer();
        return;
      }
      if (typingTarget(e.target)) return;
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && getPrefs().questionKey) {
        e.preventDefault();
        pressKey('help');
        openShortcuts();
        return;
      }
      const k = e.key.toLowerCase();
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        konami();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePalette, openShortcuts]);
}
