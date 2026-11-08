import { useState } from 'react';
import { DIAGRAM_CAPTION, traces, type Diagram, type ProjectVisual, type ScopePanel } from '../../../content';
import { toggleTrace, useTrace } from '../../../lib/trace';
import { ArrowUpRightIcon } from '../../icons';
import { DisclosurePanel, DisclosureToggle } from '../Disclosure';
import ModuleMap from './ModuleMap';
import ParallelRun from './ParallelRun';
import ProductMap from './ProductMap';

/** The visual column of a project row: a diagram for private work, a scope panel for public work. */
export default function Visual({ visual }: { visual: ProjectVisual }) {
  return visual.kind === 'scope' ? <ScopeFigure panel={visual} /> : <DiagramFigure diagram={visual} />;
}

function DiagramBody({ diagram }: { diagram: Diagram }) {
  switch (diagram.kind) {
    case 'module-map':
      return <ModuleMap map={diagram} />;
    case 'parallel-run':
      return <ParallelRun run={diagram} />;
    case 'product-map':
      return <ProductMap map={diagram} />;
  }
}

/**
 * A diagram in its panel, the caption, and 'Read as text': an ordered list that says
 * the same thing in sentences (closed by default). The steps carry data-step and
 * data-nodes, so a later terminal `trace` can walk them.
 */
function DiagramFigure({ diagram }: { diagram: Diagram }) {
  const [textOpen, setTextOpen] = useState(false);
  const textId = `dg-${diagram.id}-text`;

  return (
    <figure className="dg-figure" aria-label={diagram.title}>
      <div className="dg" data-diagram={diagram.id}>
        <p className="dg-label">{diagram.label}</p>
        <DiagramBody diagram={diagram} />
      </div>
      {traces[diagram.id] && <TraceControl id={diagram.id} />}
      <figcaption className="dg-caption">
        <span>{DIAGRAM_CAPTION}</span>
        <DisclosureToggle
          className="text-toggle"
          open={textOpen}
          controls={textId}
          onToggle={() => setTextOpen((open) => !open)}
        >
          Read as text
        </DisclosureToggle>
      </figcaption>
      <DisclosurePanel id={textId} open={textOpen}>
        <ol className="dg-text" role="list" data-diagram-text={diagram.id}>
          {diagram.steps.map((step) => (
            <li key={step.id} data-step={step.id} data-nodes={step.nodes.join(' ')}>
              {step.text}
            </li>
          ))}
        </ol>
      </DisclosurePanel>
    </figure>
  );
}

/**
 * 'Trace a ticket' / 'Trace a receipt': follows one example through the drawing, one
 * numbered step at a time (lib/trace.ts). Pressing again clears it. The current step is also written out in a status line, so the
 * walk-through never depends on seeing the highlight.
 */
function TraceControl({ id }: { id: string }) {
  const trace = traces[id];
  const { status, step } = useTrace(id);
  const current = status === 'idle' ? null : trace.steps[step - 1];
  return (
    <div className="dg-trace">
      <button type="button" className="pill pill-outline trace-btn" data-active={status !== 'idle' ? '' : undefined} onClick={() => toggleTrace(id)}>
        {trace.button}
        {status !== 'idle' && <span className="sr-only"> (press again to clear)</span>}
      </button>
      {/* One announcement when the walk ends; the per-step line below is for eyes only. */}
      <span className="sr-only" role="status">
        {status === 'done' ? `Trace finished: ${trace.steps.length} steps. The same list is under Read as text.` : ''}
      </span>
      <p className="trace-status" aria-hidden="true">
        {current && (
          <>
            <span className="trace-n">
              Step {step} of {trace.steps.length}
            </span>{' '}
            {current.text}
          </>
        )}
      </p>
    </div>
  );
}

/** Public work without screenshots: what was built, typeset, and a link to the live site. */
function ScopeFigure({ panel }: { panel: ScopePanel }) {
  return (
    <figure className="dg-figure" aria-label={`${panel.domain}: scope`}>
      <div className="dg dg-scope" data-diagram={panel.id}>
        <p className="dg-label">{panel.title}</p>
        <p className="scope-domain">{panel.domain}</p>
        <ul className="scope-pages" role="list" aria-label="Pages">
          {panel.pages.map((page) => (
            <li key={page.id} data-node={page.id}>
              <span className="dg-name">{page.label}</span>
              {page.detail && <span className="dg-detail">{page.detail}</span>}
            </li>
          ))}
        </ul>
        <ul className="dot-list scope-build" role="list" aria-label="How it is built">
          {panel.build.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <figcaption className="dg-caption">
        <a className="dg-caption-link" href={panel.href} target="_blank" rel="noopener noreferrer">
          {panel.domain} · Visit live
          <ArrowUpRightIcon />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
