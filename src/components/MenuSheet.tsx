import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { mailtoHref, profile, resumeHref, sections } from '../content';
import { ArrowRightIcon, CloseIcon, DownloadIcon } from './icons';

interface MenuSheetProps {
  id: string;
  open: boolean;
  active: string;
  onClose: () => void;
  returnFocusTo: RefObject<HTMLElement>;
}

/**
 * The compact top bar's menu: a plain full-height sheet with the four section
 * links, Email me and Resume. A native modal <dialog> makes the rest of the page
 * inert and closes on Esc; Tab also wraps inside it. It has no text input, so
 * the phone keyboard never opens.
 */
export default function MenuSheet({ id, open, active, onClose, returnFocusTo }: MenuSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  // Closing with Esc or the Close button returns focus to the Menu button; following a
  // link moves focus to that section instead.
  const restoreFocus = useRef(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      restoreFocus.current = true;
      dialog.showModal();
      document.documentElement.classList.add('sheet-open');
      firstLinkRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Fires however the dialog was closed (Esc, Close button, a link).
  const handleClose = () => {
    document.documentElement.classList.remove('sheet-open');
    if (restoreFocus.current) returnFocusTo.current?.focus();
    onClose();
  };

  const goTo = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    restoreFocus.current = false;
    dialogRef.current?.close();
    // The dialog's close event (which also unlocks the page) fires a task later; unlock
    // now, or the smooth scroll below starts on a page that cannot scroll yet.
    document.documentElement.classList.remove('sheet-open');
    const target = document.getElementById(targetId);
    if (!target) return;
    window.history.pushState(null, '', `#${targetId}`);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // Keep Tab inside the sheet (the modal dialog already makes the page inert).
  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog id={id} ref={dialogRef} className="menu-sheet" aria-label="Menu" onClose={handleClose} onKeyDown={onKeyDown}>
      <div className="shell">
        <div className="menu-sheet-head">
          <span className="mono-label">Menu</span>
          <button type="button" className="topbar-pill menu-sheet-close" onClick={() => dialogRef.current?.close()}>
            Close
            <CloseIcon />
          </button>
        </div>

        <nav className="menu-sheet-nav" aria-label="Sections">
          <ul>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  onClick={(e) => goTo(e, s.id)}
                >
                  {s.label}
                  <span className="menu-sheet-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-sheet-actions">
          <a className="pill pill-primary" href={mailtoHref}>
            Email me
            <ArrowRightIcon />
          </a>
          <a className="pill pill-outline" href={resumeHref} download={profile.resume.fileName}>
            Resume
            <DownloadIcon />
          </a>
        </div>
      </div>
    </dialog>
  );
}
