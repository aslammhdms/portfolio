import { STATUS_LABEL, periodParts, type Figure, type Project, type ProjectStatus } from '../../content';

/** Private / In progress / Live: a quiet label, not a button (no hover, no colour). */
export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className="status-pill" data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * Employer, period, role and status. A row's rail on wide screens (one item per line)
 * and a single wrapping meta line on narrow ones; the labels are for screen readers.
 * A current period ends in 'now', the one mark in colour.
 */
export function ProjectMeta({ project, showRole = true }: { project: Project; showRole?: boolean }) {
  const period = periodParts(project.period);
  return (
    <dl className="project-meta">
      <div>
        <dt className="sr-only">Employer</dt>
        <dd>{project.org}</dd>
      </div>
      <div>
        <dt className="sr-only">Period</dt>
        <dd className="whitespace-nowrap">
          {period.start} – {period.current ? <span className="now">{period.end}</span> : period.end}
        </dd>
      </div>
      {showRole && (
        <div>
          <dt className="sr-only">Role</dt>
          <dd>{project.role}</dd>
        </div>
      )}
      <div className="project-meta-status">
        <dt className="sr-only">Status</dt>
        <dd>
          <StatusPill status={project.status} />
        </dd>
      </div>
    </dl>
  );
}

/** The Cascadia stack line. Items wrap whole; no wrapped line starts with '·'. */
export function StackLine({ items, id }: { items: string[]; id: string }) {
  const labelId = `${id}-stack`;
  return (
    <div className="stack-line">
      <span className="stack-line-label" id={labelId}>
        Stack
      </span>
      <ul className="dot-list" role="list" aria-labelledby={labelId}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Report figures: condensed light numerals with the unit in Cascadia caps beside them,
 * top-aligned. Qualifiers ('~', '+') are set at full size, in ink. Where the symbols
 * would be read out literally, a spoken version replaces them for screen readers.
 */
export function Figures({ figures }: { figures: Figure[] }) {
  return (
    <ul className="figures" role="list" aria-label="Figures">
      {figures.map((figure) => (
        <li key={figure.unit} className="figure">
          <span className="figure-value" aria-hidden={figure.spoken ? true : undefined}>
            {figure.value}
          </span>{' '}
          <span className="figure-unit" aria-hidden={figure.spoken ? true : undefined}>
            {figure.unit}
          </span>
          {figure.spoken && <span className="sr-only">{figure.spoken}</span>}
        </li>
      ))}
    </ul>
  );
}
