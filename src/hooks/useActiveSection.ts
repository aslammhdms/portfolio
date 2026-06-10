import { useEffect, useState } from 'react';

const IDS = ['home', 'about', 'skills', 'projects', 'contact'];

/** Tracks which page section is currently in view (shared by Navbar + StatusBar). */
export default function useActiveSection() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
