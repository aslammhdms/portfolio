/**
 * Projects for the Work section (rebuilt in a later milestone; the terminal
 * already reads this). Four featured, two "also built".
 *
 * Only true numbers: 19 branches, 100+ staff, ~90 data entities, 2–3 client
 * implementations. Projects without numbers carry an honest status or scope line.
 * AssetCore is merged into HelpDesk as its Assets module.
 */

export type ProjectId = 'helpdesk' | 'tricore' | 'skien-suite' | 'almadina-website' | 'madina-insight' | 'retail-mobile';

export type ProjectStatus = 'private' | 'live' | 'in-progress';

export interface Figure {
  /** Shown as written, including qualifiers ('100+', '~90'). */
  value: string;
  unit: string;
}

export interface Project {
  id: ProjectId;
  name: string;
  org: string;
  role: string;
  years: string;
  status: ProjectStatus;
  featured: boolean;
  summary: string;
  /** Real figures, or nothing. */
  figures?: Figure[];
  /** Status or scope text for projects without figures. */
  statusLine?: string;
  built: string[];
  stack: string[];
  /** Module names only (for the later diagrams). */
  modules?: string[];
  link?: { label: string; href: string };
  caseStudy?: { problem: string; approach: string; outcome: string };
  /** Mentioned in text only, by decision. */
  note?: string;
}

export const projects: Project[] = [
  {
    id: 'helpdesk',
    name: 'HelpDesk platform',
    org: 'Al Madina Group',
    role: 'Software Engineer',
    years: '2025',
    status: 'private',
    featured: true,
    summary: 'The helpdesk and operations platform behind Al Madina’s 19 hypermarket branches.',
    figures: [
      { value: '19', unit: 'branches' },
      { value: '100+', unit: 'staff' },
      { value: '~90', unit: 'data entities' },
    ],
    built: [
      'Service tickets (raise, assign, complete, close) with priorities and real-time SignalR push.',
      'Assets (lifecycle, inter-branch transfers with approvals, service history), purchase orders that update stock, inventory checks, fleet and HR incidents, all under role- and branch-level permissions with a full audit trail, following OWASP Top 10.',
      'RDLC reports (PDF, Excel, Word) and live branch dashboards; a React Native (Expo) app for field technicians with barcode scanning; Gravity ERP integration.',
    ],
    stack: ['.NET 10', 'ASP.NET Core MVC', 'C#', 'EF Core', 'SQL Server', 'SignalR', 'React Native (Expo)', 'IIS'],
    modules: ['Service desk', 'Assets', 'Procurement', 'Inventory checks', 'Fleet', 'HR incidents', 'Reporting', 'Mobile API'],
    caseStudy: {
      problem:
        'IT support, asset tracking, procurement and inventory across 19 branches ran on scattered tools, spreadsheets and manual processes, with no single auditable system or real-time visibility.',
      approach:
        'Started with the service desk, then grew it module by module (assets, procurement, inventory checks, fleet, HR incidents) on one permission model with branch-level data access and a full audit trail.',
      outcome: 'A production platform of ~90 data entities, used by 100+ staff across 19 branches, on Windows Server.',
    },
    note: 'Also added AI-assisted theft detection from CCTV (YOLOv8).',
  },
  {
    id: 'tricore',
    name: 'Tricore ERP migration',
    org: 'Tristar Engineering & Construction',
    role: 'Software Engineer',
    years: '2026–now',
    status: 'in-progress',
    featured: true,
    summary: 'Moving an engineering and construction company from ePROMIS to Tricore ERP without stopping daily work.',
    statusLine: 'In progress — inventory screens in testing against live store workflows.',
    built: [
      'The Tricore inventory module (material issues, receipts, returns, transfers), set up to match how each store already works.',
      'SQL Server scripts that migrate ePROMIS data and manage user access by store, with checks before every change and full audit logging.',
      'Both ERPs run side by side during testing, so staff can switch without interrupting daily work.',
    ],
    stack: ['SQL Server', 'T-SQL', 'ePROMIS', 'Tricore ERP'],
    caseStudy: {
      problem:
        'The company runs on ePROMIS, an ageing ERP. Moving to Tricore means rebuilding daily workflows and moving years of data without stopping operations.',
      approach:
        'Module by module, starting with inventory, with scripted and checked data migration and both systems running in parallel during testing.',
      outcome: 'In progress. Inventory screens are in testing against live store workflows.',
    },
  },
  {
    id: 'skien-suite',
    name: 'Skien.Suite & Skien.eCommerce',
    org: 'Skien Software Lab',
    role: 'Software Developer, then Senior Software Developer',
    years: '2021–2025',
    status: 'private',
    featured: true,
    summary: 'A modular ERP for SME clients, plus B2B, B2C and enterprise store features.',
    statusLine: '2–3 client implementations running at a time.',
    built: [
      'Core ERP modules in .NET, bringing business operations into one platform.',
      'Skien.eCommerce features for B2B, B2C and enterprise online stores.',
      'Production troubleshooting and application and database tuning for clients; mentored junior developers.',
    ],
    stack: ['.NET Core', 'ASP.NET MVC', 'C#', 'Entity Framework', 'SQL Server', 'Angular.js', 'jQuery'],
    caseStudy: {
      problem:
        'Business clients needed unified operations (inventory, sales, accounting and more) instead of disconnected tools and spreadsheets.',
      approach: 'Built and maintained core modules in .NET and delivered client-facing web and mobile features.',
      outcome: 'Shipped to business clients over four years, with 2 to 3 client implementations running at a time.',
    },
  },
  {
    id: 'almadina-website',
    name: 'Al Madina Hypermarket website',
    org: 'Al Madina Group',
    role: 'Software Engineer',
    years: '2025',
    status: 'live',
    featured: true,
    summary: 'The production site of a 50-year-old UAE retail group.',
    statusLine: 'Live — branch directory, offers, careers and app downloads.',
    built: [
      'A fast React SPA with client-side routing.',
      'The branch directory (opening hours and GPS directions for every branch), plus offers, careers and app-download pages.',
      'Dark mode, restrained motion and a fully responsive layout, deployed on IIS / Windows Server.',
    ],
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router'],
    link: { label: 'almadinahypermarket.ae', href: 'https://almadinahypermarket.ae' },
  },
  {
    id: 'madina-insight',
    name: 'Madina Insight',
    org: 'Al Madina Group',
    role: 'Software Engineer',
    years: '2025',
    status: 'private',
    featured: false,
    summary:
      'Competitor-flyer pricing intelligence: PDF and image ingestion, product matching against the catalogue, and price-trend history.',
    built: [
      'Upload and processing pipeline for competitor flyers (PDF and images).',
      'Product matching against the catalogue that surfaces pricing gaps across branches.',
      'SQL Server history for price-trend analysis.',
    ],
    stack: ['.NET 10 MVC', 'C#', 'EF Core', 'SQL Server', 'JavaScript'],
  },
  {
    id: 'retail-mobile',
    name: 'Retail mobile apps',
    org: 'Al Madina Group',
    role: 'Software Engineer',
    years: '2025',
    status: 'live',
    featured: false,
    summary:
      'A React Native price checker for Zebra handhelds, with live price and stock from Gravity ERP, plus improvements to the public Al Madina AUH app.',
    statusLine: 'React Native · Zebra handhelds · live price and stock from Gravity ERP',
    built: [
      'A React Native price checker for Zebra handhelds with barcode scanning (Zebra SDK).',
      'Real-time price and stock lookups from Gravity ERP over REST.',
      'Improvements to the public customer app “Al Madina AUH” (product browsing, offer visibility).',
    ],
    stack: ['React Native', 'Zebra SDK', 'REST', 'SQL Server'],
    link: {
      label: 'Al Madina AUH on Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.almadinahypermarket.mobileapp',
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const alsoBuilt = projects.filter((p) => !p.featured);
