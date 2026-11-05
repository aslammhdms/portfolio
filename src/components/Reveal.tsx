import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Kept so existing call sites compile; there is no reveal animation any more. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}

/**
 * Formerly a scroll fade-up. Now a plain wrapper: the page is prerendered and
 * content must be visible without JavaScript or scrolling. Removed with the old
 * sections in a later milestone.
 */
export default function Reveal({ children, className, as = 'div' }: RevealProps) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
