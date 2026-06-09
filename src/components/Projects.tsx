import { FiArrowUpRight } from 'react-icons/fi';
import { HiOutlineLockClosed } from 'react-icons/hi';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

interface Project {
  index: string;
  name: string;
  tagline: string;
  role: string;
  period: string;
  problem: string;
  build: string[];
  stack: string[];
  outcome: string;
  link: { label: string; href?: string };
  visual: { chrome: string; isBrowser: boolean; tiles: { label: string; value: string }[] };
}

const projects: Project[] = [
  {
    index: '01',
    name: 'Al Madina Hypermarket',
    tagline: 'Production marketing & store-locator site for a 50-year-old UAE retail chain.',
    role: 'Frontend Developer · Al Madina Group',
    period: '2025',
    problem:
      'The chain’s legacy site was slow and dated, and couldn’t cleanly present 19 branches, app downloads, offers and careers across devices.',
    build: [
      'Rebuilt as a fast React SPA with client-side routing.',
      'Branch directory with 19 locations, live hours and GPS directions.',
      'App-download flows, offers, gallery and careers pages.',
      'Dark mode, restrained motion, fully responsive.',
    ],
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router'],
    outcome: 'Live in production at almadinahypermarket.ae, deployed on IIS / Windows Server.',
    link: { label: 'almadinahypermarket.ae', href: 'https://almadinahypermarket.ae' },
    visual: {
      chrome: 'almadinahypermarket.ae',
      isBrowser: true,
      tiles: [
        { label: 'Branches', value: '19' },
        { label: 'Status', value: 'Live' },
        { label: 'Devices', value: 'All' },
      ],
    },
  },
  {
    index: '02',
    name: 'Helpdesk Portal',
    tagline: 'Al Madina’s internal IT operations platform — a service desk that grew into the backbone for 80+ outlets.',
    role: 'Software Developer · Al Madina Group',
    period: '2025',
    problem:
      'IT support, asset tracking, procurement and inventory across 80+ outlets ran on scattered tools, spreadsheets and manual processes — with no single auditable system or real-time visibility.',
    build: [
      'Service-desk core: ticket intake, assignment and tracking with real-time SignalR updates.',
      'Grew into modules for asset management, procurement, inventory checks, fleet and HR incident / warning workflows.',
      'Granular role + permission system with branch-level data access control and a full audit trail.',
      'RDLC + Excel reporting, plus a companion React Native mobile app on a dedicated API.',
      'Integrated the Gravity ERP and added AI-assisted theft detection from CCTV (YOLOv8).',
    ],
    stack: ['.NET 10', 'ASP.NET Core MVC', 'C#', 'EF Core', 'SQL Server', 'SignalR', 'React Native'],
    outcome: 'Production platform spanning ~90 data entities across dozens of modules, serving 80+ outlets on Windows Server.',
    link: { label: 'Internal / private' },
    visual: {
      chrome: 'helpdesk — service desk',
      isBrowser: false,
      tiles: [
        { label: 'Outlets', value: '80+' },
        { label: 'Modules', value: '90+' },
        { label: 'Mobile', value: 'RN' },
      ],
    },
  },
  {
    index: '03',
    name: 'AssetCore',
    tagline: 'IT asset-lifecycle management — the asset module of Al Madina’s IT platform.',
    role: 'Software Developer · Al Madina Group',
    period: '2025',
    problem:
      'Devices moved between branches with no single source of truth — service history went untracked and reporting was manual.',
    build: [
      'End-to-end asset CRUD across categories, branches and vendors.',
      'Inter-branch transfer workflows with approvals.',
      'Per-asset service / maintenance history and document storage.',
      'Audit logging and interactive dashboards with Excel / RDLC exports.',
    ],
    stack: ['.NET 10', 'C#', 'EF Core', 'SQL Server', 'Bootstrap 5'],
    outcome: 'Production-ready, multi-branch asset tracking with a full audit trail — part of the wider Helpdesk platform.',
    link: { label: 'Internal / private' },
    visual: {
      chrome: 'assetcore — dashboard',
      isBrowser: false,
      tiles: [
        { label: 'Assets', value: 'CRUD' },
        { label: 'Transfers', value: 'Flow' },
        { label: 'Audit', value: 'Full' },
      ],
    },
  },
  {
    index: '04',
    name: 'Skien.Suite',
    tagline: 'Modular ERP integrating core business operations for SME clients.',
    role: 'Senior Software Developer · Skien Software Lab',
    period: '2021 – 2025',
    problem:
      'Business clients needed unified operations — inventory, sales, accounting and more — instead of disconnected tools and spreadsheets.',
    build: [
      'Built and maintained core ERP modules in .NET.',
      'Delivered customer-facing web and mobile features.',
      'Contributed to Skien.eCommerce, an AI-assisted commerce product.',
      'Mentored junior developers and led technical initiatives.',
    ],
    stack: ['.NET Core 6', 'C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server', 'Angular.js'],
    outcome: 'Shipped to multiple business clients over four years.',
    link: { label: 'Internal / private' },
    visual: {
      chrome: 'skien.suite — erp',
      isBrowser: false,
      tiles: [
        { label: 'Modules', value: 'ERP' },
        { label: 'Clients', value: 'Multi' },
        { label: 'Tenure', value: '4 yrs' },
      ],
    },
  },
];

function ProjectVisual({ project }: { project: Project }) {
  const { visual, name } = project;
  return (
    <div className="card overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-elevated px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-line" />
          <span className="h-3 w-3 rounded-full bg-line" />
          <span className="h-3 w-3 rounded-full bg-line" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md bg-canvas/60 px-3 py-1 font-mono text-xs text-faint">
          {visual.isBrowser ? 'https://' : '~/'}
          {visual.chrome}
        </span>
      </div>

      {/* Faux UI body */}
      <div className="relative overflow-hidden p-5">
        <span
          className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-8xl font-bold text-fg/[0.04]"
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
        <div className="relative grid grid-cols-3 gap-3">
          {visual.tiles.map((t) => (
            <div key={t.label} className="rounded-lg border border-line bg-surface p-3">
              <p className="font-display text-xl font-semibold text-accent">{t.value}</p>
              <p className="mono-label mt-1 normal-case">{t.label}</p>
            </div>
          ))}
        </div>
        <div className="relative mt-4 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-3/4 rounded bg-line" />
          <div className="h-2.5 w-full rounded bg-line/70" />
          <div className="h-2.5 w-1/2 rounded bg-line/50" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="04 — Work"
          title="Selected projects."
          subtitle="Systems I designed, built and shipped — what the problem was, what I built, and what it runs on."
        />

        <div className="space-y-20 md:space-y-28">
          {projects.map((project, i) => {
            const reverse = i % 2 === 1;
            return (
              <Reveal key={project.name}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  {/* Text */}
                  <div className={reverse ? 'lg:order-2' : ''}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="font-mono text-sm text-accent">{project.index}</span>
                      <span className="h-px w-10 bg-line" aria-hidden="true" />
                      <span className="font-mono text-xs text-faint">{project.period}</span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-lg text-muted">{project.tagline}</p>
                    <p className="mt-1 font-mono text-xs text-faint">{project.role}</p>

                    <div className="mt-5">
                      <p className="mono-label mb-1.5">The problem</p>
                      <p className="leading-relaxed text-muted">{project.problem}</p>
                    </div>

                    <div className="mt-4">
                      <p className="mono-label mb-1.5">What I built</p>
                      <ul className="space-y-1.5">
                        {project.build.map((b) => (
                          <li key={b} className="flex gap-2.5 leading-relaxed text-muted">
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <p className="mono-label mb-1.5">Outcome</p>
                      <p className="leading-relaxed text-muted">{project.outcome}</p>
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      {project.link.href ? (
                        <a
                          href={project.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                        >
                          {project.link.label} <FiArrowUpRight size={16} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 font-mono text-xs text-faint">
                          <HiOutlineLockClosed size={14} /> {project.link.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={reverse ? 'lg:order-1' : ''}>
                    <ProjectVisual project={project} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.05} className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-card border border-dashed border-line p-6">
          <p className="text-muted">More projects and references available on request.</p>
          <a
            href="https://www.linkedin.com/in/aslammhdms"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            See more on LinkedIn <FiArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
