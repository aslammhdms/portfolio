/**
 * The equal-measure lockup (html.amd) sets the name and the role line nowrap,
 * sized to fill the name column exactly. If either still overflows the column
 * (the visitor's own text-spacing overrides, WCAG 1.4.12, or unexpected font
 * metrics), 'amd' is removed so the safe, wrapping fallback styles apply for
 * the rest of the visit. Client only; returns a cleanup function.
 */
export function watchLockupFit(column: HTMLElement | null): () => void {
  const root = document.documentElement;
  const name = column?.querySelector<HTMLElement>('.hero-name');
  const role = column?.querySelector<HTMLElement>('.hero-role');
  if (!name || !role || typeof ResizeObserver === 'undefined') return () => {};

  // A pixel or two past the box is normal: the lockup fits the ink, not the advances.
  const overflows = (el: HTMLElement) => el.scrollWidth - el.clientWidth > Math.max(3, el.clientWidth * 0.02);

  let observer: ResizeObserver | null = null;
  let cancelled = false;
  const check = () => {
    if (!root.classList.contains('amd')) return;
    if (overflows(name) || overflows(role)) {
      root.classList.remove('amd');
      observer?.disconnect(); // never re-added, so nothing more to watch
    }
  };

  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (cancelled) return;
    check();
    observer = new ResizeObserver(check);
    observer.observe(name);
    observer.observe(role);
  });

  return () => {
    cancelled = true;
    observer?.disconnect();
  };
}
