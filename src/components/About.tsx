import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineBadgeCheck } from 'react-icons/hi';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { bio, certifications, education, experience, formatMonth, formatRange, profile } from '../content';

// Not yet rebuilt (later milestone): the old card layout, now reading src/content.
const facts = [
  { label: 'Experience', value: `${profile.yearsOfExperience} years` },
  { label: 'Based in', value: profile.location.short },
  { label: 'Languages', value: profile.languages.join(' · ') },
];

export default function About() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="02 — Experience"
          title="Engineer across the full stack."
          subtitle="I build the software and run the systems behind it — comfortable from C# and SQL Server up to the browser, and from CI pipelines to production servers."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left rail: bio + facts + education + certs */}
          <div className="space-y-6">
            <Reveal className="card p-6">
              <p className="leading-relaxed text-muted">{bio}</p>
              <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between bg-surface px-4 py-3">
                    <dt className="mono-label">{f.label}</dt>
                    <dd className="font-mono text-sm text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="card p-6">
              <h3 className="mb-4 flex items-center gap-2.5 text-lg font-semibold">
                <HiOutlineAcademicCap className="text-accent-ink" size={20} aria-hidden="true" /> Education
              </h3>
              <ul className="space-y-4">
                {education.map((e) => (
                  <li key={e.degree} className="border-l border-line pl-4">
                    <p className="font-medium text-fg">{e.degree}</p>
                    <p className="text-sm text-muted">{e.school}</p>
                    <p className="font-mono text-xs text-faint">
                      {e.start} – {e.end}
                    </p>
                  </li>
                ))}
              </ul>
              <h3 className="mb-4 mt-6 flex items-center gap-2.5 text-lg font-semibold">
                <HiOutlineBadgeCheck className="text-accent-ink" size={20} aria-hidden="true" /> Certifications
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
          <Reveal className="card p-6 lg:col-span-2 lg:p-8">
            <h3 className="mb-8 flex items-center gap-2.5 text-lg font-semibold">
              <HiOutlineBriefcase className="text-accent-ink" size={20} aria-hidden="true" /> Experience
            </h3>
            <ol className="relative space-y-9 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
              {experience.flatMap((job) =>
                job.roles.map((role, i) => (
                  <li key={`${job.id}-${role.start}`} className="relative pl-7">
                    <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-canvas bg-ink-3" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h4 className="text-lg font-semibold text-fg">{role.title}</h4>
                      <span className="font-mono text-xs text-faint">{formatRange(role.start, role.end)}</span>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {job.company}
                      <span className="text-faint"> · {job.location}</span>
                    </p>
                    <p className="mt-2 leading-relaxed text-muted">{i === 0 ? job.summary : role.highlights[0]}</p>
                    {i === 0 && job.onsite && (
                      <p className="mt-2 border-l border-line pl-3 text-sm leading-relaxed text-muted">
                        <span className="font-mono text-xs text-faint">
                          Onsite · {job.onsite.client}, {job.onsite.location} · {formatMonth(job.onsite.start)} –{' '}
                          {formatMonth(job.onsite.end)}
                        </span>
                        <br />
                        {job.onsite.summary}
                      </p>
                    )}
                  </li>
                ))
              )}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
