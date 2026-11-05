import type { ReactNode } from 'react';
import { OWNERSHIP_LABEL, type DiagramNode, type ListNode, type OwnedNode } from '../../../content';

/**
 * Building blocks shared by the three diagrams. Everything is real HTML text: square
 * frames, 1px strokes, Mona Sans names and Cascadia details. Ownership is a word in a
 * small tag whose border repeats the frame's stroke (solid = built or contributed,
 * dashed = existing), so it never depends on colour. Every part carries data-node.
 */

/** A frame's first line: its name, an optional detail or mark, and the ownership tag. */
export function FrameHead({ node, mark }: { node: OwnedNode; mark?: ReactNode }) {
  return (
    <p className="dg-frame-head">
      <span className="dg-frame-name">{node.label}</span>
      {node.detail && <span className="dg-detail">{node.detail}</span>}
      {mark}
      <span className="dg-tag" data-owner={node.owner}>
        {OWNERSHIP_LABEL[node.owner]}
      </span>
    </p>
  );
}

/** A name with an optional mono detail line under it. */
export function NodeText({ node }: { node: DiagramNode }) {
  return (
    <>
      <span className="dg-name">{node.label}</span>
      {node.detail && <span className="dg-detail">{node.detail}</span>}
    </>
  );
}

/** A grid of cells with hairlines between them (modules, flows, store types). */
export function Cells({
  nodes,
  label,
  className,
  idPrefix = '',
}: {
  nodes: DiagramNode[];
  label: string;
  className: string;
  /** Prepended to each data-node, for cells repeated in more than one frame. */
  idPrefix?: string;
}) {
  return (
    <ul className={`dg-cells ${className}`} role="list" aria-label={label}>
      {nodes.map((node) => (
        <li key={node.id} className="dg-cell" data-node={`${idPrefix}${node.id}`}>
          <NodeText node={node} />
        </li>
      ))}
    </ul>
  );
}

/** A labelled strip of short items on one line, e.g. what a system runs on. */
export function Strip({ node, className, scope }: { node: ListNode; className: string; scope: string }) {
  // Scoped by diagram, so two diagrams can reuse a node id without clashing element ids.
  const labelId = `dg-${scope}-${node.id}-label`;
  return (
    <div className={`dg-strip ${className}`} data-node={node.id}>
      <span className="dg-strip-label" id={labelId}>
        {node.label}
      </span>
      <ul className="dot-list" role="list" aria-labelledby={labelId}>
        {node.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
