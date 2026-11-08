import { renderToString } from 'react-dom/server';
import Root from './Root';
import NotFound from './NotFound';
import { buildVCard, profile, unprovenSkills } from './content';

/**
 * Build-time prerender (scripts/prerender.mjs puts the result into dist/index.html).
 * Nothing in the tree may read window, storage, the clock or the visitor's time
 * zone while rendering; those parts render after mount on the client.
 */
export function render(): string {
  // The Stack section claims every listed skill was used on a project shown on the
  // page. Fail the build rather than publish a skill without a receipt.
  if (unprovenSkills.length > 0) {
    throw new Error(`Skills with no project on the page: ${unprovenSkills.join(', ')}. Add them to a project's skills or to the toolbox.`);
  }
  return renderToString(<Root />);
}

/** The 404 page's body (dist/404.html). */
export function render404(): string {
  return renderToString(<NotFound />);
}

/** The contact card, generated from src/content (scripts/build-vcard.mjs writes it to dist/). */
export function vcard(): { path: string; text: string } {
  return { path: profile.vcard.path, text: buildVCard() };
}
