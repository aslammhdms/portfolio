import { useSyncExternalStore } from 'react';
import { motionReduced } from './prefs';

/**
 * Page-level actions shared by the palette, the terminal, the shortcuts and the
 * footer. The interactive chunks (terminal, palette) are loaded lazily, so they reach
 * the page through this small module instead of through React props. App registers
 * the handlers that need React state (theme, the overlays).
 */
export interface SiteHandlers {
  openPalette: () => void;
  openShortcuts: () => void;
  getTheme: () => 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const handlers: Partial<SiteHandlers> = {};

export function registerSiteHandlers(next: SiteHandlers): () => void {
  Object.assign(handlers, next);
  return () => {
    (Object.keys(next) as (keyof SiteHandlers)[]).forEach((k) => delete handlers[k]);
  };
}

export const site = {
  openPalette: () => handlers.openPalette?.(),
  openShortcuts: () => handlers.openShortcuts?.(),
  getTheme: () => handlers.getTheme?.() ?? 'dark',
  setTheme: (t: 'dark' | 'light') => handlers.setTheme?.(t),
};

// ---------- Navigation ----------

/** Smooth-scroll behaviour that respects both the OS setting and the in-page toggle. */
export const scrollBehavior = (): ScrollBehavior => (motionReduced() ? 'auto' : 'smooth');

/**
 * Go to an element by id (a section, or a project row 'work/helpdesk'). Setting the
 * hash lets the browser scroll (to the id, clear of the bars) and lets Work open the
 * row's case study; if the hash is already there, scroll by hand.
 */
export function jumpTo(id: string) {
  if (window.location.hash === `#${id}`) {
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  } else {
    window.location.hash = id;
  }
}

/** Open a skill's evidence line in the Stack section (the Stack component listens). */
export const STACK_SKILL_EVENT = 'am:stack-skill';
export function showSkill(name: string) {
  window.dispatchEvent(new CustomEvent(STACK_SKILL_EVENT, { detail: name }));
}

/** Highlight project rows for a few seconds (terminal `stack sql`). */
let hlTimer = 0;
export function highlightRows(ids: string[]) {
  clearHighlight();
  const rows = ids
    .map((id) => document.querySelector<HTMLElement>(`[data-work-row="${id}"]`))
    .filter((el): el is HTMLElement => el !== null);
  rows.forEach((el) => el.setAttribute('data-hl', ''));
  hlTimer = window.setTimeout(clearHighlight, 6000);
  const first = rows[0];
  if (first) {
    const r = first.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) first.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
  }
}
export function clearHighlight() {
  window.clearTimeout(hlTimer);
  document.querySelectorAll('[data-hl]').forEach((el) => el.removeAttribute('data-hl'));
}

// ---------- Keycap press ----------

/** The keycap that matches a fired shortcut visibly presses for 90 ms (every copy of it on the page). */
export function pressKey(id: string) {
  const caps = document.querySelectorAll<HTMLElement>(`[data-keycap~="${id}"]`);
  caps.forEach((el) => el.setAttribute('data-pressed', ''));
  window.setTimeout(() => caps.forEach((el) => el.removeAttribute('data-pressed')), 90);
}

// ---------- Toasts ----------

export interface Toast {
  id: number;
  text: string;
}

let toasts: Toast[] = [];
let toastId = 0;
const toastListeners = new Set<() => void>();

export function toast(text: string, ms = 3600) {
  const t = { id: ++toastId, text };
  toasts = [...toasts, t].slice(-3);
  toastListeners.forEach((l) => l());
  window.setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    toastListeners.forEach((l) => l());
  }, ms);
}

const subscribeToasts = (l: () => void) => {
  toastListeners.add(l);
  return () => toastListeners.delete(l);
};
const NO_TOASTS: Toast[] = [];
export const useToasts = () => useSyncExternalStore(subscribeToasts, () => toasts, () => NO_TOASTS);

// ---------- Easter eggs ----------

/** The Konami code: a one-second barrel roll, then the name locks in again. */
export function konami() {
  pressKey('konami');
  if (motionReduced()) {
    toast('Konami accepted. Motion is off, so no barrel roll.');
    return;
  }
  const root = document.documentElement;
  root.classList.add('konami-roll');
  document.body.classList.add('konami');
  window.setTimeout(() => {
    document.body.classList.remove('konami');
    root.classList.remove('konami-roll');
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'auto' });
    // Restart the lock-in animation: drop the class, force a style flush, add it back.
    root.classList.remove('replay');
    void root.offsetWidth;
    root.classList.add('replay');
    window.setTimeout(() => root.classList.remove('replay'), 1000);
  }, 1000);
}
