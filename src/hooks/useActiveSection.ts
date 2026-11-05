import { useEffect, useState } from 'react';
import { TOP_ID, sections } from '../content';

const IDS = [TOP_ID, ...sections.map((s) => s.id)];

/**
 * Tracks which page section is in view (shared by the top bar nav and the status
 * bar path). Starts at the hero on the server and on the first client render, so
 * hydration matches; the observer takes over after mount.
 */
export default function useActiveSection() {
  const [active, setActive] = useState<string>(TOP_ID);

  useEffect(() => {
    const elements = IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    // A thin band across the middle of the viewport decides which section is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
