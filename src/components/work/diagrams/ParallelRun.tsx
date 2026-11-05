import type { OwnedNode, ParallelRun as ParallelRunData } from '../../../content';
import { Cells, FrameHead } from './parts';

/**
 * Tricore as two lanes over the same four inventory flows: the existing ERP (dashed)
 * above, the new inventory module (built by me) below, and the checked migration
 * scripts between them. The 'now' mark is the only colour.
 */
export default function ParallelRun({ run }: { run: ParallelRunData }) {
  const lane = (node: OwnedNode, mark?: JSX.Element) => (
    <div className="dg-frame dg-lane" data-owner={node.owner} data-node={node.id}>
      <FrameHead node={node} mark={mark} />
      <Cells nodes={run.flows} label={`${node.label}: inventory flows`} className="dg-cells-4" idPrefix={`${node.id}/`} />
    </div>
  );

  return (
    <div className="dg-body dg-run">
      {lane(run.from)}
      <div className="dg-arrow" aria-hidden="true" />
      <div className="dg-frame dg-bridge" data-owner={run.bridge.owner} data-node={run.bridge.id}>
        <FrameHead node={run.bridge} />
        <Cells nodes={run.bridge.items} label="Migration" className="dg-cells-2" />
      </div>
      <div className="dg-arrow" aria-hidden="true" />
      {lane(
        run.to,
        <span className="dg-now">
          <span className="dot" aria-hidden="true" />
          {run.to.now}
        </span>
      )}
    </div>
  );
}
