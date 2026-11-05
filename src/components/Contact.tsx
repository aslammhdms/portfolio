import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import { ArrowRightIcon, DownloadIcon } from './icons';
import { availability, mailtoHref, profile, resumeHref, telHref, vcardHref } from '../content';

// Interim Contact section (the recruiter kit arrives in a later milestone). It reads
// src/content, so the address, phone and the discreet availability line match the hero.
const channels = [
  { icon: HiOutlineMail, label: 'Email', value: profile.email, href: mailtoHref },
  { icon: HiOutlinePhone, label: 'Phone', value: profile.phone.display, href: telHref },
  { icon: HiOutlineLocationMarker, label: 'Location', value: profile.location.short, href: undefined },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="04 — Contact"
          title="Let’s build something solid."
          subtitle="Have a role, a project or a system that needs building? The fastest way to reach me is email."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-4 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {channels.map((c) => {
                const inner = (
                  <>
                    <span className="grid h-10 w-10 flex-none place-items-center border border-rule bg-raised text-ink-2">
                      <c.icon size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="mono-label">{c.label}</p>
                      {/* Never truncated: recruiters copy the address from here. 'anywhere' (not
                          break-word) also lets the card shrink, so wide text spacing never pushes it
                          past a 320px screen. */}
                      <p className="text-sm text-ink [overflow-wrap:anywhere]">{c.value}</p>
                    </div>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className="card flex h-full items-center gap-3 p-4 transition-colors hover:border-rule-strong"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className="card flex h-full items-center gap-3 p-4">
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md leading-relaxed text-ink-2">
                Send a message, or take the résumé and the contact card with you.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={mailtoHref} className="btn-primary">
                  Email me
                  <ArrowRightIcon />
                </a>
                <a href={resumeHref} download={profile.resume.fileName} className="btn-ghost">
                  Resume
                  <DownloadIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="card flex flex-col justify-between p-6">
            <div>
              <p className="flex items-center gap-2 font-sans text-xl font-semibold leading-snug text-ink">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-accent-ink" aria-hidden="true" />
                {availability.label}
              </p>
              <p className="mt-3 text-ink-2">
                {profile.location.city} · {profile.residency}
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {/* Full-width buttons may wrap (whitespace-normal), so wide text spacing never
                  pushes the card past a 320px screen. */}
              <a
                href={profile.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full whitespace-normal text-center"
              >
                <FaLinkedin size={18} aria-hidden="true" /> Connect on LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={vcardHref} type="text/vcard" className="btn-ghost w-full whitespace-normal text-center">
                Save contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
