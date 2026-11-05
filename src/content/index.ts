/** The single typed content source. Components import from here. */
export * from './profile';
export * from './now';
export * from './availability';
export * from './experience';
export * from './projects';
export * from './skills';
export * from './history';

/** Page sections in order: id (used by anchors, the nav and the status bar path) and label. */
export const sections = [
  { id: 'work', label: 'Work', path: '~/work' },
  { id: 'experience', label: 'Experience', path: '~/experience' },
  { id: 'stack', label: 'Stack', path: '~/stack' },
  { id: 'contact', label: 'Contact', path: '~/contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** The hero's id; the wordmark links here and the status bar shows '~'. */
export const TOP_ID = 'top';
