import { useSyncExternalStore } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * The visitor's saved preferences, besides the theme (ThemeContext): an in-page
 * "reduce motion" on top of the OS setting, "hide status bar" (WCAG 2.2.2) and the
 * switch for the single-key '?' shortcut (WCAG 2.1.4). A tiny external store, so
 * the lazy terminal and palette chunks and the page read the same values.
 *
 * Storage is wrapped in try/catch: it can be blocked, and then a choice lasts for
 * the page view. index.html applies the same classes before first paint.
 */
export interface Prefs {
  reduceMotion: boolean;
  hideStatusBar: boolean;
  /** Whether pressing '?' alone opens the shortcuts sheet. */
  questionKey: boolean;
}

const KEY = 'am:prefs';
const DEFAULTS: Prefs = { reduceMotion: false, hideStatusBar: false, questionKey: true };

let state: Prefs = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function readStored(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const data = JSON.parse(raw) as Partial<Prefs>;
    return {
      reduceMotion: data.reduceMotion === true,
      hideStatusBar: data.hideStatusBar === true,
      questionKey: data.questionKey !== false,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Mirror the preferences onto <html>, where the stylesheets read them. */
function apply(next: Prefs) {
  const root = document.documentElement;
  root.classList.toggle('rm', next.reduceMotion);
  root.classList.toggle('sb-hidden', next.hideStatusBar);
  if (next.reduceMotion) root.classList.remove('intro');
}

function emit() {
  listeners.forEach((l) => l());
}

/** Read the saved values once, after mount (the prerendered page and the first render use the defaults). */
export function initPrefs() {
  if (loaded) return;
  loaded = true;
  state = readStored();
  apply(state);
  emit();
}

export function getPrefs(): Prefs {
  return state;
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  if (state[key] === value) return;
  state = { ...state, [key]: value };
  apply(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getPrefs, () => DEFAULTS);
}

/** Motion is off when the OS asks for it or the visitor turned it off in the page. */
export function useReducedMotion(): boolean {
  const os = usePrefersReducedMotion();
  const { reduceMotion } = usePrefs();
  return os || reduceMotion;
}

/** Non-React callers (event handlers, the terminal engine). */
export function motionReduced(): boolean {
  return state.reduceMotion || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
