import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineBadgeCheck } from 'react-icons/hi';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const experiences = [
  {
    title: 'Software Developer',
    company: 'Al Madina Group',
    period: 'Sep 2025 – Present',
    location: 'Abu Dhabi, UAE',
    description:
      'Building and maintaining enterprise applications for a 50-year-old retail group — including the production company website — and supporting the systems and infrastructure that keep them running.',
  },
  {
    title: 'Senior Software Developer',
    company: 'Skien Software Lab',
    period: 'Sep 2023 – Sep 2025',
    location: 'Trivandrum, India',
    description:
      'Led .NET web and mobile delivery for business clients. Built backend services with .NET Core, C#, EF Core and SQL Server, and front ends with Angular.js and jQuery. Core contributor to Skien.Suite (ERP) and Skien.eCommerce; mentored junior developers.',
  },
  {
    title: 'Software Developer',
    company: 'Skien Software Lab',
    period: 'Oct 2021 – Sep 2023',
    location: 'Trivandrum, India',
    description:
      'Engineered and maintained .NET applications end to end — backend APIs, data models and front-end features — and handled troubleshooting and performance fixes for client systems.',
  },
  {
    title: 'Onsite Support Engineer',
    company: 'FOODWORLD, Bahrain',
    period: 'May 2023 – Feb 2024',
    location: 'Bahrain',
    description:
      'Provided onsite application support, resolving live technical issues, performing data corrections and working directly with the client to optimize performance.',
  },
];

const education = [
  { degree: 'B.C.A. Computer Applications', school: 'University of Calicut', period: '2018 – 2021' },
  { degree: 'Higher Secondary', school: 'Vivekananda VHSS', period: '2016 – 2018' },
];

const certifications = [{ title: '1 Million Prompters', issuer: 'AI & Prompt Engineering', year: '2024' }];

const facts = [
  { label: 'Experience', value: '4+ years' },
  { label: 'Based in', value: 'Abu Dhabi, UAE' },
  { label: 'Languages', value: 'EN · ML · HI · TA · AR' },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="02 — About"
          title="Engineer across the full stack."
          subtitle="I build the software and run the systems behind it — comfortable from C# and SQL Server up to the browser, and from CI pipelines to production servers."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left rail: bio + facts + education + certs */}
          <div className="space-y-6">
            <Reveal className="card p-6">
              <p className="leading-relaxed text-muted">
                I'm a results-driven developer who likes owning a problem end to end — designing the
                data model, writing the backend, shipping the UI, and making sure it deploys cleanly
                and stays reliable. Most of my work has been in{' '}
                <span className="text-fg">enterprise retail</span>, where correctness, auditability
                and uptime matter.
              </p>
              <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between bg-surface px-4 py-3">
                    <dt className="mono-label">{f.label}</dt>
                    <dd className="font-mono text-sm text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.05} className="card p-6">
              <h3 className="mb-4 flex items-center gap-2.5 text-lg font-semibold">
                <HiOutlineAcademicCap className="text-accent" size={20} /> Education
              </h3>
              <ul className="space-y-4">
                {education.map((e) => (
                  <li key={e.degree} className="border-l border-line pl-4">
                    <p className="font-medium text-fg">{e.degree}</p>
                    <p className="text-sm text-muted">{e.school}</p>
                    <p className="font-mono text-xs text-faint">{e.period}</p>
                  </li>
                ))}
              </ul>
              <h3 className="mb-4 mt-6 flex items-center gap-2.5 text-lg font-semibold">
                <HiOutlineBadgeCheck className="text-accent" size={20} /> Certifications
              </h3>
              <ul className="space-y-4">
                {certifications.map((c) => (
                  <li key={c.title} className="border-l border-line pl-4">
                    <p className="font-medium text-fg">{c.title}</p>
                    <p className="text-sm text-muted">{c.issuer}</p>
                    <p className="font-mono text-xs text-faint">{c.year}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right: experience timeline */}
          <Reveal delay={0.1} className="card p-6 lg:col-span-2 lg:p-8">
            <h3 className="mb-8 flex items-center gap-2.5 text-lg font-semibold">
              <HiOutlineBriefcase className="text-accent" size={20} /> Experience
            </h3>
            <ol className="relative space-y-9 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
              {experiences.map((exp) => (
                <li key={`${exp.company}-${exp.period}`} className="relative pl-7">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-canvas bg-accent" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h4 className="text-lg font-semibold text-fg">{exp.title}</h4>
                    <span className="font-mono text-xs text-faint">{exp.period}</span>
                  </div>
                  <p className="text-sm font-medium text-accent">
                    {exp.company} <span className="text-faint">· {exp.location}</span>
                  </p>
                  <p className="mt-2 leading-relaxed text-muted">{exp.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
