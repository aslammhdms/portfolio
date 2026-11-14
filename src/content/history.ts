/**
 * The site's own history, for the terminal's `git log`.
 * Hard-coded so a shallow CI clone cannot break it. Hashes and dates are the
 * real commits on this repository.
 */
export interface HistoryEntry {
  hash: string;
  date: string;
  title: string;
}

export const history: HistoryEntry[] = [
  { hash: '3b660c2', date: '2025-07-18', title: 'First site: static HTML and CSS in Material indigo (#3F51B5)' },
  { hash: 'cc3a8a7', date: '2025-10-23', title: 'React + TypeScript + Vite rebuild' },
  { hash: 'a46821c', date: '2026-06-09', title: 'Terminal Ink: dark developer redesign' },
  { hash: 'fd6607b', date: '2026-06-10', title: 'Live System: terminal, ⌘K palette, status bar' },
  { hash: 'a8073a4', date: '2026-06-16', title: 'Cinematic: scroll-scrubbed video backdrops' },
  { hash: '77d57e8', date: '2026-11-04', title: 'Tristar role, Tricore project, new résumé' },
  { hash: 'dfe3c6f', date: '2026-11-05', title: 'v4 "Equal Measure": raspberry, equal-measure name, report figures, recruiter kit' },
];
