/**
 * The NOW line: one dated sentence about current work. Shown as the hero eyebrow
 * (and later by the terminal's `now`). Deliberately says nothing about being the
 * only developer: it sits next to the availability line.
 */
export const now = {
  long: 'Software Engineer at Tristar Engineering & Construction, moving the company from ePROMIS to Tricore ERP.',
  short: 'Software Engineer, Tristar',
  updated: 'Nov 2026',
  updatedISO: '2026-11',
} as const;

/** Year of the last content update, for the footer copyright. Static, so prerender and hydration agree. */
export const lastUpdatedYear = Number(now.updatedISO.slice(0, 4));
