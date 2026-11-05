/** Window event the Terminal listens for: finish the intro and focus the prompt. */
export const TERMINAL_FOCUS_EVENT = 'terminal:focus';

/** Scroll the Prompt band into view and hand focus to its terminal. */
export function focusTerminal() {
  const band = document.getElementById('prompt');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  band?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  window.dispatchEvent(new CustomEvent(TERMINAL_FOCUS_EVENT));
}
