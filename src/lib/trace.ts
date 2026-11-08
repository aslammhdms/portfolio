import { useSyncExternalStore } from 'react';
import { traces, type DiagramStep } from '../content';
import { motionReduced } from './prefs';

/**
 * Diagram traces: one numbered walk through a diagram, started only by the visitor
 * (the diagram's button or the terminal's `trace`), never looping. The highlight is
 * set straight on the diagram's elements (data-lit = the step numbers that lit a
 * part), so the drawing needs no re-render; the button's pressed state and the status
 * line read this store. Reduced motion lights every step at once.
 */
export interface TraceState {
  status: 'idle' | 'running' | 'done';
  /** The step shown (1-based), 0 before the first. */
  step: number;
}

const IDLE: TraceState = { status: 'idle', step: 0 };
const NONE: Record<string, TraceState> = {};
let state: Record<string, TraceState> = NONE;
const listeners = new Set<() => void>();
const tokens: Record<string, number> = {};

/** At most this long from the first step to the last. */
const MAX_MS = 2500;
const STEP_MS = 450;

const set = (id: string, next: TraceState) => {
  state = { ...state, [id]: next };
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useTrace(id: string): TraceState {
  return useSyncExternalStore(subscribe, () => state[id] ?? IDLE, () => IDLE);
}

export const hasTrace = (id: string) => id in traces;

function root(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`.dg[data-diagram="${id}"]`);
}

/** Light steps 1..upTo: each part gets the numbers of the steps that name it. */
function paint(id: string, upTo: number) {
  const el = root(id);
  const trace = traces[id];
  if (!el || !trace) return;
  el.querySelectorAll('[data-lit]').forEach((n) => {
    n.removeAttribute('data-lit');
    n.removeAttribute('data-lit-now');
  });
  const byNode = new Map<string, number[]>();
  trace.steps.slice(0, upTo).forEach((step, i) => step.nodes.forEach((n) => byNode.set(n, [...(byNode.get(n) ?? []), i + 1])));
  const all = Array.from(el.querySelectorAll<HTMLElement>('[data-node]'));
  byNode.forEach((numbers, nodeId) => {
    all
      .filter((n) => n.dataset.node === nodeId)
      .forEach((n) => {
        n.setAttribute('data-lit', numbers.join('·'));
        if (numbers[numbers.length - 1] === upTo) n.setAttribute('data-lit-now', '');
      });
  });
  el.setAttribute('data-trace-step', String(upTo));
}

export function clearTrace(id: string) {
  tokens[id] = (tokens[id] ?? 0) + 1;
  const el = root(id);
  el?.querySelectorAll('[data-lit]').forEach((n) => {
    n.removeAttribute('data-lit');
    n.removeAttribute('data-lit-now');
  });
  el?.removeAttribute('data-trace-step');
  el?.removeAttribute('data-trace');
  set(id, IDLE);
}

/**
 * Run the trace. `onStep` is called as each step lights (the terminal prints it
 * then). Resolves when the last step has been shown; a newer start or a clear
 * cancels it silently.
 */
export async function startTrace(id: string, onStep?: (step: DiagramStep, index: number) => void): Promise<void> {
  const trace = traces[id];
  if (!trace) return;
  // One trace on the page at a time.
  Object.keys(traces).forEach((other) => {
    if (other !== id && (state[other]?.status ?? 'idle') !== 'idle') clearTrace(other);
  });
  const token = (tokens[id] = (tokens[id] ?? 0) + 1);
  const el = root(id);
  el?.setAttribute('data-trace', 'on');
  const n = trace.steps.length;

  if (motionReduced()) {
    paint(id, n);
    trace.steps.forEach((s, i) => onStep?.(s, i));
    set(id, { status: 'done', step: n });
    return;
  }

  const interval = Math.min(STEP_MS, MAX_MS / n);
  for (let i = 0; i < n; i++) {
    paint(id, i + 1);
    set(id, { status: 'running', step: i + 1 });
    onStep?.(trace.steps[i], i);
    await new Promise((r) => window.setTimeout(r, interval));
    if (tokens[id] !== token) return;
  }
  set(id, { status: 'done', step: n });
}

export function toggleTrace(id: string) {
  const current = state[id]?.status ?? 'idle';
  if (current === 'idle') void startTrace(id);
  else clearTrace(id);
}

/**
 * Bring a diagram into the clear part of the screen: below the top bar and above the
 * status bar or, if the terminal drawer is open, above the drawer. Resolves when the
 * scroll should be done.
 */
export async function revealDiagram(id: string): Promise<boolean> {
  const el = root(id);
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const drawer = document.getElementById('term-drawer');
  const drawerH = drawer && drawer.hasAttribute('data-open') ? drawer.offsetHeight : 0;
  const barH = document.querySelector('.statusbar')?.getBoundingClientRect().height ?? 0;
  const top = 72;
  const bottom = window.innerHeight - Math.max(drawerH, 0) - barH - 8;
  if (rect.top >= top - 8 && rect.bottom <= bottom) return true;
  const slack = Math.max(8, (bottom - top - rect.height) / 2);
  window.scrollTo({ top: window.scrollY + rect.top - top - slack, behavior: motionReduced() ? 'auto' : 'smooth' });
  await new Promise((res) => window.setTimeout(res, motionReduced() ? 50 : 700));
  return true;
}
