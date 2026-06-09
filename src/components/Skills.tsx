import { IconType } from 'react-icons';
import {
  HiOutlineCode,
  HiOutlineServer,
  HiOutlineDesktopComputer,
  HiOutlineDatabase,
  HiOutlineCog,
  HiOutlineTerminal,
} from 'react-icons/hi';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

interface StackGroup {
  title: string;
  icon: IconType;
  items: string[];
}

const groups: StackGroup[] = [
  {
    title: 'Languages',
    icon: HiOutlineCode,
    items: ['C#', 'TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    title: '.NET & Backend',
    icon: HiOutlineServer,
    items: ['.NET Core / .NET 6+', 'ASP.NET MVC', 'Web API', 'Entity Framework', 'REST'],
  },
  {
    title: 'Frontend',
    icon: HiOutlineDesktopComputer,
    items: ['React', 'Angular.js', 'jQuery', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    title: 'Data',
    icon: HiOutlineDatabase,
    items: ['SQL Server', 'T-SQL', 'EF Core', 'Schema design'],
  },
  {
    title: 'DevOps & Infrastructure',
    icon: HiOutlineCog,
    items: ['Azure DevOps', 'CI/CD', 'Docker', 'IIS', 'Windows Server', 'Git'],
  },
  {
    title: 'Tools & Practices',
    icon: HiOutlineTerminal,
    items: ['Visual Studio', 'VS Code', 'Postman', 'Jira', 'Agile / Scrum'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="03 — Stack"
          title="The tools I build with."
          subtitle="A .NET-centred stack, with the frontend and infrastructure skills to ship and run a system end to end."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 0.06} className="card group p-6 transition-colors hover:border-accent/40">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-elevated text-accent">
                  <group.icon size={18} />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight">{group.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
