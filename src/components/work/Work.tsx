import { useCallback, useEffect, useState } from 'react';
import { alsoBuilt, featuredProjects, projectFromHash, sections, workSection, type ProjectId } from '../../content';
import AlsoBuilt from './AlsoBuilt';
import ProjectRow from './ProjectRow';

const SECTION = sections.find((s) => s.id === 'work')!;
const SECTION_NUMBER = String(sections.indexOf(SECTION) + 1).padStart(2, '0');

/**
 * 01 — Work. Four featured rows on the rail grid, then 'Also built'. Every row has an
 * address, #work/<id>: the row's element id, so the browser scrolls to it by itself
 * (also on first load, before any script runs); this component then opens that row's
 * case study. Disclosures start closed, so the prerendered HTML and the first client
 * render always agree.
 *
 * Lists styled without markers carry role="list" (here and in the rows): Safari drops
 * list semantics from 'list-style: none' lists otherwise.
 */
export default function Work() {
  const [open, setOpen] = useState<ReadonlySet<ProjectId>>(() => new Set());

  const toggle = useCallback((id: ProjectId) => {
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);
  const isOpen = useCallback((id: ProjectId) => open.has(id), [open]);

  // A link to a row (#work/helpdesk) opens it: on load, and on every later hash change.
  useEffect(() => {
    const openFromHash = () => {
      const id = projectFromHash(window.location.hash);
      if (id) setOpen((current) => (current.has(id) ? current : new Set(current).add(id)));
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <section id={SECTION.id} className="work" aria-labelledby="work-title">
      <div className="shell">
        <header className="section-head work-head">
          <p className="section-rail">
            <span className="section-rail-label">
              {SECTION_NUMBER} — {SECTION.label}
            </span>{' '}
            <span>
              {featuredProjects.length} featured · {alsoBuilt.length} more
            </span>
          </p>
          <div className="section-intro">
            <h2 id="work-title" className="section-title">
              {workSection.title}
            </h2>
            <p className="section-lede">{workSection.intro}</p>
          </div>
        </header>

        <ol className="work-list" role="list">
          {featuredProjects.map((project, index) => (
            <li key={project.id}>
              <ProjectRow
                project={project}
                index={index}
                caseOpen={open.has(project.id)}
                onToggleCase={() => toggle(project.id)}
              />
            </li>
          ))}
        </ol>

        <AlsoBuilt isOpen={isOpen} onToggle={toggle} />
      </div>
    </section>
  );
}
