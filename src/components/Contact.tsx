import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiArrowUpRight } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const channels = [
  { icon: HiOutlineMail, label: 'Email', value: 'aslammhdms@gmail.com', href: 'mailto:aslammhdms@gmail.com' },
  { icon: HiOutlinePhone, label: 'Phone', value: '+971 50 802 4425', href: 'tel:+971508024425' },
  { icon: HiOutlineLocationMarker, label: 'Location', value: 'Abu Dhabi, UAE', href: undefined },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          index="05 — Contact"
          title="Let’s build something solid."
          subtitle="Open to full-time .NET / systems engineering roles in the UAE and remote. The fastest way to reach me is email."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Channels */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {channels.map((c, i) => {
                const Inner = (
                  <>
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-elevated text-accent">
                      <c.icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="mono-label">{c.label}</p>
                      <p className="truncate text-sm text-fg">{c.value}</p>
                    </div>
                  </>
                );
                return (
                  <Reveal key={c.label} delay={i * 0.05}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="card flex h-full items-center gap-3 p-4 transition-colors hover:border-accent/40"
                      >
                        {Inner}
                      </a>
                    ) : (
                      <div className="card flex h-full items-center gap-3 p-4">{Inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.15} className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md leading-relaxed text-muted">
                Have a role, a project, or a system that needs building? Send a message — I reply
                quickly.
              </p>
              <a href="mailto:aslammhdms@gmail.com" className="btn-primary whitespace-nowrap">
                Email me <FiArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>

          {/* Side card */}
          <Reveal delay={0.1} className="card flex flex-col justify-between p-6">
            <div>
              <span className="flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-signal" /> Available now
              </span>
              <p className="mt-4 font-display text-xl font-semibold leading-snug">
                Currently in Abu Dhabi — open to opportunities across the UAE.
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/aslammhdms"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6 w-full"
            >
              <FaLinkedin size={18} /> Connect on LinkedIn
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
