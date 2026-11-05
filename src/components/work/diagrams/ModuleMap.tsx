import type { ModuleMap as ModuleMapData } from '../../../content';
import { Cells, FrameHead, NodeText, Strip } from './parts';

/**
 * HelpDesk as a module map, top to bottom: the two groups of people who use it, the
 * platform (built by me) with its modules, the permission band and the stack under
 * them, then the existing ERP it is integrated with, on a dashed line.
 */
export default function ModuleMap({ map }: { map: ModuleMapData }) {
  return (
    <div className="dg-body dg-map">
      <ul className="dg-actors" role="list" aria-label="Who uses it">
        {map.actors.map((actor) => (
          <li key={actor.id} className="dg-actor" data-node={actor.id}>
            <NodeText node={actor} />
          </li>
        ))}
      </ul>

      <div className="dg-frame" data-owner={map.system.owner} data-node={map.system.id}>
        <FrameHead node={map.system} />
        <Cells nodes={map.modules} label="Modules" className="dg-cells-2" />
        <Strip node={map.band} className="dg-band" scope={map.id} />
        <Strip node={map.base} className="dg-base" scope={map.id} />
      </div>

      <p className="dg-link" data-owner={map.external.owner}>
        <span>{map.external.relation}</span>
      </p>
      <div className="dg-frame dg-frame-ext" data-owner={map.external.owner} data-node={map.external.id}>
        <FrameHead node={map.external} />
      </div>
    </div>
  );
}
