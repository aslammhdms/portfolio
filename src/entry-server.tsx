import { renderToString } from 'react-dom/server';
import Root from './Root';

/**
 * Build-time prerender (scripts/prerender.mjs puts the result into dist/index.html).
 * Nothing in the tree may read window, storage, the clock or the visitor's time
 * zone while rendering; those parts render after mount on the client.
 */
export function render(): string {
  return renderToString(<Root />);
}
