/**
 * Projects for the Work section, the terminal and (later) the palette and print view:
 * four featured rows that share one structure, then two compact "Also built" rows.
 *
 * Facts and wording follow the résumé (public/doc/Aslam_Muhammed_Resume.pdf) and the
 * earlier site. Only true numbers: 19 branches, 100+ staff, ~90 data entities, 2–3 client
 * implementations at a time, 4 years. A project without numbers shows an honest status
 * or scope line instead, and 19 branches is a figure once, under HelpDesk.
 *
 * Dates: Aslam has not confirmed single project years, so the Al Madina projects show
 * his employment period there; a current project ends in 'now'.
 */
import { formatMonth } from './experience';
import { helpdeskMap, skienMap, tricoreRun, websiteScope, type ProjectVisual } from './diagrams';
import type { SkillName } from './skills';

export type ProjectId =
  | 'helpdesk'
  | 'tricore'
  | 'skien-suite'
  | 'almadina-website'
  | 'madina-insight'
  | 'retail-mobile';

export type ProjectStatus = 'private' | 'live' | 'in-progress';

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  private: 'Private',
  live: 'Live',
  'in-progress': 'In progress',
};

/** 'YYYY' or 'YYYY-MM'. `end: null` means it is still going. */
export interface Period {
  start: string;
  end: string | null;
}

export interface Figure {
  /** Set exactly as written, qualifiers included ('100+', '~90'). */
  value: string;
  unit: string;
  /** What a screen reader should say when the symbols would be read out literally ('~90'). */
  spoken?: string;
}

/** A bullet: a short lead-in set in ink, then the rest of the sentence in ink-2. */
export interface Bullet {
  lead: string;
  text: string;
}

export interface CaseStudy {
  problem: string;
  approach: string;
  outcome: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

/** The line between hairlines under the summary: real figures, or an honest status or scope line. */
export type ProjectFacts =
  | { kind: 'figures'; figures: Figure[] }
  | { kind: 'status'; text: string }
  | { kind: 'scope'; text: string };

interface ProjectBase {
  id: ProjectId;
  name: string;
  /** For tight lists: the Stack section's evidence links and the print view. */
  shortName: string;
  org: string;
  role: string;
  period: Period;
  status: ProjectStatus;
  summary: string;
  stack: string[];
  /**
   * The skills this project is evidence for. The Stack section's receipts, counts and
   * Core row are derived from these lists (src/content/derive.ts), never typed by hand.
   */
  skills: SkillName[];
  link?: ProjectLink;
}

export interface FeaturedProject extends ProjectBase {
  featured: true;
  facts: ProjectFacts;
  /** Exactly three. */
  bullets: [Bullet, Bullet, Bullet];
  caseStudy: CaseStudy;
  visual: ProjectVisual;
}

export interface CompactProject extends ProjectBase {
  featured: false;
  /** What I built, shown in the row's inline disclosure. */
  details: string[];
}

export type Project = FeaturedProject | CompactProject;

const AL_MADINA: Pick<ProjectBase, 'org' | 'role' | 'period'> = {
  org: 'Al Madina Group',
  role: 'Software Engineer',
  period: { start: '2025-09', end: '2026-08' },
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'helpdesk',
    featured: true,
    name: 'HelpDesk platform',
    shortName: 'HelpDesk',
    ...AL_MADINA,
    status: 'private',
    summary: 'The helpdesk and operations platform behind Al Madina’s hypermarket branches.',
    facts: {
      kind: 'figures',
      figures: [
        { value: '19', unit: 'branches' },
        { value: '100+', unit: 'staff', spoken: 'More than 100 staff' },
        { value: '~90', unit: 'data entities', spoken: 'About 90 data entities' },
      ],
    },
    bullets: [
      {
        lead: 'Service tickets.',
        text: 'Raise, assign, complete and close, with priorities and real-time push notifications through SignalR.',
      },
      {
        lead: 'Operations in one place.',
        text: 'Asset and inventory tracking, purchase orders that update stock automatically, fleet and HR incidents, under role-based and per-branch permissions with a full audit trail, following OWASP Top 10.',
      },
      {
        lead: 'Reports and the field.',
        text: 'RDLC reports (PDF, Excel, Word) and live dashboards by branch; barcode scanning in the technicians’ app; Gravity ERP integration.',
      },
    ],
    stack: ['.NET 10', 'ASP.NET Core MVC', 'C#', 'EF Core', 'SQL Server', 'SignalR', 'React Native (Expo)', 'IIS'],
    skills: ['C#', '.NET / .NET Core', 'ASP.NET Core MVC', 'Web API / REST', 'Entity Framework / EF Core', 'SignalR', 'SQL Server', 'RDLC reporting', 'React Native / Expo', 'IIS / Windows Server', 'Gravity ERP integration'],
    caseStudy: {
      problem:
        'IT support, asset tracking, procurement and inventory across 19 branches ran on scattered tools, spreadsheets and manual processes, with no single auditable system or real-time visibility.',
      approach:
        'I started with the service desk, then grew the platform module by module (assets, procurement, inventory checks, fleet, HR incidents) on one permission model with branch-level data access and a full audit trail. I also added AI-assisted theft detection from CCTV (YOLOv8).',
      outcome: 'A production platform of ~90 data entities, used by 100+ staff across 19 branches, on Windows Server.',
    },
    visual: helpdeskMap,
  },
  {
    id: 'tricore',
    featured: true,
    name: 'Tricore ERP migration',
    shortName: 'Tricore migration',
    org: 'Tristar Engineering & Construction',
    role: 'Software Engineer',
    period: { start: '2026-09', end: null },
    status: 'in-progress',
    summary: 'Moving the company from its old ePROMIS ERP to Tricore ERP, without stopping daily work.',
    facts: { kind: 'status', text: 'In progress — inventory screens in testing against live store workflows.' },
    bullets: [
      {
        lead: 'Inventory module.',
        text: 'Material issues, receipts, returns and transfers in Tricore, set up to match how each store already works.',
      },
      {
        lead: 'Checked migration.',
        text: 'SQL Server scripts that migrate ePROMIS data and manage user access by store, with checks before every change and full audit logging.',
      },
      {
        lead: 'Side by side.',
        text: 'ePROMIS and Tricore run in parallel during testing, so staff can switch without interrupting daily work.',
      },
    ],
    stack: ['SQL Server', 'T-SQL', 'ePROMIS', 'Tricore ERP'],
    skills: ['SQL Server', 'T-SQL', 'Data migration', 'ePROMIS', 'Tricore ERP'],
    caseStudy: {
      problem:
        'The company runs on ePROMIS, an ageing ERP. Moving to Tricore means rebuilding daily workflows and moving years of data without stopping operations.',
      approach:
        'Module by module, starting with inventory: scripted, checked data migration, and both systems running in parallel during testing.',
      outcome: 'In progress. Inventory screens are in testing against live store workflows.',
    },
    visual: tricoreRun,
  },
  {
    id: 'skien-suite',
    featured: true,
    name: 'Skien.Suite & Skien.eCommerce',
    shortName: 'Skien.Suite',
    org: 'Skien Software Lab',
    role: 'Software Developer, then Senior Software Developer',
    period: { start: '2021', end: '2025' },
    status: 'private',
    summary: 'The company’s ERP product for SME clients, plus B2B, B2C and enterprise online stores.',
    facts: {
      kind: 'figures',
      figures: [
        { value: '2–3', unit: 'client implementations at\u00a0a\u00a0time', spoken: '2 to 3 client implementations at a time' },
        { value: '4', unit: 'years' },
      ],
    },
    bullets: [
      {
        lead: 'ERP modules.',
        text: 'Core business modules for Skien.Suite, built and maintained in .NET for business clients.',
      },
      {
        lead: 'eCommerce.',
        text: 'Features for B2B, B2C and enterprise online stores in Skien.eCommerce.',
      },
      {
        lead: 'In production.',
        text: 'Tracked down production issues and tuned application and database performance for clients; mentored junior developers.',
      },
    ],
    stack: ['.NET Core', 'C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server', 'Angular.js', 'JavaScript', 'jQuery'],
    skills: ['C#', '.NET / .NET Core', 'ASP.NET MVC', 'Entity Framework / EF Core', 'SQL Server', 'Angular.js', 'JavaScript', 'jQuery'],
    caseStudy: {
      problem:
        'Business clients needed unified operations (inventory, sales, accounting and more) instead of disconnected tools and spreadsheets.',
      approach:
        'I built and maintained core modules in .NET and delivered client-facing web and mobile features, first as a Software Developer and then as a Senior Software Developer.',
      outcome: 'Shipped to business clients over four years, with 2 to 3 client implementations running at a time.',
    },
    visual: skienMap,
  },
  {
    id: 'almadina-website',
    featured: true,
    name: 'Al Madina Hypermarket website',
    shortName: 'Al Madina website',
    ...AL_MADINA,
    status: 'live',
    summary: 'The production site of a 50-year-old UAE retail group.',
    facts: { kind: 'scope', text: 'Branch directory, offers, careers and app downloads.' },
    bullets: [
      {
        lead: 'React SPA.',
        text: 'A fast single-page app with client-side routing.',
      },
      {
        lead: 'Branch directory.',
        text: 'Opening hours and GPS directions for every branch, plus offers, careers and app-download pages.',
      },
      {
        lead: 'Finish.',
        text: 'Dark mode, restrained motion and a fully responsive layout, deployed on IIS / Windows Server.',
      },
    ],
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router'],
    skills: ['React', 'Tailwind CSS', 'IIS / Windows Server'],
    caseStudy: {
      problem:
        'The chain’s legacy site was slow and dated, and could not cleanly present its branches, offers, careers and app downloads across devices.',
      approach:
        'I rebuilt it as a fast React single-page app with client-side routing: a branch directory with opening hours and GPS directions, and pages for offers, careers and app downloads.',
      outcome: 'Live in production at almadinahypermarket.ae, deployed on IIS / Windows Server.',
    },
    link: { label: 'almadinahypermarket.ae', href: 'https://almadinahypermarket.ae' },
    visual: websiteScope,
  },
];

export const alsoBuilt: CompactProject[] = [
  {
    id: 'madina-insight',
    featured: false,
    name: 'Madina Insight',
    shortName: 'Madina Insight',
    ...AL_MADINA,
    status: 'private',
    summary:
      'Competitor-flyer pricing intelligence: PDF and image ingestion, product matching against the catalogue, and price-trend history.',
    stack: ['.NET 10 MVC', 'C#', 'EF Core', 'SQL Server', 'JavaScript'],
    skills: ['C#', '.NET / .NET Core', 'ASP.NET Core MVC', 'Entity Framework / EF Core', 'SQL Server', 'JavaScript'],
    details: [
      'An upload and processing pipeline for competitor flyers (PDF and images).',
      'Product matching against the catalogue that surfaces pricing gaps across branches.',
      'SQL Server history for price-trend analysis.',
    ],
  },
  {
    id: 'retail-mobile',
    featured: false,
    name: 'Retail mobile apps',
    shortName: 'Retail apps',
    ...AL_MADINA,
    status: 'live',
    summary:
      'A React Native price checker for Zebra handhelds, with barcode scanning and live price and stock from Gravity ERP, plus improvements to the public Al Madina AUH app.',
    stack: ['React Native', 'Zebra SDK', 'REST', 'SQL Server'],
    skills: ['React Native / Expo', 'Web API / REST', 'SQL Server', 'Zebra SDK', 'Gravity ERP integration'],
    details: [
      'A price checker for floor staff on Zebra handhelds, with barcode scanning through the Zebra SDK.',
      'Real-time price and stock lookups from Gravity ERP over REST.',
      'Improvements to the public customer app, Al Madina AUH: product browsing and offer visibility.',
    ],
    link: {
      label: 'Al Madina AUH on Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.almadinahypermarket.mobileapp',
    },
  },
];

export const projects: Project[] = [...featuredProjects, ...alsoBuilt];

/** The Work section's own words. */
export const workSection = {
  title: 'Selected work',
  intro:
    'What the problem was, what I built, and what it runs on. Private systems are shown as diagrams on purpose; I don’t publish internal screens.',
  alsoBuiltTitle: 'Also built',
  moreLabel: 'More on LinkedIn',
} as const;

/** 'YYYY-MM' → 'Sep 2025'; 'YYYY' stays as it is. String maths only, so prerender and hydration agree. */
const formatPoint = (point: string) => (point.length > 4 ? formatMonth(point) : point);

/** The start and end of a period as shown ('Sep 2026', 'now'), with an en dash between them in the UI. */
export function periodParts(period: Period): { start: string; end: string; current: boolean } {
  return {
    start: formatPoint(period.start),
    end: period.end ? formatPoint(period.end) : 'now',
    current: period.end === null,
  };
}

/** 'Sep 2025 – Aug 2026', 'Sep 2026 – now', '2021 – 2025'. */
export function formatPeriod(period: Period): string {
  const { start, end } = periodParts(period);
  return `${start} – ${end}`;
}

/**
 * Every project row has its own address: #work/<id>. The id contains a slash, which
 * HTML ids allow, so the browser's own fragment scroll finds the row even before the
 * page's script runs.
 */
export const workAnchorId = (id: ProjectId): string => `work/${id}`;

/** The project a location hash points at ('#work/tricore' → 'tricore'), or null. */
export function projectFromHash(hash: string): ProjectId | null {
  let decoded = hash;
  try {
    decoded = decodeURIComponent(hash);
  } catch {
    return null; // a malformed escape: not one of ours
  }
  const match = /^#work\/([a-z0-9-]+)\/?$/.exec(decoded);
  if (!match) return null;
  const found = projects.find((p) => p.id === match[1]);
  return found ? found.id : null;
}
