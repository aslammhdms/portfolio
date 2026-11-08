import { useSyncExternalStore } from 'react';
import { now, profile } from '../content';

/**
 * One terminal session with two placements: the compact Prompt band and the drawer.
 * This module is small and lives in the main bundle (it holds the session and the
 * drawer state, so the status bar, the footer and the palette can open the drawer);
 * the part that runs commands (engine.ts) and draws the interactive view are lazy
 * chunks, loaded when the band nears the viewport or a shortcut is used.
 */

export type LineKind = 'cmd' | 'out' | 'err' | 'dim' | 'pre' | 'widget';
export type Widget = 'neofetch' | 'fonts';

export interface Line {
  id: number;
  kind: LineKind;
  text: string;
  widget?: Widget;
}

export type Skin = 'main' | 'v1';

export interface TermState {
  lines: Line[];
  /** Commands typed so far, oldest first (shared by both placements). */
  history: string[];
  skin: Skin;
  /** The interactive chunk is wanted (band near the viewport, or a shortcut was used). */
  armed: boolean;
  /** The auto-typed `whoami` has run (or was skipped because the visitor got there first). */
  introDone: boolean;
  drawerOpen: boolean;
  /** The drawer has been opened once, so its chunk is mounted from now on. */
  drawerMounted: boolean;
  /** The visitor has used the terminal (typed, tapped a chip), so its log may announce output. */
  interacted: boolean;
  /** Characters per line in the placement being used, so tables can adapt. */
  cols: number;
}

const INITIAL: TermState = {
  lines: [],
  history: [],
  skin: 'main',
  armed: false,
  introDone: false,
  drawerOpen: false,
  drawerMounted: false,
  interacted: false,
  cols: 80,
};

let state: TermState = INITIAL;
let nextId = 1;
const listeners = new Set<() => void>();

function set(patch: Partial<TermState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export const getTerm = () => state;
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useTerm = (): TermState => useSyncExternalStore(subscribe, getTerm, () => INITIAL);

const MAX_LINES = 400;

export function append(...lines: { kind: LineKind; text: string; widget?: Widget }[]): number[] {
  const made = lines.map((l) => ({ ...l, id: nextId++ }));
  set({ lines: [...state.lines, ...made].slice(-MAX_LINES) });
  return made.map((l) => l.id);
}

export function updateLine(id: number, text: string) {
  set({ lines: state.lines.map((l) => (l.id === id ? { ...l, text } : l)) });
}

export function clearLines() {
  set({ lines: [] });
}

export function setSkin(skin: Skin) {
  set({ skin });
}

export function setCols(cols: number) {
  if (cols !== state.cols) set({ cols });
}

export function arm() {
  if (!state.armed) set({ armed: true });
}

// ---------- The intro ----------

export const INTRO_COMMAND = 'whoami';

export const introLines = (): { kind: LineKind; text: string }[] => [
  { kind: 'out', text: `${profile.name} · ${profile.title} · ${profile.location.city}` },
  { kind: 'out', text: `now: ${now.long}` },
  { kind: 'out', text: 'this prompt is real. try: work · stack · contact · sudo hire-me' },
];

/** Print the intro at once (or after it was typed); it runs once per page view. */
export function finishIntro() {
  if (state.introDone) return;
  state = { ...state, introDone: true };
  append({ kind: 'cmd', text: INTRO_COMMAND }, ...introLines());
}

// ---------- The drawer ----------

let opener: HTMLElement | null = null;

export function openDrawer() {
  if (state.drawerOpen) return;
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  finishIntro();
  set({ drawerOpen: true, drawerMounted: true, armed: true });
}

export function closeDrawer() {
  if (!state.drawerOpen) return;
  set({ drawerOpen: false });
  const back = opener;
  opener = null;
  // Focus returns to whatever opened the drawer (the status bar button, the palette's
  // old focus, the page) once the drawer is inert.
  window.requestAnimationFrame(() => {
    if (back?.isConnected) back.focus({ preventScroll: true });
  });
}

export function toggleDrawer() {
  if (state.drawerOpen) closeDrawer();
  else openDrawer();
}

// ---------- Running commands ----------

let queue: Promise<void> = Promise.resolve();

/**
 * Run a command line. The engine is imported on first use; commands run one after
 * another, so output from a slow command (trace, sudo) never interleaves.
 */
export function submit(raw: string): Promise<void> {
  const text = raw.trim();
  if (!text) return Promise.resolve();
  arm();
  set({ interacted: true, history: [...state.history.filter((h, i, all) => !(i === all.length - 1 && h === text)), text].slice(-100) });
  queue = queue
    .then(() => import('./engine'))
    .then((engine) => engine.run(text))
    .catch(() => {
      append({ kind: 'err', text: 'error: that command stopped unexpectedly' });
    });
  return queue;
}
