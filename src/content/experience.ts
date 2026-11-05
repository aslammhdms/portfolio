/**
 * Work history, education and certifications. Wording follows the résumé, with
 * two decided changes: HelpDesk is a "helpdesk and operations platform", and
 * Foodworld is a 10-month onsite posting inside the Skien years (not a job).
 * Dates are 'YYYY-MM'; `end: null` means current.
 */

export interface Role {
  title: string;
  start: string;
  end: string | null;
  highlights: string[];
}

export interface OnsitePosting {
  client: string;
  location: string;
  start: string;
  end: string;
  /** Stated on the résumé as "10 months". */
  months: number;
  summary: string;
}

export interface Job {
  id: 'tristar' | 'almadina' | 'skien';
  company: string;
  location: string;
  summary: string;
  roles: Role[];
  onsite?: OnsitePosting;
}

export const bio =
  'I like owning a problem end to end: the data model, the backend, the screens, the deployment, and keeping it running after go-live. Most of my work has been in ERP and enterprise retail, where correctness, auditability and uptime matter.';

export const experience: Job[] = [
  {
    id: 'tristar',
    company: 'Tristar Engineering & Construction',
    location: 'Abu Dhabi, UAE',
    summary: 'Moving the company from the legacy ePROMIS ERP to Tricore ERP.',
    roles: [
      {
        title: 'Software Engineer',
        start: '2026-09',
        end: null,
        highlights: [
          'Only developer at the company; responsible for moving all operations from the legacy ePROMIS ERP to Tricore ERP',
          'Building the Tricore inventory module: material issues, receipts, returns and transfers, set up to match how each store already works',
          'Writing SQL Server scripts to migrate ePROMIS data and manage user access by store, with checks before every change and full audit logging',
          'Running ePROMIS and Tricore side by side during testing so staff can switch without interrupting daily work',
        ],
      },
    ],
  },
  {
    id: 'almadina',
    company: 'Al Madina Group',
    location: 'Abu Dhabi, UAE',
    summary:
      'Built internal systems and the public website for a 50-year-old UAE retail group, and supported the systems and infrastructure that keep them running.',
    roles: [
      {
        title: 'Software Engineer',
        start: '2025-09',
        end: '2026-08',
        highlights: [
          'Built HelpDesk, a helpdesk and operations platform used by 100+ staff across 19 Al Madina Hypermarket branches, with an ASP.NET Core web portal and a React Native (Expo) app for field technicians',
          'Set up the service ticket workflow (raise, assign, complete, close) with priorities and real-time push notifications through SignalR',
          'Added asset and inventory tracking, purchase orders that update stock automatically, and barcode scanning from the mobile app',
          'Designed role-based and per-branch permissions and followed OWASP Top 10 guidelines for security',
          'Built RDLC reports (PDF, Excel, Word) and live dashboards showing performance by branch',
        ],
      },
    ],
  },
  {
    id: 'skien',
    company: 'Skien Software Lab',
    location: 'Trivandrum, India',
    summary: 'Four years on Skien.Suite, the company’s ERP product, and Skien.eCommerce.',
    roles: [
      {
        title: 'Senior Software Developer',
        start: '2023-09',
        end: '2025-09',
        highlights: [
          'Worked on Skien.Suite, the company’s ERP product, bringing core business modules into one platform, and handled 2 to 3 client implementations at the same time',
          'Contributed to Skien.eCommerce, building features for B2B, B2C and enterprise online stores',
          'Wrote backend services in .NET Core, C#, ASP.NET MVC, Entity Framework and SQL Server, and front ends in Angular.js, JavaScript and jQuery',
          'Tracked down production issues and tuned application and database performance for clients',
        ],
      },
      {
        title: 'Software Developer',
        start: '2021-10',
        end: '2023-09',
        highlights: [
          'Built and maintained .NET web and mobile applications for business clients',
          'Developed front-end screens in HTML, CSS, Angular.js and jQuery, and backend logic in .NET Core, C#, ASP.NET MVC, Entity Framework and SQL Server',
          'Debugged and fixed issues as part of a team delivering to client deadlines',
        ],
      },
    ],
    onsite: {
      client: 'Foodworld Group',
      location: 'Bahrain',
      start: '2023-05',
      end: '2024-02',
      months: 10,
      summary:
        'Spent 10 months onsite in Bahrain supporting Foodworld Group’s live system: fixing issues, correcting data and working directly with the client.',
    },
  },
];

export const education = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    school: 'University of Calicut',
    start: '2018',
    end: '2021',
  },
];

/** From the current site and his LinkedIn profile (not on the résumé). */
export const certifications = [{ title: '1 Million Prompters', issuer: 'AI & Prompt Engineering', year: '2024' }];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-09' -> 'Sep 2026'. String maths only, so prerender and hydration always agree. */
export function formatMonth(ym: string): string {
  const [year, month] = ym.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** 'Sep 2026 – Present' with an en dash, as on the résumé. */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
