/**
 * The skill catalogue for the Stack section, the terminal's `stack` and the palette.
 *
 * Skills do not list their own projects: each project names the skills it used
 * (`skills` in projects.ts), and src/content/derive.ts inverts that into the evidence
 * ("SQL Server → Tricore migration · HelpDesk · …"), the counts and the Core row. So
 * the receipts can never claim more than the project data says. A skill in a group
 * must be used by at least one project on the page (the prerender fails otherwise);
 * tools with no project to point at go in the toolbox instead.
 */

export const skillGroups = [
  {
    title: 'Backend',
    skills: ['C#', '.NET / .NET Core', 'ASP.NET Core MVC', 'ASP.NET MVC', 'Web API / REST', 'Entity Framework / EF Core', 'SignalR'],
  },
  {
    title: 'Data',
    skills: ['SQL Server', 'T-SQL', 'Data migration', 'RDLC reporting'],
  },
  {
    title: 'Front end & mobile',
    skills: ['React', 'React Native / Expo', 'Angular.js', 'JavaScript', 'jQuery', 'Tailwind CSS'],
  },
  {
    title: 'Infrastructure',
    skills: ['IIS / Windows Server'],
  },
  {
    title: 'Devices & ERP',
    skills: ['Zebra SDK', 'Gravity ERP integration', 'ePROMIS', 'Tricore ERP'],
  },
] as const;

export type SkillGroupTitle = (typeof skillGroups)[number]['title'];
export type SkillName = (typeof skillGroups)[number]['skills'][number];

/** A skill counts as Core when this many projects on the page used it. */
export const CORE_MIN_PROJECTS = 2;

/** Hero ledger "Core stack". Each item is kept unbroken; React is dropped on phones. */
export const coreStack: ReadonlyArray<{ label: string; phone: boolean }> = [
  { label: 'C#', phone: true },
  { label: '.NET', phone: true },
  { label: 'SQL Server', phone: true },
  { label: 'React', phone: false },
];

/** "Also in my toolbox": used, but not claimed for a project on this page. */
export const toolbox = ['TypeScript', 'Git', 'Azure DevOps', 'CI/CD', 'Docker', '.NET MAUI', 'Postman', 'Jira', 'Visual Studio'];
