/**
 * The visuals of the four featured projects. Private systems are drawn as module-level
 * diagrams, typeset in HTML (never screenshots of internal screens). The public website
 * gets a typeset scope panel until real screenshots can be captured.
 *
 * Every node and step below is a DRAFT for Aslam's sign-off (the list he reviews mirrors
 * this file). Ownership is shown in words and stroke style, never by colour alone:
 * "Built by me" or "Core contributor" with solid strokes, "Existing system" dashed.
 *
 * Ids are stable: the page writes them out as data-diagram / data-node / data-step
 * attributes, so a later terminal `trace` can point at the same parts.
 */

export type Ownership = 'built' | 'existing' | 'contributor';

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  built: 'Built by me',
  existing: 'Existing system',
  contributor: 'Core contributor',
};

export interface DiagramNode {
  id: string;
  label: string;
  /** A short second line (mono): a channel, a technology, a sub-name. */
  detail?: string;
}

export interface OwnedNode extends DiagramNode {
  owner: Ownership;
}

/** A strip of short items set on one line, e.g. the stack a system runs on. */
export interface ListNode {
  id: string;
  label: string;
  items: string[];
}

/** One line of the "Read as text" list. `nodes` names the parts of the drawing it describes. */
export interface DiagramStep {
  id: string;
  text: string;
  nodes: string[];
}

interface DiagramBase {
  /** Which project the drawing belongs to (data-diagram). */
  id: string;
  /** The panel's own small label ('Module map'). */
  label: string;
  /** The figure's accessible name. */
  title: string;
  steps: DiagramStep[];
}

/** HelpDesk: who uses it, the modules inside it, what holds them together, what it connects to. */
export interface ModuleMap extends DiagramBase {
  kind: 'module-map';
  actors: DiagramNode[];
  system: OwnedNode;
  modules: DiagramNode[];
  band: ListNode;
  base: ListNode;
  external: OwnedNode & { relation: string };
}

/** Tricore: the existing and the new ERP side by side across the same flows, the migration between them. */
export interface ParallelRun extends DiagramBase {
  kind: 'parallel-run';
  flows: DiagramNode[];
  from: OwnedNode;
  bridge: OwnedNode & { items: DiagramNode[] };
  to: OwnedNode & { now: string };
}

/** Skien: who it serves, the two products and their modules, what they are written in. */
export interface ProductMap extends DiagramBase {
  kind: 'product-map';
  actor: DiagramNode;
  frame: OwnedNode;
  products: (DiagramNode & { modules: DiagramNode[] })[];
  base: ListNode[];
}

/** Public work shown without screenshots: a typeset panel of what was built. */
export interface ScopePanel {
  kind: 'scope';
  id: string;
  title: string;
  domain: string;
  href: string;
  pages: DiagramNode[];
  build: string[];
}

export type Diagram = ModuleMap | ParallelRun | ProductMap;
export type ProjectVisual = Diagram | ScopePanel;

export const DIAGRAM_CAPTION = 'Diagram, not a screenshot (internal system).';

export const helpdeskMap: ModuleMap = {
  kind: 'module-map',
  id: 'helpdesk',
  label: 'Module map',
  title: 'HelpDesk platform: module map',
  actors: [
    { id: 'branch-staff', label: 'Branch staff', detail: 'Web portal' },
    { id: 'technicians', label: 'Field technicians', detail: 'React Native (Expo) app' },
  ],
  system: { id: 'platform', label: 'HelpDesk platform', owner: 'built' },
  modules: [
    { id: 'service-desk', label: 'Service desk', detail: 'Real-time, SignalR' },
    { id: 'assets', label: 'Assets', detail: 'AssetCore' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'inventory-checks', label: 'Inventory checks' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'hr-incidents', label: 'HR incidents' },
    { id: 'reporting', label: 'Reporting', detail: 'RDLC · Excel' },
    { id: 'mobile-api', label: 'Mobile API' },
  ],
  band: { id: 'access', label: 'Across every module', items: ['Roles', 'Branch-level permissions', 'Audit trail'] },
  base: {
    id: 'runs-on',
    label: 'Runs on',
    items: ['.NET 10', 'EF Core', 'SQL Server (~90 entities)', 'Windows Server / IIS'],
  },
  external: { id: 'gravity-erp', label: 'Gravity ERP', owner: 'existing', relation: 'Integration' },
  steps: [
    {
      id: '1',
      text: 'Branch staff use the web portal; field technicians use the React Native (Expo) app.',
      nodes: ['branch-staff', 'technicians'],
    },
    {
      id: '2',
      text: 'Both reach the HelpDesk platform, which I built. Its modules: Service desk (real-time updates through SignalR), Assets (AssetCore), Procurement, Inventory checks, Fleet, HR incidents, Reporting (RDLC and Excel), and the Mobile API behind the app.',
      nodes: [
        'platform',
        'service-desk',
        'assets',
        'procurement',
        'inventory-checks',
        'fleet',
        'hr-incidents',
        'reporting',
        'mobile-api',
      ],
    },
    {
      id: '3',
      text: 'Every module works under the same roles, branch-level permissions and audit trail.',
      nodes: ['access'],
    },
    {
      id: '4',
      text: 'It runs on .NET 10, EF Core and SQL Server (about 90 data entities), on Windows Server and IIS.',
      nodes: ['runs-on'],
    },
    {
      id: '5',
      text: 'It is integrated with Gravity ERP, an existing system I did not build.',
      nodes: ['gravity-erp'],
    },
  ],
};

export const tricoreRun: ParallelRun = {
  kind: 'parallel-run',
  id: 'tricore',
  label: 'Parallel run',
  title: 'Tricore ERP migration: parallel run',
  flows: [
    { id: 'material-issues', label: 'Material issues' },
    { id: 'receipts', label: 'Receipts' },
    { id: 'returns', label: 'Returns' },
    { id: 'transfers', label: 'Transfers' },
  ],
  from: { id: 'epromis', label: 'ePROMIS', owner: 'existing' },
  bridge: {
    id: 'migration',
    label: 'SQL Server scripts',
    owner: 'built',
    items: [
      { id: 't-sql-migration', label: 'T-SQL migration' },
      { id: 'checks', label: 'Checks before every change' },
      { id: 'audit-log', label: 'Audit log' },
      { id: 'store-access', label: 'Store-level access' },
    ],
  },
  to: { id: 'tricore', label: 'Tricore inventory module', owner: 'built', now: 'now: testing' },
  steps: [
    {
      id: '1',
      text: 'Today the four inventory flows (material issues, receipts, returns and transfers) run in ePROMIS, the existing ERP.',
      nodes: ['epromis'],
    },
    {
      id: '2',
      text: 'I am building the same four flows in the Tricore inventory module, set up to match how each store already works.',
      nodes: ['tricore'],
    },
    {
      id: '3',
      text: 'Between them, SQL Server scripts migrate the ePROMIS data and set store-level access, with checks before every change and an audit log.',
      nodes: ['migration', 't-sql-migration', 'checks', 'audit-log', 'store-access'],
    },
    {
      id: '4',
      text: 'Both ERPs run side by side during testing, so staff can switch without interrupting daily work.',
      nodes: ['epromis', 'tricore'],
    },
    {
      id: '5',
      text: 'Now: the inventory screens are in testing against live store workflows.',
      nodes: ['tricore'],
    },
  ],
};

export const skienMap: ProductMap = {
  kind: 'product-map',
  id: 'skien-suite',
  label: 'Product map',
  title: 'Skien.Suite and Skien.eCommerce: product map',
  actor: { id: 'clients', label: 'SME clients', detail: '2–3 implementations at a time' },
  frame: { id: 'products', label: 'Skien Software Lab', owner: 'contributor' },
  products: [
    {
      id: 'suite',
      label: 'Skien.Suite',
      detail: 'ERP',
      modules: [
        { id: 'inventory', label: 'Inventory' },
        { id: 'sales', label: 'Sales' },
        { id: 'accounting', label: 'Accounting' },
      ],
    },
    {
      id: 'ecommerce',
      label: 'Skien.eCommerce',
      detail: 'Online stores',
      modules: [
        { id: 'b2b', label: 'B2B store' },
        { id: 'b2c', label: 'B2C store' },
        { id: 'enterprise', label: 'Enterprise store' },
      ],
    },
  ],
  base: [
    { id: 'backend', label: 'Backend', items: ['.NET Core', 'C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server'] },
    { id: 'front-end', label: 'Front end', items: ['Angular.js', 'JavaScript', 'jQuery'] },
  ],
  steps: [
    {
      id: '1',
      text: 'SME clients run on Skien.Suite, Skien Software Lab’s ERP product; I handled 2 to 3 client implementations at a time.',
      nodes: ['clients', 'suite'],
    },
    {
      id: '2',
      text: 'Skien.Suite brings core business modules into one platform, among them inventory, sales and accounting.',
      nodes: ['suite', 'inventory', 'sales', 'accounting'],
    },
    {
      id: '3',
      text: 'Skien.eCommerce adds features for B2B, B2C and enterprise online stores.',
      nodes: ['ecommerce', 'b2b', 'b2c', 'enterprise'],
    },
    {
      id: '4',
      text: 'I was a core contributor to both: backend services in .NET Core, C#, ASP.NET MVC, Entity Framework and SQL Server, and front ends in Angular.js, JavaScript and jQuery.',
      nodes: ['backend', 'front-end'],
    },
  ],
};

export const websiteScope: ScopePanel = {
  kind: 'scope',
  id: 'almadina-website',
  title: 'Scope',
  domain: 'almadinahypermarket.ae',
  href: 'https://almadinahypermarket.ae',
  pages: [
    { id: 'branches', label: 'Branch directory', detail: 'Opening hours and GPS directions' },
    { id: 'offers', label: 'Offers' },
    { id: 'careers', label: 'Careers' },
    { id: 'app', label: 'App downloads' },
  ],
  build: ['React SPA, client-side routing', 'Dark mode', 'Responsive', 'IIS / Windows Server'],
};
