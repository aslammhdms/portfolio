import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { mailtoHref, profile } from '../content';
import useMediaQuery from '../hooks/useMediaQuery';
import { copyText } from '../lib/clipboard';
import { ArrowRightIcon, ChevronDownIcon, CopyIcon } from './icons';

/** A mouse or trackpad: where a mailto link often has no mail app behind it. */
const DESKTOP = '(hover: hover) and (pointer: fine)';
/** Room the menu needs below the button before it opens upwards instead (menu + status bar). */
const MENU_ROOM = 150;

/**
 * 'Email me', the page's primary action (hero and Contact). On phones, and in the
 * prerendered HTML, it is a plain mailto link. On a desktop, where mailto links often
 * do nothing, it becomes a menu button after mount: Copy address / Open mail app.
 *
 * The menu follows the ARIA menu-button pattern: focus moves to the first item on
 * open, arrows move between items, Escape closes and returns focus, Tab or a click
 * outside closes it. Copy confirms in place ('Copied') before the menu closes.
 */
export default function EmailButton({ className = '' }: { className?: string }) {
  const desktop = useMediaQuery(DESKTOP);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');
  const id = useId();
  const menuId = `${id}-menu`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);

  const items = () => Array.from(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    window.clearTimeout(timer.current);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Focus the first item once the menu is in the DOM.
  useEffect(() => {
    if (open) items()[0]?.focus();
  }, [open]);

  // A click or tap outside closes the menu (focus stays where the visitor put it).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  if (!desktop) {
    return (
      <a className={`pill pill-primary ${className}`.trim()} href={mailtoHref}>
        Email me
        <ArrowRightIcon />
      </a>
    );
  }

  const toggle = () => {
    if (open) return close(false);
    const box = buttonRef.current?.getBoundingClientRect();
    setUp(box ? window.innerHeight - box.bottom < MENU_ROOM : false);
    setCopied('idle');
    setOpen(true);
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    const at = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      list[(at + step + list.length) % list.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      list[e.key === 'Home' ? 0 : list.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  const onCopy = async () => {
    const ok = await copyText(profile.email);
    setCopied(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => close(true), ok ? 900 : 2400);
  };

  return (
    <div className={`email-menu-wrap ${className}`.trim()} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="pill pill-primary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            toggle();
          }
        }}
      >
        Email me
        <ChevronDownIcon />
      </button>
      {open && (
        <div id={menuId} role="menu" aria-label="Email" className="email-menu" data-up={up ? '' : undefined} onKeyDown={onMenuKey}>
          <button type="button" role="menuitem" className="email-menu-item" onClick={onCopy}>
            <CopyIcon />
            <span className="email-menu-text">
              <span className="swap">
                <span data-on={copied === 'idle' ? '' : undefined}>Copy address</span>
                <span data-on={copied === 'copied' ? '' : undefined}>Copied</span>
                <span data-on={copied === 'failed' ? '' : undefined}>Not copied</span>
              </span>
              <span className="email-menu-meta">{profile.email}</span>
            </span>
          </button>
          <a role="menuitem" className="email-menu-item" href={mailtoHref} onClick={() => close(false)}>
            <ArrowRightIcon />
            <span className="email-menu-text">
              Open mail app
              <span className="email-menu-meta">Subject: {profile.emailSubject}</span>
            </span>
          </a>
        </div>
      )}
      {/* Outside the menu (a menu holds only items) and always mounted, so it is announced. */}
      <span className="sr-only" role="status">
        {copied === 'copied' ? 'Email address copied' : copied === 'failed' ? 'Could not copy the address' : ''}
      </span>
    </div>
  );
}
