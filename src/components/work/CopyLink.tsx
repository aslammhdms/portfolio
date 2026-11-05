import { useEffect, useRef, useState } from 'react';
import { workAnchorId, type ProjectId } from '../../content';
import { copyText } from '../../lib/clipboard';
import { LinkIcon } from '../icons';

type CopyState = 'idle' | 'copied' | 'failed';

const LABEL: Record<CopyState, string> = { idle: 'Copy link', copied: 'Copied', failed: 'Not copied' };
const ANNOUNCE: Record<CopyState, string> = {
  idle: '',
  copied: 'Link copied',
  failed: 'Could not copy. The link is now in the address bar.',
};

/**
 * Copies the address of a project row (…/#work/<id>) and confirms in place: the label
 * flips to 'Copied' for two seconds. All three labels share one grid cell, so the
 * button never changes width. The URL is built at click time from the current page,
 * so it works on any host and base path.
 */
export default function CopyLink({ id, name }: { id: ProjectId; name: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const hash = `#${workAnchorId(id)}`;
    const ok = await copyText(`${window.location.origin}${window.location.pathname}${hash}`);
    // If the clipboard refused, put the link where it can still be copied by hand.
    if (!ok) window.history.replaceState(null, '', hash);
    setState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  };

  return (
    <>
      <button type="button" className="copy-link" onClick={onClick} aria-label={`Copy link to ${name}`}>
        <LinkIcon />
        <span className="swap" aria-hidden="true">
          {(Object.keys(LABEL) as CopyState[]).map((key) => (
            <span key={key} data-on={key === state ? '' : undefined}>
              {LABEL[key]}
            </span>
          ))}
        </span>
      </button>
      <span className="sr-only" role="status">
        {ANNOUNCE[state]}
      </span>
    </>
  );
}
