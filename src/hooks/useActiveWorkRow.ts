import { useEffect, useState } from 'react';

/**
 * The project row ([data-work-row]) crossing the middle of the viewport, for the
 * status bar path (~/work/helpdesk), or null between and outside rows. Uses the same
 * thin band as useActiveSection. Null on the server and the first client render, so
 * hydration matches; the observer takes over after mount.
 */
export default function useActiveWorkRow(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-work-row]'));
    if (rows.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.workRow;
          if (!id) return;
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        });
        // Rows never overlap, so at most one is in the band at a time.
        const [current = null] = inBand;
        setActive(current);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return active;
}
