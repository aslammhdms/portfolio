import type { ReactNode } from 'react';
import { sections, type SectionId } from '../content';

interface SectionRailProps {
  id: SectionId;
  /** The H2's id, for the section's aria-labelledby. */
  titleId: string;
  title: string;
  /** Mono lines under the rail label ('4 featured · 2 more'); each item is kept whole. */
  meta?: string | string[];
  /** The lede under the H2. */
  children?: ReactNode;
  className?: string;
}

/**
 * The head of every content section on the rail grid: '01 — Work' in mono caps in
 * columns 1–2 (above the heading below 1280px), then the H2 and its lede in 3–7.
 * The number comes from the section's place in the page order, so it never drifts.
 */
export default function SectionRail({ id, titleId, title, meta, children, className = '' }: SectionRailProps) {
  const index = sections.findIndex((s) => s.id === id);
  const number = String(index + 1).padStart(2, '0');
  return (
    <header className={`section-head ${className}`.trim()}>
      <p className="section-rail">
        <span className="section-rail-label">
          {number} — {sections[index].label}
        </span>
        {(Array.isArray(meta) ? meta : meta ? [meta] : []).map((line) => (
          <span key={line} className="section-rail-meta">
            {' '}
            {line}
          </span>
        ))}
      </p>
      <div className="section-intro">
        <h2 id={titleId} className="section-title">
          {title}
        </h2>
        {children && <p className="section-lede">{children}</p>}
      </div>
    </header>
  );
}
