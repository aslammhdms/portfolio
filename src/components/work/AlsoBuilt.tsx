import { alsoBuilt, profile, workAnchorId, workSection, type ProjectId } from '../../content';
import { ArrowUpRightIcon } from '../icons';
import { DisclosurePanel, DisclosureToggle } from './Disclosure';
import { ProjectMeta, StackLine } from './parts';

interface AlsoBuiltProps {
  isOpen: (id: ProjectId) => boolean;
  onToggle: (id: ProjectId) => void;
}

/**
 * Two compact entries under the featured rows: no visuals, no cards. Name, meta,
 * one line, the stack, and 'What I built' as an inline disclosure. Side by side in
 * the text and visual columns on wide screens, stacked below that. Then the way
 * to everything else: LinkedIn.
 */
export default function AlsoBuilt({ isOpen, onToggle }: AlsoBuiltProps) {
  return (
    <div className="also">
      <h3 id="also-title" className="also-title">
        {workSection.alsoBuiltTitle}
      </h3>

      <ul className="also-list" role="list">
        {alsoBuilt.map((project) => {
          const key = `work-${project.id}`;
          const detailsId = `${key}-details`;
          return (
            <li key={project.id} className="also-item">
              <article
                id={workAnchorId(project.id)}
                className="also-row"
                aria-labelledby={`${key}-title`}
                data-work-row={project.id}
              >
                <h4 id={`${key}-title`} className="also-name">
                  {project.name}
                </h4>
                <ProjectMeta project={project} showRole={false} />
                <p className="also-summary">{project.summary}</p>
                <StackLine items={project.stack} id={key} />
                <div className="row-actions">
                  <DisclosureToggle
                    className="text-toggle"
                    open={isOpen(project.id)}
                    controls={detailsId}
                    onToggle={() => onToggle(project.id)}
                  >
                    What I built
                  </DisclosureToggle>
                  {project.link && (
                    <a className="text-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
                      {project.link.label}
                      <ArrowUpRightIcon />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
                <DisclosurePanel id={detailsId} open={isOpen(project.id)}>
                  <ul className="also-details" role="list">
                    {project.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </DisclosurePanel>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="also-more">
        <a className="text-link" href={profile.linkedin.url} target="_blank" rel="noopener noreferrer">
          {workSection.moreLabel}
          <ArrowUpRightIcon />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </div>
  );
}
