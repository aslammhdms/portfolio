import type { ProductMap as ProductMapData } from '../../../content';
import { Cells, FrameHead, NodeText, Strip } from './parts';

/**
 * Skien as a product map: the clients it serves, then one frame (core contributor)
 * holding the ERP and the eCommerce product with only the modules the sources name,
 * and the stack both were written in.
 */
export default function ProductMap({ map }: { map: ProductMapData }) {
  return (
    <div className="dg-body dg-product">
      <ul className="dg-actors dg-actors-1" role="list" aria-label="Who uses it">
        <li className="dg-actor" data-node={map.actor.id}>
          <NodeText node={map.actor} />
        </li>
      </ul>

      <div className="dg-frame" data-owner={map.frame.owner} data-node={map.frame.id}>
        <FrameHead node={map.frame} />
        {map.products.map((product) => (
          <div key={product.id} className="dg-group" data-node={product.id}>
            <p className="dg-group-head">
              <NodeText node={product} />
            </p>
            <Cells nodes={product.modules} label={`${product.label} modules`} className="dg-cells-3" />
          </div>
        ))}
        {map.base.map((strip) => (
          <Strip key={strip.id} node={strip} className="dg-base" scope={map.id} />
        ))}
      </div>
    </div>
  );
}
