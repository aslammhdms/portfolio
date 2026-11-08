/**
 * The words of the Stack and Contact sections, the footer colophon and the print
 * view. Kept here, not in components, so every surface reads one source.
 */
import { lastUpdatedYear, now } from './now';
import { profile } from './profile';
import { CORE_MIN_PROJECTS } from './skills';

/** The live site's address, as printed in the CV footer and the copied profile. */
export const SITE_URL = 'https://portfolio.aslammhdms.workers.dev/';
export const SITE_HOST = 'portfolio.aslammhdms.workers.dev';

export const stackSection = {
  title: 'Stack',
  railMeta: 'Every skill links to where it was used',
  lede: 'Select a skill to see which projects on this page used it.',
  coreLabel: 'Core',
  coreNote: `Used in ${CORE_MIN_PROJECTS} or more projects`,
  toolboxLabel: 'Also in my toolbox',
  toolboxNote: 'Used, but not on a project shown here.',
} as const;

export const contactSection = {
  title: 'Contact',
  fastest: 'Email is the fastest way to reach me.',
} as const;

export const colophon = {
  copyright: `© ${lastUpdatedYear} ${profile.name}`,
  text: `Set in Mona Sans and Cascadia Mono. Built with React, TypeScript and Tailwind; hosted on Cloudflare. Last updated ${now.updated}.`,
  printFooter: `Printed from ${SITE_HOST} — the live version has a terminal.`,
} as const;
