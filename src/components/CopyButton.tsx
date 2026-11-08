import { useEffect, useRef, useState, type ReactNode } from 'react';
import { copyText } from '../lib/clipboard';

type CopyState = 'idle' | 'copied' | 'failed';

interface CopyButtonProps {
  text: string;
  /** Visible label at rest ('Copy', 'Copy profile'). */
  label: string;
  /** What a screen reader hears once it worked ('Email address copied'). */
  announce: string;
  /** Accessible name when the visible label is not enough ('Copy email address'). */
  ariaLabel?: string;
  className?: string;
  icon?: ReactNode;
}

const FLIP_MS = 2000;

/**
 * A copy action that confirms in place: the label flips to 'Copied' for two seconds.
 * All labels share one grid cell (.swap), so the button never changes width. If the
 * clipboard refuses, it says so ('Not copied') and the text stays visible on the page.
 */
export default function CopyButton({ text, label, announce, ariaLabel, className = 'copy-text', icon }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), FLIP_MS);
  };

  const labels: Record<CopyState, string> = { idle: label, copied: 'Copied', failed: 'Not copied' };
  const spoken: Record<CopyState, string> = { idle: '', copied: announce, failed: 'Could not copy. Select the text on the page instead.' };

  return (
    <>
      <button type="button" className={className} onClick={onClick} aria-label={ariaLabel} data-state={state}>
        {icon}
        <span className="swap" aria-hidden={ariaLabel ? true : undefined}>
          {(Object.keys(labels) as CopyState[]).map((key) => (
            <span key={key} data-on={key === state ? '' : undefined}>
              {labels[key]}
            </span>
          ))}
        </span>
      </button>
      <span className="sr-only" role="status">
        {spoken[state]}
      </span>
    </>
  );
}
