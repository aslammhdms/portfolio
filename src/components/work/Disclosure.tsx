import type { ReactNode } from 'react';
import { PlusIcon } from '../icons';

interface DisclosureToggleProps {
  open: boolean;
  /** Id of the panel it opens. */
  controls: string;
  onToggle: () => void;
  className: string;
  children: ReactNode;
}

/** The button half of a disclosure: aria-expanded plus a '+' that folds into '−' (CSS). */
export function DisclosureToggle({ open, controls, onToggle, className, children }: DisclosureToggleProps) {
  return (
    <button type="button" className={`disclosure-toggle ${className}`} aria-expanded={open} aria-controls={controls} onClick={onToggle}>
      {children}
      <PlusIcon className="icon disclosure-icon" />
    </button>
  );
}

interface DisclosurePanelProps {
  id: string;
  open: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The panel half. It stays in the DOM and opens by animating its grid row from 0fr
 * to 1fr (CSS, 240 ms); while closed it is visibility: hidden, so its content is
 * neither read out nor reachable by Tab. Without scripts (no 'js' class on <html>)
 * it is simply shown open.
 */
export function DisclosurePanel({ id, open, className, children }: DisclosurePanelProps) {
  return (
    <div id={id} className={className ? `disclosure ${className}` : 'disclosure'} data-open={open ? '' : undefined}>
      <div className="disclosure-inner">{children}</div>
    </div>
  );
}
