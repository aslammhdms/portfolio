import type { ReactNode } from 'react';
import {
  bio,
  certifications,
  education,
  experience,
  experienceSection,
  profile,
  rangeParts,
} from '../content';
import SectionRail from './SectionRail';

/** 'Sep 2026 – now', with 'now' in the accent: the one live mark in the section. */
function Dates({ start, end }: { start: string; end: string | null }) {
  const range = rangeParts(start, end);
  return (
    <p className="exp-dates">
      {range.start} – {range.current ? <span className="now">{range.end}</span> : range.end}
    </p>
  );
}

interface RowProps {
  start: string;
  end: string | null;
  title: string;
  org: string;
  place: string;
  line: string;
  /** A label above the title ('Onsite posting'), for the nested row. */
  kicker?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * One plain dated row: dates | title and company | place | one or two lines. No time
 * ruler and no computed durations: the rows say what happened, not how long it lasted.
 */
function Row({ start, end, title, org, place, line, kicker, className = 'exp-row', children }: RowProps) {
  return (
    <li className={className}>
      <Dates start={start} end={end} />
      <div className="exp-role">
        {kicker && <p className="exp-kicker">{kicker}</p>}
        <h3 className="exp-title">
          {title}
          <span className="sr-only">, </span>
          <span className="exp-org">{org}</span>
        </h3>
      </div>
      <p className="exp-place">{place}</p>
      <p className="exp-line">{line}</p>
      {children}
    </li>
  );
}

/**
 * 02 — Experience. His opening line, four dated rows (the Foodworld posting nested
 * under the Skien role it belongs to), then a closing ledger of the plain facts.
 */
export default function Experience() {
  const facts = [
    {
      label: 'Education',
      value: `BCA, ${education[0].school}`,
      detail: `${education[0].start} – ${education[0].end}`,
    },
    { label: 'Certification', value: certifications[0].title, detail: certifications[0].year },
    { label: 'Languages', value: profile.languages.join(', ') },
    { label: 'Based in', value: profile.location.city, detail: profile.residency },
  ];

  return (
    <section id="experience" className="section exp" aria-labelledby="experience-title">
      <div className="shell">
        <SectionRail id="experience" titleId="experience-title" title={experienceSection.title} meta={experienceSection.railMeta}>
          {bio}
        </SectionRail>

        <ol className="exp-list" role="list">
          {experience.flatMap((job) =>
            job.roles.map((role) => (
              <Row
                key={`${job.id}-${role.start}`}
                start={role.start}
                end={role.end}
                title={role.title}
                org={job.company}
                place={job.location}
                line={role.line}
              >
                {job.onsite && job.onsite.duringRole === role.title && (
                  <ul className="exp-sub-list" role="list">
                    <Row
                      className="exp-row exp-sub"
                      kicker="Onsite posting"
                      start={job.onsite.start}
                      end={job.onsite.end}
                      title={job.onsite.client}
                      org={`for ${job.company}`}
                      place={job.onsite.location}
                      line={job.onsite.line}
                    />
                  </ul>
                )}
              </Row>
            ))
          )}
        </ol>

        <dl className="facts-ledger exp-facts">
          {facts.map((fact) => (
            <div key={fact.label} className="facts-cell">
              <dt className="facts-label">{fact.label}</dt>
              <dd className="facts-value">
                {fact.value}
                {fact.detail && <span className="facts-detail">{fact.detail}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
