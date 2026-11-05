import SectionHeader from './SectionHeader';
import { ArrowUpRightIcon } from './icons';
import { alsoBuilt, featuredProjects, profile, type Project } from '../content';

// Interim Work section (rebuilt with project rows, figures and diagrams in a later
// milestone). It already reads src/content, so the facts match the hero, the
// terminal and the palette: four featured projects, then two compact "also built" rows.

const STATUS_LABEL: Record<Project['status'], string> = {
  private: 'Private · internal system',
  live: 'Live',
  'in-progress': 'In progress',
};

/** Real figures in large type, or the honest status line when a project has none. */
function ProjectPanel({ project }: { project: Project }) {
  return (
    <div className="card min-w-0">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5 font-mono text-xs text-ink-3">
        <span className="truncate">~/work/{project.id}</span>
        <span className="whitespace-nowrap">{STATUS_LABEL[project.status]}</span>
      </div>
      <div className="p-5">
        {project.figures ? (
          <ul className="grid grid-cols-3 gap-3" aria-label="Figures">
            {project.figures.map((f) => (
              <li key={f.unit} className="min-w-0 border-l border-rule pl-3">
                <span className="block font-sans text-3xl font-semibold leading-none text-ink">{f.value}</span>{' '}
                <span className="mono-label mt-2 block">{f.unit}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-2">{project.statusLine}</p>
        )}
        {project.modules && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Modules">
            {project.modules.map((m) => (
              <li key={m} className="chip">
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.link) return <span className="font-mono text-xs text-ink-3">{STATUS_LABEL[project.status]}</span>;
  return (
    <a
      href={project.link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost max-w-full whitespace-normal text-left"
    >
      {project.link.label}
      <ArrowUpRightIcon />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export default function Projects() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="01 — Work"
          title="Selected projects."
          subtitle="Systems I designed, built and shipped: what the problem was, what I built, and what it runs on."
        />

        <div className="space-y-20 md:space-y-28">
          {featuredProjects.map((project, i) => (
            <article key={project.id} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-px w-10 bg-rule" aria-hidden="true" />
                  <span className="font-mono text-xs text-ink-3">{project.years}</span>
                </div>
                <h3 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h3>
                <p className="mt-2 text-lg text-ink-2">{project.summary}</p>
                <p className="mt-1 font-mono text-xs text-ink-3">
                  {project.role} · {project.org}
                </p>

                {project.caseStudy && (
                  <div className="mt-5">
                    <p className="mono-label mb-1.5">The problem</p>
                    <p className="leading-relaxed text-ink-2">{project.caseStudy.problem}</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="mono-label mb-1.5">What I built</p>
                  <ul className="space-y-1.5">
                    {project.built.map((b) => (
                      <li key={b} className="flex gap-2.5 leading-relaxed text-ink-2">
                        <span className="mt-[0.7em] h-1 w-1 flex-shrink-0 rounded-full bg-ink-3" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.caseStudy && (
                  <div className="mt-4">
                    <p className="mono-label mb-1.5">Outcome</p>
                    <p className="leading-relaxed text-ink-2">{project.caseStudy.outcome}</p>
                  </div>
                )}

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Stack">
                  {project.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <ProjectLink project={project} />
                </div>
              </div>

              <ProjectPanel project={project} />
            </article>
          ))}
        </div>

        <div className="mt-20 border-t border-rule pt-10">
          <h3 className="mono-label">Also built</h3>
          <ul className="mt-2">
            {alsoBuilt.map((project) => (
              <li key={project.id} className="grid grid-cols-1 gap-2 border-b border-rule py-6 md:grid-cols-12 md:gap-6">
                <div className="min-w-0 md:col-span-4">
                  <p className="text-lg font-semibold text-ink">{project.name}</p>
                  <p className="font-mono text-xs text-ink-3">
                    {project.org} · {project.years}
                  </p>
                </div>
                <div className="min-w-0 md:col-span-8">
                  <p className="leading-relaxed text-ink-2">{project.summary}</p>
                  <p className="mt-2 font-mono text-xs text-ink-3">{project.stack.join(' · ')}</p>
                  {project.link && (
                    <a
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink hover:decoration-accent-ink"
                    >
                      {project.link.label}
                      <ArrowUpRightIcon />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border border-dashed border-rule p-6">
          <p className="text-ink-2">More projects and references available on request.</p>
          <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            See more on LinkedIn
            <ArrowUpRightIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
