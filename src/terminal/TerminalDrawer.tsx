import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CloseIcon } from '../components/icons';
import { closeDrawer, useTerm } from './store';
import TerminalBody from './TerminalBody';

/**
 * The terminal as a drawer: 40vh (70vh on phones), sliding up from the status bar in
 * 240 ms. The same session as the Prompt band. Tab stays inside it, Esc closes it and
 * focus goes back to whatever opened it. While it is closed it is inert, so nothing in
 * it can take focus or be read out.
 */
export default function TerminalDrawer() {
  const term = useTerm();
  const open = term.drawerOpen;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // The first frame is the closed position, so the very first opening slides too.
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setShown(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (el) el.inert = !open;
  }, [open]);

  useEffect(() => {
    if (shown) document.getElementById('term-input-drawer')?.focus({ preventScroll: true });
  }, [shown]);

  // The page behind keeps its last link clear of the drawer when it scrolls to a target.
  useEffect(() => {
    document.documentElement.classList.toggle('drawer-open', open);
    return () => document.documentElement.classList.remove('drawer-open');
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeDrawer();
      return;
    }
    // The prompt uses Tab to complete a command and says so with preventDefault.
    if (e.key !== 'Tab' || e.defaultPrevented) return;
    const focusables = ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex="0"]');
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <section
      ref={ref}
      id="term-drawer"
      className="term term-drawer"
      data-open={shown ? '' : undefined}
      data-skin={term.skin}
      role="region"
      aria-label="Terminal"
      onKeyDown={onKeyDown}
    >
      <div className="term-head">
        <span>{term.skin === 'v1' ? 'HEAD detached at a46821c' : 'aslam@auh ~'}</span>
        <span className="term-head-right">
          <span className="term-hint">Esc closes</span>
          <button type="button" className="term-btn" onClick={closeDrawer}>
            Close
            <CloseIcon />
          </button>
        </span>
      </div>
      <TerminalBody placement="drawer" />
    </section>
  );
}
