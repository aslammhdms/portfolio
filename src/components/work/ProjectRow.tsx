import { workAnchorId, type FeaturedProject, type ProjectFacts } from '../../content';
import CopyLink from './CopyLink';
import { DisclosurePanel, DisclosureToggle } from './Disclosure';
import Visual from './diagrams/Visual';
import { Figures, ProjectMeta, StackLine } from './parts';

interface ProjectRowProps {
  project: FeaturedProject;
  index: number;
  caseOpen: boolean;
  onToggleCase: () => void;
}

/** Figures between hairlines, or the honest status or scope line in their place. */
function Facts({ facts }: { facts: ProjectFacts }) {
  if (facts.kind === 'figures') return <Figures figures={facts.figures} />;
  return (
    <p className="row-line" data-kind={facts.kind}>
      <span className="row-line-label">
        {facts.kind === 'status' ? 'Status' : 'Scope'}
        <span className="sr-only">:</span>
      </span>{' '}
      <span className="row-line-text">
        {facts.kind === 'status' && <span className="dot" aria-hidden="true" />}
        {facts.text}
      </span>
    </p>
  );
}

/**
 * One featured project. Every row has the same parts, in the same order: rail (index,
 * employer and period, role, status), title, one-line summary, figures or status line,
 * three bullets, visual, stack line, the case study and a link to the row itself.
 *
 * DOM order is title, rail, body, visual, foot: the order a phone shows them (the
 * meta line moves above the title with CSS; it holds nothing focusable). Wide screens
 * place the same parts on the rail grid: rail 1–2, text 3–7, visual 8–12.
 */
export default function ProjectRow({ project, index, caseOpen, onToggleCase }: ProjectRowProps) {
  const key = `work-${project.id}`;
  const caseId = `${key}-case`;

  return (
    <article id={workAnchorId(project.id)} className="work-row" aria-labelledby={`${key}-title`} data-work-row={project.id}>
      <h3 id={`${key}-title`} className="row-title">
        {project.name}
      </h3>

      <div className="row-rail">
        <span className="row-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <ProjectMeta project={project} />
      </div>

      <div className="row-body">
        <p className="row-summary">{project.summary}</p>
        {/* The CV view hides the visual and its caption link, so a public link is printed as text. */}
        {project.link && <p className="print-link">{project.link.href}</p>}
        <Facts facts={project.facts} />
        <ul className="row-bullets" role="list">
          {project.bullets.map((bullet) => (
            <li key={bullet.lead}>
              <b>{bullet.lead}</b> {bullet.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="row-visual">
        <Visual visual={project.visual} />
      </div>

      <div className="row-foot">
        <StackLine items={project.stack} id={key} />
        <div className="row-actions">
          <DisclosureToggle className="case-toggle" open={caseOpen} controls={caseId} onToggle={onToggleCase}>
            Read the case study
          </DisclosureToggle>
          <CopyLink id={project.id} name={project.name} />
        </div>
        <DisclosurePanel id={caseId} open={caseOpen} className="case-panel">
          <dl className="case-study">
            <div>
              <dt>Problem</dt>
              <dd>{project.caseStudy.problem}</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>{project.caseStudy.approach}</dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>{project.caseStudy.outcome}</dd>
            </div>
          </dl>
        </DisclosurePanel>
      </div>
    </article>
  );
}
