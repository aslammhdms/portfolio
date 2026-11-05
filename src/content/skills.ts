/**
 * Skills, drafted from the résumé and the current Stack section. `usedIn` links a
 * skill to the projects that used it (the later "stack with receipts" derives the
 * core row and counts from it). Tools with no project evidence go in the toolbox.
 */
import type { ProjectId } from './projects';

export interface Skill {
  name: string;
  usedIn: ProjectId[];
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

/** Hero ledger "Core stack". Each item is kept unbroken; React is dropped on phones. */
export const coreStack: ReadonlyArray<{ label: string; phone: boolean }> = [
  { label: 'C#', phone: true },
  { label: '.NET', phone: true },
  { label: 'SQL Server', phone: true },
  { label: 'React', phone: false },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    skills: [
      { name: 'C#', usedIn: ['helpdesk', 'skien-suite', 'madina-insight'] },
      { name: '.NET 10 / .NET Core', usedIn: ['helpdesk', 'skien-suite', 'madina-insight'] },
      { name: 'ASP.NET Core MVC', usedIn: ['helpdesk', 'madina-insight'] },
      { name: 'ASP.NET MVC', usedIn: ['skien-suite'] },
      { name: 'Web API / REST', usedIn: ['helpdesk', 'retail-mobile'] },
      { name: 'Entity Framework Core', usedIn: ['helpdesk', 'skien-suite', 'madina-insight'] },
      { name: 'SignalR', usedIn: ['helpdesk'] },
    ],
  },
  {
    title: 'Data',
    skills: [
      { name: 'SQL Server', usedIn: ['tricore', 'helpdesk', 'madina-insight', 'retail-mobile', 'skien-suite'] },
      { name: 'T-SQL', usedIn: ['tricore'] },
      { name: 'Data migration', usedIn: ['tricore'] },
      { name: 'RDLC reporting', usedIn: ['helpdesk'] },
    ],
  },
  {
    title: 'Front end & mobile',
    skills: [
      { name: 'React', usedIn: ['almadina-website'] },
      { name: 'React Native / Expo', usedIn: ['helpdesk', 'retail-mobile'] },
      { name: 'Angular.js', usedIn: ['skien-suite'] },
      { name: 'JavaScript', usedIn: ['skien-suite', 'madina-insight'] },
      { name: 'jQuery', usedIn: ['skien-suite'] },
      { name: 'Tailwind CSS', usedIn: ['almadina-website'] },
    ],
  },
  {
    title: 'Infrastructure',
    skills: [
      { name: 'IIS', usedIn: ['helpdesk', 'almadina-website'] },
      { name: 'Windows Server', usedIn: ['helpdesk', 'almadina-website'] },
    ],
  },
  {
    title: 'Devices & ERP',
    skills: [
      { name: 'Zebra SDK', usedIn: ['retail-mobile'] },
      { name: 'ePROMIS', usedIn: ['tricore'] },
      { name: 'Tricore ERP', usedIn: ['tricore'] },
      { name: 'Gravity ERP integration', usedIn: ['helpdesk', 'retail-mobile'] },
    ],
  },
];

/** "Also in my toolbox": used, but not claimed for a project on this page. */
export const toolbox = ['TypeScript', 'Git', 'Azure DevOps', 'CI/CD', 'Docker', '.NET MAUI', 'Postman', 'Jira', 'Visual Studio'];
